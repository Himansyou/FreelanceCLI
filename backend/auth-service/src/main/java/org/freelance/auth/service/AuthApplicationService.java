package org.freelance.auth.service;

import org.freelance.auth.domain.User;
import org.freelance.auth.dto.LoginRequest;
import org.freelance.auth.dto.LoginResponse;
import org.freelance.auth.dto.RegisterRequest;
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

    public AuthApplicationService(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            JwtService jwtService
    ) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    @Transactional
    public UserResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Email already registered");
        }
        User user = new User();
        user.setEmail(request.getEmail().trim().toLowerCase());
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        user = userRepository.save(user);
        return new UserResponse(user.getId(), user.getEmail(), user.getCreatedAt());
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
}
