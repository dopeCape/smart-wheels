'use client';

import { use, useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { Car as CarIcon, Users, Fuel, Gauge, Calendar, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

interface Car {
  _id: string;
  name: string;
  brand: string;
  seating: number;
  mileage: number;
  fuelType: string;
  costPerKm: number;
  extraChargePerDay: number;
  imageUrl?: string;
  transmission: string;
  year: number;
  description?: string;
}

export default function BookCarPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { data: session } = useSession();
  const router = useRouter();
  const [car, setCar] = useState<Car | null>(null);
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    startDate: '',
    endDate: '',
    totalKm: 0,
  });

  useEffect(() => {
    if (!session) {
      router.push('/login');
      return;
    }

    fetchCar();
  }, [session]);

  const fetchCar = async () => {
    try {
      const response = await fetch(`/api/cars/${id}`);
      const data = await response.json();
      setCar(data.car);
    } catch (error) {
      setError('Failed to load car details');
    } finally {
      setLoading(false);
    }
  };

  const calculateCost = () => {
    if (!car || !formData.startDate || !formData.endDate) return 0;

    const start = new Date(formData.startDate);
    const end = new Date(formData.endDate);
    const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));

    if (days <= 0) return 0;

    const kmCost = formData.totalKm * car.costPerKm;
    const dayCost = days * car.extraChargePerDay;

    return kmCost + dayCost;
  };

  const calculateDays = () => {
    if (!formData.startDate || !formData.endDate) return 0;

    const start = new Date(formData.startDate);
    const end = new Date(formData.endDate);
    const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));

    return days > 0 ? days : 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setBooking(true);

    if (!car) return;

    const totalDays = calculateDays();
    const totalCost = calculateCost();

    if (totalDays <= 0) {
      setError('End date must be after start date');
      setBooking(false);
      return;
    }

    if (formData.totalKm <= 0) {
      setError('Please enter estimated kilometers');
      setBooking(false);
      return;
    }

    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          car: car._id,
          startDate: formData.startDate,
          endDate: formData.endDate,
          totalKm: formData.totalKm,
          totalDays,
          totalCost,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Failed to create booking');
      } else {
        router.push('/bookings?success=true');
      }
    } catch (error) {
      setError('Something went wrong');
    } finally {
      setBooking(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-white"></div>
      </div>
    );
  }

  if (!car) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Car not found</h1>
          <Link href="/">
            <Button variant="primary">Go Back</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link href="/" className="inline-flex items-center text-gray-400 hover:text-white mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to cars
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Car Details */}
          <div>
            <Card padding={false}>
              <div className="relative h-80 bg-gray-800 rounded-t-xl overflow-hidden">
                {car.imageUrl ? (
                  <Image
                    src={car.imageUrl}
                    alt={car.name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <CarIcon className="h-24 w-24 text-gray-600" />
                  </div>
                )}
              </div>
              <div className="p-6">
                <h1 className="text-3xl font-bold mb-2">{car.name}</h1>
                <p className="text-gray-400 mb-6">{car.brand} • {car.year}</p>

                {car.description && (
                  <p className="text-gray-300 mb-6">{car.description}</p>
                )}

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="flex items-center text-gray-300">
                    <Users className="h-5 w-5 mr-3 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-400">Seating</p>
                      <p className="font-medium">{car.seating} People</p>
                    </div>
                  </div>
                  <div className="flex items-center text-gray-300">
                    <Fuel className="h-5 w-5 mr-3 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-400">Fuel Type</p>
                      <p className="font-medium capitalize">{car.fuelType}</p>
                    </div>
                  </div>
                  <div className="flex items-center text-gray-300">
                    <Gauge className="h-5 w-5 mr-3 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-400">Mileage</p>
                      <p className="font-medium">{car.mileage} km/l</p>
                    </div>
                  </div>
                  <div className="flex items-center text-gray-300">
                    <Calendar className="h-5 w-5 mr-3 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-400">Transmission</p>
                      <p className="font-medium capitalize">{car.transmission}</p>
                    </div>
                  </div>
                </div>

                <div className="border-t border-gray-800 pt-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-gray-400 text-sm mb-1">Cost per km</p>
                      <p className="text-2xl font-bold">₹{car.costPerKm}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm mb-1">Extra per day</p>
                      <p className="text-2xl font-bold">₹{car.extraChargePerDay}</p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Booking Form */}
          <div>
            <Card>
              <h2 className="text-2xl font-bold mb-6">Book this car</h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <div className="bg-red-500/10 border border-red-500/50 text-red-500 px-4 py-3 rounded-lg text-sm">
                    {error}
                  </div>
                )}

                <Input
                  label="Start Date"
                  type="date"
                  value={formData.startDate}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, startDate: e.target.value }))
                  }
                  min={new Date().toISOString().split('T')[0]}
                  required
                />

                <Input
                  label="End Date"
                  type="date"
                  value={formData.endDate}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, endDate: e.target.value }))
                  }
                  min={formData.startDate || new Date().toISOString().split('T')[0]}
                  required
                />

                <Input
                  label="Estimated Kilometers"
                  type="number"
                  placeholder="e.g., 500"
                  value={formData.totalKm || ''}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, totalKm: parseInt(e.target.value) || 0 }))
                  }
                  min="1"
                  required
                />

                {formData.startDate && formData.endDate && formData.totalKm > 0 && (
                  <div className="bg-gray-800 rounded-lg p-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Total Days</span>
                      <span className="font-medium">{calculateDays()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Distance Cost</span>
                      <span className="font-medium">₹{formData.totalKm * car.costPerKm}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Day Charges</span>
                      <span className="font-medium">₹{calculateDays() * car.extraChargePerDay}</span>
                    </div>
                    <div className="border-t border-gray-700 pt-2 mt-2">
                      <div className="flex justify-between">
                        <span className="font-semibold">Total Cost</span>
                        <span className="text-2xl font-bold">₹{calculateCost()}</span>
                      </div>
                    </div>
                  </div>
                )}

                <div className="bg-blue-500/10 border border-blue-500/50 text-blue-400 px-4 py-3 rounded-lg text-sm">
                  Your booking will be sent to admin for confirmation
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  className="w-full"
                  disabled={booking}
                >
                  {booking ? 'Creating booking...' : 'Confirm Booking'}
                </Button>
              </form>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
