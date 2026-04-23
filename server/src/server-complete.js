import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// In-memory storage (temporary until MongoDB is set up)
let users = [];
let cars = [];
let nextUserId = 1;
let nextCarId = 1;

// Sample data
const sampleCars = [
  {
    id: 1,
    title: "2020 Tesla Model 3",
    brand: "Tesla",
    model: "Model 3",
    year: 2020,
    price: 45000,
    mileage: 25000,
    fuelType: "Electric",
    transmission: "Automatic",
    color: "Red",
    location: "New York, NY",
    description: "Excellent condition, full self-driving capability",
    images: ["https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=400"],
    isAvailable: true,
    views: 120,
    userId: null
  },
  {
    id: 2,
    title: "2019 BMW X5",
    brand: "BMW",
    model: "X5",
    year: 2019,
    price: 55000,
    mileage: 30000,
    fuelType: "Petrol",
    transmission: "Automatic",
    color: "Black",
    location: "Los Angeles, CA",
    description: "Luxury SUV, well maintained",
    images: ["https://images.unsplash.com/photo-1555215695-3004980ad54e?w=400"],
    isAvailable: true,
    views: 85,
    userId: null
  },
  {
    id: 3,
    title: "2021 Honda CR-V",
    brand: "Honda",
    model: "CR-V",
    year: 2021,
    price: 32000,
    mileage: 15000,
    fuelType: "Hybrid",
    transmission: "Automatic",
    color: "Blue",
    location: "Chicago, IL",
    description: "Fuel efficient, great family car",
    images: ["https://images.unsplash.com/photo-1568844296065-0c23d3d8af9e?w=400"],
    isAvailable: true,
    views: 45,
    userId: null
  }
];

cars.push(...sampleCars);
nextCarId = 4;

// JWT Authentication Middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  jwt.verify(token, process.env.JWT_SECRET || 'secret_key', (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

// ============ AUTH ROUTES ============
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password, phone, location } = req.body;
    
    const userExists = users.find(u => u.email === email);
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }
    
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = {
      id: nextUserId++,
      name,
      email,
      password: hashedPassword,
      phone: phone || '',
      location: location || '',
      role: 'user'
    };
    
    users.push(newUser);
    
    const token = jwt.sign(
      { id: newUser.id, email: newUser.email, name: newUser.name },
      process.env.JWT_SECRET || 'secret_key',
      { expiresIn: '30d' }
    );
    
    res.status(201).json({
      _id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      token
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = users.find(u => u.email === email);
    
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    
    const token = jwt.sign(
      { id: user.id, email: user.email, name: user.name },
      process.env.JWT_SECRET || 'secret_key',
      { expiresIn: '30d' }
    );
    
    res.json({
      _id: user.id,
      name: user.name,
      email: user.email,
      token
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get('/api/auth/profile', authenticateToken, (req, res) => {
  const user = users.find(u => u.id === req.user.id);
  if (user) {
    const { password, ...userWithoutPassword } = user;
    res.json(userWithoutPassword);
  } else {
    res.status(404).json({ message: 'User not found' });
  }
});

// ============ CAR ROUTES ============
app.get('/api/cars', (req, res) => {
  const { brand, minPrice, maxPrice, location, transmission, fuelType } = req.query;
  let filteredCars = [...cars];
  
  if (brand && brand !== 'all') {
    filteredCars = filteredCars.filter(car => car.brand === brand);
  }
  if (minPrice) {
    filteredCars = filteredCars.filter(car => car.price >= parseInt(minPrice));
  }
  if (maxPrice) {
    filteredCars = filteredCars.filter(car => car.price <= parseInt(maxPrice));
  }
  if (location) {
    filteredCars = filteredCars.filter(car => 
      car.location.toLowerCase().includes(location.toLowerCase())
    );
  }
  if (transmission && transmission !== 'all') {
    filteredCars = filteredCars.filter(car => car.transmission === transmission);
  }
  if (fuelType && fuelType !== 'all') {
    filteredCars = filteredCars.filter(car => car.fuelType === fuelType);
  }
  
  res.json(filteredCars);
});

app.get('/api/cars/:id', (req, res) => {
  const car = cars.find(c => c.id === parseInt(req.params.id));
  if (car) {
    car.views += 1;
    res.json(car);
  } else {
    res.status(404).json({ message: 'Car not found' });
  }
});

app.post('/api/cars', authenticateToken, (req, res) => {
  const newCar = {
    id: nextCarId++,
    ...req.body,
    userId: req.user.id,
    views: 0,
    isAvailable: true
  };
  cars.push(newCar);
  res.status(201).json(newCar);
});

app.put('/api/cars/:id', authenticateToken, (req, res) => {
  const carIndex = cars.findIndex(c => c.id === parseInt(req.params.id));
  if (carIndex === -1) {
    return res.status(404).json({ message: 'Car not found' });
  }
  
  if (cars[carIndex].userId !== req.user.id) {
    return res.status(403).json({ message: 'Not authorized to update this car' });
  }
  
  cars[carIndex] = { ...cars[carIndex], ...req.body };
  res.json(cars[carIndex]);
});

app.delete('/api/cars/:id', authenticateToken, (req, res) => {
  const carIndex = cars.findIndex(c => c.id === parseInt(req.params.id));
  if (carIndex === -1) {
    return res.status(404).json({ message: 'Car not found' });
  }
  
  if (cars[carIndex].userId !== req.user.id) {
    return res.status(403).json({ message: 'Not authorized to delete this car' });
  }
  
  cars.splice(carIndex, 1);
  res.json({ message: 'Car deleted successfully' });
});

app.get('/api/cars/my-cars', authenticateToken, (req, res) => {
  const userCars = cars.filter(car => car.userId === req.user.id);
  res.json(userCars);
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ message: 'CarMax Server is running!', status: 'OK', timestamp: new Date() });
});

// Start server
app.listen(PORT, () => {
  console.log('\n=================================');
  console.log('🚀 CarMax Server Started!');
  console.log(`📍 URL: http://localhost:${PORT}`);
  console.log(`❤️  Health: http://localhost:${PORT}/api/health`);
  console.log(`🔐 Auth: http://localhost:${PORT}/api/auth`);
  console.log(`🚗 Cars: http://localhost:${PORT}/api/cars`);
  console.log('=================================\n');
});