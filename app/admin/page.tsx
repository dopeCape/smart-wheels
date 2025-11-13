'use client';

import { useEffect, useState } from 'react';
import Card from '@/components/ui/Card';
import { Car, Calendar, Clock, CheckCircle } from 'lucide-react';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalCars: 0,
    totalBookings: 0,
    pendingBookings: 0,
    confirmedBookings: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [carsRes, bookingsRes] = await Promise.all([
        fetch('/api/cars'),
        fetch('/api/bookings'),
      ]);

      const carsData = await carsRes.json();
      const bookingsData = await bookingsRes.json();

      setStats({
        totalCars: carsData.cars.length,
        totalBookings: bookingsData.bookings.length,
        pendingBookings: bookingsData.bookings.filter(
          (b: any) => b.status === 'pending'
        ).length,
        confirmedBookings: bookingsData.bookings.filter(
          (b: any) => b.status === 'confirmed'
        ).length,
      });
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Total Cars',
      value: stats.totalCars,
      icon: Car,
      color: 'text-blue-500',
    },
    {
      title: 'Total Bookings',
      value: stats.totalBookings,
      icon: Calendar,
      color: 'text-green-500',
    },
    {
      title: 'Pending Approval',
      value: stats.pendingBookings,
      icon: Clock,
      color: 'text-yellow-500',
    },
    {
      title: 'Confirmed Bookings',
      value: stats.confirmedBookings,
      icon: CheckCircle,
      color: 'text-purple-500',
    },
  ];

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
        <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
        <p className="text-gray-400">Overview of your car rental business</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm mb-1">{stat.title}</p>
                  <p className="text-3xl font-bold">{stat.value}</p>
                </div>
                <Icon className={`h-12 w-12 ${stat.color}`} />
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
