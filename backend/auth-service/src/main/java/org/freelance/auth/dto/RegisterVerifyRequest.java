package org.freelance.auth.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

/**
 * Request body for verifying registration with OTP or token.
 * Supports both: click-to-verify link (token) and manual OTP code (email+otp).
 */
public class RegisterVerifyRequest {

    @Email
    private String email;

    @Size(min = 6, max = 6, message = "OTP must be 6 digits")
    @Pattern(regexp = "\\d{6}", message = "OTP must be 6 digits")
    private String otp;

    private String token;

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getOtp() { return otp; }
    public void setOtp(String otp) { this.otp = otp; }
    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }

    public boolean isTokenVerification() {
        return token != null && !token.isBlank();
    }

    public boolean isOtpVerification() {
        return email != null && !email.isBlank() && otp != null && !otp.isBlank();
    }
}
