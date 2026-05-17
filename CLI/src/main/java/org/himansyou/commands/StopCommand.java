package org.himansyou.commands;

import org.himansyou.storage.LocalStorage;
import org.himansyou.storage.SqliteLocalStorage;
import picocli.CommandLine.Command;

import java.time.Instant;

/**
 * freelance stop
 * Stops the current running session.
 */
@Command(name = "stop", description = "Stop the current work session")
public class StopCommand implements Runnable {

    @Override
    public void run() {
        LocalStorage storage = new SqliteLocalStorage();
        storage.initSchema();
        boolean stopped = storage.stopCurrentSession(Instant.now());
        if (stopped) {
            System.out.println("Session stopped.");
        } else {
            System.err.println("No running session to stop.");
        }
    }
}
