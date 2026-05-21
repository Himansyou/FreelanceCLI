package org.freelance.auth.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;

/**
 * Sends verification emails via Resend's REST API (HTTPS only — no SMTP ports needed).
 */
@Service
public class ResendEmailService {

    private static final Logger log = LoggerFactory.getLogger(ResendEmailService.class);
    private static final String RESEND_API_URL = "https://api.resend.com/emails";

    private final HttpClient httpClient;
    private final String apiKey;
    private final String fromEmail;
    private final String verifyBaseUrl;

    public ResendEmailService(
            @Value("${resend.api-key}") String apiKey,
            @Value("${resend.from:noreply@freelance.com}") String fromEmail,
            @Value("${resend.verify-base-url:http://localhost:5173/verify}") String verifyBaseUrl
    ) {
        this.apiKey = apiKey;
        this.fromEmail = fromEmail;
        this.verifyBaseUrl = verifyBaseUrl;
        this.httpClient = HttpClient.newBuilder()
                .connectTimeout(Duration.ofSeconds(10))
                .build();
    }

    /**
     * Send a verification email with a click-to-verify link and a fallback OTP code.
     *
     * @param toEmail            recipient email
     * @param verificationToken  UUID token embedded in the verify link
     * @param otp                6-digit fallback code shown in the email body
     */
    public void sendVerificationEmail(String toEmail, String verificationToken, String otp) {
        String verifyLink = verifyBaseUrl + "?token=" + verificationToken;

        String htmlBody = """
            <div style="font-family:Arial,sans-serif;max-width:480px;margin:0 auto;padding:32px;background:#0a0a0a;border-radius:16px;border:1px solid #222;color:#e5e5e5">
              <h2 style="margin:0 0 8px;font-size:22px;font-weight:800;color:#fff">Verify your email</h2>
              <p style="margin:0 0 24px;font-size:14px;color:#999">Click the button below to complete your registration.</p>
              <a href="%s" style="display:inline-block;padding:14px 32px;background:#89faaa;color:#0a0a0a;font-weight:700;font-size:15px;border-radius:12px;text-decoration:none">Verify Email</a>
              <p style="margin:24px 0 0;font-size:13px;color:#777">Or enter this code manually:</p>
              <p style="margin:4px 0 0;font-size:28px;font-weight:700;letter-spacing:6px;color:#89faaa">%s</p>
              <p style="margin:24px 0 0;font-size:12px;color:#555">This link and code expire in 20 minutes. If you didn't request this, ignore this email.</p>
            </div>
            """.formatted(verifyLink, otp);

        String plainBody = "Verify your email by visiting: " + verifyLink
                + "\n\nOr enter this code manually: " + otp
                + "\n\nThis link and code expire in 20 minutes.";

        String payload = """
                {
                  "from": "%s",
                  "to": ["%s"],
                  "subject": "Verify your email — FreelanceCLI",
                  "html": %s,
                  "text": %s
                }
                """.formatted(
                fromEmail,
                toEmail,
                jsonEscape(htmlBody),
                jsonEscape(plainBody)
        );

        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(RESEND_API_URL))
                .header("Authorization", "Bearer " + apiKey)
                .header("Content-Type", "application/json")
                .timeout(Duration.ofSeconds(15))
                .POST(HttpRequest.BodyPublishers.ofString(payload))
                .build();

        try {
            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());
            if (response.statusCode() >= 400) {
                log.error("Resend API error {}: {}", response.statusCode(), response.body());
                throw new RuntimeException("Failed to send verification email (status " + response.statusCode() + ")");
            }
            log.info("Verification email sent to {} via Resend", toEmail);
        } catch (RuntimeException e) {
            throw e;
        } catch (Exception e) {
            log.error("Failed to call Resend API", e);
            throw new RuntimeException("Failed to send verification email", e);
        }
    }

    private static String jsonEscape(String value) {
        return "\"" + value
                .replace("\\", "\\\\")
                .replace("\"", "\\\"")
                .replace("\n", "\\n")
                .replace("\r", "\\r")
                .replace("\t", "\\t")
                + "\"";
    }
}
