package org.himansyou.api;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import okhttp3.*;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

/**
 * HTTP client for Auth and Tracking APIs. Base URL typically http://localhost:8080 (Gateway).
 */
public class ApiClient {

    private static final MediaType JSON = MediaType.get("application/json; charset=utf-8");
    private final OkHttpClient client = new OkHttpClient();
    private final ObjectMapper mapper = new ObjectMapper();
    private final String baseUrl;

    public ApiClient(String baseUrl) {
        this.baseUrl = baseUrl.endsWith("/") ? baseUrl.substring(0, baseUrl.length() - 1) : baseUrl;
    }

    /**
     * Login and return LoginResult or throw on error.
     */
    public LoginResult login(String email, String password) throws IOException {
        String body = mapper.writeValueAsString(new LoginBody(email, password));
        Request request = new Request.Builder()
            .url(baseUrl + "/auth/login")
            .post(RequestBody.create(body, JSON))
            .build();
        try (Response response = client.newCall(request).execute()) {
            if (!response.isSuccessful() || response.body() == null) {
                throw new IOException("Login failed: " + (response.body() != null ? response.body().string() : response.code()));
            }
            JsonNode root = mapper.readTree(response.body().string());
            return new LoginResult(
                root.get("accessToken").asText(),
                root.get("userId").asText(),
                root.get("expiresIn").asLong()
            );
        }
    }

    /**
     * Sync sessions (idempotent). Requires valid Bearer token.
     */
    public SyncResult sync(String bearerToken, List<SessionPayload> sessions) throws IOException {
        SyncRequestPayload payload = new SyncRequestPayload(sessions);
        String body = mapper.writeValueAsString(payload);
        Request request = new Request.Builder()
            .url(baseUrl + "/tracking/sessions/sync")
            .addHeader("Authorization", "Bearer " + bearerToken)
            .post(RequestBody.create(body, JSON))
            .build();
        try (Response response = client.newCall(request).execute()) {
            if (!response.isSuccessful() || response.body() == null) {
                throw new IOException("Sync failed: " + response.code());
            }
            JsonNode root = mapper.readTree(response.body().string());
            return new SyncResult(root.get("synced").asInt(), root.get("rejected").asInt());
        }
    }

    public record LoginResult(String accessToken, String userId, long expiresIn) {}
    public record SyncResult(int synced, int rejected) {}

    public record LoginBody(String email, String password) {}
    public record SessionPayload(UUID id, String projectId, String startTime, String endTime, int durationMinutes, String deviceId) {}
    public record SyncRequestPayload(List<SessionPayload> sessions) {}
}
