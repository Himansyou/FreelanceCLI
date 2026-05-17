package org.freelance.tracking.service;

import org.freelance.tracking.domain.ProjectSettings;
import org.freelance.tracking.repository.ProjectSettingsRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class ProjectSettingsService {

    private final ProjectSettingsRepository projectSettingsRepository;

    public ProjectSettingsService(ProjectSettingsRepository projectSettingsRepository) {
        this.projectSettingsRepository = projectSettingsRepository;
    }

    public Optional<ProjectSettings> getProjectSettings(UUID userId, String projectId) {
        return projectSettingsRepository.findByUserIdAndProjectId(userId, projectId);
    }

    public List<ProjectSettings> getAllProjectSettings(UUID userId) {
        return projectSettingsRepository.findByUserId(userId);
    }

    @Transactional
    public ProjectSettings setProjectRate(UUID userId, String projectId, Double hourlyRate) {
        Optional<ProjectSettings> existing = projectSettingsRepository.findByUserIdAndProjectId(userId, projectId);
        if (existing.isPresent()) {
            ProjectSettings settings = existing.get();
            settings.setHourlyRate(hourlyRate);
            return projectSettingsRepository.save(settings);
        } else {
            ProjectSettings settings = new ProjectSettings();
            settings.setUserId(userId);
            settings.setProjectId(projectId);
            settings.setHourlyRate(hourlyRate);
            return projectSettingsRepository.save(settings);
        }
    }

    @Transactional
    public void deleteProjectRate(UUID userId, String projectId) {
        projectSettingsRepository.deleteByUserIdAndProjectId(userId, projectId);
    }
}