package org.freelance.report.dto;

import java.time.Instant;
import java.util.List;

/**
 * Summary report: total minutes, session count, breakdown by project.
 */
public class ReportSummaryResponse {

    private String userId;
    private String projectId;  // "all" or specific
    private String from;
    private String to;
    private long totalMinutes;
    private int sessionCount;
    private List<ProjectSummary> byProject;

    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }
    public String getProjectId() { return projectId; }
    public void setProjectId(String projectId) { this.projectId = projectId; }
    public String getFrom() { return from; }
    public void setFrom(String from) { this.from = from; }
    public String getTo() { return to; }
    public void setTo(String to) { this.to = to; }
    public long getTotalMinutes() { return totalMinutes; }
    public void setTotalMinutes(long totalMinutes) { this.totalMinutes = totalMinutes; }
    public int getSessionCount() { return sessionCount; }
    public void setSessionCount(int sessionCount) { this.sessionCount = sessionCount; }
    public List<ProjectSummary> getByProject() { return byProject; }
    public void setByProject(List<ProjectSummary> byProject) { this.byProject = byProject; }

    public static class ProjectSummary {
        private String projectId;
        private long totalMinutes;
        private int sessionCount;

        public ProjectSummary() {}
        public ProjectSummary(String projectId, long totalMinutes, int sessionCount) {
            this.projectId = projectId;
            this.totalMinutes = totalMinutes;
            this.sessionCount = sessionCount;
        }
        public String getProjectId() { return projectId; }
        public void setProjectId(String projectId) { this.projectId = projectId; }
        public long getTotalMinutes() { return totalMinutes; }
        public void setTotalMinutes(long totalMinutes) { this.totalMinutes = totalMinutes; }
        public int getSessionCount() { return sessionCount; }
        public void setSessionCount(int sessionCount) { this.sessionCount = sessionCount; }
    }
}
