package org.freelance.tracking.controller;

import org.freelance.tracking.domain.ProjectSettings;
import org.freelance.tracking.dto.ProjectRateRequest;
import org.freelance.tracking.dto.ProjectRateResponse;
import org.freelance.tracking.service.ProjectSettingsService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/project-settings")
public class ProjectSettingsController {

    private final ProjectSettingsService projectSettingsService;

    public ProjectSettingsController(ProjectSettingsService projectSettingsService) {
        this.projectSettingsService = projectSettingsService;
    }

    @GetMapping
    public ResponseEntity<List<ProjectRateResponse>> getAllProjectSettings(Authentication authentication) {
        UUID userId = UUID.fromString(authentication.getName());
        List<ProjectSettings> settings = projectSettingsService.getAllProjectSettings(userId);
        List<ProjectRateResponse> responses = settings.stream()
                .map(s -> new ProjectRateResponse(s.getProjectId(), s.getHourlyRate(), s.getCreatedAt(), s.getUpdatedAt()))
                .collect(Collectors.toList());
        return ResponseEntity.ok(responses);
    }

    @GetMapping("/{projectId}")
    public ResponseEntity<ProjectRateResponse> getProjectSettings(
            @PathVariable String projectId,
            Authentication authentication) {
        UUID userId = UUID.fromString(authentication.getName());
        return projectSettingsService.getProjectSettings(userId, projectId)
                .map(s -> new ProjectRateResponse(s.getProjectId(), s.getHourlyRate(), s.getCreatedAt(), s.getUpdatedAt()))
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<ProjectRateResponse> setProjectRate(
            @RequestBody ProjectRateRequest request,
            Authentication authentication) {
        UUID userId = UUID.fromString(authentication.getName());
        ProjectSettings settings = projectSettingsService.setProjectRate(userId, request.getProjectId(), request.getHourlyRate());
        ProjectRateResponse response = new ProjectRateResponse(
                settings.getProjectId(),
                settings.getHourlyRate(),
                settings.getCreatedAt(),
                settings.getUpdatedAt()
        );
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{projectId}")
    public ResponseEntity<Void> deleteProjectRate(
            @PathVariable String projectId,
            Authentication authentication) {
        UUID userId = UUID.fromString(authentication.getName());
        projectSettingsService.deleteProjectRate(userId, projectId);
        return ResponseEntity.noContent().build();
    }
}