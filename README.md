# TravelGenius
FullStack - SpringBoot Project
# 🌍 Travel Planner with Itinerary + Expense Splitter

A collaborative travel planning application that helps groups organize trips, manage itineraries, and split expenses seamlessly — all in one place.

---

## 🚀 Overview

Planning group trips is often messy — itineraries get lost, expenses become confusing, and settling payments is awkward.

This application solves that by providing:

* A shared itinerary builder
* Real-time collaboration
* Expense tracking with smart debt simplification
* Centralized document storage

---

## ✨ Features

### 🧭 Trip Management

* Create trips with destination, dates, and cover image
* Invite friends via link or code
* Role-based permissions (Admin & Members)

### 📅 Collaborative Itinerary

* Day-wise timeline
* Add/edit/delete activities
* Real-time updates for all members

### 💸 Expense Splitter

* Add shared expenses
* Equal & unequal split support
* Track who paid and who owes

### 🔄 Debt Simplification

* Minimizes number of transactions
* Shows exact “who pays whom”

### 📂 Document Vault

* Upload tickets, hotel bookings, IDs
* Access all trip documents in one place

### 🗳️ Voting System

* Create polls for group decisions
* Vote on hotels, places, etc.

### 📡 Real-Time Sync

* Instant updates using WebSockets

### 📴 Offline Support

* View itinerary and expenses without internet

---

## 🧠 Core Algorithm

The app uses a **Min Cash Flow Algorithm** to simplify debts:

* Converts multiple transactions into minimal payments
* Reduces complexity in settlements

Example:
Instead of:

* A pays B ₹500
* B pays C ₹500

It becomes:

* A pays C ₹500

---

## 🏗️ Tech Stack

### Frontend

* React Native / React
* Context API / Redux Toolkit

### Backend

* Java Spring Boot
* REST APIs + WebSockets

### Database

* PostgreSQL / Firebase

### APIs

* Google Places API (location data)
* OpenExchangeRates (currency conversion)

---

## 📁 Project Structure

### Backend (Spring Boot)

```
src/main/java/com/travelplanner/
│── controller/
│── service/
│── repository/
│── model/
│── dto/
│── config/
│── util/
```

### Frontend

```
src/
│── components/
│── screens/
│── navigation/
│── services/
│── context/ or store/
│── utils/
│── assets/
```

---

## 👥 User Roles

### 👑 Admin (Trip Organizer)

* Create and manage trip
* Invite members
* Control permissions

### 👤 Group Member

* Add itinerary items
* Upload documents
* Add expenses
* View balances and settle payments

---

## 🔌 API Endpoints (Sample)

### Auth

* POST `/auth/login`
* POST `/auth/register`

### Trips

* POST `/trips`
* GET `/trips/{id}`
* POST `/trips/{id}/join`

### Itinerary

* POST `/itinerary`
* GET `/itinerary/{tripId}`

### Expenses

* POST `/expenses`
* GET `/expenses/{tripId}`
* GET `/expenses/{tripId}/settlement`

---

## 🧪 Demo Flow

1. Create a trip
2. Invite friends
3. Add itinerary items
4. Add expenses
5. View simplified settlement

---

## ⚙️ Setup Instructions

### Backend

```
cd backend
mvn clean install
mvn spring-boot:run
```

### Frontend

```
cd frontend
npm install
npm start
```

---

## 🎯 Hackathon Highlights

* Clean UI/UX for group collaboration
* Advanced expense splitting logic
* Real-time sync with WebSockets
* Offline support capability
* End-to-end working product

---

## 📌 Future Enhancements

* AI-based itinerary suggestions
* Integration with booking platforms
* In-app payments (UPI integration)
* Notifications & reminders

---

## 🤝 Contribution

Contributions are welcome! Feel free to fork, improve, and submit PRs.

---

## 📄 License

This project is open-source and available under the MIT License.

---

## 🙌 Acknowledgements

* Inspired by real-world travel planning problems
* Built for hackathon innovation and practical use

---

## ⭐ Show Your Support

If you like this project, give it a ⭐ on GitHub!
