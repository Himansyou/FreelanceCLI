package org.himansyou.storage;

import java.nio.file.Files;
import java.nio.file.Path;
import java.sql.*;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

/**
 * SQLite implementation: ~/.freelancecli/sessions.db and config in same DB.
 */
public class SqliteLocalStorage implements LocalStorage {

    private static final String CONFIG_TABLE = "config";
    private static final String SESSIONS_TABLE = "sessions";
    private final Path dbPath;

    public SqliteLocalStorage() {
        this(dbPath());
    }

    public SqliteLocalStorage(Path dbPath) {
        this.dbPath = dbPath;
    }

    private static Path dbPath() {
        Path dir = Path.of(System.getProperty("user.home")).resolve(".freelancecli");
        try {
            Files.createDirectories(dir);
        } catch (Exception ignored) {}
        return dir.resolve("sessions.db");
    }

    private Connection connect() throws SQLException {
        return DriverManager.getConnection("jdbc:sqlite:" + dbPath.toAbsolutePath());
    }

    @Override
    public void initSchema() {
        try (Connection c = connect();
             Statement s = c.createStatement()) {
            s.execute("CREATE TABLE IF NOT EXISTS " + CONFIG_TABLE + " (key TEXT PRIMARY KEY, value TEXT)");
            s.execute("CREATE TABLE IF NOT EXISTS " + SESSIONS_TABLE + " (" +
                "id TEXT PRIMARY KEY, project TEXT NOT NULL, start_time TEXT NOT NULL, end_time TEXT, " +
                "duration_minutes INTEGER, device_id TEXT, synced INTEGER NOT NULL DEFAULT 0, created_at TEXT NOT NULL)");
        } catch (SQLException e) {
            throw new RuntimeException("Failed to init DB", e);
        }
    }

    @Override
    public Optional<String> getAccessToken() {
        return getConfig("access_token");
    }

    @Override
    public Optional<String> getUserId() {
        return getConfig("user_id");
    }

    @Override
    public void setAuth(String accessToken, String userId) {
        setConfig("access_token", accessToken);
        setConfig("user_id", userId);
    }

    @Override
    public void clearAuth() {
        setConfig("access_token", null);
        setConfig("user_id", null);
    }

    @Override
    public String getOrCreateDeviceId() {
        Optional<String> existing = getConfig("device_id");
        if (existing.isPresent()) return existing.get();
        String id = "cli-" + UUID.randomUUID();
        setConfig("device_id", id);
        return id;
    }

    @Override
    public String insertSession(String project, Instant startTime) {
        String id = UUID.randomUUID().toString();
        String start = startTime.toString();
        try (Connection c = connect();
             PreparedStatement ps = c.prepareStatement(
                 "INSERT INTO " + SESSIONS_TABLE + " (id, project, start_time, end_time, duration_minutes, device_id, synced, created_at) VALUES (?,?,?,NULL,NULL,?,0,?)")) {
            ps.setString(1, id);
            ps.setString(2, project);
            ps.setString(3, start);
            ps.setString(4, getOrCreateDeviceId());
            ps.setString(5, Instant.now().toString());
            ps.executeUpdate();
        } catch (SQLException e) {
            throw new RuntimeException("Insert session failed", e);
        }
        return id;
    }

    @Override
    public boolean stopCurrentSession(Instant endTime) {
        Optional<SessionRow> current = getCurrentRunningSession();
        if (current.isEmpty()) return false;
        String id = current.get().id();
        int duration = (int) (endTime.getEpochSecond() - current.get().startTime().getEpochSecond()) / 60;
        try (Connection c = connect();
             PreparedStatement ps = c.prepareStatement(
                 "UPDATE " + SESSIONS_TABLE + " SET end_time=?, duration_minutes=? WHERE id=?")) {
            ps.setString(1, endTime.toString());
            ps.setInt(2, duration);
            ps.setString(3, id);
            int n = ps.executeUpdate();
            return n > 0;
        } catch (SQLException e) {
            throw new RuntimeException("Stop session failed", e);
        }
    }

    @Override
    public void markSynced(List<String> sessionIds) {
        if (sessionIds.isEmpty()) return;
        try (Connection c = connect()) {
            for (String id : sessionIds) {
                try (PreparedStatement ps = c.prepareStatement("UPDATE " + SESSIONS_TABLE + " SET synced=1 WHERE id=?")) {
                    ps.setString(1, id);
                    ps.executeUpdate();
                }
            }
        } catch (SQLException e) {
            throw new RuntimeException("Mark synced failed", e);
        }
    }

