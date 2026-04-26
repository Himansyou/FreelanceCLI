package org.freelance.tracking.dto;

public class ProjectRateRequest {
    private String projectId;
    private Double hourlyRate;

    public String getProjectId() { return projectId; }
    public void setProjectId(String projectId) { this.projectId = projectId; }
    public Double getHourlyRate() { return hourlyRate; }
    public void setHourlyRate(Double hourlyRate) { this.hourlyRate = hourlyRate; }
}