package org.himansyou.commands;

import org.himansyou.api.ApiClient;
import org.himansyou.storage.LocalStorage;
import org.himansyou.storage.SqliteLocalStorage;
import org.himansyou.storage.LocalStorage.SessionRow;
import picocli.CommandLine.Command;
import picocli.CommandLine.Option;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

/**
 * freelance sync [--api-url url]
 * Uploads unsynced sessions to the backend (idempotent).
 */
@Command(name = "sync", description = "Sync local sessions to the backend")
public class SyncCommand implements Runnable {

    @Option(names = {"--api-url"}, description = "API base URL", defaultValue = "http://localhost:8080")
    String apiUrl;

    @Override
    public void run() {
        LocalStorage storage = new SqliteLocalStorage();
        storage.initSchema();
        if (storage.getAccessToken().isEmpty()) {
            System.err.println("Not logged in. Run 'freelance login' first.");
            return;
        }
        List<SessionRow> unsynced = storage.listSessions(true);
        if (unsynced.isEmpty()) {
            System.out.println("Nothing to sync.");
            return;
        }
        String token = storage.getAccessToken().get();
        List<ApiClient.SessionPayload> payloads = new ArrayList<>();
        for (SessionRow s : unsynced) {
            if (s.endTime() == null) continue; // skip still-running
            payloads.add(new ApiClient.SessionPayload(
                UUID.fromString(s.id()),
                s.project(),
                s.startTime().toString(),
                s.endTime().toString(),
                s.durationMinutes(),
                s.deviceId()
            ));
        }
        if (payloads.isEmpty()) {
            System.out.println("No completed sessions to sync (finish current session with 'freelance stop' first).");
            return;
        }
        ApiClient client = new ApiClient(apiUrl);
        try {
            ApiClient.SyncResult result = client.sync(token, payloads);
            List<String> ids = payloads.stream().map(p -> p.id().toString()).toList();
            storage.markSynced(ids);
            System.out.println("Synced " + result.synced() + " session(s). Rejected: " + result.rejected());
        } catch (Exception ex) {
            System.err.println("Sync failed: " + ex.getMessage());
        }
    }
}
