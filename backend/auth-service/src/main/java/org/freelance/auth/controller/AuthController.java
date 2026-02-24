package org.freelance.auth.controller;

import jakarta.validation.Valid;
import org.freelance.auth.dto.LoginRequest;
import org.freelance.auth.dto.LoginResponse;
import org.freelance.auth.dto.RegisterRequest;
import org.freelance.auth.dto.UserResponse;
import org.freelance.auth.service.AuthApplicationService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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
}
