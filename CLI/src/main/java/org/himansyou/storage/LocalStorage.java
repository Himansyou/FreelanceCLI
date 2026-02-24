package org.himansyou.storage;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

/**
 * Local persistence for sessions and auth config. Implemented with SQLite.
 */
public interface LocalStorage {

    /** Ensure DB tables exist. Call once at startup. */
    void initSchema();

    /** Get stored access token if present. */
    Optional<String> getAccessToken();

    /** Get stored user id if present. */
    Optional<String> getUserId();

    /** Store auth after login. */
    void setAuth(String accessToken, String userId);

    /** Clear auth (logout). */
    void clearAuth();

    /** Get device id (generated once, stored). */
    String getOrCreateDeviceId();

    /** Insert a new session (id generated). Returns session id. */
    String insertSession(String project, Instant startTime);

    /** End the current running session (single active session). Returns true if one was stopped. */
    boolean stopCurrentSession(Instant endTime);

    /** Mark sessions as synced by ids. */
    void markSynced(List<String> sessionIds);

    /** List all sessions (optional: only unsynced). */
    List<SessionRow> listSessions(boolean unsyncedOnly);

    /** List sessions for report (optional project, date range). */
    List<SessionRow> listSessionsForReport(String project, Instant from, Instant to);

    /** Get current running session if any (single active). */
    Optional<SessionRow> getCurrentRunningSession();

    record SessionRow(
        String id,
        String project,
        Instant startTime,
        Instant endTime,
        int durationMinutes,
        String deviceId,
        boolean synced,
        Instant createdAt
    ) {}
}
