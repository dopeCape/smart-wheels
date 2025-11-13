import mongoose, { Schema, models } from 'mongoose';

export interface ICar {
  name: string;
  brand: string;
  seating: number;
  mileage: number;
  fuelType: 'petrol' | 'diesel' | 'electric' | 'hybrid';
  costPerKm: number;
  extraChargePerDay: number;
  imageUrl?: string;
  isAvailable: boolean;
  description?: string;
  transmission: 'manual' | 'automatic';
  year: number;
  createdAt: Date;
}

const CarSchema = new Schema<ICar>({
  name: {
    type: String,
    required: [true, 'Please provide a car name'],
  },
  brand: {
    type: String,
    required: [true, 'Please provide a brand'],
  },
  seating: {
    type: Number,
    required: [true, 'Please provide seating capacity'],
    min: 2,
    max: 8,
  },
  mileage: {
    type: Number,
    required: [true, 'Please provide mileage'],
  },
  fuelType: {
    type: String,
    enum: ['petrol', 'diesel', 'electric', 'hybrid'],
    required: [true, 'Please provide fuel type'],
  },
  costPerKm: {
    type: Number,
    required: [true, 'Please provide cost per km'],
    min: 0,
  },
  extraChargePerDay: {
    type: Number,
    required: [true, 'Please provide extra charge per day'],
    min: 0,
  },
  imageUrl: {
    type: String,
  },
  isAvailable: {
    type: Boolean,
    default: true,
  },
  description: {
    type: String,
  },
  transmission: {
    type: String,
    enum: ['manual', 'automatic'],
    default: 'manual',
  },
  year: {
    type: Number,
    required: [true, 'Please provide car year'],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Car = models.Car || mongoose.model<ICar>('Car', CarSchema);

export default Car;
