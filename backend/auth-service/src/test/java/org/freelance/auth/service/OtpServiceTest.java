package org.freelance.auth.service;

import org.freelance.auth.service.OtpService.OtpData;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.ValueOperations;

import java.time.Duration;
import java.util.concurrent.TimeUnit;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class OtpServiceTest {

    @Mock
    private RedisTemplate<String, Object> redisTemplate;

    @Mock
    private ValueOperations<String, Object> valueOperations;

    @Mock
    private ResendEmailService emailService;

    @InjectMocks
    private OtpService otpService;

    private static final String TEST_EMAIL = "test@example.com";
    private static final String TEST_USERNAME = "testuser";
    private static final String TEST_PASSWORD_HASH = "$2a$10$hashedpassword";

    @BeforeEach
    void setUp() {
        when(redisTemplate.opsForValue()).thenReturn(valueOperations);
    }

    @Test
    void testGenerateAndSendOtp_Success() {
        when(valueOperations.increment(anyString())).thenReturn(1L);

        String token = otpService.generateAndSendOtp(TEST_EMAIL, TEST_USERNAME, TEST_PASSWORD_HASH);

        assertNotNull(token);
        assertTrue(token.matches("[0-9a-f-]{36}")); // UUID format

        // Verify OTP data was stored in Redis under both keys
        ArgumentCaptor<OtpData> otpDataCaptor = ArgumentCaptor.forClass(OtpData.class);
        verify(valueOperations, times(2)).set(
                anyString(),
                otpDataCaptor.capture(),
                eq(Duration.ofMinutes(20))
        );

        OtpData storedData = otpDataCaptor.getAllValues().get(0);
        assertNotNull(storedData.getOtp());
        assertEquals(6, storedData.getOtp().length());
        assertEquals(TEST_USERNAME, storedData.getUsername());
        assertEquals(TEST_PASSWORD_HASH, storedData.getPassword());
        assertNotNull(storedData.getToken());
        assertEquals(TEST_EMAIL.toLowerCase(), storedData.getEmail());

        // Verify email was sent via Resend
        verify(emailService).sendVerificationEmail(eq(TEST_EMAIL), eq(token), anyString());
    }

    @Test
    void testGenerateAndSendOtp_RateLimitExceeded() {
        when(valueOperations.increment(anyString())).thenReturn(5L);

        IllegalStateException exception = assertThrows(IllegalStateException.class,
                () -> otpService.generateAndSendOtp(TEST_EMAIL, TEST_USERNAME, TEST_PASSWORD_HASH));
        assertEquals("Too many OTP requests. Please try again later.", exception.getMessage());

        verify(valueOperations, never()).set(anyString(), any(OtpData.class), any(Duration.class));
        verify(emailService, never()).sendVerificationEmail(anyString(), anyString(), anyString());
    }

    @Test
    void testValidateToken_Success() {
        String token = "abc-123-def";
        OtpData testData = new OtpData("123456", token, TEST_EMAIL.toLowerCase(), TEST_USERNAME, TEST_PASSWORD_HASH);
        when(valueOperations.get("verify:token:" + token)).thenReturn(testData);

        OtpData result = otpService.validateToken(token);

        assertNotNull(result);
        assertEquals(token, result.getToken());
        assertEquals(TEST_USERNAME, result.getUsername());
        assertEquals(TEST_PASSWORD_HASH, result.getPassword());

        verify(redisTemplate).delete("verify:token:" + token);
        verify(redisTemplate).delete("verify:email:" + TEST_EMAIL.toLowerCase());
    }

    @Test
    void testValidateToken_Expired() {
        when(valueOperations.get("verify:token:invalid-token")).thenReturn(null);

        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class,
                () -> otpService.validateToken("invalid-token"));
        assertEquals("Verification link expired or invalid", exception.getMessage());

        verify(redisTemplate, never()).delete(anyString());
    }

    @Test
    void testValidateOtp_Success() {
        String otp = "123456";
        OtpData testData = new OtpData(otp, "some-token", TEST_EMAIL.toLowerCase(), TEST_USERNAME, TEST_PASSWORD_HASH);
        when(valueOperations.get("verify:email:" + TEST_EMAIL.toLowerCase())).thenReturn(testData);

        OtpData result = otpService.validateOtp(TEST_EMAIL, otp);

        assertNotNull(result);
        assertEquals(otp, result.getOtp());
        assertEquals(TEST_USERNAME, result.getUsername());

        verify(redisTemplate).delete("verify:email:" + TEST_EMAIL.toLowerCase());
        verify(redisTemplate).delete("verify:token:some-token");
    }

    @Test
    void testValidateOtp_Expired() {
        when(valueOperations.get("verify:email:" + TEST_EMAIL.toLowerCase())).thenReturn(null);

        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class,
                () -> otpService.validateOtp(TEST_EMAIL, "123456"));
        assertEquals("OTP expired or not found", exception.getMessage());

        verify(redisTemplate, never()).delete(anyString());
    }

    @Test
    void testValidateOtp_InvalidOtp() {
        OtpData testData = new OtpData("123456", "token", TEST_EMAIL.toLowerCase(), TEST_USERNAME, TEST_PASSWORD_HASH);
        when(valueOperations.get("verify:email:" + TEST_EMAIL.toLowerCase())).thenReturn(testData);

        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class,
                () -> otpService.validateOtp(TEST_EMAIL, "654321"));
        assertEquals("Invalid OTP", exception.getMessage());

        verify(redisTemplate, never()).delete(anyString());
    }
}
