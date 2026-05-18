package org.freelance.tracking.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.env.Environment;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.reactive.CorsWebFilter;
import org.springframework.web.cors.reactive.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.List;

/**
 * CORS for actuator endpoints. Configurable via FRONTEND_ALLOWED_ORIGINS environment variable.
 */
@Configuration
public class CorsConfig {

    @Value("${FRONTEND_ALLOWED_ORIGINS:}")
    private String frontendAllowedOrigins;

    @Bean
    public CorsWebFilter corsWebFilter() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowCredentials(true);

        // Parse comma-separated origins from environment variable
        List<String> allowedOrigins = Arrays.stream(frontendAllowedOrigins.split(","))
                .map(String::trim)
                .filter(origin -> !origin.isEmpty())
                .toList();

        // Fallback to localhost for development if not configured
        if (allowedOrigins.isEmpty()) {
            allowedOrigins = List.of("http://localhost:3000", "http://127.0.0.1:3000");
        }

        config.setAllowedOrigins(allowedOrigins);
        config.setAllowedHeaders(List.of("*"));
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/actuator/**", config);
        return new CorsWebFilter(source);
    }
}