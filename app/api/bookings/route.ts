import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import Booking from '@/models/Booking';

// GET all bookings
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get('status');

    let query: any = {};

    // If user is not admin, only show their bookings
    if ((session.user as any).role !== 'admin') {
      query.user = (session.user as any).id;
    }

    if (status) {
      query.status = status;
    }

    const bookings = await Booking.find(query)
      .populate('car')
      .populate('user', 'name email')
      .sort({ createdAt: -1 });

    return NextResponse.json({ bookings }, { status: 200 });
  } catch (error: any) {
    console.error('Error fetching bookings:', error);
    return NextResponse.json(
      { error: error.message || 'Something went wrong' },
      { status: 500 }
    );
  }
}

// POST - Create a new booking
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();

    await dbConnect();

    // Check for overlapping bookings
    const overlappingBooking = await Booking.findOne({
      car: body.car,
      status: 'confirmed',
      $or: [
        {
          startDate: { $lte: new Date(body.endDate) },
          endDate: { $gte: new Date(body.startDate) },
        },
      ],
    });

    if (overlappingBooking) {
      return NextResponse.json(
        { error: 'Car is not available for the selected dates' },
        { status: 400 }
      );
    }

    const booking = await Booking.create({
      ...body,
      user: (session.user as any).id,
    });

    const populatedBooking = await Booking.findById(booking._id)
      .populate('car')
      .populate('user', 'name email');

    return NextResponse.json(
      { message: 'Booking created successfully', booking: populatedBooking },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error creating booking:', error);
    return NextResponse.json(
      { error: error.message || 'Something went wrong' },
      { status: 500 }
    );
  }
}
