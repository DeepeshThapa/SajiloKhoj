import React from 'react';
import Link from 'next/link';
import { Wrench, Phone, Mail, MapPin, ShieldCheck, Clock, Award, Heart } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-white border-t border-slate-200/80 pt-16 pb-12 text-slate-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Trust Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pb-12 border-b border-slate-100">
          <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-slate-50/70 border border-slate-100">
            <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200/60 text-blue-600 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-slate-900 font-bold text-sm tracking-tight">Verified Technicians</h4>
              <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                Background-checked, CTEVT certified, and rated by genuine Nepali homeowners.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-slate-50/70 border border-slate-100">
            <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-200/60 text-teal-700 flex items-center justify-center shrink-0">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-slate-900 font-bold text-sm tracking-tight">Upfront Pricing</h4>
              <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                Clear starting rates and itemized service tariffs before any repair job begins.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-slate-50/70 border border-slate-100">
            <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200/60 text-amber-700 flex items-center justify-center shrink-0">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-slate-900 font-bold text-sm tracking-tight">Prompt Doorstep Service</h4>
              <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                Fast response for emergency pipe leaks, wiring issues, and appliance fixes.
              </p>
            </div>
          </div>
        </div>

        {/* Main Footer Links */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 py-12">
          {/* Brand Col */}
          <div className="col-span-2 space-y-4">
            <Link href="/" className="inline-flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-xs">
                <Wrench className="w-4 h-4" />
              </div>
              <span className="text-xl font-bold tracking-tight text-slate-900">
                Sajilo<span className="text-blue-600">Khoj</span>
              </span>
            </Link>
            <p className="text-xs text-slate-500 max-w-sm leading-relaxed">
              Sajilo Khoj connects homeowners and businesses in Nepal with background-verified trade specialists for plumbing, electrical wiring, AC servicing, carpentry, and home maintenance.
            </p>
            <div className="space-y-2 text-xs text-slate-500 pt-1">
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                <span>+977-1-4567890 / 9800000001</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                <span>support@sajilokhoj.com</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                <span>New Baneshwor, Kathmandu, Nepal</span>
              </div>
            </div>
          </div>

          {/* Popular Services */}
          <div>
            <h5 className="text-slate-900 font-bold text-xs uppercase tracking-wider mb-4">Services</h5>
            <ul className="space-y-2.5 text-xs text-slate-500">
              <li>
                <Link href="/technicians?category=plumbing" className="hover:text-blue-600 transition-colors">
                  Plumbing Repair
                </Link>
              </li>
              <li>
                <Link href="/technicians?category=electrical" className="hover:text-blue-600 transition-colors">
                  Electrician & DB Wiring
                </Link>
              </li>
              <li>
                <Link href="/technicians?category=ac-repair" className="hover:text-blue-600 transition-colors">
                  AC Servicing & Gas Refill
                </Link>
              </li>
              <li>
                <Link href="/technicians?category=appliance-repair" className="hover:text-blue-600 transition-colors">
                  Appliance Repair
                </Link>
              </li>
              <li>
                <Link href="/technicians?category=carpentry" className="hover:text-blue-600 transition-colors">
                  Carpentry Work
                </Link>
              </li>
              <li>
                <Link href="/technicians?category=painting" className="hover:text-blue-600 transition-colors">
                  Painting & Waterproofing
                </Link>
              </li>
              <li>
                <Link href="/technicians?category=cleaning" className="hover:text-blue-600 transition-colors">
                  Deep Home Cleaning
                </Link>
              </li>
            </ul>
          </div>

          {/* Locations */}
          <div>
            <h5 className="text-slate-900 font-bold text-xs uppercase tracking-wider mb-4">Top Cities</h5>
            <ul className="space-y-2.5 text-xs text-slate-500">
              <li>
                <Link href="/technicians?location=Kathmandu" className="hover:text-blue-600 transition-colors">
                  Kathmandu
                </Link>
              </li>
              <li>
                <Link href="/technicians?location=Lalitpur" className="hover:text-blue-600 transition-colors">
                  Lalitpur & Patan
                </Link>
              </li>
              <li>
                <Link href="/technicians?location=Bhaktapur" className="hover:text-blue-600 transition-colors">
                  Bhaktapur
                </Link>
              </li>
              <li>
                <Link href="/technicians?location=Pokhara" className="hover:text-blue-600 transition-colors">
                  Pokhara
                </Link>
              </li>
              <li>
                <Link href="/technicians?location=Chitwan" className="hover:text-blue-600 transition-colors">
                  Chitwan
                </Link>
              </li>
              <li>
                <Link href="/technicians?location=Baneshwor" className="hover:text-blue-600 transition-colors">
                  New Baneshwor
                </Link>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h5 className="text-slate-900 font-bold text-xs uppercase tracking-wider mb-4">Platform</h5>
            <ul className="space-y-2.5 text-xs text-slate-500">
              <li>
                <Link href="/technicians" className="hover:text-blue-600 transition-colors">
                  Find Technicians
                </Link>
              </li>
              <li>
                <Link href="/services" className="hover:text-blue-600 transition-colors">
                  All Services Directory
                </Link>
              </li>
              <li>
                <Link href="/how-it-works" className="hover:text-blue-600 transition-colors">
                  How It Works
                </Link>
              </li>
              <li>
                <Link href="/register/technician" className="text-teal-700 font-semibold hover:underline">
                  Join as Technician
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-blue-600 transition-colors">
                  Sign In
                </Link>
              </li>
              <li>
                <Link href="/admin" className="hover:text-blue-600 transition-colors">
                  Admin Portal
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>© {new Date().getFullYear()} Sajilo Khoj Technologies Pvt. Ltd. All rights reserved.</p>
          <div className="flex items-center gap-1.5">
            <span>Built with care</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 inline" />
            <span>for Nepal Home Services</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
