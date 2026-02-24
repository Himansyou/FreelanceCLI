package org.freelance.tracking;

import org.freelance.tracking.dto.SessionDto;
import org.freelance.tracking.service.SessionService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * Unit/integration tests for SessionService (sync and list). Uses H2.
 */
@SpringBootTest
@ActiveProfiles("test")
class SessionServiceTest {

    @Autowired
    private SessionService sessionService;

    private static final UUID USER_ID = UUID.randomUUID();

    @Test
    void sync_and_list_sessions() {
        UUID sessionId = UUID.randomUUID();
        SessionDto dto = new SessionDto();
        dto.setId(sessionId);
        dto.setProjectId("test-project");
        dto.setStartTime(Instant.now().minusSeconds(3600));
        dto.setEndTime(Instant.now());
        dto.setDurationMinutes(60);
        dto.setDeviceId("test-device");

        int synced = sessionService.syncSessions(USER_ID, List.of(dto));
        assertThat(synced).isEqualTo(1);

        var list = sessionService.listSessions(USER_ID, null, null, null);
        assertThat(list).hasSize(1);
        assertThat(list.get(0).getProjectId()).isEqualTo("test-project");
        assertThat(list.get(0).getDurationMinutes()).isEqualTo(60);
    }

    @Test
    void sync_idempotent_same_id_twice() {
        UUID sessionId = UUID.randomUUID();
        SessionDto dto = new SessionDto();
        dto.setId(sessionId);
        dto.setProjectId("project-a");
        dto.setStartTime(Instant.now().minusSeconds(1800));
        dto.setEndTime(Instant.now());
        dto.setDurationMinutes(30);
        sessionService.syncSessions(USER_ID, List.of(dto));
        dto.setDurationMinutes(35);
        sessionService.syncSessions(USER_ID, List.of(dto));

        var list = sessionService.listSessions(USER_ID, null, null, null);
        assertThat(list).hasSize(1);
        assertThat(list.get(0).getDurationMinutes()).isEqualTo(35);
    }
}
