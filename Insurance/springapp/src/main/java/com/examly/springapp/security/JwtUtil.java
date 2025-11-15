package com.examly.springapp.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.stereotype.Component;

import java.util.Date;

@Component
public class JwtUtil {

  private final String SECRET_KEY = "my_super_secret_key_which_is_long_enough_1234567890"; // 🔑 change to strong key in production
  private final long EXPIRATION_MS = 86400000; // 1 day

  // Generate token
  public String generateToken(String username) {
    return Jwts.builder()
        .setSubject(username)
        .setIssuedAt(new Date())
        .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION_MS))
        .signWith(SignatureAlgorithm.HS256, SECRET_KEY)
        .compact();
  }

  // Extract username from token
  public String extractUsername(String token) {
    return getClaims(token).getSubject();
  }

  // Validate token
  public boolean validateToken(String token) {
    try {
      Claims claims = getClaims(token);
      return !claims.getExpiration().before(new Date());
    } catch (Exception e) {
      return false;
    }
  }

  // Get claims
  private Claims getClaims(String token) {
    return Jwts.parser()
        .setSigningKey(SECRET_KEY)
        .parseClaimsJws(token)
        .getBody();
  }

  // Extract JWT from request header
  public String extractJwtFromRequest(HttpServletRequest request) {
    String bearer = request.getHeader("Authorization");
    if (bearer != null && bearer.startsWith("Bearer ")) {
      return bearer.substring(7);
    }
    return null;
  }
}

