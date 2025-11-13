'use client';

import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { Car, LogOut, LayoutDashboard, User, Sparkles } from 'lucide-react';
import Button from './ui/Button';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const { data: session } = useSession();
  const pathname = usePathname();

  return (
    <nav className="glass-strong sticky top-0 z-50 border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center space-x-3 group relative">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg blur-lg opacity-50 group-hover:opacity-75 transition-opacity"></div>
              <Car className="h-7 w-7 relative group-hover:scale-110 transition-transform duration-300 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              SmartWheels
            </span>
            <Sparkles className="h-4 w-4 text-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </Link>

          <div className="flex items-center space-x-2 sm:space-x-3">
            {session ? (
              <>
                <div className="text-sm text-gray-300 hidden md:flex items-center space-x-2 px-3 py-1.5 rounded-lg glass">
                  <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
                  <span>{session.user?.name}</span>
                </div>
                {(session.user as any)?.role === 'admin' && (
                  <Link href="/admin">
                    <Button
                      variant="ghost"
                      size="sm"
                      className={pathname?.startsWith('/admin') ? 'bg-white/10' : ''}
                    >
                      <LayoutDashboard className="h-4 w-4 sm:mr-2" />
                      <span className="hidden sm:inline">Dashboard</span>
                    </Button>
                  </Link>
                )}
                <Link href="/bookings">
                  <Button
                    variant="ghost"
                    size="sm"
                    className={pathname === '/bookings' ? 'bg-white/10' : ''}
                  >
                    <User className="h-4 w-4 sm:mr-2" />
                    <span className="hidden sm:inline">Bookings</span>
                  </Button>
                </Link>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => signOut({ callbackUrl: '/login' })}
                  className="hidden sm:flex"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => signOut({ callbackUrl: '/login' })}
                  className="sm:hidden"
                >
                  <LogOut className="h-4 w-4" />
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
                  <Button variant="primary" size="sm" className="relative group overflow-hidden">
                    <span className="relative z-10">Sign Up</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 opacity-0 group-hover:opacity-20 transition-opacity"></div>
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
