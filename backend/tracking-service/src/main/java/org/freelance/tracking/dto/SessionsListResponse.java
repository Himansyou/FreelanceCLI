package org.freelance.tracking.dto;

import java.util.List;

/**
 * Wrapper for list of sessions.
 */
public class SessionsListResponse {

    private List<SessionResponse> sessions;

    public SessionsListResponse(List<SessionResponse> sessions) {
        this.sessions = sessions;
    }

    public List<SessionResponse> getSessions() { return sessions; }
    public void setSessions(List<SessionResponse> sessions) { this.sessions = sessions; }
}
