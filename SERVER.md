
# Mini Event Platform – Backend (Server)

This folder contains the **backend (server-side)** implementation of the **Mini Event Platform**, built as part of the **MERN Stack Intern – Technical Screening Assignment**.

The backend is responsible for:
- Authentication & authorization
- Event management (CRUD)
- RSVP system with strict capacity & concurrency handling
- User dashboard data aggregation
- Image uploads
- Secure token handling

---

## 🚀 Tech Stack

- **Node.js**
- **Express.js**
- **MongoDB + Mongoose**
- **JWT (Access & Refresh Tokens)**
- **Cloudinary** (Image hosting)
- **Multer** (File uploads)
- **MongoDB Transactions** (Concurrency safety)

---

## 🧱 Architecture Design (Class-Based & Clean Structure)

This backend follows a **clean, class-based architecture** with a strict separation of concerns.

### Architecture Layers

- **Service Layer (Class-Based)**  
  All business logic is implemented using class-based services such as:
  - `UserService`
  - `EventService`
  - `RSVPService`
  - `DashboardService`  

  These classes coordinate application logic and remain independent of HTTP or Express-specific code.

- **Repository Layer (Class-Based)**  
  All database operations are encapsulated inside repository classes:
  - `UserRepository`
  - `EventRepository`
  - `RSVPRepository`
  - `DashboardRepository`  

  This ensures:
  - No database logic inside routes
  - Clean, testable data access
  - Easy scalability and maintainability

- **Controller / API Layer (Functional)**  
  Express routes are intentionally kept **functional and stateless**, responsible only for:
  - Request handling
  - Authentication
  - Calling service methods

> This hybrid approach combines **class-based core logic** with **lightweight functional routing**, avoiding unnecessary boilerplate while maintaining clean architecture principles.

---

## 📂 Folder Structure

```
server/
│── src/
│   ├── api/
│   │   ├── middlewares/
│   │   │   └── auth.js
│   │   ├── user.js
│   │   ├── event.js
│   │   ├── rsvp.js
│   │   └── index.js
│   │
│   ├── services/
│   │   ├── user-service.js
│   │   ├── event-service.js
│   │   ├── rsvp-service.js
│   │   └── dashboard-service.js
│   │
│   ├── database/
│   │   ├── models/
│   │   │   ├── UserModel.js
│   │   │   ├── EventModel.js
│   │   │   └── RSVPModel.js
│   │   └── repository/
│   │       ├── user-repository.js
│   │       ├── event-repository.js
│   │       ├── rsvp-repository.js
│   │       └── dashboard-repository.js
│   │
│   ├── utils/
│   │   ├── async-handler.js
│   │   ├── api-error.js
│   │   ├── api-response.js
│   │   ├── cloudinary.js
│   │   ├── multer.js
│   │   └── index.js
│   │
│   ├── config/
│   │   └── index.js
│   │
│   ├── express-app.js
│   └── index.js
│
└── README.md
```

---

## 🔐 Authentication & Security

### Authentication Flow
- Users authenticate using **JWT**
- **Access Token** → sent via `Authorization` header
- **Refresh Token** → stored securely in **HTTP-only cookies**

### Key Features
- Secure password hashing using **bcrypt**
- Token-based stateless authentication
- Protected routes via middleware

---

## 🎫 Event Management (CRUD)

Authenticated users can:
- Create events (with image upload)
- View all upcoming events
- Update or delete **only events they created**

### Event Fields
- Title
- Description
- Date & Time
- Location
- Capacity
- Available Seats
- Category
- Image (Cloudinary URL)
- Created By (User reference)

---

## 🔄 RSVP System (Critical Business Logic)

### Why RSVP is a Separate Model
RSVP represents the **relationship** between a user and an event and must handle:
- Capacity enforcement
- Concurrency safety
- Duplicate prevention

### Key Guarantees
- **No Overbooking**
- **No Duplicate RSVP**
- **Safe under concurrent requests**

### Technical Strategy (Important)
- RSVP stored in its own collection
- Compound unique index on `(user, event)`
- Event capacity managed using **atomic updates**
- MongoDB **transactions** ensure consistency

### RSVP Flow (Join)
1. Atomically decrement available seats
2. Create RSVP record
3. Commit transaction

### RSVP Flow (Leave)
1. Delete RSVP record
2. Increment available seats
3. Commit transaction

---

## 👤 User Dashboard

Private dashboard routes provide:
- Events created by the logged-in user
- Events the user is attending

### Data Source
- Created Events → `Event.createdBy`
- Attending Events → `RSVP → Event`

No event references are stored inside the User document to avoid duplication.

---

## 🌐 API Endpoints (Summary)

### Auth
- `POST /user/signup`
- `POST /user/login`
- `GET /user/refresh`
- `GET /user/logout`
- `GET /user/profile`

### Events
- `POST /event`
- `GET /event`
- `PATCH /event/:id`
- `DELETE /event/:id`

### RSVP
- `POST /event/:id/rsvp`
- `DELETE /event/:id/rsvp`

### Dashboard
- `GET /user/events/created`
- `GET /user/events/attending`

---

## 🖼 Image Uploads

- Handled using **Multer**
- Temporarily stored on disk
- Uploaded to **Cloudinary**
- Local temp files removed after upload

---

## ⚙️ Environment Variables

Create a `.env` file in the server root:

```
PORT=5000
MONGODB_URI=your_mongodb_atlas_url

ACCESS_TOKEN_SECRET=your_access_secret
ACCESS_TOKEN_EXPIRY=60m

REFRESH_TOKEN_SECRET=your_refresh_secret
REFRESH_TOKEN_EXPIRY=10d

CLOUDINARY_CLOUD_NAME=xxxx
CLOUDINARY_API_KEY=xxxx
CLOUDINARY_API_SECRET=xxxx
```

---

## ▶️ Running Locally

```bash
npm install
npm run dev
```

Server will start on:
```
http://localhost:5000
```

---

## 🧠 Assignment Notes (Important)

- RSVP capacity enforcement is **transaction-based**
- Duplicate RSVPs are prevented at **database level**
- No user-event arrays are stored to avoid inconsistency
- Architecture follows **Controller → Service → Repository** pattern

---

## ✅ Features Implemented

- Secure authentication with JWT
- Event CRUD with ownership checks
- Image uploads
- RSVP system with concurrency protection
- User dashboard
- Search & filtering
- Clean layered backend architecture

---

