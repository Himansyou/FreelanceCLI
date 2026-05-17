package org.freelance.report.dto;

import java.time.Instant;
import java.util.List;

/**
 * Detailed project data for HTML export: project overview, weekly summaries, and session details.
 */
public class ProjectDetailResponse {

    private String projectId;
    private String projectName;
    private Instant projectStart;
    private Instant projectEnd;
    private long totalMinutes;
    private int sessionCount;
    private double totalEarnings;
    private double hourlyRate;
    private List<WeeklySummary> weeklySummaries;
    private List<SessionDetail> sessions;

    public String getProjectId() { return projectId; }
    public void setProjectId(String projectId) { this.projectId = projectId; }
    public String getProjectName() { return projectName; }
    public void setProjectName(String projectName) { this.projectName = projectName; }
    public Instant getProjectStart() { return projectStart; }
    public void setProjectStart(Instant projectStart) { this.projectStart = projectStart; }
    public Instant getProjectEnd() { return projectEnd; }
    public void setProjectEnd(Instant projectEnd) { this.projectEnd = projectEnd; }
    public long getTotalMinutes() { return totalMinutes; }
    public void setTotalMinutes(long totalMinutes) { this.totalMinutes = totalMinutes; }
    public int getSessionCount() { return sessionCount; }
    public void setSessionCount(int sessionCount) { this.sessionCount = sessionCount; }
    public double getTotalEarnings() { return totalEarnings; }
    public void setTotalEarnings(double totalEarnings) { this.totalEarnings = totalEarnings; }
    public double getHourlyRate() { return hourlyRate; }
    public void setHourlyRate(double hourlyRate) { this.hourlyRate = hourlyRate; }
    public List<WeeklySummary> getWeeklySummaries() { return weeklySummaries; }
    public void setWeeklySummaries(List<WeeklySummary> weeklySummaries) { this.weeklySummaries = weeklySummaries; }
    public List<SessionDetail> getSessions() { return sessions; }
    public void setSessions(List<SessionDetail> sessions) { this.sessions = sessions; }

    public static class WeeklySummary {
        private String weekStart;
        private String weekEnd;
        private long totalMinutes;
        private int sessionCount;
        private double earnings;

        public WeeklySummary() {}
        public WeeklySummary(String weekStart, String weekEnd, long totalMinutes, int sessionCount, double earnings) {
            this.weekStart = weekStart;
            this.weekEnd = weekEnd;
            this.totalMinutes = totalMinutes;
            this.sessionCount = sessionCount;
            this.earnings = earnings;
        }
        public String getWeekStart() { return weekStart; }
        public void setWeekStart(String weekStart) { this.weekStart = weekStart; }
        public String getWeekEnd() { return weekEnd; }
        public void setWeekEnd(String weekEnd) { this.weekEnd = weekEnd; }
        public long getTotalMinutes() { return totalMinutes; }
        public void setTotalMinutes(long totalMinutes) { this.totalMinutes = totalMinutes; }
        public int getSessionCount() { return sessionCount; }
        public void setSessionCount(int sessionCount) { this.sessionCount = sessionCount; }
        public double getEarnings() { return earnings; }
        public void setEarnings(double earnings) { this.earnings = earnings; }
    }

    public static class SessionDetail {
        private String sessionId;
        private Instant startTime;
        private Instant endTime;
        private int durationMinutes;
        private double earnings;
        private String deviceId;

        public SessionDetail() {}
        public SessionDetail(String sessionId, Instant startTime, Instant endTime, int durationMinutes, double earnings, String deviceId) {
            this.sessionId = sessionId;
            this.startTime = startTime;
            this.endTime = endTime;
            this.durationMinutes = durationMinutes;
            this.earnings = earnings;
            this.deviceId = deviceId;
        }
        public String getSessionId() { return sessionId; }
        public void setSessionId(String sessionId) { this.sessionId = sessionId; }
        public Instant getStartTime() { return startTime; }
        public void setStartTime(Instant startTime) { this.startTime = startTime; }
        public Instant getEndTime() { return endTime; }
        public void setEndTime(Instant endTime) { this.endTime = endTime; }
        public int getDurationMinutes() { return durationMinutes; }
        public void setDurationMinutes(int durationMinutes) { this.durationMinutes = durationMinutes; }
        public double getEarnings() { return earnings; }
        public void setEarnings(double earnings) { this.earnings = earnings; }
        public String getDeviceId() { return deviceId; }
        public void setDeviceId(String deviceId) { this.deviceId = deviceId; }
    }
}