package org.freelance.auth.service;

import org.freelance.auth.domain.User;
import org.freelance.auth.dto.LoginRequest;
import org.freelance.auth.dto.LoginResponse;
import org.freelance.auth.dto.RegisterInitiateRequest;
import org.freelance.auth.dto.RegisterRequest;
import org.freelance.auth.dto.RegisterVerifyRequest;
import org.freelance.auth.dto.UpdateDefaultRateRequest;
import org.freelance.auth.dto.UserResponse;
import org.freelance.auth.repository.UserRepository;
import org.freelance.auth.security.JwtService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

/**
 * Application service for registration and login. Single responsibility: auth use cases.
 */
@Service
public class AuthApplicationService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final OtpService otpService;

    public AuthApplicationService(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            JwtService jwtService,
            OtpService otpService
    ) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.otpService = otpService;
    }

    @Transactional
    public UserResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Email already registered");
        }
        User user = new User();
        user.setEmail(request.getEmail().trim().toLowerCase());
        user.setUsername(request.getUsername().trim());
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        user = userRepository.save(user);
        return new UserResponse(user.getId(), user.getEmail(), user.getUsername(), user.getCreatedAt(), user.getDefaultHourlyRate());
    }

    public void initiateRegistration(RegisterInitiateRequest request) {
        String email = request.getEmail().trim().toLowerCase();
        if (userRepository.existsByEmail(email)) {
            throw new IllegalArgumentException("Email already registered");
        }
        String passwordHash = passwordEncoder.encode(request.getPassword());
        otpService.generateAndSendOtp(email, request.getUsername().trim(), passwordHash);
    }

    @Transactional
    public LoginResponse verifyRegistration(RegisterVerifyRequest request) {
        OtpService.OtpData otpData;

        if (request.isTokenVerification()) {
            otpData = otpService.validateToken(request.getToken());
        } else if (request.isOtpVerification()) {
            String email = request.getEmail().trim().toLowerCase();
            otpData = otpService.validateOtp(email, request.getOtp());
        } else {
            throw new IllegalArgumentException("Provide either a verification token or email+OTP");
        }

        if (userRepository.existsByEmail(otpData.getEmail())) {
            throw new IllegalArgumentException("Email already registered");
        }

        User user = new User();
        user.setEmail(otpData.getEmail());
        user.setUsername(otpData.getUsername());
        user.setPasswordHash(otpData.getPassword());
        user = userRepository.save(user);

        String token = jwtService.createToken(user.getId());
        return new LoginResponse(token, jwtService.getExpirationSeconds(), user.getId());
    }

    public LoginResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail().trim().toLowerCase())
            .orElseThrow(() -> new IllegalArgumentException("Invalid credentials"));
        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            throw new IllegalArgumentException("Invalid credentials");
        }
        String token = jwtService.createToken(user.getId());
        return new LoginResponse(token, jwtService.getExpirationSeconds(), user.getId());
    }

    @Transactional(readOnly = true)
    public UserResponse getUserById(UUID userId) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new IllegalArgumentException("User not found"));
        return new UserResponse(user.getId(), user.getEmail(), user.getUsername(), user.getCreatedAt(), user.getDefaultHourlyRate());
    }

    @Transactional
    public UserResponse updateDefaultRate(UUID userId, UpdateDefaultRateRequest request) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new IllegalArgumentException("User not found"));
        user.setDefaultHourlyRate(request.getHourlyRate());
        user = userRepository.save(user);
        return new UserResponse(user.getId(), user.getEmail(), user.getUsername(), user.getCreatedAt(), user.getDefaultHourlyRate());
    }
}
