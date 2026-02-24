package org.freelance.report;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * Report Service: aggregate data from Tracking API, cache in Redis, invalidate on new session.
 */
@SpringBootApplication
public class ReportServiceApplication {

    public static void main(String[] args) {
        SpringApplication.run(ReportServiceApplication.class, args);
    }
}
