package com.wandersplit.backend.controller;

import com.wandersplit.backend.model.User;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User user) {
        // Implementation logic
        return ResponseEntity.ok(Map.of("user", user));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> credentials) {
        // Implementation logic
        return ResponseEntity.ok(Map.of("token", "dummy-jwt"));
    }

    @GetMapping("/me")
    public ResponseEntity<?> me() {
        return ResponseEntity.ok(Map.of("user", new User("1", "User", "user@example.com", "", "")));
    }
}
