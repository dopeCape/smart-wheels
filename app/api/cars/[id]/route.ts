import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import Car from '@/models/Car';

// GET single car
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();

    const { id } = await params;
    const car = await Car.findById(id);

    if (!car) {
      return NextResponse.json({ error: 'Car not found' }, { status: 404 });
    }

    return NextResponse.json({ car }, { status: 200 });
  } catch (error: any) {
    console.error('Error fetching car:', error);
    return NextResponse.json(
      { error: error.message || 'Something went wrong' },
      { status: 500 }
    );
  }
}

// PUT - Update a car (Admin only)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || (session.user as any).role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();

    await dbConnect();

    const { id } = await params;
    const car = await Car.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });

    if (!car) {
      return NextResponse.json({ error: 'Car not found' }, { status: 404 });
    }

    return NextResponse.json(
      { message: 'Car updated successfully', car },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error updating car:', error);
    return NextResponse.json(
      { error: error.message || 'Something went wrong' },
      { status: 500 }
    );
  }
}

// DELETE - Delete a car (Admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || (session.user as any).role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    const { id } = await params;
    const car = await Car.findByIdAndDelete(id);

    if (!car) {
      return NextResponse.json({ error: 'Car not found' }, { status: 404 });
    }

    return NextResponse.json(
      { message: 'Car deleted successfully' },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error deleting car:', error);
    return NextResponse.json(
      { error: error.message || 'Something went wrong' },
      { status: 500 }
    );
  }
}
