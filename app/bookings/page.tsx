'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { Calendar, Car, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';

interface Booking {
  _id: string;
  car: {
    name: string;
    brand: string;
    imageUrl?: string;
  };
  startDate: string;
  endDate: string;
  totalKm: number;
  totalDays: number;
  totalCost: number;
  status: 'pending' | 'confirmed' | 'rejected' | 'completed' | 'cancelled';
  createdAt: string;
}

export default function BookingsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
      return;
    }

    if (status === 'authenticated') {
      fetchBookings();
    }
  }, [status]);

  const fetchBookings = async () => {
    try {
      const response = await fetch('/api/bookings');
      const data = await response.json();
      setBookings(data.bookings);
    } catch (error) {
      console.error('Failed to fetch bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case 'confirmed':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'rejected':
        return <XCircle className="h-5 w-5 text-red-500" />;
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-blue-500" />;
      case 'cancelled':
        return <XCircle className="h-5 w-5 text-gray-500" />;
      default:
        return <AlertCircle className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/50';
      case 'confirmed':
        return 'bg-green-500/10 text-green-500 border-green-500/50';
      case 'rejected':
        return 'bg-red-500/10 text-red-500 border-red-500/50';
      case 'completed':
        return 'bg-blue-500/10 text-blue-500 border-blue-500/50';
      case 'cancelled':
        return 'bg-gray-500/10 text-gray-500 border-gray-500/50';
      default:
        return 'bg-gray-500/10 text-gray-500 border-gray-500/50';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-white"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">My Bookings</h1>
          <p className="text-gray-400">View and manage your car rental bookings</p>
        </div>

        {bookings.length === 0 ? (
          <Card className="text-center py-12">
            <Car className="h-16 w-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No bookings yet</h3>
            <p className="text-gray-400 mb-6">Start booking cars to see them here</p>
            <Button variant="primary" onClick={() => router.push('/')}>
              Browse Cars
            </Button>
          </Card>
        ) : (
          <div className="space-y-4">
            {bookings.map((booking) => (
              <Card key={booking._id}>
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-xl font-semibold mb-1">
                          {booking.car.name}
                        </h3>
                        <p className="text-gray-400 text-sm">{booking.car.brand}</p>
                      </div>
                      <div className={`flex items-center space-x-2 px-3 py-1 rounded-full border text-sm ${getStatusColor(booking.status)}`}>
                        {getStatusIcon(booking.status)}
                        <span className="capitalize">{booking.status}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-gray-400 mb-1">Duration</p>
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                          <span>
                            {format(new Date(booking.startDate), 'MMM dd')} -{' '}
                            {format(new Date(booking.endDate), 'MMM dd, yyyy')}
                          </span>
                        </div>
                        <p className="text-gray-400 text-xs mt-1">
                          {booking.totalDays} {booking.totalDays === 1 ? 'day' : 'days'}
                        </p>
                      </div>

                      <div>
                        <p className="text-gray-400 mb-1">Distance</p>
                        <p className="font-medium">{booking.totalKm} km</p>
                      </div>

                      <div>
                        <p className="text-gray-400 mb-1">Total Cost</p>
                        <p className="text-xl font-bold">₹{booking.totalCost}</p>
                      </div>
                    </div>

                    <div className="mt-3 text-xs text-gray-500">
                      Booked on {format(new Date(booking.createdAt), 'MMM dd, yyyy')}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
