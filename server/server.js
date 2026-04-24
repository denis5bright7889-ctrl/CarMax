import express from 'express';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 10000;

app.use(cors());
app.use(express.json());

const cars = [
  { id: 1, title: "2020 Tesla Model 3", brand: "Tesla", price: 45000, year: 2020, mileage: 25000, location: "New York", fuelType: "Electric", transmission: "Automatic", images: ["https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=400"] },
  { id: 2, title: "2019 BMW X5", brand: "BMW", price: 55000, year: 2019, mileage: 30000, location: "Los Angeles", fuelType: "Petrol", transmission: "Automatic", images: ["https://images.unsplash.com/photo-1555215695-3004980ad54e?w=400"] },
  { id: 3, title: "2021 Honda CR-V", brand: "Honda", price: 32000, year: 2021, mileage: 15000, location: "Chicago", fuelType: "Hybrid", transmission: "Automatic", images: ["https://images.unsplash.com/photo-1568844296065-0c23d3d8af9e?w=400"] }
];

app.get('/api/health', (req, res) => {
  res.json({ status: 'healthy', message: 'CarMax Backend is running', timestamp: new Date() });
});

app.get('/api/cars', (req, res) => {
  res.json(cars);
});

app.get('/api/cars/:id', (req, res) => {
  const car = cars.find(c => c.id === parseInt(req.params.id));
  car ? res.json(car) : res.status(404).json({ error: 'Car not found' });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`? CarMax Backend running on port ${PORT}`);
});
