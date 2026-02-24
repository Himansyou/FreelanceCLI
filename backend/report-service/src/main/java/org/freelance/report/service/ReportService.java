package org.freelance.report.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.freelance.report.client.TrackingClient;
import org.freelance.report.dto.ReportSummaryResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneOffset;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;

/**
 * Builds summary report from Tracking API and caches result in Redis. Cache invalidation by userId pattern.
 */
@Service
public class ReportService {

    private static final String CACHE_KEY_PREFIX = "report:summary:";
    private static final DateTimeFormatter DATE_FMT = DateTimeFormatter.ISO_LOCAL_DATE;

    private final TrackingClient trackingClient;
    private final RedisTemplate<String, String> redisTemplate;
    private final ObjectMapper objectMapper;
    private final long cacheTtlSeconds;

    public ReportService(
            TrackingClient trackingClient,
            RedisTemplate<String, String> redisTemplate,
            ObjectMapper objectMapper,
            @Value("${report.cache-ttl-seconds:300}") long cacheTtlSeconds
    ) {
        this.trackingClient = trackingClient;
        this.redisTemplate = redisTemplate;
        this.objectMapper = objectMapper;
        this.cacheTtlSeconds = cacheTtlSeconds;
    }

    /**
     * Returns summary report. Checks Redis first; on miss fetches from Tracking and caches.
     */
    public ReportSummaryResponse getSummary(
            String userId,
            String bearerToken,
            String projectId,
            String fromStr,
            String toStr
    ) {
        Instant from = parseDate(fromStr);
        Instant to = parseDate(toStr);
        if (from == null) from = LocalDate.now().minusDays(30).atStartOfDay(ZoneOffset.UTC).toInstant();
        if (to == null) to = Instant.now();

        String cacheKey = CACHE_KEY_PREFIX + userId + ":" + (projectId != null ? projectId : "all") + ":" + from + ":" + to;
        String cached = redisTemplate.opsForValue().get(cacheKey);
        if (cached != null) {
            try {
                return objectMapper.readValue(cached, ReportSummaryResponse.class);
            } catch (JsonProcessingException e) {
                // fall through to compute
            }
        }

        List<TrackingClient.SessionItem> sessions = trackingClient.getSessions(bearerToken, projectId, from, to);
        ReportSummaryResponse report = buildSummary(userId, projectId != null ? projectId : "all", from, to, sessions);
        try {
            redisTemplate.opsForValue().set(cacheKey, objectMapper.writeValueAsString(report), cacheTtlSeconds, TimeUnit.SECONDS);
        } catch (JsonProcessingException ignored) {}
        return report;
    }

    /**
     * Invalidates cache for a user (call when new sessions are synced).
     */
    public void invalidateCacheForUser(String userId) {
        Set<String> keys = redisTemplate.keys(CACHE_KEY_PREFIX + userId + ":*");
        if (keys != null && !keys.isEmpty()) {
            redisTemplate.delete(keys);
        }
    }

    private Instant parseDate(String s) {
        if (s == null || s.isBlank()) return null;
        try {
            return LocalDate.parse(s.trim(), DATE_FMT).atStartOfDay(ZoneOffset.UTC).toInstant();
        } catch (Exception e) {
            return null;
        }
    }

    private ReportSummaryResponse buildSummary(String userId, String projectId, Instant from, Instant to, List<TrackingClient.SessionItem> sessions) {
        ReportSummaryResponse r = new ReportSummaryResponse();
        r.setUserId(userId);
        r.setProjectId(projectId);
        r.setFrom(from.atOffset(ZoneOffset.UTC).format(DATE_FMT));
        r.setTo(to.atOffset(ZoneOffset.UTC).format(DATE_FMT));
        r.setTotalMinutes(sessions.stream().mapToInt(TrackingClient.SessionItem::getDurationMinutes).sum());
        r.setSessionCount(sessions.size());

        Map<String, List<TrackingClient.SessionItem>> byProject = sessions.stream().collect(Collectors.groupingBy(s -> s.getProjectId() != null ? s.getProjectId() : "unknown"));
        List<ReportSummaryResponse.ProjectSummary> list = new ArrayList<>();
        for (Map.Entry<String, List<TrackingClient.SessionItem>> e : byProject.entrySet()) {
            int total = e.getValue().stream().mapToInt(TrackingClient.SessionItem::getDurationMinutes).sum();
            list.add(new ReportSummaryResponse.ProjectSummary(e.getKey(), total, e.getValue().size()));
        }
        r.setByProject(list);
        return r;
    }
}
