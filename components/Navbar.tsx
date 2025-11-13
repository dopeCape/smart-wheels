'use client';

import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { Car, LogOut, LayoutDashboard, User } from 'lucide-react';
import Button from './ui/Button';

export default function Navbar() {
  const { data: session } = useSession();

  return (
    <nav className="border-b border-gray-800 bg-black/50 backdrop-blur-xl sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center space-x-2 group">
            <Car className="h-6 w-6 group-hover:scale-110 transition-transform" />
            <span className="text-xl font-semibold">SmartWheels</span>
          </Link>

          <div className="flex items-center space-x-4">
            {session ? (
              <>
                <div className="text-sm text-gray-400 hidden sm:block">
                  {session.user?.name}
                </div>
                {(session.user as any)?.role === 'admin' && (
                  <Link href="/admin">
                    <Button variant="ghost" size="sm">
                      <LayoutDashboard className="h-4 w-4 mr-2" />
                      Dashboard
                    </Button>
                  </Link>
                )}
                <Link href="/bookings">
                  <Button variant="ghost" size="sm">
                    <User className="h-4 w-4 mr-2" />
                    My Bookings
                  </Button>
                </Link>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => signOut({ callbackUrl: '/login' })}
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost" size="sm">
                    Login
                  </Button>
                </Link>
                <Link href="/register">
                  <Button variant="primary" size="sm">
                    Sign Up
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
