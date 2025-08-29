package com.example.referralwallet.config;

import java.util.logging.Logger;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import com.example.referralwallet.dto.ApiResponse;
import com.example.referralwallet.security.JwtAuthenticationFilter;
import com.example.referralwallet.config.CorsConfig;
import com.fasterxml.jackson.databind.ObjectMapper;

import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;

@Configuration
@RequiredArgsConstructor
@EnableMethodSecurity
public class SecurityConfig {

    private static final Logger logger = Logger.getLogger(SecurityConfig.class.getName());

    private final JwtAuthenticationFilter jwtAuthenticationFilter;
    private final CorsConfig corsConfig;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .cors(cors -> cors.configurationSource(corsConfig.corsConfigurationSource()))
                .csrf(csrf -> csrf.disable())
                .headers(headers -> headers.frameOptions(frame -> frame.disable()))
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/api/admin/premium/approve/", "/api/admin/withdraw/approve/",
                                "/api/admin/premium/reject/", "/api/admin/withdraw/reject/")
                        .permitAll() // Permit admin approval/rejection without authentication
                        .requestMatchers(HttpMethod.OPTIONS, "/api/**").permitAll()
                        .requestMatchers(
                                "/api/auth/login", // Allow login
                                "/api/auth/init-register", // Allow registration
                                "/api/otp/verify", // Allow OTP verification
                                "/api/auth/complete-register",
                                "/swagger-ui/", // Swagger
                                "/v3/api-docs/",
                                "/h2/", // H2 Console (if needed)
                                "/error", // Permit error page
                                "/api/password-reset/" // Allow password reset
                        ).permitAll()
                        .anyRequest().authenticated() // EVERYTHING else needs JWT
                )
                .exceptionHandling(exception -> exception
                        .authenticationEntryPoint((request, response, authException) -> {
                            logger.warning("Unauthorized access attempt to " + request.getRequestURI() + ": "
                                    + authException.getMessage());
                            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                            response.setContentType(MediaType.APPLICATION_JSON_VALUE);
                            ObjectMapper mapper = new ObjectMapper();
                            mapper.writeValue(response.getOutputStream(),
                                    new ApiResponse(false, "Unauthorized: Invalid or expired token", null));
                        }))
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    // CORS configuration is handled by CorsConfig.java
    // This ensures consistent CORS settings across the application

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authConfig) throws Exception {
        return authConfig.getAuthenticationManager();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}