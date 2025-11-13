'use client';

import { useEffect, useState } from 'react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { Calendar, Car, User, CheckCircle, XCircle, Clock } from 'lucide-react';
import { format } from 'date-fns';

interface Booking {
  _id: string;
  car: {
    name: string;
    brand: string;
  };
  user: {
    name: string;
    email: string;
  };
  startDate: string;
  endDate: string;
  totalKm: number;
  totalDays: number;
  totalCost: number;
  status: 'pending' | 'confirmed' | 'rejected' | 'completed' | 'cancelled';
  createdAt: string;
}

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');

  useEffect(() => {
    fetchBookings();
  }, []);

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

  const handleStatusUpdate = async (id: string, status: string) => {
    try {
      const response = await fetch(`/api/bookings/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });

      if (response.ok) {
        await fetchBookings();
      }
    } catch (error) {
      console.error('Failed to update booking:', error);
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

  const filteredBookings = bookings.filter((booking) => {
    if (filter === 'all') return true;
    return booking.status === filter;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-white"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Bookings Management</h1>
        <p className="text-gray-400">Manage and approve customer bookings</p>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto">
        {['all', 'pending', 'confirmed', 'rejected', 'completed', 'cancelled'].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
              filter === status
                ? 'bg-white text-black'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
            {status === 'all' && ` (${bookings.length})`}
            {status !== 'all' && ` (${bookings.filter((b) => b.status === status).length})`}
          </button>
        ))}
      </div>

      {filteredBookings.length === 0 ? (
        <Card className="text-center py-12">
          <Calendar className="h-16 w-16 text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">No bookings found</h3>
          <p className="text-gray-400">
            {filter === 'all'
              ? 'No bookings have been made yet'
              : `No ${filter} bookings`}
          </p>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredBookings.map((booking) => (
            <Card key={booking._id}>
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Left Section - Booking Info */}
                <div className="lg:col-span-8">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <Car className="h-5 w-5 text-gray-400" />
                        <div>
                          <h3 className="text-lg font-semibold">{booking.car.name}</h3>
                          <p className="text-sm text-gray-400">{booking.car.brand}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <User className="h-5 w-5 text-gray-400" />
                        <div>
                          <p className="text-sm font-medium">{booking.user.name}</p>
                          <p className="text-sm text-gray-400">{booking.user.email}</p>
                        </div>
                      </div>
                    </div>
                    <div className={`px-3 py-1 rounded-full border text-sm ${getStatusColor(booking.status)}`}>
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
                    Booked on {format(new Date(booking.createdAt), 'MMM dd, yyyy HH:mm')}
                  </div>
                </div>

                {/* Right Section - Actions */}
                <div className="lg:col-span-4 flex flex-col justify-center">
                  {booking.status === 'pending' && (
                    <div className="space-y-2">
                      <Button
                        variant="primary"
                        className="w-full"
                        onClick={() => handleStatusUpdate(booking._id, 'confirmed')}
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Confirm Booking
                      </Button>
                      <Button
                        variant="danger"
                        className="w-full"
                        onClick={() => handleStatusUpdate(booking._id, 'rejected')}
                      >
                        <XCircle className="h-4 w-4 mr-2" />
                        Reject Booking
                      </Button>
                    </div>
                  )}
                  {booking.status === 'confirmed' && (
                    <Button
                      variant="secondary"
                      className="w-full"
                      onClick={() => handleStatusUpdate(booking._id, 'completed')}
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Mark as Completed
                    </Button>
                  )}
                  {booking.status !== 'pending' && booking.status !== 'confirmed' && (
                    <div className="flex items-center justify-center text-gray-500">
                      <Clock className="h-5 w-5 mr-2" />
                      <span>No actions available</span>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
