import React from 'react';
import Link from 'next/link';
import { Wrench, Phone, Mail, MapPin, ShieldCheck, Clock, Award, Heart } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Trust Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-12 border-b border-slate-800">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-white font-bold text-base">Verified Technicians</h4>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Background-checked, CTEVT certified, and rated by genuine Nepali homeowners.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-teal-500/10 border border-teal-500/20 text-teal-400 flex items-center justify-center shrink-0">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-white font-bold text-base">Upfront Honest Pricing</h4>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Clear starting rates and itemized service tariffs before any repair job begins.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-white font-bold text-base">Fast Doorstep Arrival</h4>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Prompt dispatch for emergency pipe leaks, power outages, and appliance breakdowns.
              </p>
            </div>
          </div>
        </div>

        {/* Main Footer Links */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 py-12">
          {/* Brand Col */}
          <div className="col-span-2">
            <Link href="/" className="inline-flex items-center gap-2.5 mb-4">
              <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
                <Wrench className="w-5 h-5" />
              </div>
              <span className="text-2xl font-black tracking-tight text-white">
                Sajilo<span className="text-blue-500">Khoj</span>
              </span>
            </Link>
            <p className="text-xs text-slate-400 max-w-sm leading-relaxed mb-6">
              Sajilo Khoj is Nepal&apos;s trusted technician marketplace connecting homeowners and businesses with verified electricians, plumbers, HVAC experts, carpenters, and appliance mechanics.
            </p>
            <div className="space-y-2.5 text-xs text-slate-400">
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-blue-400 shrink-0" />
                <span>Helpline: +977-1-4567890 / 9800000001</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-blue-400 shrink-0" />
                <span>support@sajilokhoj.com</span>
              </div>
              <div className="flex items-center gap-2.5">
                <MapPin className="w-4 h-4 text-blue-400 shrink-0" />
                <span>New Baneshwor, Kathmandu, Nepal</span>
              </div>
            </div>
          </div>

          {/* Popular Services */}
          <div>
            <h5 className="text-white font-bold text-sm tracking-wider uppercase mb-4">Popular Services</h5>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <Link href="/technicians?category=plumbing" className="hover:text-white transition-colors">
                  Plumbing & Pipe Repair
                </Link>
              </li>
              <li>
                <Link href="/technicians?category=electrical" className="hover:text-white transition-colors">
                  Electrician & DB Wiring
                </Link>
              </li>
              <li>
                <Link href="/technicians?category=ac-repair" className="hover:text-white transition-colors">
                  AC Servicing & Gas Refill
                </Link>
              </li>
              <li>
                <Link href="/technicians?category=appliance-repair" className="hover:text-white transition-colors">
                  Washing Machine & Fridge
                </Link>
              </li>
              <li>
                <Link href="/technicians?category=carpentry" className="hover:text-white transition-colors">
                  Carpentry & Modular Kitchen
                </Link>
              </li>
              <li>
                <Link href="/technicians?category=painting" className="hover:text-white transition-colors">
                  Painting & Waterproofing
                </Link>
              </li>
              <li>
                <Link href="/technicians?category=cleaning" className="hover:text-white transition-colors">
                  Deep Home Cleaning
                </Link>
              </li>
            </ul>
          </div>

          {/* Locations */}
          <div>
            <h5 className="text-white font-bold text-sm tracking-wider uppercase mb-4">Top Cities</h5>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <Link href="/technicians?location=Kathmandu" className="hover:text-white transition-colors">
                  Kathmandu Metropolitan
                </Link>
              </li>
              <li>
                <Link href="/technicians?location=Lalitpur" className="hover:text-white transition-colors">
                  Lalitpur & Patan
                </Link>
              </li>
              <li>
                <Link href="/technicians?location=Bhaktapur" className="hover:text-white transition-colors">
                  Bhaktapur Municipality
                </Link>
              </li>
              <li>
                <Link href="/technicians?location=Pokhara" className="hover:text-white transition-colors">
                  Pokhara & Lakeside
                </Link>
              </li>
              <li>
                <Link href="/technicians?location=Chitwan" className="hover:text-white transition-colors">
                  Chitwan & Bharatpur
                </Link>
              </li>
              <li>
                <Link href="/technicians?location=Baneshwor" className="hover:text-white transition-colors">
                  New Baneshwor Local Area
                </Link>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h5 className="text-white font-bold text-sm tracking-wider uppercase mb-4">Explore</h5>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <Link href="/technicians" className="hover:text-white transition-colors">
                  Find Technicians
                </Link>
              </li>
              <li>
                <Link href="/services" className="hover:text-white transition-colors">
                  Browse All Services
                </Link>
              </li>
              <li>
                <Link href="/how-it-works" className="hover:text-white transition-colors">
                  How Sajilo Khoj Works
                </Link>
              </li>
              <li>
                <Link href="/register/technician" className="text-teal-400 font-bold hover:underline">
                  Join as a Service Provider
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-white transition-colors">
                  Customer & Tech Login
                </Link>
              </li>
              <li>
                <Link href="/admin" className="hover:text-white transition-colors">
                  Admin Portal
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 mt-4 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} Sajilo Khoj Technologies Pvt. Ltd. All rights reserved.</p>
          <div className="flex items-center gap-1">
            <span>Built with</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 inline" />
            <span>for Nepal Home Services</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
