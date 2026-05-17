package org.freelance.tracking.domain;

import jakarta.persistence.*;
import java.time.Instant;
import java.util.UUID;

/**
 * ProjectSettings entity for tracking_db. Stores per-project hourly rates for users.
 */
@Entity
@Table(
    name = "project_settings",
    indexes = {
        @Index(name = "idx_project_settings_user_id", columnList = "user_id"),
        @Index(name = "idx_project_settings_user_project", columnList = "user_id, project_id", unique = true)
    }
)
public class ProjectSettings {

    @Id
    @Column(columnDefinition = "uuid")
    private UUID id;

    @Column(name = "user_id", nullable = false)
    private UUID userId;

    @Column(name = "project_id", nullable = false, length = 255)
    private String projectId;

    @Column(name = "hourly_rate", nullable = false)
    private Double hourlyRate;

    @Column(name = "created_at", nullable = false)
    private Instant createdAt;

    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;

    @PrePersist
    public void prePersist() {
        if (id == null) id = UUID.randomUUID();
        if (createdAt == null) createdAt = Instant.now();
        if (updatedAt == null) updatedAt = Instant.now();
    }

    @PreUpdate
    public void preUpdate() {
        updatedAt = Instant.now();
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    public UUID getUserId() { return userId; }
    public void setUserId(UUID userId) { this.userId = userId; }
    public String getProjectId() { return projectId; }
    public void setProjectId(String projectId) { this.projectId = projectId; }
    public Double getHourlyRate() { return hourlyRate; }
    public void setHourlyRate(Double hourlyRate) { this.hourlyRate = hourlyRate; }
    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
    public Instant getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(Instant updatedAt) { this.updatedAt = updatedAt; }
}