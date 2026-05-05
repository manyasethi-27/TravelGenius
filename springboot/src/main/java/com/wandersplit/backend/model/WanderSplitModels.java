package com.wandersplit.backend.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class User {
    private String id;
    private String name;
    private String email;
    private String password;
    private String avatar;
}

@Data
@NoArgsConstructor
@AllArgsConstructor
class Activity {
    private String id;
    private String title;
    private String time;
    private String notes;
    private int day;
    private String documentId;
}

@Data
@NoArgsConstructor
@AllArgsConstructor
class Expense {
    private String id;
    private String title;
    private double amount;
    private String paidBy;
    private List<String> splitBetween;
    private String date;
    private String type; // EQUAL, UNEQUAL
}

@Data
@NoArgsConstructor
@AllArgsConstructor
class Trip {
    private String id;
    private String name;
    private String destination;
    private String startDate;
    private String endDate;
    private String joinCode;
    private String coverImage;
    private String adminId;
    private List<User> members;
    private List<Activity> itinerary;
    private List<Expense> expenses;
}
