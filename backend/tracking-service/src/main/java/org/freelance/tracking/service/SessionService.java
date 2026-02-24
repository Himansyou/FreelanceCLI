package org.freelance.tracking.service;

import org.freelance.tracking.domain.Session;
import org.freelance.tracking.dto.SessionDto;
import org.freelance.tracking.dto.SessionResponse;
import org.freelance.tracking.repository.SessionRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

/**
 * Application service for session sync (idempotent) and list. Single responsibility.
 */
@Service
public class SessionService {

    private final SessionRepository sessionRepository;

    public SessionService(SessionRepository sessionRepository) {
        this.sessionRepository = sessionRepository;
    }

    /**
     * Idempotent sync: for each session, save or update by id. Same id sent again overwrites.
     */
    @Transactional
    public int syncSessions(UUID userId, List<SessionDto> dtos) {
        int synced = 0;
        for (SessionDto dto : dtos) {
            try {
                Session session = sessionRepository.findById(dto.getId()).orElse(new Session());
                session.setId(dto.getId());
                session.setUserId(userId);
                session.setProjectId(dto.getProjectId());
                session.setStartTime(dto.getStartTime());
                session.setEndTime(dto.getEndTime());
                session.setDurationMinutes(dto.getDurationMinutes());
                session.setDeviceId(dto.getDeviceId());
                sessionRepository.save(session);
                synced++;
            } catch (Exception e) {
                // Skip invalid row; could increment rejected
            }
        }
        return synced;
    }

    public List<SessionResponse> listSessions(UUID userId, String projectId, Instant from, Instant to) {
        List<Session> list = sessionRepository.findByUserAndOptionalFilters(userId, projectId, from, to);
        return list.stream().map(this::toResponse).collect(Collectors.toList());
    }

    private SessionResponse toResponse(Session s) {
        SessionResponse r = new SessionResponse();
        r.setId(s.getId());
        r.setUserId(s.getUserId());
        r.setProjectId(s.getProjectId());
        r.setStartTime(s.getStartTime());
        r.setEndTime(s.getEndTime());
        r.setDurationMinutes(s.getDurationMinutes());
        r.setDeviceId(s.getDeviceId());
        r.setCreatedAt(s.getCreatedAt());
        return r;
    }
}
