import mongoose, { Schema, models } from 'mongoose';

export interface IBooking {
  car: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
  startDate: Date;
  endDate: Date;
  totalKm: number;
  totalDays: number;
  totalCost: number;
  status: 'pending' | 'confirmed' | 'rejected' | 'completed' | 'cancelled';
  createdAt: Date;
  updatedAt: Date;
}

const BookingSchema = new Schema<IBooking>({
  car: {
    type: Schema.Types.ObjectId,
    ref: 'Car',
    required: [true, 'Please provide a car'],
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Please provide a user'],
  },
  startDate: {
    type: Date,
    required: [true, 'Please provide a start date'],
  },
  endDate: {
    type: Date,
    required: [true, 'Please provide an end date'],
  },
  totalKm: {
    type: Number,
    required: [true, 'Please provide total kilometers'],
    min: 0,
  },
  totalDays: {
    type: Number,
    required: [true, 'Please provide total days'],
    min: 1,
  },
  totalCost: {
    type: Number,
    required: [true, 'Please provide total cost'],
    min: 0,
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'rejected', 'completed', 'cancelled'],
    default: 'pending',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Update the updatedAt field before saving
BookingSchema.pre('save', function (next) {
  this.updatedAt = new Date();
  next();
});

const Booking = models.Booking || mongoose.model<IBooking>('Booking', BookingSchema);

export default Booking;
