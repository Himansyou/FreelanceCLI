package org.freelance.tracking.controller;

import jakarta.validation.Valid;
import org.freelance.tracking.dto.SessionResponse;
import org.freelance.tracking.dto.SessionsListResponse;
import org.freelance.tracking.dto.SyncRequest;
import org.freelance.tracking.dto.SyncResponse;
import org.freelance.tracking.service.SessionService;
import org.springframework.format.annotation.DateTimeFormat;
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
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) Instant from,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) Instant to,
            Authentication authentication
    ) {
        UUID userId = UUID.fromString(authentication.getName());
        List<SessionResponse> sessions = sessionService.listSessions(userId, projectId, from, to);
        return ResponseEntity.ok(new SessionsListResponse(sessions));
    }
}
