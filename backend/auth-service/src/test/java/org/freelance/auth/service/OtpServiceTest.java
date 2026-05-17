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
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.SimpleMailMessage;

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
    private JavaMailSender mailSender;

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
        // Arrange
        when(valueOperations.increment(anyString())).thenReturn(1L);

        // Act
        String otp = otpService.generateAndSendOtp(TEST_EMAIL, TEST_USERNAME, TEST_PASSWORD_HASH);

        // Assert
        assertNotNull(otp);
        assertEquals(6, otp.length());
        assertTrue(otp.matches("\\d+")); // Should be all digits

        // Verify OTP was stored in Redis
        ArgumentCaptor<String> keyCaptor = ArgumentCaptor.forClass(String.class);
        ArgumentCaptor<OtpData> otpDataCaptor = ArgumentCaptor.forClass(OtpData.class);
        verify(valueOperations).set(
                keyCaptor.capture(),
                otpDataCaptor.capture(),
                eq(Duration.ofMinutes(20))
        );

        assertEquals("otp:" + TEST_EMAIL.toLowerCase(), keyCaptor.getValue());
        OtpData storedData = otpDataCaptor.getValue();
        assertEquals(otp, storedData.getOtp());
        assertEquals(TEST_USERNAME, storedData.getUsername());
        assertEquals(TEST_PASSWORD_HASH, storedData.getPassword());

        // Verify email was sent
        ArgumentCaptor<SimpleMailMessage> messageCaptor = ArgumentCaptor.forClass(SimpleMailMessage.class);
        verify(mailSender).send(messageCaptor.capture());
        assertEquals(TEST_EMAIL, messageCaptor.getValue().getTo()[0]);
        assertEquals("Your Freelance Verification Code", messageCaptor.getValue().getSubject());
        assertTrue(messageCaptor.getValue().getText().contains(otp));
    }

    @Test
    void testGenerateAndSendOtp_RateLimitExceeded() {
        // Arrange
        when(valueOperations.increment(anyString())).thenReturn(5L); // Exceeds limit of 4

        // Act & Assert
        IllegalStateException exception = assertThrows(IllegalStateException.class,
                () -> otpService.generateAndSendOtp(TEST_EMAIL, TEST_USERNAME, TEST_PASSWORD_HASH));
        assertEquals("Too many OTP requests. Please try again later.", exception.getMessage());

        // Verify no OTP was stored or email sent
        verify(valueOperations, never()).set(anyString(), any(OtpData.class), any(Duration.class));
        verify(mailSender, never()).send(any(SimpleMailMessage.class));
    }

    @Test
    void testValidateOtp_Success() {
        // Arrange
        String otp = "123456";
        OtpData testData = new OtpData(otp, TEST_USERNAME, TEST_PASSWORD_HASH);
        when(valueOperations.get("otp:" + TEST_EMAIL.toLowerCase())).thenReturn(testData);

        // Act
        OtpData result = otpService.validateOtp(TEST_EMAIL, otp);

        // Assert
        assertNotNull(result);
        assertEquals(otp, result.getOtp());
        assertEquals(TEST_USERNAME, result.getUsername());
        assertEquals(TEST_PASSWORD_HASH, result.getPassword());

        // Verify OTP was deleted from Redis after successful validation
        verify(valueOperations).get("otp:" + TEST_EMAIL.toLowerCase());
        verify(redisTemplate).delete("otp:" + TEST_EMAIL.toLowerCase());
    }

    @Test
    void testValidateOtp_Expired() {
        // Arrange
        when(valueOperations.get("otp:" + TEST_EMAIL.toLowerCase())).thenReturn(null);

        // Act & Assert
        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class,
                () -> otpService.validateOtp(TEST_EMAIL, "123456"));
        assertEquals("OTP expired or not found", exception.getMessage());

        // Verify delete was not called
        verify(redisTemplate, never()).delete(anyString());
    }

    @Test
    void testValidateOtp_InvalidOtp() {
        // Arrange
        String correctOtp = "123456";
        OtpData testData = new OtpData(correctOtp, TEST_USERNAME, TEST_PASSWORD_HASH);
        when(valueOperations.get("otp:" + TEST_EMAIL.toLowerCase())).thenReturn(testData);

        // Act & Assert
        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class,
                () -> otpService.validateOtp(TEST_EMAIL, "654321")); // Wrong OTP
        assertEquals("Invalid OTP", exception.getMessage());

        // Verify OTP was NOT deleted (since validation failed)
        verify(valueOperations).get("otp:" + TEST_EMAIL.toLowerCase());
        verify(redisTemplate, never()).delete(anyString());
    }

    @Test
    void testGenerateOtp_IsUsedInGenerateAndSendOtp() {
        // We test this indirectly by verifying the generated OTP is 6 digits
        // Arrange
        when(valueOperations.increment(anyString())).thenReturn(1L);

        // Act
        String otp = otpService.generateAndSendOtp(TEST_EMAIL, TEST_USERNAME, TEST_PASSWORD_HASH);

        // Assert
        assertNotNull(otp);
        assertEquals(6, otp.length());
        assertTrue(otp.matches("\\d{6}")); // Should be all digits
    }

    @Test
    void testSendOtpEmail_IsUsedInGenerateAndSendOtp() {
        // We test this indirectly by verifying email is sent
        // Arrange
        when(valueOperations.increment(anyString())).thenReturn(1L);

        // Act
        otpService.generateAndSendOtp(TEST_EMAIL, TEST_USERNAME, TEST_PASSWORD_HASH);

        // Assert
        verify(mailSender).send(any(SimpleMailMessage.class));
        ArgumentCaptor<SimpleMailMessage> messageCaptor = ArgumentCaptor.forClass(SimpleMailMessage.class);
        verify(mailSender).send(messageCaptor.capture());

        SimpleMailMessage message = messageCaptor.getValue();
        assertEquals(TEST_EMAIL, message.getTo()[0]);
        assertEquals("Your Freelance Verification Code", message.getSubject());
        assertTrue(message.getText().contains("verification code is:"));
    }
}