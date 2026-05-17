package org.freelance.report.client;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * HTTP client to fetch project settings and user default rate from Tracking service.
 */
@Component
public class ProjectSettingsClient {

    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Value("${tracking.base-url:http://localhost:8082}")
    private String trackingBaseUrl;

    @Value("${auth.base-url:http://localhost:8081}")
    private String authBaseUrl;

    /** Fetches all project settings for a user. */
    public Map<String, Double> getProjectRates(String bearerToken) {
        String url = trackingBaseUrl + "/project-settings";
        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(bearerToken);
        HttpEntity<Void> entity = new HttpEntity<>(headers);

        try {
            ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.GET, entity, String.class);
            if (!response.getStatusCode().is2xxSuccessful() || response.getBody() == null) {
                return new HashMap<>();
            }

            JsonNode root = objectMapper.readTree(response.getBody());
            Map<String, Double> rates = new HashMap<>();
            if (root.isArray()) {
                for (JsonNode node : root) {
                    String projectId = node.has("projectId") ? node.get("projectId").asText() : null;
                    Double hourlyRate = node.has("hourlyRate") ? node.get("hourlyRate").asDouble() : null;
                    if (projectId != null && hourlyRate != null) {
                        rates.put(projectId, hourlyRate);
                    }
                }
            }
            return rates;
        } catch (Exception e) {
            return new HashMap<>();
        }
    }

    /** Fetches user's default hourly rate from Auth service. */
    public Double getUserDefaultRate(String bearerToken) {
        String url = authBaseUrl + "/auth/me";
        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(bearerToken);
        HttpEntity<Void> entity = new HttpEntity<>(headers);

        try {
            ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.GET, entity, String.class);
            if (!response.getStatusCode().is2xxSuccessful() || response.getBody() == null) {
                return null;
            }

            JsonNode root = objectMapper.readTree(response.getBody());
            if (root.has("defaultHourlyRate")) {
                return root.get("defaultHourlyRate").asDouble();
            }
            return null;
        } catch (Exception e) {
            return null;
        }
    }

    /** Fetches a specific project's hourly rate. */
    public Double getProjectRate(String bearerToken, String projectId) {
        String url = trackingBaseUrl + "/project-settings/" + projectId;
        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(bearerToken);
        HttpEntity<Void> entity = new HttpEntity<>(headers);

        try {
            ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.GET, entity, String.class);
            if (!response.getStatusCode().is2xxSuccessful() || response.getBody() == null) {
                return null;
            }

            JsonNode root = objectMapper.readTree(response.getBody());
            if (root.has("hourlyRate")) {
                return root.get("hourlyRate").asDouble();
            }
            return null;
        } catch (Exception e) {
            return null;
        }
    }
}