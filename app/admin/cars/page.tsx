'use client';

import { useEffect, useState } from 'react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { Plus, Edit, Trash2, Car as CarIcon } from 'lucide-react';
import Image from 'next/image';

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
  isAvailable: boolean;
}

export default function AdminCarsPage() {
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingCar, setEditingCar] = useState<Car | null>(null);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    brand: '',
    seating: 4,
    mileage: 0,
    fuelType: 'petrol',
    costPerKm: 0,
    extraChargePerDay: 0,
    imageUrl: '',
    transmission: 'manual',
    year: new Date().getFullYear(),
    description: '',
    isAvailable: true,
  });

  useEffect(() => {
    fetchCars();
  }, []);

  const fetchCars = async () => {
    try {
      const response = await fetch('/api/cars');
      const data = await response.json();
      setCars(data.cars);
    } catch (error) {
      console.error('Failed to fetch cars:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formDataUpload = new FormData();
    formDataUpload.append('file', file);

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formDataUpload,
      });

      const data = await response.json();
      if (response.ok) {
        setFormData((prev) => ({ ...prev, imageUrl: data.url }));
      }
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const url = editingCar ? `/api/cars/${editingCar._id}` : '/api/cars';
      const method = editingCar ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        await fetchCars();
        resetForm();
      }
    } catch (error) {
      console.error('Failed to save car:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this car?')) return;

    try {
      const response = await fetch(`/api/cars/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        await fetchCars();
      }
    } catch (error) {
      console.error('Failed to delete car:', error);
    }
  };

  const handleEdit = (car: Car) => {
    setEditingCar(car);
    setFormData({
      name: car.name,
      brand: car.brand,
      seating: car.seating,
      mileage: car.mileage,
      fuelType: car.fuelType,
      costPerKm: car.costPerKm,
      extraChargePerDay: car.extraChargePerDay,
      imageUrl: car.imageUrl || '',
      transmission: car.transmission,
      year: car.year,
      description: car.description || '',
      isAvailable: car.isAvailable,
    });
    setShowForm(true);
  };

  const resetForm = () => {
    setShowForm(false);
    setEditingCar(null);
    setFormData({
      name: '',
      brand: '',
      seating: 4,
      mileage: 0,
      fuelType: 'petrol',
      costPerKm: 0,
      extraChargePerDay: 0,
      imageUrl: '',
      transmission: 'manual',
      year: new Date().getFullYear(),
      description: '',
      isAvailable: true,
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-white"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Cars Management</h1>
          <p className="text-gray-400">Manage your car inventory</p>
        </div>
        <Button
          variant="primary"
          onClick={() => setShowForm(!showForm)}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Car
        </Button>
      </div>

      {showForm && (
        <Card className="mb-8">
          <h2 className="text-xl font-bold mb-6">
            {editingCar ? 'Edit Car' : 'Add New Car'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Car Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
              <Input
                label="Brand"
                value={formData.brand}
                onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                required
              />
              <Input
                label="Seating Capacity"
                type="number"
                value={formData.seating}
                onChange={(e) => setFormData({ ...formData, seating: parseInt(e.target.value) })}
                min="2"
                max="8"
                required
              />
              <Input
                label="Mileage (km/l)"
                type="number"
                step="0.1"
                value={formData.mileage}
                onChange={(e) => setFormData({ ...formData, mileage: parseFloat(e.target.value) })}
                required
              />
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">
                  Fuel Type
                </label>
                <select
                  className="w-full px-3 py-2 bg-gray-900 border border-gray-800 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-white"
                  value={formData.fuelType}
                  onChange={(e) => setFormData({ ...formData, fuelType: e.target.value })}
                >
                  <option value="petrol">Petrol</option>
                  <option value="diesel">Diesel</option>
                  <option value="electric">Electric</option>
                  <option value="hybrid">Hybrid</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">
                  Transmission
                </label>
                <select
                  className="w-full px-3 py-2 bg-gray-900 border border-gray-800 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-white"
                  value={formData.transmission}
                  onChange={(e) => setFormData({ ...formData, transmission: e.target.value })}
                >
                  <option value="manual">Manual</option>
                  <option value="automatic">Automatic</option>
                </select>
              </div>
              <Input
                label="Cost per km (₹)"
                type="number"
                step="0.1"
                value={formData.costPerKm}
                onChange={(e) => setFormData({ ...formData, costPerKm: parseFloat(e.target.value) })}
                required
              />
              <Input
                label="Extra Charge per Day (₹)"
                type="number"
                value={formData.extraChargePerDay}
                onChange={(e) => setFormData({ ...formData, extraChargePerDay: parseInt(e.target.value) })}
                required
              />
              <Input
                label="Year"
                type="number"
                value={formData.year}
                onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })}
                min="1900"
                max={new Date().getFullYear() + 1}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">
                Description
              </label>
              <textarea
                className="w-full px-3 py-2 bg-gray-900 border border-gray-800 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white resize-none"
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">
                Car Image
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="w-full px-3 py-2 bg-gray-900 border border-gray-800 rounded-lg text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-white file:text-black hover:file:bg-gray-100"
              />
              {uploading && <p className="text-sm text-gray-400 mt-2">Uploading...</p>}
              {formData.imageUrl && (
                <p className="text-sm text-green-500 mt-2">Image uploaded successfully</p>
              )}
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="isAvailable"
                checked={formData.isAvailable}
                onChange={(e) => setFormData({ ...formData, isAvailable: e.target.checked })}
                className="mr-2"
              />
              <label htmlFor="isAvailable" className="text-sm text-gray-300">
                Available for booking
              </label>
            </div>

            <div className="flex gap-3">
              <Button type="submit" variant="primary">
                {editingCar ? 'Update Car' : 'Add Car'}
              </Button>
              <Button type="button" variant="ghost" onClick={resetForm}>
                Cancel
              </Button>
            </div>
          </form>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cars.map((car) => (
          <Card key={car._id} padding={false}>
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
              <h3 className="text-xl font-semibold mb-1">{car.name}</h3>
              <p className="text-gray-400 text-sm mb-4">{car.brand} • {car.year}</p>

              <div className="grid grid-cols-2 gap-2 text-sm mb-4">
                <div>
                  <span className="text-gray-400">Seating:</span> {car.seating}
                </div>
                <div>
                  <span className="text-gray-400">Fuel:</span> {car.fuelType}
                </div>
                <div>
                  <span className="text-gray-400">₹{car.costPerKm}/km</span>
                </div>
                <div>
                  <span className="text-gray-400">₹{car.extraChargePerDay}/day</span>
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  className="flex-1"
                  onClick={() => handleEdit(car)}
                >
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  className="flex-1"
                  onClick={() => handleDelete(car._id)}
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Delete
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
