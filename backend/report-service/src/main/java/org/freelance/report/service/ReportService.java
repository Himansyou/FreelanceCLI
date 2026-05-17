package org.freelance.report.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.freelance.report.client.ProjectSettingsClient;
import org.freelance.report.client.TrackingClient;
import org.freelance.report.dto.ProjectDetailResponse;
import org.freelance.report.dto.ReportSummaryResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.time.*;
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
    private final ProjectSettingsClient projectSettingsClient;
    private final RedisTemplate<String, String> redisTemplate;
    private final ObjectMapper objectMapper;
    private final long cacheTtlSeconds;

    public ReportService(
            TrackingClient trackingClient,
            ProjectSettingsClient projectSettingsClient,
            RedisTemplate<String, String> redisTemplate,
            ObjectMapper objectMapper,
            @Value("${report.cache-ttl-seconds:300}") long cacheTtlSeconds
    ) {
        this.trackingClient = trackingClient;
        this.projectSettingsClient = projectSettingsClient;
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
        System.out.println("CACHE HIT: " + (cached != null));
        if (cached != null) {
            try {
                return objectMapper.readValue(cached, ReportSummaryResponse.class);
            } catch (JsonProcessingException e) {
                // fall through to compute
            }
        }

        List<TrackingClient.SessionItem> sessions = trackingClient.getSessions(bearerToken, projectId, from, to);
        Map<String, Double> projectRates = projectSettingsClient.getProjectRates(bearerToken);
        Double defaultRate = projectSettingsClient.getUserDefaultRate(bearerToken);
        ReportSummaryResponse report = buildSummary(userId, projectId != null ? projectId : "all", from, to, sessions, projectRates, defaultRate);
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

    /**
     * Returns detailed project data for HTML export with weekly summaries and session details.
     */
    public ProjectDetailResponse getProjectDetail(String userId, String bearerToken, String projectId) {
        List<TrackingClient.SessionItem> sessions = trackingClient.getSessions(bearerToken, projectId, null, null);
        Double projectRate = projectSettingsClient.getProjectRate(bearerToken, projectId);
        Double defaultRate = projectSettingsClient.getUserDefaultRate(bearerToken);
        double hourlyRate = projectRate != null ? projectRate : (defaultRate != null ? defaultRate : 0.0);

        if (sessions.isEmpty()) {
            ProjectDetailResponse empty = new ProjectDetailResponse();
            empty.setProjectId(projectId);
            empty.setProjectName(projectId);
            empty.setHourlyRate(hourlyRate);
            empty.setTotalMinutes(0);
            empty.setSessionCount(0);
            empty.setTotalEarnings(0.0);
            empty.setWeeklySummaries(new ArrayList<>());
            empty.setSessions(new ArrayList<>());
            return empty;
        }

        // Calculate project timeline
        Instant projectStart = sessions.stream().map(TrackingClient.SessionItem::getStartTime).min(Instant::compareTo).orElse(Instant.now());
        Instant projectEnd = sessions.stream().map(TrackingClient.SessionItem::getEndTime).filter(Objects::nonNull).max(Instant::compareTo).orElse(Instant.now());

        // Calculate totals
        long totalMinutes = sessions.stream().mapToInt(TrackingClient.SessionItem::getDurationMinutes).sum();
        double totalEarnings = (totalMinutes / 60.0) * hourlyRate;

        // Build weekly summaries
        List<ProjectDetailResponse.WeeklySummary> weeklySummaries = buildWeeklySummaries(sessions, hourlyRate);

        // Build session details
        List<ProjectDetailResponse.SessionDetail> sessionDetails = sessions.stream()
            .map(s -> {
                double earnings = (s.getDurationMinutes() / 60.0) * hourlyRate;
                return new ProjectDetailResponse.SessionDetail(
                    s.getId().toString(),
                    s.getStartTime(),
                    s.getEndTime(),
                    s.getDurationMinutes(),
                    earnings,
                    s.getDeviceId()
                );
            })
            .sorted(Comparator.comparing(ProjectDetailResponse.SessionDetail::getStartTime).reversed())
            .collect(Collectors.toList());

        ProjectDetailResponse detail = new ProjectDetailResponse();
        detail.setProjectId(projectId);
        detail.setProjectName(projectId);
        detail.setProjectStart(projectStart);
        detail.setProjectEnd(projectEnd);
        detail.setTotalMinutes(totalMinutes);
        detail.setSessionCount(sessions.size());
        detail.setTotalEarnings(totalEarnings);
        detail.setHourlyRate(hourlyRate);
        detail.setWeeklySummaries(weeklySummaries);
        detail.setSessions(sessionDetails);

        return detail;
    }

    private Instant parseDate(String s) {
        if (s == null || s.isBlank()) return null;
        try {
            return LocalDate.parse(s.trim(), DATE_FMT).atStartOfDay(ZoneOffset.UTC).toInstant();
        } catch (Exception e) {
            return null;
        }
    }

    private ReportSummaryResponse buildSummary(String userId, String projectId, Instant from, Instant to, List<TrackingClient.SessionItem> sessions, Map<String, Double> projectRates, Double defaultRate) {
        ReportSummaryResponse r = new ReportSummaryResponse();
        r.setUserId(userId);
        r.setProjectId(projectId);
        r.setFrom(from.atOffset(ZoneOffset.UTC).format(DATE_FMT));
        r.setTo(to.atOffset(ZoneOffset.UTC).format(DATE_FMT));
        r.setTotalMinutes(sessions.stream().mapToInt(TrackingClient.SessionItem::getDurationMinutes).sum());
        r.setSessionCount(sessions.size());

        Map<String, List<TrackingClient.SessionItem>> byProject = sessions.stream().collect(Collectors.groupingBy(s -> s.getProjectId() != null ? s.getProjectId() : "unknown"));
        List<ReportSummaryResponse.ProjectSummary> list = new ArrayList<>();
        double totalEarnings = 0.0;

        for (Map.Entry<String, List<TrackingClient.SessionItem>> e : byProject.entrySet()) {
            int totalMinutes = e.getValue().stream().mapToInt(TrackingClient.SessionItem::getDurationMinutes).sum();
            double rate = projectRates.getOrDefault(e.getKey(), defaultRate != null ? defaultRate : 0.0);
            double earnings = (totalMinutes / 60.0) * rate;
            totalEarnings += earnings;
            list.add(new ReportSummaryResponse.ProjectSummary(e.getKey(), totalMinutes, e.getValue().size(), earnings));
        }

        r.setByProject(list);
        r.setTotalEarnings(totalEarnings);
        return r;
    }

    private List<ProjectDetailResponse.WeeklySummary> buildWeeklySummaries(List<TrackingClient.SessionItem> sessions, double hourlyRate) {
        Map<String, List<TrackingClient.SessionItem>> byWeek = sessions.stream()
            .collect(Collectors.groupingBy(s -> getWeekKey(s.getStartTime())));

        List<ProjectDetailResponse.WeeklySummary> summaries = new ArrayList<>();
        for (Map.Entry<String, List<TrackingClient.SessionItem>> entry : byWeek.entrySet()) {
            String weekKey = entry.getKey();
            List<TrackingClient.SessionItem> weekSessions = entry.getValue();

            long totalMinutes = weekSessions.stream().mapToInt(TrackingClient.SessionItem::getDurationMinutes).sum();
            double earnings = (totalMinutes / 60.0) * hourlyRate;

            String[] dates = weekKey.split("_");
            summaries.add(new ProjectDetailResponse.WeeklySummary(dates[0], dates[1], totalMinutes, weekSessions.size(), earnings));
        }

        return summaries.stream()
            .sorted(Comparator.comparing(ProjectDetailResponse.WeeklySummary::getWeekStart).reversed())
            .collect(Collectors.toList());
    }

    private String getWeekKey(Instant instant) {
        LocalDate date = instant.atZone(ZoneOffset.UTC).toLocalDate();
        LocalDate startOfWeek = date.with(DayOfWeek.MONDAY);
        LocalDate endOfWeek = date.with(DayOfWeek.SUNDAY);
        return startOfWeek.toString() + "_" + endOfWeek.toString();
    }
}
