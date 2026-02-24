package org.freelance.tracking.repository;

import org.freelance.tracking.domain.Session;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

/**
 * Repository for Session entity. Custom queries for filtering by user, project, date range.
 */
public interface SessionRepository extends JpaRepository<Session, UUID> {

    @Query("SELECT s FROM Session s WHERE s.userId = :userId " +
           "AND (:projectId IS NULL OR s.projectId = :projectId) " +
           "AND (:from IS NULL OR s.startTime >= :from) " +
           "AND (:to IS NULL OR s.endTime <= :to) ORDER BY s.startTime DESC")
    List<Session> findByUserAndOptionalFilters(
        @Param("userId") UUID userId,
        @Param("projectId") String projectId,
        @Param("from") Instant from,
        @Param("to") Instant to
    );
}
