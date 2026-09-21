import React from 'react';
import Link from 'next/link';
import {
  Search,
  CheckCircle,
  Clock,
  ShieldCheck,
  Star,
  Award,
  DollarSign,
  ArrowRight,
  Briefcase,
  Users,
  Wrench,
  Sparkles,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen bg-[#fafbfc] py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="inline-block text-xs font-bold text-blue-600 uppercase tracking-wider bg-blue-50/90 px-3 py-1 rounded-full border border-blue-200/60">
            Step-by-Step Guide
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            How Sajilo Khoj Works
          </h1>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            Whether you need a quick household repair or want to offer your trade services as a technician, Sajilo Khoj makes the process seamless, transparent, and trustworthy.
          </p>
        </div>

        {/* Section 1: For Customers */}
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200/80 shadow-card space-y-10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
            <div>
              <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
                For Homeowners & Businesses
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight mt-1">
                Booking a Technician in 4 Simple Steps
              </h2>
            </div>
            <Link href="/technicians">
              <Button variant="primary" size="sm">
                Find Technicians Now <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-slate-50/70 p-6 rounded-2xl border border-slate-100 space-y-3 relative">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 border border-blue-200/60 font-bold text-sm flex items-center justify-center">
                1
              </div>
              <h3 className="font-bold text-sm sm:text-base text-slate-900">Search by Trade & City</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Filter plumbers, electricians, or mechanics by location (e.g. Baneshwor, Pokhara), budget, or availability.
              </p>
            </div>

            <div className="bg-slate-50/70 p-6 rounded-2xl border border-slate-100 space-y-3 relative">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 border border-blue-200/60 font-bold text-sm flex items-center justify-center">
                2
              </div>
              <h3 className="font-bold text-sm sm:text-base text-slate-900">Compare Verified Profiles</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                View verified CTEVT licenses, customer ratings, starting prices, working hours, and reviews from past customers.
              </p>
            </div>

            <div className="bg-slate-50/70 p-6 rounded-2xl border border-slate-100 space-y-3 relative">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 border border-blue-200/60 font-bold text-sm flex items-center justify-center">
                3
              </div>
              <h3 className="font-bold text-sm sm:text-base text-slate-900">Submit Booking Slot</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Choose your preferred date, time slot, and describe the issue. No advance deposit or credit card needed!
              </p>
            </div>

            <div className="bg-slate-50/70 p-6 rounded-2xl border border-slate-100 space-y-3 relative">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 border border-blue-200/60 font-bold text-sm flex items-center justify-center">
                4
              </div>
              <h3 className="font-bold text-sm sm:text-base text-slate-900">Doorstep Fix & Review</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                The pro arrives, fixes the problem cleanly, and you pay directly in cash or eSewa/Khalti. Leave a review afterwards!
              </p>
            </div>
          </div>
        </div>

        {/* Section 2: For Technicians */}
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200/80 shadow-card space-y-10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
            <div>
              <span className="text-xs font-bold text-teal-700 uppercase tracking-wider">
                For Technicians & Service Providers
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight mt-1">
                Growing Your Trade Business with Sajilo Khoj
              </h2>
            </div>
            <Link href="/register/technician">
              <Button size="sm" className="bg-teal-700 hover:bg-teal-800 text-white font-bold">
                Join as a Pro <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-slate-50/70 p-6 rounded-2xl border border-slate-100 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-800 border border-teal-200/60 font-bold text-sm flex items-center justify-center">
                1
              </div>
              <h3 className="font-bold text-sm sm:text-base text-slate-900">Register Profile</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Create your account, select your trade category, add skills, certifications, and service area coverage.
              </p>
            </div>

            <div className="bg-slate-50/70 p-6 rounded-2xl border border-slate-100 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-800 border border-teal-200/60 font-bold text-sm flex items-center justify-center">
                2
              </div>
              <h3 className="font-bold text-sm sm:text-base text-slate-900">Admin Verification</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Our verification team checks your phone, ID, and CTEVT certificate. Once approved, your profile becomes publicly searchable.
              </p>
            </div>

            <div className="bg-slate-50/70 p-6 rounded-2xl border border-slate-100 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-800 border border-teal-200/60 font-bold text-sm flex items-center justify-center">
                3
              </div>
              <h3 className="font-bold text-sm sm:text-base text-slate-900">Receive Direct Bookings</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Get instant notifications on your dashboard when customers book services in your area. Accept or decline easily.
              </p>
            </div>

            <div className="bg-slate-50/70 p-6 rounded-2xl border border-slate-100 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-800 border border-teal-200/60 font-bold text-sm flex items-center justify-center">
                4
              </div>
              <h3 className="font-bold text-sm sm:text-base text-slate-900">Earn & Build Reputation</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Keep 100% of your earnings, collect verified 5-star reviews, and earn the Featured Pro badge to get more high-paying jobs.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
