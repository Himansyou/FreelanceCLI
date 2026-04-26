package org.freelance.auth.dto;

import java.time.Instant;
import java.util.UUID;

/**
 * Public user representation (no password).
 */
public class UserResponse {

    private UUID id;
    private String email;
    private Instant createdAt;
    private Double defaultHourlyRate;

    public UserResponse(UUID id, String email, Instant createdAt, Double defaultHourlyRate) {
        this.id = id;
        this.email = email;
        this.createdAt = createdAt;
        this.defaultHourlyRate = defaultHourlyRate;
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
    public Double getDefaultHourlyRate() { return defaultHourlyRate; }
    public void setDefaultHourlyRate(Double defaultHourlyRate) { this.defaultHourlyRate = defaultHourlyRate; }
}
