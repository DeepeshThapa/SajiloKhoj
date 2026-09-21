'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Wrench,
  User,
  Mail,
  Lock,
  Phone,
  Briefcase,
  MapPin,
  DollarSign,
  Camera,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  AlertCircle,
  Clock,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { registerTechnician } from '@/lib/actions/auth';

const CATEGORIES = [
  { id: 'plumbing', name: 'Plumbing', icon: '🔧', slug: 'plumbing' },
  { id: 'electrical', name: 'Electrical', icon: '⚡', slug: 'electrical' },
  { id: 'ac-repair', name: 'AC & HVAC', icon: '❄️', slug: 'ac-repair' },
  { id: 'appliance-repair', name: 'Appliance Repair', icon: '📺', slug: 'appliance-repair' },
  { id: 'carpentry', name: 'Carpentry', icon: '🪚', slug: 'carpentry' },
  { id: 'painting', name: 'Painting', icon: '🎨', slug: 'painting' },
  { id: 'cleaning', name: 'Cleaning & Sanitation', icon: '✨', slug: 'cleaning' },
  { id: 'handyman', name: 'Handyman Services', icon: '🛠️', slug: 'handyman' },
];

const PROVINCES = [
  'Bagmati Province',
  'Gandaki Province',
  'Koshi Province',
  'Lumbini Province',
  'Madhesh Province',
  'Karnali Province',
  'Sudurpashchim Province',
];

const DISTRICTS_BY_PROVINCE: Record<string, string[]> = {
  'Bagmati Province': ['Kathmandu', 'Lalitpur', 'Bhaktapur', 'Chitwan', 'Kavrepalanchok', 'Makwanpur'],
  'Gandaki Province': ['Kaski (Pokhara)', 'Tanahun', 'Syangja', 'Gorkha', 'Nawalpur'],
  'Koshi Province': ['Morang (Biratnagar)', 'Sunsari (Dharan)', 'Jhapa'],
  'Lumbini Province': ['Rupandehi (Butwal)', 'Dang', 'Banke (Nepalgunj)'],
  'Madhesh Province': ['Parsa (Birgunj)', 'Dhanusha (Janakpur)'],
  'Karnali Province': ['Surkhet'],
  'Sudurpashchim Province': ['Kailali (Dhangadhi)', 'Kanchanpur'],
};

