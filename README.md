# HRMS Backend

A secure REST API for an HR Management System built with Node.js, Express, and MongoDB.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js (ES Modules) |
| Framework | Express.js |
| Database | MongoDB + Mongoose |
| Authentication | JWT + httpOnly Cookies |
| Password Hashing | bcryptjs |
| Validation | express-validator |
| Logging | Winston + Morgan |
| Security | Helmet + CORS |

---

## Project Structure

```
server/
├── src/
│   ├── config/
│   │   ├── db.js                 # MongoDB connection
│   │   ├── logger.js             # Winston logger setup
│   │   └── seed.js               # Admin seed script
│   ├── controllers/
│   │   ├── auth.controller.js
│   │   ├── employee.controller.js
│   │   ├── status.controller.js
│   │   ├── eod.controller.js
│   │   └── admin.controller.js
│   ├── middlewares/
│   │   ├── auth.middleware.js    # protect + restrictTo
│   │   ├── validate.middleware.js
│   │   └── error.middleware.js   # Global error handler
│   ├── models/
│   │   ├── User.js
│   │   └── EOD.js
│   ├── routes/
│   │   ├── auth.routes.js
│   │   ├── employee.routes.js
│   │   ├── status.routes.js
│   │   ├── eod.routes.js
│   │   └── admin.routes.js
│   ├── services/
│   │   ├── auth.service.js
│   │   ├── employee.service.js
│   │   ├── status.service.js
│   │   ├── eod.service.js
│   │   └── admin.service.js
│   ├── utils/
│   │   ├── AppError.js           # Custom error class
│   │   ├── generateToken.js      # JWT + cookie setter
│   │   └── responseFormatter.js  # Consistent API responses
│   ├── validators/
│   │   ├── auth.validator.js
│   │   └── employee.validator.js
│   └── app.js                    # Express app setup
├── logs/
│   ├── app.log
│   └── error.log
├── requests/
│   ├── auth.http
│   ├── employee.http
│   ├── status.http
│   ├── eod.http
│   └── admin.http
├── .env
└── server.js                     # Entry point
```

---

## Getting Started

### Prerequisites
- Node.js v18+
- MongoDB running locally or a MongoDB Atlas URI

### Installation

```bash
# Clone the repo and navigate to server
cd server

# Install dependencies
npm install

# Create your .env file
cp .env.example .env
```

### Environment Variables

Create a `.env` file in the root of the server folder:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/hrms
JWT_SECRET=your_super_secret_key_here
JWT_EXPIRES_IN=7d
NODE_ENV=development
CLIENT_URL=http://localhost:5173

# Admin seed credentials
ADMIN_NAME=Admin
ADMIN_EMAIL=admin@hrms.com
ADMIN_PASSWORD=Admin@123
```

### Run the server

```bash
# Development (with nodemon)
npm run dev

# Production
npm start
```

On first startup the server will:
1. Connect to MongoDB
2. Seed the admin account if it doesn't exist
3. Start listening on the configured port

---

## API Reference

All responses follow this consistent shape:

```json
// Success
{
  "success": true,
  "message": "...",
  "data": {}
}

// Error
{
  "success": false,
  "message": "...",
  "error": []
}
```

---

### Auth Routes
**Base:** `/api/auth`

| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/login` | Public | Login for both admin and employee |
| POST | `/logout` | Protected | Clear auth cookie |
| GET | `/me` | Protected | Get current logged in user |

**Login Request Body:**
```json
{
  "email": "admin@hrms.com",
  "password": "Admin@123"
}
```

---

### Employee Routes
**Base:** `/api/employees`
**Access:** Admin only

| Method | Endpoint | Description |
|---|---|---|
| GET | `/` | Get all employees (supports search + filters) |
| POST | `/` | Create new employee |
| GET | `/:id` | Get employee by ID |
| PUT | `/:id` | Update employee details |
| DELETE | `/:id` | Delete employee |
| PATCH | `/:id/toggle-status` | Activate or deactivate account |
| PATCH | `/:id/reset-password` | Reset employee password |