    @Override
    public List<SessionRow> listSessions(boolean unsyncedOnly) {
        String sql = "SELECT id, project, start_time, end_time, duration_minutes, device_id, synced, created_at FROM " + SESSIONS_TABLE;
        if (unsyncedOnly) sql += " WHERE synced=0";
        sql += " ORDER BY start_time DESC";
        List<SessionRow> list = new ArrayList<>();
        try (Connection c = connect(); Statement s = c.createStatement(); ResultSet rs = s.executeQuery(sql)) {
            while (rs.next()) {
                list.add(row(rs));
            }
        } catch (SQLException e) {
            throw new RuntimeException("List sessions failed", e);
        }
        return list;
    }

    @Override
    public List<SessionRow> listSessionsForReport(String project, Instant from, Instant to) {
        StringBuilder sql = new StringBuilder(
            "SELECT id, project, start_time, end_time, duration_minutes, device_id, synced, created_at FROM " + SESSIONS_TABLE + " WHERE end_time IS NOT NULL");
        List<Object> params = new ArrayList<>();
        if (project != null && !project.isBlank()) {
            sql.append(" AND project=?");
            params.add(project);
        }
        if (from != null) {
            sql.append(" AND start_time >= ?");
            params.add(from.toString());
        }
        if (to != null) {
            sql.append(" AND end_time <= ?");
            params.add(to.toString());
        }
        sql.append(" ORDER BY start_time DESC");
        List<SessionRow> list = new ArrayList<>();
        try (Connection c = connect(); PreparedStatement ps = c.prepareStatement(sql.toString())) {
            for (int i = 0; i < params.size(); i++) {
                Object p = params.get(i);
                if (p instanceof String) ps.setString(i + 1, (String) p);
                else if (p instanceof Instant) ps.setString(i + 1, ((Instant) p).toString());
            }
            try (ResultSet rs = ps.executeQuery()) {
                while (rs.next()) list.add(row(rs));
            }
        } catch (SQLException e) {
            throw new RuntimeException("List sessions failed", e);
        }
        return list;
    }

    @Override
    public Optional<SessionRow> getCurrentRunningSession() {
        try (Connection c = connect();
             PreparedStatement ps = c.prepareStatement(
                 "SELECT id, project, start_time, end_time, duration_minutes, device_id, synced, created_at FROM " + SESSIONS_TABLE + " WHERE end_time IS NULL ORDER BY start_time DESC LIMIT 1");
             ResultSet rs = ps.executeQuery()) {
            if (rs.next()) return Optional.of(row(rs));
        } catch (SQLException e) {
            throw new RuntimeException("Get current session failed", e);
        }
        return Optional.empty();
    }

    private Optional<String> getConfig(String key) {
        try (Connection c = connect();
             PreparedStatement ps = c.prepareStatement("SELECT value FROM " + CONFIG_TABLE + " WHERE key=?")) {
            ps.setString(1, key);
            try (ResultSet rs = ps.executeQuery()) {
                if (rs.next()) return Optional.ofNullable(rs.getString("value"));
            }
        } catch (SQLException e) {
            throw new RuntimeException("Get config failed", e);
        }
        return Optional.empty();
    }

    private void setConfig(String key, String value) {
        try (Connection c = connect();
             PreparedStatement ps = c.prepareStatement("INSERT OR REPLACE INTO " + CONFIG_TABLE + " (key, value) VALUES (?,?)")) {
            ps.setString(1, key);
            ps.setString(2, value);
            ps.executeUpdate();
        } catch (SQLException e) {
            throw new RuntimeException("Set config failed", e);
        }
    }

    private static SessionRow row(ResultSet rs) throws SQLException {
        String end = rs.getString("end_time");
        return new SessionRow(
            rs.getString("id"),
            rs.getString("project"),
            Instant.parse(rs.getString("start_time")),
            end == null ? null : Instant.parse(end),
            rs.getInt("duration_minutes"),
            rs.getString("device_id"),
            rs.getInt("synced") == 1,
            Instant.parse(rs.getString("created_at"))
        );
    }
}
