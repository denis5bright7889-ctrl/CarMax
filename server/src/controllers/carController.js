import asyncHandler from 'express-async-handler';
import Car from '../models/Car.js';

const getCars = asyncHandler(async (req, res) => {
  const cars = await Car.find({ isAvailable: true }).populate('user', 'name email');
  res.json(cars);
});

const getCarById = asyncHandler(async (req, res) => {
  const car = await Car.findById(req.params.id).populate('user', 'name email phone');
  if (car) {
    car.views += 1;
    await car.save();
    res.json(car);
  } else {
    res.status(404);
    throw new Error('Car not found');
  }
});

const createCar = asyncHandler(async (req, res) => {
  const car = new Car({ ...req.body, user: req.user._id });
  const createdCar = await car.save();
  res.status(201).json(createdCar);
});

const updateCar = asyncHandler(async (req, res) => {
  const car = await Car.findById(req.params.id);
  if (car) {
    if (car.user.toString() !== req.user._id.toString()) {
      res.status(401);
      throw new Error('Not authorized');
    }
    Object.assign(car, req.body);
    const updatedCar = await car.save();
    res.json(updatedCar);
  } else {
    res.status(404);
    throw new Error('Car not found');
  }
});

const deleteCar = asyncHandler(async (req, res) => {
  const car = await Car.findById(req.params.id);
  if (car) {
    await car.deleteOne();
    res.json({ message: 'Car removed' });
  } else {
    res.status(404);
    throw new Error('Car not found');
  }
});

const getUserCars = asyncHandler(async (req, res) => {
  const cars = await Car.find({ user: req.user._id });
  res.json(cars);
});

export { getCars, getCarById, createCar, updateCar, deleteCar, getUserCars };
