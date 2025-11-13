# SmartWheels - Car Rental Application

A modern, full-stack car rental platform built with Next.js, TypeScript, MongoDB, and Tailwind CSS.

## Features

### User Portal
- Browse available cars with advanced filtering
- Filter by brand, fuel type, date range, and price
- Book cars for specific date ranges
- View booking history and status
- Real-time availability checking

### Admin Dashboard
- Manage car inventory (CRUD operations)
- Upload car images to Vercel Blob Storage
- Approve or reject booking requests
- View analytics and statistics
- Mark bookings as completed

### Authentication
- Secure user registration and login
- Role-based access control (User/Admin)
- Protected routes and API endpoints

## Tech Stack

- **Framework:** Next.js 15 with App Router
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Authentication:** NextAuth.js
- **Database:** MongoDB with Mongoose
- **File Storage:** Vercel Blob Storage
- **Icons:** Lucide React
- **Date Handling:** date-fns

## Getting Started

### Prerequisites

- Node.js 18+ installed
- MongoDB database (local or MongoDB Atlas)
- Vercel account (for blob storage)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd smart-wheels
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:

Create a `.env` file in the root directory:

```env
# MongoDB Connection
MONGODB_URI=mongodb://localhost:27017/smart-wheels
# or use MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/smart-wheels

# NextAuth Configuration
NEXTAUTH_SECRET=your-secret-key-here-generate-with-openssl-rand-base64-32
NEXTAUTH_URL=http://localhost:3000

# Vercel Blob Storage
BLOB_READ_WRITE_TOKEN=your-vercel-blob-token-here
```

To generate a secure `NEXTAUTH_SECRET`:
```bash
openssl rand -base64 32
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Creating an Admin Account

1. Register a new account through the UI
2. Open MongoDB and find your user in the `users` collection
3. Change the `role` field from `"user"` to `"admin"`
4. Log out and log back in to access the admin dashboard

## Project Structure

```
smart-wheels/
├── app/
│   ├── admin/              # Admin dashboard pages
│   │   ├── cars/          # Car management
│   │   ├── bookings/      # Booking management
│   │   └── layout.tsx     # Admin layout with sidebar
│   ├── api/               # API routes
│   │   ├── auth/          # Authentication endpoints
│   │   ├── cars/          # Car CRUD operations
│   │   ├── bookings/      # Booking operations
│   │   └── upload/        # Image upload
│   ├── book/              # Car booking pages
│   ├── bookings/          # User bookings page
│   ├── login/             # Login page
│   ├── register/          # Registration page
│   └── page.tsx           # Home page (car listing)
├── components/
│   ├── ui/                # Reusable UI components
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   └── Input.tsx
│   ├── Navbar.tsx         # Navigation bar
│   └── SessionProvider.tsx
├── lib/
│   └── mongodb.ts         # MongoDB connection
├── models/                # Mongoose models
│   ├── User.ts
│   ├── Car.ts
│   └── Booking.ts
└── ...
```

## Features Overview

### For Users
1. **Browse Cars:** View all available cars with detailed information
2. **Filter & Search:** Filter by brand, fuel type, and availability
3. **Book Cars:** Select dates and distance, get instant cost calculation
4. **Track Bookings:** View all your bookings and their status

### For Admins
1. **Dashboard:** View key metrics and statistics
2. **Car Management:** Add, edit, delete cars with image upload
3. **Booking Management:** Approve/reject bookings, mark as completed
4. **Availability Control:** Automatic availability management based on bookings

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Import your repository in Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

### MongoDB Atlas Setup

1. Create a free cluster at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a database user
3. Whitelist your IP or allow access from anywhere (0.0.0.0/0)
4. Get your connection string and update `MONGODB_URI`

### Vercel Blob Storage Setup

1. Go to your Vercel project settings
2. Navigate to Storage
3. Create a new Blob store
4. Copy the `BLOB_READ_WRITE_TOKEN` to your environment variables

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## Design Philosophy

SmartWheels follows a dark, modern, and minimalistic design inspired by Apple, Vercel, and Linear. Key design principles:

- Clean, uncluttered interfaces
- Dark theme with high contrast
- Smooth transitions and interactions
- Mobile-responsive design
- Intuitive navigation

## License

MIT
