import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import Booking from '@/models/Booking';

// GET single booking
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    const { id } = await params;
    const booking = await Booking.findById(id)
      .populate('car')
      .populate('user', 'name email');

    if (!booking) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    }

    // Check if user is authorized to view this booking
    if (
      (session.user as any).role !== 'admin' &&
      booking.user._id.toString() !== (session.user as any).id
    ) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    return NextResponse.json({ booking }, { status: 200 });
  } catch (error: any) {
    console.error('Error fetching booking:', error);
    return NextResponse.json(
      { error: error.message || 'Something went wrong' },
      { status: 500 }
    );
  }
}

// PUT - Update booking status (Admin only for confirm/reject, users for cancel)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { status } = await request.json();

    await dbConnect();

    const { id } = await params;
    const booking = await Booking.findById(id);

    if (!booking) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    }

    // Only admin can confirm or reject
    if (
      (status === 'confirmed' || status === 'rejected') &&
      (session.user as any).role !== 'admin'
    ) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Users can only cancel their own bookings
    if (
      status === 'cancelled' &&
      booking.user.toString() !== (session.user as any).id &&
      (session.user as any).role !== 'admin'
    ) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    booking.status = status;
    await booking.save();

    const updatedBooking = await Booking.findById(id)
      .populate('car')
      .populate('user', 'name email');

    return NextResponse.json(
      { message: 'Booking updated successfully', booking: updatedBooking },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error updating booking:', error);
    return NextResponse.json(
      { error: error.message || 'Something went wrong' },
      { status: 500 }
    );
  }
}

// DELETE - Delete a booking
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    const { id } = await params;
    const booking = await Booking.findById(id);

    if (!booking) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    }

    // Only admin or the user who created the booking can delete it
    if (
      (session.user as any).role !== 'admin' &&
      booking.user.toString() !== (session.user as any).id
    ) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await Booking.findByIdAndDelete(id);

    return NextResponse.json(
      { message: 'Booking deleted successfully' },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error deleting booking:', error);
    return NextResponse.json(
      { error: error.message || 'Something went wrong' },
      { status: 500 }
    );
  }
}
