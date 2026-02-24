package org.freelance.tracking.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import java.time.Instant;
import java.util.UUID;

/**
 * Single session in sync request (client-provided id for idempotency).
 */
public class SessionDto {

    @NotNull
    private UUID id;

    @NotNull
    private String projectId;

    @NotNull
    private Instant startTime;

    @NotNull
    private Instant endTime;

    @NotNull
    @Min(0)
    private Integer durationMinutes;

    private String deviceId;

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    public String getProjectId() { return projectId; }
    public void setProjectId(String projectId) { this.projectId = projectId; }
    public Instant getStartTime() { return startTime; }
    public void setStartTime(Instant startTime) { this.startTime = startTime; }
    public Instant getEndTime() { return endTime; }
    public void setEndTime(Instant endTime) { this.endTime = endTime; }
    public Integer getDurationMinutes() { return durationMinutes; }
    public void setDurationMinutes(Integer durationMinutes) { this.durationMinutes = durationMinutes; }
    public String getDeviceId() { return deviceId; }
    public void setDeviceId(String deviceId) { this.deviceId = deviceId; }
}
