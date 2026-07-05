# 🏠 HouseHunt — Premium House Rental & Real Estate Platform

![HouseHunt](https://img.shields.io/badge/Stack-React%20%7C%20Node.js%20%7C%20MongoDB-blueviolet?style=for-the-badge)
![License](https://img.shields.io/badge/License-ISC-green?style=for-the-badge)
![Version](https://img.shields.io/badge/Version-1.0.0-blue?style=for-the-badge)

> A full-stack, production-ready real estate rental platform inspired by Airbnb, MagicBricks, Zillow, and Housing.com — built with React (Vite), Node.js/Express, and MongoDB.

---

## ✨ Features

### 🏡 Core Platform
- **Property Listings** — Browse, search, and filter rental properties by city, type, budget, bedrooms
- **Property Details** — Full-screen gallery, amenities, contact landlord, book a visit, leave a review
- **Advanced Search** — Real-time keyword search + filter sidebar with price range sliders
- **Wishlist** — Save favorite properties for logged-in tenants

### 🔐 Authentication & RBAC
- JWT-based authentication (login / register / forgot password / reset password)
- Role-Based Access Control: **Tenant**, **Landlord**, **Admin**
- Secure password hashing with `bcryptjs`
- Session persistence via `localStorage`

### 👤 Tenant Dashboard
- Edit profile & upload profile picture
- View and manage saved wishlist properties
- Track scheduled property visit bookings

### 🏢 Landlord Dashboard
- Add / Edit / Delete property listings (with image upload)
- View all incoming visit requests from tenants
- Simple analytics: total views, total bookings, revenue summary

### 🛡️ Admin Dashboard
- View & manage all users (tenants and landlords)
- Approve or reject pending property listings
- Platform-wide analytics overview

### 🎨 UI/UX
- Premium design system with CSS variables
- Light / Dark mode toggle
- Responsive layout (mobile-first)
- Skeleton loaders, micro-animations, glassmorphism effects
- React `ErrorBoundary` for graceful error states

---

## 🗂️ Project Structure

```
HouseHunt/
├── backend/                    # Node.js + Express API Server
│   ├── config/
│   │   └── db.js               # MongoDB connection
│   ├── controllers/            # Business logic handlers
│   │   ├── authController.js
│   │   ├── userController.js
│   │   ├── propertyController.js
│   │   ├── bookingController.js
│   │   ├── reviewController.js
│   │   ├── wishlistController.js
│   │   └── adminController.js
│   ├── middleware/
│   │   ├── authMiddleware.js   # JWT verification
│   │   └── uploadMiddleware.js # Multer image upload config
│   ├── models/                 # Mongoose schemas
│   │   ├── User.js
│   │   ├── Property.js
│   │   ├── Booking.js
│   │   ├── Review.js
│   │   └── Wishlist.js
│   ├── routes/                 # Express route definitions
│   ├── uploads/                # Uploaded images (gitignored)
│   ├── .env                    # Environment variables
│   └── server.js               # Express app entry point
│
├── database/
│   ├── seedData.js             # Database seeding script
│   └── sampleProperties.json  # Sample property data
│
├── frontend/                   # React (Vite) SPA
│   ├── public/
│   └── src/
│       ├── components/         # Reusable UI components
│       │   ├── Navbar.jsx
│       │   ├── Footer.jsx
│       │   ├── PropertyCard.jsx
│       │   ├── SearchBar.jsx
│       │   ├── SkeletonLoader.jsx
│       │   └── ErrorBoundary.jsx
│       ├── context/
│       │   ├── AuthContext.jsx  # Global auth state
│       │   └── ThemeContext.jsx # Light/Dark mode toggle
│       ├── pages/
│       │   ├── Home.jsx
│       │   ├── SearchResults.jsx
│       │   ├── PropertyDetails.jsx
│       │   ├── Login.jsx
│       │   ├── Register.jsx
│       │   ├── ForgotPassword.jsx
│       │   ├── ResetPassword.jsx
│       │   ├── TenantDashboard.jsx
│       │   ├── LandlordDashboard.jsx
│       │   └── AdminDashboard.jsx
│       ├── routes/
│       │   ├── AppRoutes.jsx   # Route definitions
│       │   └── ProtectedRoute.jsx # Auth guard
│       ├── services/
│       │   └── api.js          # Axios instance with JWT interceptor
│       └── index.css           # Global premium design system
│
└── package.json                # Root monorepo scripts
```

---

## ⚙️ Tech Stack

| Layer       | Technology                              |
|-------------|----------------------------------------|
| Frontend    | React 19, Vite 8, React Router DOM v6  |
| State Mgmt  | Context API (Auth + Theme)             |
| HTTP Client | Axios (with JWT interceptor)           |
| Icons       | Lucide React                           |
| Backend     | Node.js, Express.js                    |
| Auth        | JWT (`jsonwebtoken`), Bcrypt           |
| File Upload | Multer                                  |
| Email       | Nodemailer                              |
| Database    | MongoDB, Mongoose ODM                  |
| Dev Tools   | Nodemon, Concurrently, Vite HMR        |

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** v18+ 
- **MongoDB** (local instance running on port 27017, or Atlas URI)
- **npm** v9+

### 1. Clone the Repository
```bash
git clone <your-repo-url> HouseHunt
cd HouseHunt
```

### 2. Install Dependencies
```bash
npm run install-all
```
This installs root, backend, and frontend dependencies.

### 3. Configure Environment Variables

The backend `.env` is pre-configured for local development:
```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://127.0.0.1:27017/househunt
JWT_SECRET=super_secret_key_househunt_2026
JWT_EXPIRES_IN=7d
FRONTEND_URL=http://localhost:5173
```

> **For production**, update `MONGO_URI` to your MongoDB Atlas connection string and set a strong `JWT_SECRET`.

### 4. Seed the Database (Optional)
```bash
node database/seedData.js
```

This creates:
| User | Email | Password | Role |
|------|-------|----------|------|
| John Tenant | tenant@househunt.com | password123 | Tenant |
| Jane Landlord | landlord@househunt.com | password123 | Landlord |
| Alex Admin | admin@househunt.com | password123 | Admin |

And seeds **7 sample property listings**.

### 5. Start Development Servers
```bash
npm run dev
```

This concurrently starts:
- 🟢 **Backend API** → `http://localhost:5000/api`
- 🔵 **Frontend App** → `http://localhost:5173`

---

## 📡 API Reference

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login & get JWT |
| GET | `/api/auth/me` | Get current user |
| POST | `/api/auth/forgot-password` | Send reset email |
| POST | `/api/auth/reset-password/:token` | Reset password |

### Properties
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/properties` | Public | List/search properties |
| GET | `/api/properties/:id` | Public | Get property details |
| POST | `/api/properties` | Landlord | Create new listing |
| PUT | `/api/properties/:id` | Landlord | Update listing |
| DELETE | `/api/properties/:id` | Landlord | Delete listing |

### Bookings
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/bookings` | Tenant | Request a property visit |
| GET | `/api/bookings/my` | Tenant | Get my bookings |
| GET | `/api/bookings/landlord` | Landlord | Get incoming requests |
| PATCH | `/api/bookings/:id/status` | Landlord | Approve/reject booking |

### Reviews
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/reviews` | Tenant | Submit a review |
| GET | `/api/reviews/:propertyId` | Public | Get property reviews |

### Wishlist
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/wishlist` | Tenant | Get saved properties |
| POST | `/api/wishlist/toggle` | Tenant | Add/remove from wishlist |

### Admin
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/admin/users` | Admin | List all users |
| DELETE | `/api/admin/users/:id` | Admin | Delete a user |
| GET | `/api/admin/properties` | Admin | List all properties |
| PATCH | `/api/admin/properties/:id/status` | Admin | Approve/reject listing |

---

## 🗃️ Database Schema

### User
```
name, email, password (hashed), phone, role (tenant|landlord|admin), 
profileImage, createdAt
```

### Property
```
title, description, address, city, state, price, propertyType, 
bedrooms, bathrooms, area, amenities[], images[], furnished, 
parking, petsAllowed, virtualTourUrl, status (active|pending|rejected), 
owner (ref: User), views, averageRating, reviewCount, createdAt
```

### Booking
```
tenant (ref: User), property (ref: Property), visitDate, visitTime, 
message, status (pending|confirmed|cancelled|completed), createdAt
```

### Review
```
user (ref: User), property (ref: Property), rating (1-5), 
comment, createdAt
```

### Wishlist
```
user (ref: User), properties [] (ref: Property)
```

---

## 🛡️ Security Features

- **JWT Auth** — Tokens expire after 7 days; auto-logout on 401
- **Password Hashing** — Bcrypt with salt rounds (10)
- **Role Guards** — Backend enforces `tenant`, `landlord`, `admin` roles
- **CORS** — Restricted to `FRONTEND_URL` in production
- **File Validation** — Multer restricts uploads to image MIME types

---

## 📝 License

ISC © HouseHunt 2026
