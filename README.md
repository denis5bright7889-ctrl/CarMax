# CarMax - Car Marketplace

A full-stack car marketplace application built with the MERN stack (MongoDB, Express.js, React, Node.js).

## Features

- ?? User Authentication (JWT)
- ?? Create, Read, Update, Delete car listings
- ?? Search and filter cars by price, brand, location
- ?? Responsive design with Tailwind CSS
- ?? User dashboard to manage listings
- ?? View counts for car listings

## Tech Stack

### Frontend
- React 18 with Vite
- Tailwind CSS
- React Router
- Axios
- React Hot Toast

### Backend
- Node.js with Express
- MongoDB with Mongoose
- JWT Authentication
- bcryptjs

## Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB or MongoDB Atlas account

### Backend Setup

\`\`\`bash
cd server
npm install
npm run dev
\`\`\`

### Frontend Setup

\`\`\`bash
cd client
npm install
npm run dev
\`\`\`

## Environment Variables

Create a `.env` file in the server directory:

\`\`\`env
NODE_ENV=development
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
JWT_EXPIRE=30d
\`\`\`

## API Endpoints

### Authentication
- POST /api/auth/register - Register new user
- POST /api/auth/login - Login user
- GET /api/auth/profile - Get user profile

### Cars
- GET /api/cars - Get all cars
- GET /api/cars/:id - Get single car
- POST /api/cars - Create car listing
- PUT /api/cars/:id - Update car
- DELETE /api/cars/:id - Delete car
- GET /api/cars/my-cars - Get user's cars

## Screenshots

(Add your screenshots here)

## License

MIT License

## Author

Your Name

## Live Demo

(Add your deployed link here)
