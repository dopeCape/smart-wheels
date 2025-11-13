'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import Image from 'next/image';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { Car as CarIcon, Users, Fuel, Gauge, Calendar } from 'lucide-react';

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

export default function HomePage() {
  const { data: session } = useSession();
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    brand: '',
    fuelType: '',
    startDate: '',
    endDate: '',
  });

  const fetchCars = async () => {
    setLoading(true);
    const queryParams = new URLSearchParams();

    if (filters.brand) queryParams.append('brand', filters.brand);
    if (filters.fuelType) queryParams.append('fuelType', filters.fuelType);
    if (filters.startDate) queryParams.append('startDate', filters.startDate);
    if (filters.endDate) queryParams.append('endDate', filters.endDate);
    queryParams.append('available', 'true');

    const response = await fetch(`/api/cars?${queryParams.toString()}`);
    const data = await response.json();
    setCars(data.cars);
    setLoading(false);
  };

  useEffect(() => {
    fetchCars();
  }, []);

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const applyFilters = () => {
    fetchCars();
  };

  const resetFilters = () => {
    setFilters({
      brand: '',
      fuelType: '',
      startDate: '',
      endDate: '',
    });
    setTimeout(fetchCars, 0);
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-b from-gray-900 to-black border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4">
              Rent Your Perfect Car
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Choose from our wide selection of premium vehicles for your next journey
            </p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className="mb-8">
          <h2 className="text-lg font-semibold mb-4">Filter Cars</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            <Input
              label="Brand"
              placeholder="e.g., Toyota, Honda"
              value={filters.brand}
              onChange={(e) => handleFilterChange('brand', e.target.value)}
            />
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">
                Fuel Type
              </label>
              <select
                className="w-full px-3 py-2 bg-gray-900 border border-gray-800 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent"
                value={filters.fuelType}
                onChange={(e) => handleFilterChange('fuelType', e.target.value)}
              >
                <option value="">All</option>
                <option value="petrol">Petrol</option>
                <option value="diesel">Diesel</option>
                <option value="electric">Electric</option>
                <option value="hybrid">Hybrid</option>
              </select>
            </div>
            <Input
              label="Start Date"
              type="date"
              value={filters.startDate}
              onChange={(e) => handleFilterChange('startDate', e.target.value)}
            />
            <Input
              label="End Date"
              type="date"
              value={filters.endDate}
              onChange={(e) => handleFilterChange('endDate', e.target.value)}
            />
          </div>
          <div className="flex gap-3">
            <Button onClick={applyFilters} variant="primary">
              Apply Filters
            </Button>
            <Button onClick={resetFilters} variant="ghost">
              Reset
            </Button>
          </div>
        </Card>

        {/* Car Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-white mx-auto"></div>
          </div>
        ) : cars.length === 0 ? (
          <div className="text-center py-12">
            <CarIcon className="h-16 w-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No cars available</h3>
            <p className="text-gray-400">Try adjusting your filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cars.map((car) => (
              <Card key={car._id} className="hover:border-gray-700 transition-all" padding={false}>
                <div className="relative h-48 bg-gray-800 rounded-t-xl overflow-hidden">
                  {car.imageUrl ? (
                    <Image
                      src={car.imageUrl}
                      alt={car.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <CarIcon className="h-16 w-16 text-gray-600" />
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <div className="mb-4">
                    <h3 className="text-xl font-semibold mb-1">{car.name}</h3>
                    <p className="text-gray-400 text-sm">{car.brand} • {car.year}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
                    <div className="flex items-center text-gray-400">
                      <Users className="h-4 w-4 mr-2" />
                      {car.seating} Seats
                    </div>
                    <div className="flex items-center text-gray-400">
                      <Fuel className="h-4 w-4 mr-2" />
                      {car.fuelType}
                    </div>
                    <div className="flex items-center text-gray-400">
                      <Gauge className="h-4 w-4 mr-2" />
                      {car.mileage} km/l
                    </div>
                    <div className="flex items-center text-gray-400">
                      <Calendar className="h-4 w-4 mr-2" />
                      {car.transmission}
                    </div>
                  </div>

                  <div className="border-t border-gray-800 pt-4 mb-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm text-gray-400">Cost per km</p>
                        <p className="text-lg font-semibold">₹{car.costPerKm}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-400">Per day</p>
                        <p className="text-lg font-semibold">₹{car.extraChargePerDay}</p>
                      </div>
                    </div>
                  </div>

                  {session ? (
                    <Link href={`/book/${car._id}`}>
                      <Button variant="primary" className="w-full">
                        Book Now
                      </Button>
                    </Link>
                  ) : (
                    <Link href="/login">
                      <Button variant="primary" className="w-full">
                        Login to Book
                      </Button>
                    </Link>
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
