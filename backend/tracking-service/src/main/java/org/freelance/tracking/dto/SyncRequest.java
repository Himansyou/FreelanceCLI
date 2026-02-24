package org.freelance.tracking.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import java.util.List;

/**
 * Request body for idempotent sync: list of sessions.
 */
public class SyncRequest {

    @NotEmpty
    @Valid
    private List<SessionDto> sessions;

    public List<SessionDto> getSessions() { return sessions; }
    public void setSessions(List<SessionDto> sessions) { this.sessions = sessions; }
}
