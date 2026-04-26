package org.freelance.auth.controller;

import jakarta.validation.Valid;
import org.freelance.auth.dto.LoginRequest;
import org.freelance.auth.dto.LoginResponse;
import org.freelance.auth.dto.RegisterRequest;
import org.freelance.auth.dto.UpdateDefaultRateRequest;
import org.freelance.auth.dto.UserResponse;
import org.freelance.auth.service.AuthApplicationService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

/**
 * REST controller for /auth/register and /auth/login.
 */
@RestController
@RequestMapping("/auth")
public class AuthController {

    private final AuthApplicationService authService;

    public AuthController(AuthApplicationService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public ResponseEntity<UserResponse> register(@Valid @RequestBody RegisterRequest request) {
        UserResponse user = authService.register(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(user);
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginRequest request) {
        LoginResponse response = authService.login(request);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/me")
    public ResponseEntity<UserResponse> me(Authentication authentication) {
        if (authentication == null || authentication.getName() == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        UUID userId = UUID.fromString(authentication.getName());
        UserResponse response = authService.getUserById(userId);
        return ResponseEntity.ok(response);
    }

    @PatchMapping("/me/default-rate")
    public ResponseEntity<UserResponse> updateDefaultRate(
            @Valid @RequestBody UpdateDefaultRateRequest request,
            Authentication authentication) {
        if (authentication == null || authentication.getName() == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        UUID userId = UUID.fromString(authentication.getName());
        UserResponse response = authService.updateDefaultRate(userId, request);
        return ResponseEntity.ok(response);
    }
}
