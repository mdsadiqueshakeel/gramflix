package com.example.referralwallet.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@RequiredArgsConstructor
@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {
    // This filter automatically processes JWT tokens for authenticated requests

    private final JwtProvider jwtProvider;
    private final CustomUserDetailsService customUserDetailsService;

    @Override
    protected void doFilterInternal(@NonNull HttpServletRequest request,
                                    @NonNull HttpServletResponse response,
                                    @NonNull FilterChain filterChain) throws ServletException, IOException {

        String path = request.getRequestURI();
        System.out.println("➡️ [DEBUG] Incoming request path: " + path);

        // Explicitly skip login endpoint and other public endpoints
        if (path.equals("/api/auth/login") || path.startsWith("/api/auth") || path.startsWith("/api/otp") ||
            path.startsWith("/h2") || path.startsWith("/swagger-ui") || path.startsWith("/v3/api-docs")) {
            System.out.println("✅ [DEBUG] Public endpoint, skipping JWT check for: " + path);
            filterChain.doFilter(request, response);
            return;
        }

        String header = request.getHeader("Authorization");
        System.out.println("🔑 [DEBUG] Authorization header: " + header);

        if (header != null && header.startsWith("Bearer ")) {
            String token = header.substring(7);
            System.out.println("🧾 [DEBUG] JWT Token found: " + token);

            try {
                if (jwtProvider.validateToken(token)) {
                    String userId = jwtProvider.getUserIdFromToken(token);
                    System.out.println("✔️ [DEBUG] JWT valid, userId: " + userId);

                    UserDetails userDetails = customUserDetailsService.loadUserById(userId);
                    UsernamePasswordAuthenticationToken authToken =
                            new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());

                    SecurityContextHolder.getContext().setAuthentication(authToken);
                    System.out.println("🔓 [DEBUG] Authentication set in SecurityContext");
                } else {
                    System.out.println("❌ [DEBUG] Invalid JWT token");
                }
            } catch (Exception e) {
                System.out.println("⚠️ [DEBUG] Error validating token: " + e.getMessage());
                response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Token validation error: " + e.getMessage());
                return;
            }
        } else {
            System.out.println("⚠️ [DEBUG] No JWT header found");
        }

        filterChain.doFilter(request, response);
    }
}