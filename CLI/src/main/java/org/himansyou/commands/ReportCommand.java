package org.himansyou.commands;

import org.himansyou.storage.LocalStorage;
import org.himansyou.storage.SqliteLocalStorage;
import org.himansyou.storage.LocalStorage.SessionRow;
import picocli.CommandLine.Command;
import picocli.CommandLine.Option;
import picocli.CommandLine.Parameters;

import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneOffset;
import java.time.format.DateTimeFormatter;
import java.util.List;

/**
 * freelance report [project] [--from date] [--to date]
 * Shows local session report (from SQLite). Date format: yyyy-MM-dd.
 */
@Command(name = "report", description = "Show session report (local data)")
public class ReportCommand implements Runnable {

    @Parameters(index = "0", arity = "0..1", description = "Filter by project name")
    String project;

    @Option(names = {"--from"}, description = "From date (yyyy-MM-dd)")
    String fromStr;

    @Option(names = {"--to"}, description = "To date (yyyy-MM-dd)")
    String toStr;

    private static final DateTimeFormatter FMT = DateTimeFormatter.ISO_LOCAL_DATE;

    @Override
    public void run() {
        LocalStorage storage = new SqliteLocalStorage();
        storage.initSchema();
        Instant from = fromStr != null && !fromStr.isBlank() ? LocalDate.parse(fromStr.trim(), FMT).atStartOfDay(ZoneOffset.UTC).toInstant() : null;
        Instant to = toStr != null && !toStr.isBlank() ? LocalDate.parse(toStr.trim(), FMT).atTime(23, 59, 59).atZone(ZoneOffset.UTC).toInstant() : null;
        List<SessionRow> sessions = storage.listSessionsForReport(project, from, to);
        if (sessions.isEmpty()) {
            System.out.println("No sessions found.");
            return;
        }
        int totalMinutes = sessions.stream().mapToInt(SessionRow::durationMinutes).sum();
        System.out.println("--- Report " + (project != null ? "project: " + project : "all") + " ---");
        System.out.println("Sessions: " + sessions.size() + " | Total: " + totalMinutes + " min (" + (totalMinutes / 60) + "h " + (totalMinutes % 60) + "m)");
        System.out.println();
        for (SessionRow s : sessions) {
            String synced = s.synced() ? "synced" : "pending";
            System.out.println("  " + s.startTime() + " - " + s.project() + " | " + s.durationMinutes() + " min | " + synced);
        }
    }
}
