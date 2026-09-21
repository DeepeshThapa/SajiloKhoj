'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Wrench,
  Menu,
  X,
  User,
  LogOut,
  Heart,
  Calendar,
  LayoutDashboard,
  Shield,
  Briefcase,
  ChevronDown,
  Sparkles,
} from 'lucide-react';
import { NotificationDropdown } from './NotificationDropdown';
import { logoutUser } from '@/lib/actions/auth';
import { Badge } from '@/components/ui/Badge';

interface SessionUser {
  id: string;
  name: string;
  email: string;
  role: 'CUSTOMER' | 'TECHNICIAN' | 'ADMIN';
}

interface NavbarProps {
  initialSession?: SessionUser | null;
}

export function Navbar({ initialSession = null }: NavbarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [session, setSession] = useState<SessionUser | null>(initialSession);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);

  useEffect(() => {
    setSession(initialSession);
  }, [initialSession]);

  const handleLogout = async () => {
    await logoutUser();
    setSession(null);
    setIsUserDropdownOpen(false);
    setIsMobileMenuOpen(false);
    router.push('/login');
    router.refresh();
  };

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Find Technicians', href: '/technicians' },
    { name: 'Services', href: '/services' },
    { name: 'How It Works', href: '/how-it-works' },
  ];

  const getDashboardUrl = () => {
    if (!session) return '/login';
    if (session.role === 'ADMIN') return '/admin';
    if (session.role === 'TECHNICIAN') return '/dashboard/technician';
    return '/dashboard/customer';
  };

  return (
    <header className="sticky top-0 z-40 bg-white/85 backdrop-blur-md border-b border-slate-200/70 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-18">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-xs group-hover:scale-105 transition-transform">
              <Wrench className="w-4 h-4" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold tracking-tight text-slate-900 leading-none">
                Sajilo<span className="text-blue-600">Khoj</span>
              </span>
              <span className="text-[9px] font-semibold text-slate-400 tracking-wider uppercase mt-0.5">
                Verified Pros • Nepal
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold tracking-tight transition-all ${
                    isActive
                      ? 'bg-slate-100 text-slate-900 font-bold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* Right Action Bar */}
          <div className="hidden md:flex items-center gap-2.5">
            {session ? (
              <>
                {/* Customer Quick Favorites Link */}
                {session.role === 'CUSTOMER' && (
                  <Link
                    href="/dashboard/customer?tab=favorites"
                    className="p-2 rounded-xl text-slate-600 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                    title="Saved Technicians"
                  >
                    <Heart className="w-5 h-5" />
                  </Link>
                )}

                {/* Notifications */}
                <NotificationDropdown />

                {/* User Menu */}
                <div className="relative">
                  <button
                    onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                    className="flex items-center gap-2.5 pl-2 pr-3 py-1.5 rounded-xl border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-all cursor-pointer"
                  >
                    <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs">
                      {session.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="text-left hidden lg:block">
                      <p className="text-xs font-bold text-slate-900 leading-tight max-w-[120px] truncate">
                        {session.name}
                      </p>
                      <span className="text-[10px] font-medium text-slate-500 uppercase">
                        {session.role.toLowerCase()}
                      </span>
                    </div>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-1" />
                  </button>

                  {/* Dropdown Card */}
                  {isUserDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-float border border-slate-200/80 py-2 z-50 animate-fade-in divide-y divide-slate-100">
                      <div className="px-4 py-2.5">
                        <p className="text-xs font-bold text-slate-900 truncate">{session.name}</p>
                        <p className="text-[11px] text-slate-500 truncate">{session.email}</p>
                        <div className="mt-1.5">
                          <Badge
                            variant={
                              session.role === 'ADMIN'
                                ? 'danger'
                                : session.role === 'TECHNICIAN'
                                ? 'secondary'
                                : 'primary'
                            }
                            size="sm"
                          >
                            {session.role}
                          </Badge>
                        </div>
                      </div>

                      <div className="py-1">
                        <Link
                          href={getDashboardUrl()}
                          onClick={() => setIsUserDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-slate-700 hover:text-blue-600 hover:bg-slate-50 transition-colors"
                        >
                          <LayoutDashboard className="w-4 h-4 text-slate-400" />
                          Dashboard
                        </Link>

                        {session.role === 'CUSTOMER' && (
                          <>
                            <Link
                              href="/dashboard/customer?tab=requests"
                              onClick={() => setIsUserDropdownOpen(false)}
                              className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-slate-700 hover:text-blue-600 hover:bg-slate-50 transition-colors"
                            >
                              <Calendar className="w-4 h-4 text-slate-400" />
                              My Service Requests
                            </Link>
                            <Link
                              href="/dashboard/customer?tab=favorites"
                              onClick={() => setIsUserDropdownOpen(false)}
                              className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-slate-700 hover:text-blue-600 hover:bg-slate-50 transition-colors"
                            >
                              <Heart className="w-4 h-4 text-slate-400" />
                              Saved Technicians
                            </Link>
                          </>
                        )}

                        {session.role === 'TECHNICIAN' && (
                          <>
                            <Link
                              href="/dashboard/technician?tab=requests"
                              onClick={() => setIsUserDropdownOpen(false)}
                              className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-slate-700 hover:text-teal-700 hover:bg-slate-50 transition-colors"
                            >
                              <Briefcase className="w-4 h-4 text-slate-400" />
                              Booking Requests
                            </Link>
                            <Link
                              href="/dashboard/technician?tab=profile"
                              onClick={() => setIsUserDropdownOpen(false)}
                              className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-slate-700 hover:text-teal-700 hover:bg-slate-50 transition-colors"
                            >
                              <User className="w-4 h-4 text-slate-400" />
                              Profile & Services
                            </Link>
                          </>
                        )}

                        {session.role === 'ADMIN' && (
                          <Link
                            href="/admin"
                            onClick={() => setIsUserDropdownOpen(false)}
                            className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-slate-700 hover:text-blue-600 hover:bg-slate-50 transition-colors"
                          >
                            <Shield className="w-4 h-4 text-slate-400" />
                            Admin Control Panel
                          </Link>
                        )}
                      </div>

                      <div className="py-1">
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                        >
                          <LogOut className="w-4 h-4" />
                          Sign Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link
                  href="/register/technician"
                  className="hidden xl:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-teal-800 bg-teal-50 hover:bg-teal-100/80 rounded-xl border border-teal-200/60 transition-colors"
                >
                  <Sparkles className="w-3.5 h-3.5" /> Become a Pro
                </Link>
                <Link
                  href="/login"
                  className="px-3.5 py-1.5 rounded-xl text-xs font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-100/70 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  className="px-4 py-1.5 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 shadow-xs transition-all active:scale-[0.98]"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            {session && <NotificationDropdown />}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 px-4 pt-3 pb-6 animate-fade-in space-y-4">
          <nav className="flex flex-col space-y-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`px-4 py-2.5 rounded-xl text-sm font-semibold ${
                    isActive ? 'bg-blue-50 text-blue-700' : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          <div className="pt-3 border-t border-slate-100">
            {session ? (
              <div className="space-y-2">
                <div className="px-4 py-2 bg-slate-50 rounded-xl">
                  <p className="text-xs font-bold text-slate-900">{session.name}</p>
                  <p className="text-[11px] text-slate-500">{session.email}</p>
                  <div className="mt-1">
                    <Badge size="sm" variant="primary">
                      {session.role}
                    </Badge>
                  </div>
                </div>
                <Link
                  href={getDashboardUrl()}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 rounded-xl"
                >
                  <LayoutDashboard className="w-4 h-4 text-blue-600" /> Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-rose-600 hover:bg-rose-50 rounded-xl"
                >
                  <LogOut className="w-4 h-4" /> Sign Out
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <Link
                  href="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 rounded-xl text-sm font-bold text-slate-700 bg-slate-100"
                >
                  Log In
                </Link>
                <Link
                  href="/register"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 rounded-xl text-sm font-bold text-white bg-blue-600"
                >
                  Register Customer
                </Link>
                <Link
                  href="/register/technician"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 rounded-xl text-sm font-bold text-teal-700 bg-teal-50 border border-teal-200"
                >
                  Join as a Technician
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
