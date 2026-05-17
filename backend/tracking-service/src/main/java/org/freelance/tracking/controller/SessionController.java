package org.freelance.tracking.controller;

import jakarta.validation.Valid;
import org.freelance.tracking.dto.SessionResponse;
import org.freelance.tracking.dto.SessionsListResponse;
import org.freelance.tracking.dto.SyncRequest;
import org.freelance.tracking.dto.SyncResponse;
import org.freelance.tracking.service.SessionService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

/**
 * REST controller for session sync and list. User id from JWT.
 */
@RestController
@RequestMapping("/tracking")
public class SessionController {

    private final SessionService sessionService;

    public SessionController(SessionService sessionService) {
        this.sessionService = sessionService;
    }

    @PostMapping("/sessions/sync")
    public ResponseEntity<SyncResponse> sync(
            @Valid @RequestBody SyncRequest request,
            Authentication authentication
    ) {
        UUID userId = UUID.fromString(authentication.getName());
        int synced = sessionService.syncSessions(userId, request.getSessions());
        int rejected = request.getSessions().size() - synced;
        return ResponseEntity.ok(new SyncResponse(synced, rejected));
    }

    @GetMapping("/sessions")
    public ResponseEntity<SessionsListResponse> list(
            @RequestParam(required = false) String projectId,
            @RequestParam(required = false) String from,
            @RequestParam(required = false) String to,
            Authentication authentication
    ) {
        UUID userId = UUID.fromString(authentication.getName());

        String cleanProjectId = (projectId == null || projectId.isBlank() || "null".equalsIgnoreCase(projectId))
                ? null : projectId;

        Instant cleanFrom = null;
        Instant cleanTo = null;

        try {
            if (from != null && !from.isBlank() && !"null".equalsIgnoreCase(from)) {
                cleanFrom = Instant.parse(from);
            }
        } catch (Exception ignored) {}

        try {
            if (to != null && !to.isBlank() && !"null".equalsIgnoreCase(to)) {
                cleanTo = Instant.parse(to);
            }
        } catch (Exception ignored) {}

        List<SessionResponse> sessions =
                sessionService.listSessions(userId, cleanProjectId, cleanFrom, cleanTo);

        return ResponseEntity.ok(new SessionsListResponse(sessions));
    }
}
