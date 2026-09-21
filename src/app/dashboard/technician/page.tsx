'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  Star,
  Plus,
  Trash2,
  Edit,
  User,
  MapPin,
  Phone,
  ShieldCheck,
  AlertTriangle,
  MessageSquare,
  Wrench,
  DollarSign,
  Save,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { StarRating } from '@/components/ui/StarRating';
import { getTechnicianRequests, updateRequestStatus } from '@/lib/actions/requests';
import {
  updateTechnicianAvailability,
  updateTechnicianProfile,
  addTechnicianService,
  deleteTechnicianService,
  getMyTechnicianProfile,
} from '@/lib/actions/technicians';
import { replyToReview } from '@/lib/actions/reviews';
import { getUserNotifications } from '@/lib/actions/notifications';
import { Availability } from '@prisma/client';

export default function TechnicianDashboardPage() {
  const [activeTab, setActiveTab] = useState<'requests' | 'services' | 'profile' | 'reviews'>('requests');
  const [requests, setRequests] = useState<any[]>([]);
  const [profile, setProfile] = useState<any>(null);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [isLoading, setIsLoading] = useState(true);

  // Availability state
  const [availability, setAvailability] = useState<Availability>('AVAILABLE_TODAY');
  const [isUpdatingAvail, setIsUpdatingAvail] = useState(false);

  // New service form state
  const [isAddingService, setIsAddingService] = useState(false);
  const [newServiceTitle, setNewServiceTitle] = useState('');
  const [newServicePrice, setNewServicePrice] = useState('');
  const [newServiceDesc, setNewServiceDesc] = useState('');

  // Profile form state
  const [bio, setBio] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [skills, setSkills] = useState('');
  const [certifications, setCertifications] = useState('');
  const [startingPrice, setStartingPrice] = useState('');
  const [hourlyRate, setHourlyRate] = useState('');
  const [workingHours, setWorkingHours] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [profileMsg, setProfileMsg] = useState('');

  // Review reply state
  const [replyingReviewId, setReplyingReviewId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');

  const loadData = async () => {
    setIsLoading(true);
    const [reqRes, notifRes, profileRes] = await Promise.all([
      getTechnicianRequests(statusFilter),
      getUserNotifications(),
      getMyTechnicianProfile(),
    ]);

    if (reqRes.success && reqRes.data) {
      setRequests(reqRes.data);
    }
    if (notifRes.success && notifRes.data) {
      setNotifications(notifRes.data);
    }

    if (profileRes.success && profileRes.data) {
      const p = profileRes.data;
      setProfile(p);
      setAvailability(p.availability);
      setBio(p.bio || '');
      setBusinessName(p.businessName || '');
      setSkills(p.skills || '');
      setCertifications(p.certifications || '');
      setStartingPrice(String(p.startingPrice || '0'));
      setHourlyRate(String(p.hourlyRate || '0'));
      setWorkingHours(p.workingHours || '');
      setAddress(p.address || '');
    }

    setIsLoading(false);
  };

  useEffect(() => {
    loadData();
  }, [statusFilter]);

  const handleAvailabilityChange = async (newAvail: Availability) => {
    setIsUpdatingAvail(true);
    setAvailability(newAvail);
    const res = await updateTechnicianAvailability(newAvail);
    setIsUpdatingAvail(false);
    if (!res.success) {
      alert(res.error || 'Failed to update availability');
    }
  };

  const handleStatusUpdate = async (requestId: string, newStatus: any) => {
    let cancelReason = undefined;
    if (newStatus === 'REJECTED') {
      const promptReason = window.prompt('Please provide a reason for declining this request:');
      if (promptReason === null) return;
      cancelReason = promptReason;
    }

    const res = await updateRequestStatus(requestId, newStatus, cancelReason);
    if (res.success) {
      loadData();
    } else {
      alert(res.error || 'Failed to update status');
    }
  };

  const handleAddService = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newServiceTitle || !newServicePrice) return;

    const res = await addTechnicianService(
      newServiceTitle,
      Number(newServicePrice),
      newServiceDesc
    );

    if (res.success) {
      setNewServiceTitle('');
      setNewServicePrice('');
      setNewServiceDesc('');
      setIsAddingService(false);
      loadData();
    } else {
      alert(res.error || 'Failed to add service');
    }
  };

  const handleDeleteService = async (serviceId: string) => {
    if (window.confirm('Are you sure you want to remove this service?')) {
      const res = await deleteTechnicianService(serviceId);
      if (res.success) {
        loadData();
      }
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingProfile(true);
    setProfileMsg('');

    const res = await updateTechnicianProfile({
      bio,
      businessName,
      skills,
      certifications,
      startingPrice: Number(startingPrice),
      hourlyRate: hourlyRate ? Number(hourlyRate) : undefined,
      workingHours,
      address,
      phone,
    });

    setIsSavingProfile(false);
    if (res.success) {
      setProfileMsg('Profile saved successfully! ✨');
      setTimeout(() => setProfileMsg(''), 4000);
    } else {
      alert(res.error || 'Failed to save profile');
    }
  };

  const handleReplySubmit = async (reviewId: string) => {
    if (!replyText.trim()) return;
    const res = await replyToReview(reviewId, replyText);
    if (res.success) {
      setReplyingReviewId(null);
      setReplyText('');
      loadData();
    } else {
      alert(res.error || 'Failed to submit reply');
    }
  };

  const pendingRequests = requests.filter((r) => r.status === 'PENDING');
  const activeJobs = requests.filter((r) => r.status === 'ACCEPTED' || r.status === 'IN_PROGRESS');
  const completedJobs = requests.filter((r) => r.status === 'COMPLETED');

  return (
    <div className="min-h-screen bg-[#fafbfc] py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Verification Status Alert */}
        {profile?.verificationStatus === 'PENDING' && (
          <div className="p-5 rounded-3xl bg-amber-50/80 border border-amber-200/80 text-amber-900 flex items-start gap-3 shadow-card">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-sm">Account Awaiting Admin Approval</h4>
              <p className="text-xs text-amber-800 mt-0.5 leading-relaxed">
                Your profile has been submitted and is currently being verified by the Sajilo Khoj administration. You can configure your services and profile settings below while awaiting activation.
              </p>
            </div>
          </div>
        )}

        {profile?.verificationStatus === 'SUSPENDED' && (
          <div className="p-5 rounded-3xl bg-rose-50/80 border border-rose-200/80 text-rose-900 flex items-start gap-3 shadow-card">
            <XCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-sm">Account Suspended</h4>
              <p className="text-xs text-rose-800 mt-0.5">
                Your account is currently suspended. Please contact platform support at support@sajilokhoj.com.
              </p>
            </div>
          </div>
        )}

        {/* Dashboard Header Banner with Availability Toggle */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-card flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <span className="text-[11px] font-bold text-teal-700 uppercase tracking-wider">
              Technician Workspace
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-0.5">
              {profile?.businessName || 'Service Provider Dashboard'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Manage incoming repair orders, configure your pricing tariffs, and respond to clients.
            </p>
          </div>

          {/* Quick Availability Switcher */}
          <div className="flex items-center gap-3 bg-slate-50/80 p-2 rounded-2xl border border-slate-200/80">
            <span className="text-xs font-bold text-slate-600 uppercase tracking-wider pl-2">
              Status:
            </span>
            <select
              value={availability}
              disabled={isUpdatingAvail}
              onChange={(e) => handleAvailabilityChange(e.target.value as Availability)}
              className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500 cursor-pointer shadow-xs"
            >
              <option value="AVAILABLE_NOW">🟢 Available Now</option>
              <option value="AVAILABLE_TODAY">🔵 Available Today</option>
              <option value="AVAILABLE_THIS_WEEK">⚪ Available This Week</option>
              <option value="BUSY">🟠 Busy</option>
              <option value="OFF_DUTY">🔴 Off Duty</option>
            </select>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-card">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-600">Pending Orders</span>
              <Clock className="w-4 h-4 text-amber-500" />
            </div>
            <p className="text-2xl font-extrabold text-slate-900">{pendingRequests.length}</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-card">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-700">Active Jobs</span>
              <Wrench className="w-4 h-4 text-blue-600" />
            </div>
            <p className="text-2xl font-extrabold text-slate-900">{activeJobs.length}</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-card">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-teal-700">Completed</span>
              <CheckCircle className="w-4 h-4 text-teal-600" />
            </div>
            <p className="text-2xl font-extrabold text-slate-900">{completedJobs.length}</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-card">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Rating</span>
              <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
            </div>
            <p className="text-2xl font-extrabold text-slate-900">
              {profile?.rating ? profile.rating.toFixed(1) : '5.0'} ★
            </p>
          </div>
        </div>

        {/* Dashboard Navigation Tabs */}
        <div className="border-b border-slate-200 flex items-center gap-2 sm:gap-3 overflow-x-auto pb-1">
          <button
            onClick={() => setActiveTab('requests')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'requests'
                ? 'bg-teal-700 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white border border-transparent hover:border-slate-200/80'
            }`}
          >
            Service Bookings ({requests.length})
          </button>
          <button
            onClick={() => setActiveTab('services')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'services'
                ? 'bg-teal-700 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white border border-transparent hover:border-slate-200/80'
            }`}
          >
            Services & Rates
          </button>
          <button
            onClick={() => setActiveTab('profile')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'profile'
                ? 'bg-teal-700 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white border border-transparent hover:border-slate-200/80'
            }`}
          >
            Profile & Coverage
          </button>
          <button
            onClick={() => setActiveTab('reviews')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'reviews'
                ? 'bg-teal-700 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white border border-transparent hover:border-slate-200/80'
            }`}
          >
            Customer Reviews
          </button>
        </div>

        {/* TAB 1: SERVICE REQUESTS MANAGEMENT */}
        {activeTab === 'requests' && (
          <div className="space-y-6 animate-fade-in">
            {/* Filter Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2">
              {['ALL', 'PENDING', 'ACCEPTED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED', 'REJECTED'].map(
                (st) => (
                  <button
                    key={st}
                    onClick={() => setStatusFilter(st)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all cursor-pointer ${
                      statusFilter === st
                        ? 'bg-slate-900 text-white shadow-xs'
                        : 'bg-white border border-slate-200/80 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {st.replace('_', ' ')}
                  </button>
                )
              )}
            </div>

            {requests.length === 0 ? (
              <div className="bg-white rounded-3xl border border-slate-200/80 p-12 text-center max-w-md mx-auto shadow-card">
                <Calendar className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <h3 className="font-bold text-slate-900 text-base">No Bookings Found</h3>
                <p className="text-xs text-slate-500 mt-1">
                  You do not have any bookings matching this status.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {requests.map((req) => (
                  <div
                    key={req.id}
                    className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-card flex flex-col lg:flex-row lg:items-center justify-between gap-6"
                  >
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-base text-slate-900">
                          {req.customer.name}
                        </span>
                        <Badge
                          variant={
                            req.status === 'COMPLETED'
                              ? 'success'
                              : req.status === 'PENDING'
                              ? 'warning'
                              : req.status === 'IN_PROGRESS'
                              ? 'secondary'
                              : 'neutral'
                          }
                        >
                          {req.status}
                        </Badge>
                      </div>

                      <p className="text-sm font-bold text-teal-800">{req.serviceTitle}</p>
                      <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
                        {req.description}
                      </p>

                      <div className="flex items-center gap-4 flex-wrap text-xs text-slate-500 pt-1">
                        <span className="flex items-center gap-1 font-semibold text-slate-700">
                          <Calendar className="w-3.5 h-3.5 text-teal-600" />
                          {req.preferredDate} ({req.preferredTime})
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-rose-500" />
                          {req.address}
                        </span>
                        <span className="flex items-center gap-1 font-semibold text-blue-700">
                          <Phone className="w-3.5 h-3.5" />
                          {req.phone || req.customer.phone}
                        </span>
                      </div>
                    </div>

                    {/* Workflow Action Buttons */}
                    <div className="flex flex-wrap lg:flex-col items-end gap-2 border-t lg:border-t-0 pt-4 lg:pt-0 border-slate-100 shrink-0">
                      {req.status === 'PENDING' && (
                        <>
                          <Button
                            size="sm"
                            variant="success"
                            onClick={() => handleStatusUpdate(req.id, 'ACCEPTED')}
                          >
                            <CheckCircle className="w-4 h-4 mr-1" /> Accept Booking
                          </Button>
                          <Button
                            size="sm"
                            variant="danger"
                            onClick={() => handleStatusUpdate(req.id, 'REJECTED')}
                          >
                            <XCircle className="w-4 h-4 mr-1" /> Decline
                          </Button>
                        </>
                      )}

                      {req.status === 'ACCEPTED' && (
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => handleStatusUpdate(req.id, 'IN_PROGRESS')}
                        >
                          <Wrench className="w-4 h-4 mr-1" /> Start Work
                        </Button>
                      )}

                      {req.status === 'IN_PROGRESS' && (
                        <Button
                          size="sm"
                          variant="success"
                          onClick={() => handleStatusUpdate(req.id, 'COMPLETED')}
                        >
                          <CheckCircle className="w-4 h-4 mr-1" /> Mark Completed
                        </Button>
                      )}

                      {req.status === 'COMPLETED' && (
                        <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-200">
                          ✅ Job Finished
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: SERVICES & PRICING MENU */}
        {activeTab === 'services' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-card space-y-6 animate-fade-in">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Custom Services & Tariff</h2>
                <p className="text-xs text-slate-500">
                  Itemize your repair offerings so customers can select specific jobs when booking.
                </p>
              </div>
              <Button
                size="sm"
                variant="primary"
                onClick={() => setIsAddingService(!isAddingService)}
              >
                <Plus className="w-4 h-4 mr-1" /> Add Service
              </Button>
            </div>

            {/* Add Service Form */}
            {isAddingService && (
              <form
                onSubmit={handleAddService}
                className="bg-slate-50/80 p-5 sm:p-6 rounded-2xl border border-slate-200/80 space-y-4 animate-fade-in"
              >
                <h3 className="text-sm font-bold text-slate-900">New Service Item</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                      Service Title *
                    </label>
                    <input
                      type="text"
                      required
                      value={newServiceTitle}
                      onChange={(e) => setNewServiceTitle(e.target.value)}
                      placeholder="e.g. Bathroom Basin Mixer Fitting"
                      className="w-full px-3.5 py-2.5 bg-white rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                      Price (Rs.) *
                    </label>
                    <input
                      type="number"
                      required
                      min="0"
                      value={newServicePrice}
                      onChange={(e) => setNewServicePrice(e.target.value)}
                      placeholder="e.g. 800"
                      className="w-full px-3.5 py-2.5 bg-white rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Description (Optional)
                  </label>
                  <input
                    type="text"
                    value={newServiceDesc}
                    onChange={(e) => setNewServiceDesc(e.target.value)}
                    placeholder="Includes pipe alignment and silicon sealing..."
                    className="w-full px-3.5 py-2.5 bg-white rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                <div className="flex justify-end gap-2">
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => setIsAddingService(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" size="sm" variant="primary">
                    Save Service
                  </Button>
                </div>
              </form>
            )}

            {/* List Services */}
            {profile?.services && profile.services.length > 0 ? (
              <div className="divide-y divide-slate-100">
                {profile.services.map((srv: any) => (
                  <div key={srv.id} className="py-4 flex items-center justify-between gap-4">
                    <div>
                      <h4 className="font-bold text-sm text-slate-900">{srv.title}</h4>
                      {srv.description && (
                        <p className="text-xs text-slate-500 mt-0.5">{srv.description}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="font-extrabold text-slate-900 text-sm">
                        Rs. {srv.price.toLocaleString()}
                      </span>
                      <button
                        onClick={() => handleDeleteService(srv.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                        title="Delete service"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400 py-6 text-center">
                No individual services added yet. Click &ldquo;Add Service&rdquo; above to create your custom price menu.
              </p>
            )}
          </div>
        )}

        {/* TAB 3: PROFILE SETTINGS */}
        {activeTab === 'profile' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-card animate-fade-in">
            <h2 className="text-lg font-bold text-slate-900 mb-1">Technician Profile Settings</h2>
            <p className="text-xs text-slate-500 mb-6">
              Update your public biography, pricing, certifications, and service address.
            </p>

            {profileMsg && (
              <div className="p-3.5 mb-6 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                <span>{profileMsg}</span>
              </div>
            )}

            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Business / Display Name
                  </label>
                  <input
                    type="text"
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50/50 rounded-xl border border-slate-200 text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Contact Phone Number
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+977 98XXXXXXXX"
                    className="w-full px-3.5 py-2.5 bg-slate-50/50 rounded-xl border border-slate-200 text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Professional Bio & Experience
                </label>
                <textarea
                  rows={4}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full p-3.5 bg-slate-50/50 rounded-xl border border-slate-200 text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Skills (Comma separated)
                  </label>
                  <input
                    type="text"
                    value={skills}
                    onChange={(e) => setSkills(e.target.value)}
                    placeholder="Pipe Fitting, PPR Welding, Water Tank Setup"
                    className="w-full px-3.5 py-2.5 bg-slate-50/50 rounded-xl border border-slate-200 text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Certifications & Trade Licenses
                  </label>
                  <input
                    type="text"
                    value={certifications}
                    onChange={(e) => setCertifications(e.target.value)}
                    placeholder="CTEVT Level 2 Master Plumber"
                    className="w-full px-3.5 py-2.5 bg-slate-50/50 rounded-xl border border-slate-200 text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Starting Price (Rs.)
                  </label>
                  <input
                    type="number"
                    value={startingPrice}
                    onChange={(e) => setStartingPrice(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50/50 rounded-xl border border-slate-200 text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Hourly Tariff (Rs. / hr)
                  </label>
                  <input
                    type="number"
                    value={hourlyRate}
                    onChange={(e) => setHourlyRate(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50/50 rounded-xl border border-slate-200 text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Working Hours
                  </label>
                  <input
                    type="text"
                    value={workingHours}
                    onChange={(e) => setWorkingHours(e.target.value)}
                    placeholder="7:00 AM - 7:00 PM"
                    className="w-full px-3.5 py-2.5 bg-slate-50/50 rounded-xl border border-slate-200 text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Workshop / Base Address
                </label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Shankhamul Road, New Baneshwor, Ward 10"
                  className="w-full px-3.5 py-2.5 bg-slate-50/50 rounded-xl border border-slate-200 text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div className="pt-4 flex justify-end">
                <Button type="submit" variant="primary" isLoading={isSavingProfile}>
                  <Save className="w-4 h-4 mr-1.5" /> Save Changes
                </Button>
              </div>
            </form>
          </div>
        )}

        {/* TAB 4: REVIEWS & REPLIES */}
        {activeTab === 'reviews' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-card space-y-6 animate-fade-in">
            <h2 className="text-lg font-bold text-slate-900">Customer Feedback & Replies</h2>

            {profile?.reviews && profile.reviews.length > 0 ? (
              <div className="divide-y divide-slate-100 space-y-4">
                {profile.reviews.map((rev: any) => (
                  <div key={rev.id} className="pt-4 first:pt-0 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-slate-900">{rev.customer?.name}</span>
                        <div className="flex items-center text-amber-400 text-xs">
                          {'★'.repeat(rev.rating)}
                        </div>
                      </div>
                      <span className="text-[10px] text-slate-400">
                        {new Date(rev.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed">{rev.comment}</p>

                    {rev.technicianReply ? (
                      <div className="p-3.5 bg-teal-50/70 rounded-2xl border border-teal-100 text-xs text-teal-900">
                        <span className="font-bold block text-[11px]">Your Reply:</span>
                        <p className="mt-0.5">{rev.technicianReply}</p>
                      </div>
                    ) : replyingReviewId === rev.id ? (
                      <div className="space-y-2 pt-2">
                        <textarea
                          rows={2}
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                          placeholder="Write a polite response thanking the customer..."
                          className="w-full p-3 bg-slate-50/50 rounded-xl border border-slate-200 text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                        />
                        <div className="flex gap-2 justify-end">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setReplyingReviewId(null)}
                          >
                            Cancel
                          </Button>
                          <Button
                            size="sm"
                            variant="primary"
                            onClick={() => handleReplySubmit(rev.id)}
                          >
                            Post Reply
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <button
                        onClick={() => {
                          setReplyingReviewId(rev.id);
                          setReplyText('');
                        }}
                        className="text-xs font-bold text-teal-700 hover:text-teal-800 flex items-center gap-1.5 cursor-pointer"
                      >
                        <MessageSquare className="w-3.5 h-3.5" /> Reply to Review
                      </button>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400 py-8 text-center">No reviews received yet.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
