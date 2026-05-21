package org.freelance.auth;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.freelance.auth.dto.RegisterRequest;
import org.freelance.auth.service.ResendEmailService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Integration tests for Auth API (register, login). Uses in-memory H2 when no PostgreSQL config.
 */
@SpringBootTest
@AutoConfigureMockMvc
class AuthControllerTest {

    @Autowired
    private MockMvc mvc;

    @MockBean
    private ResendEmailService emailService;

    private final ObjectMapper mapper = new ObjectMapper();

    @Test
    void register_and_login_flow() throws Exception {
        String email = "test-" + System.currentTimeMillis() + "@example.com";
        String password = "password123";

        // Register
        RegisterRequest register = new RegisterRequest();
        register.setEmail(email);
        register.setUsername("testuser");
        register.setPassword(password);
        mvc.perform(post("/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(mapper.writeValueAsString(register)))
            .andExpect(status().isCreated())
            .andExpect(jsonPath("$.email").value(email))
            .andExpect(jsonPath("$.id").exists());

        // Login
        mvc.perform(post("/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"email\":\"" + email + "\",\"password\":\"" + password + "\"}"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.accessToken").exists())
            .andExpect(jsonPath("$.userId").exists());
    }

    @Test
    void login_invalid_credentials_returns_401() throws Exception {
        mvc.perform(post("/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"email\":\"nonexistent@example.com\",\"password\":\"wrong\"}"))
            .andExpect(status().isUnauthorized());
    }
}
