import express from 'express';
import { getCars, getCarById, createCar, updateCar, deleteCar, getUserCars } from '../controllers/carController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').get(getCars).post(protect, createCar);
router.route('/my-cars').get(protect, getUserCars);
router.route('/:id').get(getCarById).put(protect, updateCar).delete(protect, deleteCar);

export default router;
