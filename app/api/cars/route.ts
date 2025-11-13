import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import Car from '@/models/Car';
import Booking from '@/models/Booking';

// GET all cars with optional filters
export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    const searchParams = request.nextUrl.searchParams;
    const brand = searchParams.get('brand');
    const fuelType = searchParams.get('fuelType');
    const minSeating = searchParams.get('minSeating');
    const maxCostPerKm = searchParams.get('maxCostPerKm');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const available = searchParams.get('available');

    let query: any = {};

    if (brand) query.brand = brand;
    if (fuelType) query.fuelType = fuelType;
    if (minSeating) query.seating = { $gte: parseInt(minSeating) };
    if (maxCostPerKm) query.costPerKm = { $lte: parseFloat(maxCostPerKm) };
    if (available === 'true') query.isAvailable = true;

    let cars = await Car.find(query).sort({ createdAt: -1 });

    // Filter by availability based on date range
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);

      // Get all confirmed bookings that overlap with the requested date range
      const overlappingBookings = await Booking.find({
        status: 'confirmed',
        $or: [
          {
            startDate: { $lte: end },
            endDate: { $gte: start },
          },
        ],
      }).distinct('car');

      // Filter out cars that have overlapping bookings
      cars = cars.filter(
        (car) => !overlappingBookings.some((bookingCarId) => bookingCarId.equals(car._id))
      );
    }

    return NextResponse.json({ cars }, { status: 200 });
  } catch (error: any) {
    console.error('Error fetching cars:', error);
    return NextResponse.json(
      { error: error.message || 'Something went wrong' },
      { status: 500 }
    );
  }
}

// POST - Create a new car (Admin only)
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || (session.user as any).role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();

    await dbConnect();

    const car = await Car.create(body);

    return NextResponse.json(
      { message: 'Car created successfully', car },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error creating car:', error);
    return NextResponse.json(
      { error: error.message || 'Something went wrong' },
      { status: 500 }
    );
  }
}
