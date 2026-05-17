package org.freelance.auth.service;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.time.Duration;
import java.util.concurrent.TimeUnit;

/**
 * Service for OTP generation, validation, and email delivery.
 */
@Service
public class OtpService {

    private static final int OTP_LENGTH = 6;
    private static final int OTP_EXPIRY_MINUTES = 20;
    private static final int RATE_LIMIT_REQUESTS = 4;
    private static final int RATE_LIMIT_WINDOW_SECONDS = 60;

    private final RedisTemplate<String, Object> redisTemplate;
    private final JavaMailSender mailSender;
    private final String fromEmail;

    public OtpService(
            RedisTemplate<String, Object> redisTemplate,
            JavaMailSender mailSender,
            @Value("${spring.mail.from:noreply@freelance.com}") String fromEmail
    ) {
        this.redisTemplate = redisTemplate;
        this.mailSender = mailSender;
        this.fromEmail = fromEmail;
    }

    /**
     * Generate and send OTP for registration initiation.
     * Enforces rate limiting of 4 requests per minute per email.
     *
     * @param email    User's email
     * @param username User's username
     * @param password User's password (hashed)
     * @return Generated OTP
     * @throws IllegalStateException if rate limit exceeded
     */
    public String generateAndSendOtp(String email, String username, String password) {
        String rateLimitKey = "otp_rate:" + email.toLowerCase();

        Long currentCount = redisTemplate.opsForValue().increment(rateLimitKey);
        if (currentCount == null) {
            currentCount = 1L;
            redisTemplate.expire(rateLimitKey, RATE_LIMIT_WINDOW_SECONDS, TimeUnit.SECONDS);
        } else if (currentCount > RATE_LIMIT_REQUESTS) {
            throw new IllegalStateException("Too many OTP requests. Please try again later.");
        }

        String otp = generateOtp();
        String otpKey = "otp:" + email.toLowerCase();

        OtpData otpData = new OtpData(otp, username, password);
        redisTemplate.opsForValue().set(otpKey, otpData, Duration.ofMinutes(OTP_EXPIRY_MINUTES));

        sendOtpEmail(email, otp);
        return otp;
    }

    /**
     * Validate OTP and retrieve registration data.
     *
     * @param email User's email
     * @param otp   OTP to validate
     * @return OtpData containing username and password if valid
     * @throws IllegalArgumentException if OTP is invalid or expired
     */
    public OtpData validateOtp(String email, String otp) {
        String otpKey = "otp:" + email.toLowerCase();
        OtpData otpData = (OtpData) redisTemplate.opsForValue().get(otpKey);

        if (otpData == null) {
            throw new IllegalArgumentException("OTP expired or not found");
        }

        if (!otpData.getOtp().equals(otp)) {
            throw new IllegalArgumentException("Invalid OTP");
        }

        redisTemplate.delete(otpKey);
        return otpData;
    }

    private String generateOtp() {
        SecureRandom random = new SecureRandom();
        StringBuilder otp = new StringBuilder();
        for (int i = 0; i < OTP_LENGTH; i++) {
            otp.append(random.nextInt(10));
        }
        return otp.toString();
    }

    private void sendOtpEmail(String toEmail, String otp) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(fromEmail);
        message.setTo(toEmail);
        message.setSubject("Your Freelance Verification Code");
        message.setText("Your verification code is: " + otp + "\n\n" +
                "This code will expire in 20 minutes.\n\n" +
                "If you did not request this code, please ignore this email.");
        mailSender.send(message);
    }

    /**
     * Data class to store OTP and registration details.
     */
    public static class OtpData {
        private final String otp;
        private final String username;
        private final String password;

        @JsonCreator
        public OtpData(@JsonProperty("otp") String otp,
                       @JsonProperty("username") String username,
                       @JsonProperty("password") String password) {
            this.otp = otp;
            this.username = username;
            this.password = password;
        }

        public String getOtp() { return otp; }
        public String getUsername() { return username; }
        public String getPassword() { return password; }
    }
}