**Query Parameters for GET /:**
| Param | Type | Example |
|---|---|---|
| `search` | string | `?search=john` — searches name, email, department |
| `status` | string | `?status=available` |
| `isActive` | boolean | `?isActive=true` |

**Create Employee Request Body:**
```json
{
  "fullName": "John Doe",
  "email": "john@hrms.com",
  "password": "password123",
  "department": "Engineering",
  "designation": "Software Engineer",
  "phone": "9876543210"
}
```

---

### Status Routes
**Base:** `/api/status`

| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/` | All authenticated | Get full company status board |
| PATCH | `/me` | Employee only | Update own availability status |
| PATCH | `/me/toggle` | Employee only | Toggle temporary unavailability |

**Update Status Request Body:**
```json
{
  "status": "available"
}
```

**Valid status values:**
- `available`
- `on-leave`
- `half-day-leave`

---

### EOD Routes
**Base:** `/api/eod`

| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/` | All authenticated | Get full EOD timeline |
| POST | `/` | Employee only | Submit EOD report |
| GET | `/stats` | Admin only | Get today's EOD submission stats |

**Submit EOD Request Body:**
```json
{
  "message": "Today I completed the login module and fixed dashboard bugs."
}
```

> **Note:** EOD submission is restricted to **6:00 PM – 9:00 PM** server time. Requests outside this window will return a `403` error. One submission per employee per day is allowed.

---

### Admin Routes
**Base:** `/api/admin`
**Access:** Admin only

| Method | Endpoint | Description |
|---|---|---|
| GET | `/dashboard` | Get dashboard statistics |

**Dashboard Response:**
```json
{
  "success": true,
  "message": "Dashboard stats fetched successfully",
  "data": {
    "totalEmployees": 10,
    "available": 6,
    "onLeave": 2,
    "halfDay": 1,
    "temporarilyUnavailable": 1,
    "submittedToday": 7,
    "pendingEOD": 3
  }
}
```

---

## Authentication

- JWT is stored in an **httpOnly cookie** named `token`
- Cookie is inaccessible to JavaScript — protected against XSS
- Token expires in 7 days (configurable via `JWT_EXPIRES_IN`)
- Every protected route requires the cookie to be present
- Role-based access is enforced on both route and service level

---

## Database Models

### User
| Field | Type | Notes |
|---|---|---|
| `fullName` | String | Required |
| `email` | String | Required, unique, lowercase |
| `password` | String | Required, hashed, never returned |
| `role` | String | `admin` or `employee` |
| `status` | String | `available`, `on-leave`, `half-day-leave` |
| `temporaryAvailability` | Boolean | Toggle for short unavailability |
| `statusUpdatedAt` | Date | Last status change timestamp |
| `isActive` | Boolean | Disabled users cannot login |
| `department` | String | Optional |
| `designation` | String | Optional |
| `phone` | String | Optional |
| `profilePicture` | String | Optional, stores URL |

### EOD Report
| Field | Type | Notes |
|---|---|---|
| `userId` | ObjectId | Ref to User |
| `employeeName` | String | Denormalized for display |
| `message` | String | Required |
| `submittedAt` | Date | Submission timestamp |

---

## Error Handling

All errors are handled by the global error middleware. Common error codes:

| Code | Meaning |
|---|---|
| `400` | Bad request / validation error |
| `401` | Not authenticated |
| `403` | Forbidden / no permission |
| `404` | Resource not found |
| `500` | Internal server error |

---

## Logging

- **Morgan** logs all HTTP requests → piped into Winston
- **Winston** writes to:
  - Console (development only)
  - `logs/app.log` — all logs
  - `logs/error.log` — errors only
- Log level in production: `warn` and above

---

## Testing

`.http` files are in the `requests/` folder. Use the **REST Client** extension in VS Code or import into Postman.

| File | Coverage |
|---|---|
| `auth.http` | Login, logout, get me, validation errors |
| `employee.http` | Full CRUD, search, filters, role guard |
| `status.http` | Status update, toggle, role guard |
| `eod.http` | Submit, timeline, stats, time window |
| `admin.http` | Dashboard, role guard |