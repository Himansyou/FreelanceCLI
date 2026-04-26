package org.freelance.tracking.dto;

import java.time.Instant;

public class ProjectRateResponse {
    private String projectId;
    private Double hourlyRate;
    private Instant createdAt;
    private Instant updatedAt;

    public ProjectRateResponse() {}

    public ProjectRateResponse(String projectId, Double hourlyRate, Instant createdAt, Instant updatedAt) {
        this.projectId = projectId;
        this.hourlyRate = hourlyRate;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public String getProjectId() { return projectId; }
    public void setProjectId(String projectId) { this.projectId = projectId; }
    public Double getHourlyRate() { return hourlyRate; }
    public void setHourlyRate(Double hourlyRate) { this.hourlyRate = hourlyRate; }
    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
    public Instant getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(Instant updatedAt) { this.updatedAt = updatedAt; }
}