package com.example.referralwallet.security;

import java.io.IOException;

import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtProvider jwtProvider;
    private final CustomUserDetailsService customUserDetailsService;

    @Override
    protected void doFilterInternal(
            @NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain
    ) throws ServletException, IOException {

        String path = request.getRequestURI();
        System.out.println("➡️ [DEBUG] Incoming request path: " + path);

        // ✅ Allow only login, registration, Swagger, and H2 console to bypass JWT
        if (path.equals("/api/auth/login") ||
            path.equals("/api/auth/init-register") ||
            path.equals("/api/auth/complete-register") ||
            path.equals("/api/otp/verify") ||
            path.startsWith("/swagger-ui") ||
            path.startsWith("/v3/api-docs") ||
            path.startsWith("/h2") ||
            path.startsWith("/api/admin/premium/approve") ||
            path.startsWith("/api/admin/premium/reject") ||
            path.startsWith("/api/admin/withdraw/approve") ||
            path.startsWith("/api/admin/withdraw/reject") ||
            path.startsWith("/api/password-reset")) {

            System.out.println("✅ [DEBUG] Public endpoint, skipping JWT check for: " + path);
            filterChain.doFilter(request, response);
            return;
        }

        // 🔒 Check Authorization Header
        String header = request.getHeader("Authorization");
        System.out.println("🔑 [DEBUG] Authorization header: " + header);

        if (header == null || !header.startsWith("Bearer ")) {
            System.out.println("⚠️ [DEBUG] No valid Authorization header found");
            response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Missing or invalid Authorization header");
            return;
        }

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
                response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Invalid or expired token");
                return;
            }
        } catch (Exception e) {
            System.out.println("⚠️ [DEBUG] Error validating token: " + e.getMessage());
            response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Token validation error: " + e.getMessage());
            return;
        }

        filterChain.doFilter(request, response);
    }
}
