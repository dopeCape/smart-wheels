'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import Image from 'next/image';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import {
  Car as CarIcon,
  Users,
  Fuel,
  Gauge,
  Calendar,
  Sparkles,
  Zap,
  Shield,
  Clock,
  TrendingUp,
  ArrowRight
} from 'lucide-react';

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
      {/* Gradient Mesh Background */}
      <div className="gradient-mesh"></div>

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-32">
          <div className="text-center relative z-10">
            {/* Badge */}
            <div className="inline-flex items-center space-x-2 glass px-4 py-2 rounded-full mb-8 animate-float">
              <Sparkles className="h-4 w-4 text-indigo-400" />
              <span className="text-sm text-gray-300">Premium Car Rental Service</span>
              <div className="h-1.5 w-1.5 rounded-full bg-indigo-400 animate-pulse"></div>
            </div>

            {/* Main Heading */}
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
              <span className="bg-gradient-to-r from-white via-gray-100 to-white bg-clip-text text-transparent animate-gradient">
                Drive Your Dream
              </span>
              <br />
              <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent animate-gradient">
                Rent with Ease
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-xl sm:text-2xl text-gray-400 max-w-3xl mx-auto mb-12 leading-relaxed">
              Experience luxury and convenience with our premium fleet of vehicles.
              Book in seconds, drive in minutes.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
              <a href="#cars">
                <Button size="lg" variant="primary" className="group">
                  <span>Explore Our Fleet</span>
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </a>
              {!session && (
                <Link href="/register">
                  <Button size="lg" variant="secondary">
                    Get Started Free
                  </Button>
                </Link>
              )}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
              {[
                { icon: CarIcon, label: 'Premium Cars', value: `${cars.length}+` },
                { icon: Users, label: 'Happy Customers', value: '5000+' },
                { icon: Shield, label: 'Insured Fleet', value: '100%' },
                { icon: Clock, label: 'Support', value: '24/7' },
              ].map((stat, i) => (
                <div key={i} className="glass-strong rounded-xl p-4 hover:scale-105 transition-transform duration-300">
                  <stat.icon className="h-8 w-8 mx-auto mb-2 text-indigo-400" />
                  <div className="text-2xl font-bold mb-1">{stat.value}</div>
                  <div className="text-sm text-gray-400">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-indigo-500/20 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse-slow"></div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {[
            {
              icon: Zap,
              title: 'Instant Booking',
              description: 'Book your perfect ride in seconds with our streamlined process',
              gradient: 'from-yellow-500 to-orange-500'
            },
            {
              icon: Shield,
              title: 'Fully Insured',
              description: 'Drive with confidence knowing all our vehicles are fully insured',
              gradient: 'from-green-500 to-emerald-500'
            },
            {
              icon: TrendingUp,
              title: 'Best Prices',
              description: 'Competitive rates with transparent pricing and no hidden fees',
              gradient: 'from-blue-500 to-indigo-500'
            },
          ].map((feature, i) => (
            <div key={i} className="glass rounded-2xl p-6 hover:glass-strong transition-all duration-300 group">
              <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.gradient} p-3 mb-4 group-hover:scale-110 transition-transform`}>
                <feature.icon className="h-full w-full text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
              <p className="text-gray-400">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Filters Section */}
      <div id="cars" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
              Find Your Perfect Ride
            </h2>
            <Sparkles className="h-6 w-6 text-indigo-400" />
          </div>
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
                className="w-full px-3 py-2 glass rounded-lg text-white border border-white/10 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
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
              <Sparkles className="h-4 w-4 mr-2" />
              Apply Filters
            </Button>
            <Button onClick={resetFilters} variant="ghost">
              Reset
            </Button>
          </div>
        </Card>

        {/* Car Grid */}
        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block relative">
              <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-500"></div>
              <CarIcon className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-8 w-8 text-indigo-400" />
            </div>
            <p className="mt-4 text-gray-400">Loading amazing cars...</p>
          </div>
        ) : cars.length === 0 ? (
          <div className="text-center py-20">
            <div className="glass-strong rounded-2xl p-12 max-w-md mx-auto">
              <CarIcon className="h-20 w-20 text-gray-600 mx-auto mb-4" />
              <h3 className="text-2xl font-semibold mb-2">No cars available</h3>
              <p className="text-gray-400">Try adjusting your filters to see more options</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cars.map((car) => (
              <Link key={car._id} href={session ? `/book/${car._id}` : '/login'}>
                <Card padding={false} hover className="group overflow-hidden">
                  <div className="relative h-52 bg-gradient-to-br from-gray-800 to-gray-900 overflow-hidden">
                    {car.imageUrl ? (
                      <Image
                        src={car.imageUrl}
                        alt={car.name}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <CarIcon className="h-20 w-20 text-gray-600 group-hover:scale-110 transition-transform duration-500" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="absolute top-3 right-3">
                      <span className="glass px-3 py-1 rounded-full text-xs font-medium">
                        {car.year}
                      </span>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="mb-4">
                      <h3 className="text-xl font-bold mb-1 group-hover:text-indigo-400 transition-colors">
                        {car.name}
                      </h3>
                      <p className="text-gray-400 text-sm">{car.brand}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
                      <div className="flex items-center text-gray-300 glass px-2 py-1.5 rounded-lg">
                        <Users className="h-4 w-4 mr-2 text-indigo-400" />
                        {car.seating} Seats
                      </div>
                      <div className="flex items-center text-gray-300 glass px-2 py-1.5 rounded-lg">
                        <Fuel className="h-4 w-4 mr-2 text-indigo-400" />
                        {car.fuelType}
                      </div>
                      <div className="flex items-center text-gray-300 glass px-2 py-1.5 rounded-lg">
                        <Gauge className="h-4 w-4 mr-2 text-indigo-400" />
                        {car.mileage} km/l
                      </div>
                      <div className="flex items-center text-gray-300 glass px-2 py-1.5 rounded-lg">
                        <Calendar className="h-4 w-4 mr-2 text-indigo-400" />
                        {car.transmission}
                      </div>
                    </div>

                    <div className="glass-strong rounded-lg p-4 mb-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-xs text-gray-400 mb-1">Cost per km</p>
                          <p className="text-lg font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                            ₹{car.costPerKm}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-gray-400 mb-1">Per day</p>
                          <p className="text-lg font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                            ₹{car.extraChargePerDay}
                          </p>
                        </div>
                      </div>
                    </div>

                    <Button variant="primary" className="w-full">
                      {session ? 'Book Now' : 'Login to Book'}
                      <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
