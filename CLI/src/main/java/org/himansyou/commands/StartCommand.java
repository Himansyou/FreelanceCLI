package org.himansyou.commands;

import org.himansyou.storage.LocalStorage;
import org.himansyou.storage.SqliteLocalStorage;
import picocli.CommandLine.Command;
import picocli.CommandLine.Parameters;

import java.time.Instant;

/**
 * freelance start <project>
 * Starts a new session. Only one session can be running at a time.
 */
@Command(name = "start", description = "Start a work session for the given project")
public class StartCommand implements Runnable {

    @Parameters(index = "0", description = "Project name")
    String project;

    @Override
    public void run() {
        LocalStorage storage = new SqliteLocalStorage();
        storage.initSchema();
        if (storage.getCurrentRunningSession().isPresent()) {
            System.err.println("A session is already running. Run 'freelance stop' first.");
            return;
        }
        String id = storage.insertSession(project, Instant.now());
        System.out.println("Started session for project: " + project + " (id: " + id + ")");
    }
}
