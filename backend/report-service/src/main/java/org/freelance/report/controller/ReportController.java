package org.freelance.report.controller;

import org.freelance.report.dto.ReportSummaryResponse;
import org.freelance.report.service.ReportService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpServletRequest;

/**
 * GET /reports/summary (cached). Optional invalidation endpoint for internal use.
 */
@RestController
@RequestMapping("/reports")
public class ReportController {

    private final ReportService reportService;

    public ReportController(ReportService reportService) {
        this.reportService = reportService;
    }

    @GetMapping("/summary")
    public ResponseEntity<ReportSummaryResponse> summary(
            @RequestParam(required = false) String projectId,
            @RequestParam(required = false) String from,
            @RequestParam(required = false) String to,
            Authentication authentication,
            HttpServletRequest request
    ) {
        String userId = authentication.getName();
        String bearer = request.getHeader("Authorization");
        if (bearer != null && bearer.startsWith("Bearer ")) {
            bearer = bearer.substring(7);
        } else {
            bearer = "";
        }
        ReportSummaryResponse report = reportService.getSummary(userId, bearer, projectId, from, to);
        return ResponseEntity.ok(report);
    }

    /**
     * Invalidate cache for current user (e.g. after sync). Optional; can be called by Tracking via internal network.
     */
    @PostMapping("/cache/invalidate")
    public ResponseEntity<Void> invalidateCache(Authentication authentication) {
        reportService.invalidateCacheForUser(authentication.getName());
        return ResponseEntity.noContent().build();
    }
}
