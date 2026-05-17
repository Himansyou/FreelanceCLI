package org.freelance.tracking.repository;

import org.freelance.tracking.domain.ProjectSettings;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface ProjectSettingsRepository extends JpaRepository<ProjectSettings, UUID> {

    Optional<ProjectSettings> findByUserIdAndProjectId(UUID userId, String projectId);

    List<ProjectSettings> findByUserId(UUID userId);

    void deleteByUserIdAndProjectId(UUID userId, String projectId);
}