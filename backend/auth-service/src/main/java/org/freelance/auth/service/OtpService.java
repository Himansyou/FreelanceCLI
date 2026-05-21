package org.freelance.auth.service;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.time.Duration;
import java.util.UUID;
import java.util.concurrent.TimeUnit;

/**
 * Service for OTP/token generation, validation, and email delivery.
 * Uses Resend API (HTTPS) instead of SMTP.
 */
@Service
public class OtpService {

    private static final int OTP_LENGTH = 6;
    private static final int OTP_EXPIRY_MINUTES = 20;
    private static final int RATE_LIMIT_REQUESTS = 4;
    private static final int RATE_LIMIT_WINDOW_SECONDS = 60;

    private final RedisTemplate<String, Object> redisTemplate;
    private final ResendEmailService emailService;

    public OtpService(
            RedisTemplate<String, Object> redisTemplate,
            ResendEmailService emailService
    ) {
        this.redisTemplate = redisTemplate;
        this.emailService = emailService;
    }

    /**
     * Generate and send verification email for registration.
     * Creates both a UUID token (for click-to-verify link) and a 6-digit OTP (fallback).
     *
     * @param email    User's email
     * @param username User's username
     * @param password User's password (hashed)
     * @return Generated verification token
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
        String token = UUID.randomUUID().toString();
        String emailLower = email.toLowerCase();

        // Store under token key (primary lookup from email link)
        String tokenKey = "verify:token:" + token;
        OtpData otpData = new OtpData(otp, token, emailLower, username, password);
        redisTemplate.opsForValue().set(tokenKey, otpData, Duration.ofMinutes(OTP_EXPIRY_MINUTES));

        // Also store under email key (fallback OTP lookup)
        String emailKey = "verify:email:" + emailLower;
        redisTemplate.opsForValue().set(emailKey, otpData, Duration.ofMinutes(OTP_EXPIRY_MINUTES));

        emailService.sendVerificationEmail(email, token, otp);
        return token;
    }

    /**
     * Validate verification token (from click-to-verify link).
     *
     * @param token UUID token from the email link
     * @return OtpData containing username and password if valid
     * @throws IllegalArgumentException if token is invalid or expired
     */
    public OtpData validateToken(String token) {
        String tokenKey = "verify:token:" + token;
        OtpData otpData = (OtpData) redisTemplate.opsForValue().get(tokenKey);

        if (otpData == null) {
            throw new IllegalArgumentException("Verification link expired or invalid");
        }

        // Clean up both Redis keys
        redisTemplate.delete(tokenKey);
        redisTemplate.delete("verify:email:" + otpData.getEmail());
        return otpData;
    }

    /**
     * Validate OTP code (manual fallback).
     *
     * @param email User's email
     * @param otp   6-digit OTP code
     * @return OtpData containing username and password if valid
     * @throws IllegalArgumentException if OTP is invalid or expired
     */
    public OtpData validateOtp(String email, String otp) {
        String emailKey = "verify:email:" + email.toLowerCase();
        OtpData otpData = (OtpData) redisTemplate.opsForValue().get(emailKey);

        if (otpData == null) {
            throw new IllegalArgumentException("OTP expired or not found");
        }

        if (!otpData.getOtp().equals(otp)) {
            throw new IllegalArgumentException("Invalid OTP");
        }

        // Clean up both Redis keys
        redisTemplate.delete(emailKey);
        redisTemplate.delete("verify:token:" + otpData.getToken());
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

    /**
     * Data class to store verification and registration details.
     */
    public static class OtpData {
        private final String otp;
        private final String token;
        private final String email;
        private final String username;
        private final String password;

        @JsonCreator
        public OtpData(
                @JsonProperty("otp") String otp,
                @JsonProperty("token") String token,
                @JsonProperty("email") String email,
                @JsonProperty("username") String username,
                @JsonProperty("password") String password
        ) {
            this.otp = otp;
            this.token = token;
            this.email = email;
            this.username = username;
            this.password = password;
        }

        public String getOtp() { return otp; }
        public String getToken() { return token; }
        public String getEmail() { return email; }
        public String getUsername() { return username; }
        public String getPassword() { return password; }
    }
}
