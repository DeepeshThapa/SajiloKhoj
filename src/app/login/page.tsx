'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Wrench, Mail, Lock, ArrowRight, Shield, User, Briefcase, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { loginUser } from '@/lib/actions/auth';

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectParam = searchParams.get('redirect');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    const res = await loginUser({ email, password });
    setIsLoading(false);

    if (res.success && res.redirectUrl) {
      router.push(redirectParam || res.redirectUrl);
      router.refresh();
    } else {
      setError(res.error || 'Failed to login. Please try again.');
    }
  };

  const handleDemoFill = (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setError('');
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo & Heading */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2.5 mb-3 group">
            <div className="w-10 h-10 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-xs group-hover:scale-105 transition-transform">
              <Wrench className="w-5 h-5" />
            </div>
            <span className="text-2xl font-black tracking-tight text-slate-900">
              Sajilo<span className="text-blue-600">Khoj</span>
            </span>
          </Link>
          <h1 className="text-2xl font-bold text-slate-900">Welcome Back</h1>
          <p className="text-slate-500 text-sm mt-1">
            Sign in to manage your bookings, profile, or service requests
          </p>
        </div>

        {/* Demo Quick-Fill Pill Bar */}
        <div className="mb-6 bg-slate-50/80 border border-slate-200/80 rounded-2xl p-3.5">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2.5 text-center">
            ⚡ Quick Demo Accounts
          </p>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => handleDemoFill('ram.shrestha@example.com', 'customer123')}
              className="flex flex-col items-center p-2 rounded-xl bg-white border border-slate-200/80 text-slate-700 hover:border-blue-500 hover:text-blue-600 hover:bg-blue-50/50 transition-all text-xs font-medium cursor-pointer shadow-xs"
            >
              <User className="w-4 h-4 text-blue-500 mb-1" />
              <span>Customer</span>
            </button>
            <button
              type="button"
              onClick={() => handleDemoFill('hari.plumber@example.com', 'tech123')}
              className="flex flex-col items-center p-2 rounded-xl bg-white border border-slate-200/80 text-slate-700 hover:border-teal-500 hover:text-teal-600 hover:bg-teal-50/50 transition-all text-xs font-medium cursor-pointer shadow-xs"
            >
              <Briefcase className="w-4 h-4 text-teal-600 mb-1" />
              <span>Technician</span>
            </button>
            <button
              type="button"
              onClick={() => handleDemoFill('admin@sajilokhoj.com', 'admin123')}
              className="flex flex-col items-center p-2 rounded-xl bg-white border border-slate-200/80 text-slate-700 hover:border-purple-500 hover:text-purple-600 hover:bg-purple-50/50 transition-all text-xs font-medium cursor-pointer shadow-xs"
            >
              <Shield className="w-4 h-4 text-purple-600 mb-1" />
              <span>Admin</span>
            </button>
          </div>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-3xl shadow-card border border-slate-200/80 p-6 sm:p-8">
          {error && (
            <div className="mb-5 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200/80 bg-slate-50/50 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200/80 bg-slate-50/50 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                />
              </div>
            </div>

            <Button type="submit" isLoading={isLoading} className="w-full mt-2">
              Sign In <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t border-slate-100 text-center space-y-3">
            <p className="text-xs text-slate-500">
              Don&apos;t have an account?{' '}
              <Link href="/register" className="font-bold text-blue-600 hover:text-blue-700 hover:underline">
                Create Customer Account
              </Link>
            </p>
            <div>
              <Link
                href="/register/technician"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-teal-800 bg-teal-50/80 hover:bg-teal-100/80 px-3.5 py-2 rounded-xl border border-teal-200/70 transition-colors"
              >
                <Briefcase className="w-3.5 h-3.5 text-teal-700" /> Join as a Technician
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
