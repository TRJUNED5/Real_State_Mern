# 🏡 Tazan Estate — MERN Real Estate Platform

A full-stack real estate web application for exploring, creating, and managing property listings. **Tazan Estate** lets visitors browse homes for sale or rent, search and filter properties, and view listing details. Registered users can manage their profiles and their own property listings.

> **Project status:** Development project. Sample listings, images, addresses, and prices should be clearly identified as demonstrations unless verified.

## ✨ Features

- Browse recent offers, homes for rent, and properties for sale
- Search and filter real estate listings
- View property details, images, pricing, and contact information
- Sign up, sign in, and use Google authentication
- Update your profile and upload a profile image using Firebase Storage
- Create, edit, and delete your own listings
- Responsive interface built with React and Tailwind CSS
- Property image carousels powered by Swiper
- Redux Toolkit state management with persisted user state
- Protected routes and token-verified listing management endpoints

## 🛠 Tech Stack

| Frontend | Backend | Services & Libraries |
| --- | --- | --- |
| React 19, Vite 6 | Node.js, Express 5 | MongoDB, Mongoose |
| Tailwind CSS 4 | REST API | Firebase Authentication / Storage integration |
| React Router 7 | JWT, bcryptjs | Redux Toolkit, redux-persist, Swiper, React Icons |

## 📁 Project Structure

```text
Real_State_Mern/
├── api/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   └── index.js
├── client/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── redux/
│   │   ├── firebase.jsx
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
├── package.json
└── README.md
```

## 🚀 Getting Started

### Prerequisites

- Node.js and npm
- A MongoDB database (local or MongoDB Atlas)
- A Firebase project configured for the authentication/storage features you use

### 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/YOUR_REPOSITORY.git
cd YOUR_REPOSITORY
```

Replace the placeholder URL and directory with your GitHub repository details.

### 2. Install dependencies

Install backend dependencies from the project root:

```bash
npm install
```

Install frontend dependencies:

```bash
cd client
npm install
cd ..
```

### 3. Configure environment variables

Create `.env` in the **project root**:

```env
MONGO=your_mongodb_connection_string
JWT_SECRET=replace_with_a_long_random_secret
```

Create `client/.env`:

```env
VITE_FIREBASE_API_KEY=your_firebase_web_api_key
```

The current `client/src/firebase.jsx` uses `VITE_FIREBASE_API_KEY` and also contains other Firebase configuration values. Review that file and configure the Firebase project details for your own environment.

**Security:** Never commit `.env`, database credentials, private keys, or JWT secrets. If any real credentials have already been shared or committed, rotate them before making the repository public.

### 4. Start the backend

From the project root:

```bash
npm run dev
```

The Express API runs at **http://localhost:3000**.

### 5. Start the frontend

In a separate terminal:

```bash
cd client
npm run dev
```

Open the local URL displayed by Vite (typically **http://localhost:5173**).

The Vite development server proxies `/api` requests to `http://localhost:3000`.

## 🔌 API Overview

| Method | Endpoint | Purpose |
| --- | --- | --- |
| POST | `/api/auth/signup` | Register a user |
| POST | `/api/auth/signin` | Sign in |
| POST | `/api/auth/google` | Google sign-in |
| GET | `/api/auth/signout` | Sign out |
| GET | `/api/listing/get` | Browse and filter listings |
| GET | `/api/listing/get/:id` | View one listing |
| POST | `/api/listing/create` | Create a listing (authenticated) |
| POST | `/api/listing/update/:id` | Update a listing (authenticated) |
| DELETE | `/api/listing/delete/:id` | Delete a listing (authenticated) |

User profile and user-specific listing endpoints are defined under `/api/user`.

## 📸 Screenshots

### Homepage
A responsive landing page with a large hero banner, property search, featured listings, and sections for offers, rentals, and sales.

![Tazan Estate homepage](screenshots/homepage.png)

### Property Search
Search by keyword, select rental or sale properties, filter amenities such as parking and furnished units, and sort results by price.

![Property search and filters](screenshots/property-search.png)

### User Dashboard
A personalized profile dashboard for account information, profile photo uploads, and property management.

![User dashboard](screenshots/user-dashboard.png)

### My Properties
Browse your own listings in a card layout, search within your properties, and access edit or delete actions.

![My properties](screenshots/my-properties.png)

### Update Listing
Edit a listing's name, description, location, type, amenities, bedroom and bathroom counts, prices, and images.

![Update listing form](screenshots/update-listing.png)

## 🧪 Available Commands

**Project root:**

```bash
npm run dev     # Start Express with nodemon
npm start       # Start Express with Node.js
```

**Client directory:**

```bash
npm run dev     # Start Vite development server
npm run build   # Build the frontend
npm run preview # Preview the frontend build
npm run lint    # Run ESLint
```

## 🔐 Notes for Deployment



## 📄 License


---

Built as a MERN-stack real estate web application: **Tazan Estate**.
