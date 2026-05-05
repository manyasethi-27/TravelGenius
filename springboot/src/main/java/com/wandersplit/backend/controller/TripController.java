package com.wandersplit.backend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/trips")
public class TripController {

    @GetMapping
    public ResponseEntity<List<?>> getAllTrips() {
        return ResponseEntity.ok(new ArrayList<>());
    }

    @PostMapping("/create")
    public ResponseEntity<?> createTrip(@RequestBody Object trip) {
        return ResponseEntity.ok(trip);
    }

    @PostMapping("/join")
    public ResponseEntity<?> joinTrip(@RequestBody Map<String, String> body) {
        return ResponseEntity.ok(Collections.singletonMap("status", "joined"));
    }
}
