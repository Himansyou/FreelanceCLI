package org.freelance.tracking.domain;

import jakarta.persistence.*;
import java.time.Instant;
import java.util.UUID;

/**
 * Session entity for tracking_db. Id is client-provided for idempotent sync.
 */
@Entity
@Table(
    name = "sessions",
    indexes = {
        @Index(name = "idx_sessions_user_id", columnList = "user_id"),
        @Index(name = "idx_sessions_user_project", columnList = "user_id, project_id"),
        @Index(name = "idx_sessions_user_start", columnList = "user_id, start_time")
    }
)
public class Session {

    @Id
    @Column(columnDefinition = "uuid")
    private UUID id;

    @Column(name = "user_id", nullable = false)
    private UUID userId;

    @Column(name = "project_id", nullable = false, length = 255)
    private String projectId;

    @Column(name = "start_time", nullable = false)
    private Instant startTime;

    @Column(name = "end_time", nullable = false)
    private Instant endTime;

    @Column(name = "duration_minutes", nullable = false)
    private Integer durationMinutes;

    @Column(name = "device_id", length = 255)
    private String deviceId;

    @Column(name = "created_at", nullable = false)
    private Instant createdAt;

    @PrePersist
    public void prePersist() {
        if (createdAt == null) createdAt = Instant.now();
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    public UUID getUserId() { return userId; }
    public void setUserId(UUID userId) { this.userId = userId; }
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
    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
}
