package org.freelance.report.client;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

/**
 * HTTP client to fetch sessions from Tracking service. Used when cache misses.
 */
@Component
public class TrackingClient {

    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Value("${tracking.base-url:http://localhost:8082}")
    private String trackingBaseUrl;

    /** Fetches sessions (user inferred from JWT by Tracking service). */
    public List<SessionItem> getSessions(String bearerToken, String projectId, Instant from, Instant to) {
        StringBuilder url = new StringBuilder(trackingBaseUrl).append("/tracking/sessions");
        boolean first = true;
        if (projectId != null && !projectId.isEmpty()) { url.append(first ? "?" : "&").append("projectId=").append(projectId); first = false; }
        if (from != null) { url.append(first ? "?" : "&").append("from=").append(from.toString()); first = false; }
        if (to != null) url.append(first ? "?" : "&").append("to=").append(to.toString());

        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(bearerToken);
        HttpEntity<Void> entity = new HttpEntity<>(headers);
        ResponseEntity<String> response = restTemplate.exchange(url.toString(), HttpMethod.GET, entity, String.class);
        if (!response.getStatusCode().is2xxSuccessful() || response.getBody() == null) {
            return new ArrayList<>();
        }
        try {
            JsonNode root = objectMapper.readTree(response.getBody());
            JsonNode sessions = root.get("sessions");
            List<SessionItem> list = new ArrayList<>();
            if (sessions != null && sessions.isArray()) {
                for (JsonNode node : sessions) {
                    SessionItem item = new SessionItem();
                    item.setId(node.has("id") ? node.get("id").asText() : null);
                    item.setProjectId(node.has("projectId") ? node.get("projectId").asText() : null);
                    item.setDurationMinutes(node.has("durationMinutes") ? node.get("durationMinutes").asInt() : 0);
                    list.add(item);
                }
            }
            return list;
        } catch (Exception e) {
            return new ArrayList<>();
        }
    }

    public static class SessionItem {
        private String id;
        private String projectId;
        private int durationMinutes;
        public String getId() { return id; }
        public void setId(String id) { this.id = id; }
        public String getProjectId() { return projectId; }
        public void setProjectId(String projectId) { this.projectId = projectId; }
        public int getDurationMinutes() { return durationMinutes; }
        public void setDurationMinutes(int durationMinutes) { this.durationMinutes = durationMinutes; }
    }
}