export default function TechnicianRegistrationPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const [formData, setFormData] = useState({
    // Step 1: Account
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',

    // Step 2: Professional
    categoryId: 'plumbing',
    categoryName: 'Plumbing',
    businessName: '',
    experienceYears: 5,
    bio: '',
    skills: '',
    certifications: '',

    // Step 3: Location
    province: 'Bagmati Province',
    district: 'Kathmandu',
    city: 'Kathmandu',
    municipality: 'Kathmandu Metropolitan',
    locality: '',
    address: '',

    // Step 4: Pricing
    startingPrice: 500,
    hourlyRate: 600,

    // Step 5: Profile
    profileImage: 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=400&auto=format&fit=crop&q=80',
    coverImage: 'https://images.unsplash.com/photo-1581094288338-2314dddb7ece?w=1200&auto=format&fit=crop&q=80',
    workingHours: '8:00 AM - 7:00 PM (Everyday)',
  });

  const nextStep = () => {
    setError('');
    if (step === 1) {
      if (!formData.name || !formData.email || !formData.phone || !formData.password) {
        setError('Please fill in all required account fields.');
        return;
      }
      if (formData.password.length < 6) {
        setError('Password must be at least 6 characters.');
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match.');
        return;
      }
    } else if (step === 2) {
      if (!formData.categoryId || !formData.bio || formData.bio.length < 20 || !formData.skills) {
        setError('Please provide a bio of at least 20 characters and list your skills.');
        return;
      }
    } else if (step === 3) {
      if (!formData.province || !formData.district || !formData.city || !formData.locality || !formData.address) {
        setError('Please provide your complete service location and address.');
        return;
      }
    } else if (step === 4) {
      if (!formData.startingPrice || formData.startingPrice < 50) {
        setError('Starting price must be at least Rs. 50.');
        return;
      }
    }
    setStep((prev) => Math.min(prev + 1, 6));
  };

  const prevStep = () => {
    setError('');
    setStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    setError('');
    setIsLoading(true);

    const res = await registerTechnician(formData);
    setIsLoading(false);

    if (res.success) {
      setSuccessMsg(res.message || 'Registration submitted successfully. Your profile is awaiting admin approval.');
      setTimeout(() => {
        router.push(res.redirectUrl || '/dashboard/technician');
        router.refresh();
      }, 2000);
    } else {
      setError(res.error || 'Failed to submit registration. Please check your information.');
    }
  };

  const stepsList = [
    { num: 1, label: 'Account' },
    { num: 2, label: 'Profession' },
    { num: 3, label: 'Location' },
    { num: 4, label: 'Pricing' },
    { num: 5, label: 'Profile' },
    { num: 6, label: 'Review' },
  ];

  return (
    <div className="min-h-screen py-10 px-4 bg-[#fafbfc]">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-2">
            <div className="w-9 h-9 rounded-2xl bg-teal-600 flex items-center justify-center text-white shadow-xs">
              <Briefcase className="w-5 h-5" />
            </div>
            <span className="text-2xl font-black tracking-tight text-slate-900">
              Sajilo<span className="text-teal-700">Khoj</span> <span className="text-xs bg-teal-50 text-teal-800 border border-teal-200/60 px-2 py-0.5 rounded-full font-bold ml-1">PRO</span>
            </span>
          </Link>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Technician Registration</h1>
          <p className="text-slate-500 text-sm mt-1">
            Join Nepal&apos;s fastest growing verified home service technician network
          </p>
        </div>

        {/* Multi-step progress bar */}
        <div className="bg-white rounded-3xl p-4 sm:p-5 shadow-card border border-slate-200/80 mb-6">
          <div className="flex items-center justify-between relative">
            <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-1 bg-slate-100 -z-0" />
            <div
              className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-teal-600 transition-all duration-300 -z-0"
              style={{ width: `${((step - 1) / (stepsList.length - 1)) * 100}%` }}
            />
            {stepsList.map((s) => {
              const isCompleted = step > s.num;
              const isCurrent = step === s.num;
              return (
                <div key={s.num} className="flex flex-col items-center relative z-10">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                      isCompleted
                        ? 'bg-teal-700 text-white shadow-xs'
                        : isCurrent
                        ? 'bg-teal-700 text-white ring-4 ring-teal-100/80'
                        : 'bg-white text-slate-400 border border-slate-200'
                    }`}
                  >
                    {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : s.num}
                  </div>
                  <span
                    className={`text-[11px] mt-1.5 font-medium hidden sm:block ${
                      isCurrent ? 'text-teal-800 font-bold' : isCompleted ? 'text-slate-700' : 'text-slate-400'
                    }`}
                  >
                    {s.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Wizard Form Body */}
        <div className="bg-white rounded-3xl shadow-card border border-slate-200/80 p-6 sm:p-8">
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2.5 animate-fade-in">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{error}</span>
            </div>
          )}

          {successMsg && (
            <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm flex items-center gap-2.5 animate-fade-in">
              <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-600" />
              <div>
                <p className="font-semibold">{successMsg}</p>
                <p className="text-xs text-emerald-700 mt-0.5">Redirecting to your technician dashboard...</p>
              </div>
            </div>
          )}

          {/* STEP 1: Account */}
          {step === 1 && (
            <div className="space-y-4 animate-fade-in">
              <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
                <User className="w-5 h-5 text-teal-600" /> Step 1: Personal & Login Credentials
              </h2>
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Full Legal Name *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Hari Bahadur Thapa"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 text-sm focus:bg-white focus:ring-2 focus:ring-teal-500 outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    placeholder="hari.plumber@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 text-sm focus:bg-white focus:ring-2 focus:ring-teal-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Mobile Phone (+977) *
                  </label>
                  <input
                    type="tel"
                    placeholder="+977-9841555111"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 text-sm focus:bg-white focus:ring-2 focus:ring-teal-500 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Create Password *
                  </label>
                  <input
                    type="password"
                    placeholder="Min 6 characters"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 text-sm focus:bg-white focus:ring-2 focus:ring-teal-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Confirm Password *
                  </label>
                  <input
                    type="password"
                    placeholder="Confirm password"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 text-sm focus:bg-white focus:ring-2 focus:ring-teal-500 outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Professional Information */}
          {step === 2 && (
            <div className="space-y-4 animate-fade-in">
              <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-teal-600" /> Step 2: Professional Background
              </h2>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                  Select Primary Service Category *
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {CATEGORIES.map((cat) => {
                    const isSelected = formData.categoryId === cat.slug;
                    return (
                      <button
                        type="button"
                        key={cat.slug}
                        onClick={() => setFormData({ ...formData, categoryId: cat.slug, categoryName: cat.name })}
                        className={`p-3 rounded-xl border text-left flex flex-col items-center text-center gap-1.5 transition-all cursor-pointer ${
                          isSelected
                            ? 'border-teal-600 bg-teal-50/80 text-teal-900 ring-2 ring-teal-500/20 shadow-xs'
                            : 'border-slate-200 hover:border-slate-300 bg-white text-slate-700'
                        }`}
                      >
                        <span className="text-xl">{cat.icon}</span>
                        <span className="text-xs font-semibold">{cat.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Business / Trade Name (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Thapa Plumbing & Sanitary Works"
                    value={formData.businessName}
                    onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 text-sm focus:bg-white focus:ring-2 focus:ring-teal-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Years of Experience *
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="50"
                    value={formData.experienceYears}
                    onChange={(e) => setFormData({ ...formData, experienceYears: parseInt(e.target.value) || 0 })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 text-sm focus:bg-white focus:ring-2 focus:ring-teal-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Skills & Specializations (Comma Separated) *
                </label>
                <input
                  type="text"
                  placeholder="e.g. PPR Pipe Welding, Leak Detection, Commode Fitting, Water Tank Pump"
                  value={formData.skills}
                  onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 text-sm focus:bg-white focus:ring-2 focus:ring-teal-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Bio / Professional Description *
                </label>
                <textarea
                  rows={3}
                  placeholder="Tell customers about your craftsmanship, reliability, and past experience..."
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 text-sm focus:bg-white focus:ring-2 focus:ring-teal-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Certifications / Training (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. CTEVT Level 2 Master Plumber Certified"
                  value={formData.certifications}
                  onChange={(e) => setFormData({ ...formData, certifications: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 text-sm focus:bg-white focus:ring-2 focus:ring-teal-500 outline-none"
                />
              </div>
            </div>
          )}

          {/* STEP 3: Service Area in Nepal */}
          {step === 3 && (
            <div className="space-y-4 animate-fade-in">
              <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-teal-600" /> Step 3: Service Coverage Area in Nepal
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Province *
                  </label>
                  <select
                    value={formData.province}
                    onChange={(e) => {
                      const newProv = e.target.value;
                      const dists = DISTRICTS_BY_PROVINCE[newProv] || [];
                      setFormData({
                        ...formData,
                        province: newProv,
                        district: dists[0] || '',
                      });
                    }}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 text-sm focus:bg-white focus:ring-2 focus:ring-teal-500 outline-none"
                  >
                    {PROVINCES.map((p) => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    District *
                  </label>
                  <select
                    value={formData.district}
                    onChange={(e) => setFormData({ ...formData, district: e.target.value, city: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 text-sm focus:bg-white focus:ring-2 focus:ring-teal-500 outline-none"
                  >
                    {(DISTRICTS_BY_PROVINCE[formData.province] || ['Kathmandu']).map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    City / Municipality *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Kathmandu Metropolitan"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value, municipality: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 text-sm focus:bg-white focus:ring-2 focus:ring-teal-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Locality / Tole / Area *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. New Baneshwor, Shankhamul"
                    value={formData.locality}
                    onChange={(e) => setFormData({ ...formData, locality: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 text-sm focus:bg-white focus:ring-2 focus:ring-teal-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Full Street Address & Landmark *
                </label>
                <input
                  type="text"
                  placeholder="e.g. House No. 45, Near Civil Bank, Shankhamul Road"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 text-sm focus:bg-white focus:ring-2 focus:ring-teal-500 outline-none"
                />
              </div>
            </div>
          )}

          {/* STEP 4: Pricing */}
          {step === 4 && (
            <div className="space-y-4 animate-fade-in">
              <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-teal-600" /> Step 4: Service Rates & Pricing (NPR)
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Starting Inspection / Basic Service Rate (Rs.) *
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-400">
                      Rs.
                    </span>
                    <input
                      type="number"
                      min="50"
                      step="50"
                      value={formData.startingPrice}
                      onChange={(e) => setFormData({ ...formData, startingPrice: parseFloat(e.target.value) || 0 })}
                      className="w-full pl-12 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 text-sm font-semibold focus:bg-white focus:ring-2 focus:ring-teal-500 outline-none"
                    />
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">This is the minimum price displayed on your search card.</p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Estimated Hourly Rate (Rs. / hr)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-400">
                      Rs.
                    </span>
                    <input
                      type="number"
                      min="0"
                      step="50"
                      value={formData.hourlyRate}
                      onChange={(e) => setFormData({ ...formData, hourlyRate: parseFloat(e.target.value) || 0 })}
                      className="w-full pl-12 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 text-sm font-semibold focus:bg-white focus:ring-2 focus:ring-teal-500 outline-none"
                    />
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">For extended tasks billed per hour.</p>
                </div>
              </div>
            </div>
          )}

          {/* STEP 5: Profile & Availability */}
          {step === 5 && (
            <div className="space-y-4 animate-fade-in">
              <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
                <Camera className="w-5 h-5 text-teal-600" /> Step 5: Profile Photo & Working Hours
              </h2>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Profile Photo URL
                </label>
                <input
                  type="text"
                  placeholder="https://..."
                  value={formData.profileImage}
                  onChange={(e) => setFormData({ ...formData, profileImage: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 text-sm focus:bg-white focus:ring-2 focus:ring-teal-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Working Hours & Availability Schedule
                </label>
                <div className="relative">
                  <Clock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="e.g. 7:00 AM - 7:30 PM (Sun - Fri)"
                    value={formData.workingHours}
                    onChange={(e) => setFormData({ ...formData, workingHours: e.target.value })}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 text-sm focus:bg-white focus:ring-2 focus:ring-teal-500 outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 6: Review Summary */}
          {step === 6 && (
            <div className="space-y-5 animate-fade-in">
              <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-teal-600" /> Step 6: Review Your Technician Application
              </h2>

              <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200/80 space-y-4">
                <div className="flex items-center gap-4">
                  <img
                    src={formData.profileImage}
                    alt={formData.name}
                    className="w-16 h-16 rounded-xl object-cover border-2 border-white shadow-sm"
                  />
                  <div>
                    <h3 className="text-base font-bold text-slate-900">{formData.name}</h3>
                    <p className="text-xs font-medium text-teal-700">{formData.businessName || formData.categoryName}</p>
                    <Badge variant="primary" size="sm" className="mt-1">
                      {formData.categoryName} • {formData.experienceYears} Years Exp.
                    </Badge>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-3 border-t border-slate-200">
                  <div>
                    <span className="text-slate-500 font-medium">Contact:</span>
                    <p className="font-semibold text-slate-800">{formData.phone} | {formData.email}</p>
                  </div>
                  <div>
                    <span className="text-slate-500 font-medium">Location:</span>
                    <p className="font-semibold text-slate-800">
                      {formData.locality}, {formData.city}, {formData.province}
                    </p>
                  </div>
                  <div>
                    <span className="text-slate-500 font-medium">Starting Rate:</span>
                    <p className="font-bold text-emerald-700 text-sm">Rs. {formData.startingPrice}</p>
                  </div>
                  <div>
                    <span className="text-slate-500 font-medium">Working Hours:</span>
                    <p className="font-semibold text-slate-800">{formData.workingHours}</p>
                  </div>
                </div>

                <div className="text-xs pt-2 border-t border-slate-200">
                  <span className="text-slate-500 font-medium">Skills:</span>
                  <p className="font-medium text-slate-700 mt-0.5">{formData.skills}</p>
                </div>
              </div>

              <div className="bg-teal-50 border border-teal-200/80 rounded-xl p-4 text-xs text-teal-900">
                <p className="font-semibold">Notice on Profile Approval:</p>
                <p className="mt-0.5 text-teal-800">
                  Upon submission, your application status will be marked as <strong>PENDING</strong>. An admin will verify your details before your profile appears in public search listings.
                </p>
              </div>
            </div>
          )}

          {/* Buttons Navigation */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-slate-100">
            {step > 1 ? (
              <Button type="button" variant="outline" onClick={prevStep} disabled={isLoading}>
                <ArrowLeft className="w-4 h-4" /> Back
              </Button>
            ) : (
              <Link href="/login" className="text-xs font-semibold text-slate-500 hover:text-slate-800">
                Already registered? Sign in
              </Link>
            )}

            {step < 6 ? (
              <Button type="button" variant="secondary" onClick={nextStep}>
                Continue <ArrowRight className="w-4 h-4" />
              </Button>
            ) : (
              <Button
                type="button"
                variant="secondary"
                isLoading={isLoading}
                onClick={handleSubmit}
                className="bg-teal-700 hover:bg-teal-800 text-white font-bold"
              >
                Submit Application <Sparkles className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
