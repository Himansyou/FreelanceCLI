package org.freelance.tracking;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * Tracking Service: accept synced sessions (idempotent), store in PostgreSQL, list by user/date/project.
 */
@SpringBootApplication
public class TrackingServiceApplication {

    public static void main(String[] args) {
        SpringApplication.run(TrackingServiceApplication.class, args);
    }
}
