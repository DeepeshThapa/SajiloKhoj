'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import {
  Calendar,
  Clock,
  Heart,
  User,
  Bell,
  CheckCircle,
  XCircle,
  AlertCircle,
  Star,
  MapPin,
  Phone,
  ArrowRight,
  Sparkles,
  RotateCcw,
  Wrench,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { StarRating } from '@/components/ui/StarRating';
import { getCustomerRequests, updateRequestStatus } from '@/lib/actions/requests';
import { getCustomerFavorites, toggleFavorite } from '@/lib/actions/favorites';
import { getUserNotifications } from '@/lib/actions/notifications';
import { ReviewModal } from '@/components/technician/ReviewModal';
import { RequestServiceModal } from '@/components/technician/RequestServiceModal';

export default function CustomerDashboardPage() {
  const searchParams = useSearchParams();
  const initialTab = searchParams.get('tab') || 'requests';

  const [activeTab, setActiveTab] = useState<'requests' | 'favorites' | 'notifications'>(
    (initialTab as any) || 'requests'
  );

  const [statusFilter, setStatusFilter] = useState('ALL');
  const [requests, setRequests] = useState<any[]>([]);
  const [favorites, setFavorites] = useState<any[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Modal states
  const [reviewRequest, setReviewRequest] = useState<any>(null);
  const [rebookTech, setRebookTech] = useState<any>(null);

  const loadData = async () => {
    setIsLoading(true);
    const [reqRes, favRes, notifRes] = await Promise.all([
      getCustomerRequests(statusFilter),
      getCustomerFavorites(),
      getUserNotifications(),
    ]);

    if (reqRes.success && reqRes.data) setRequests(reqRes.data);
    if (favRes.success && favRes.data) setFavorites(favRes.data);
    if (notifRes.success && notifRes.data) setNotifications(notifRes.data);
    setIsLoading(false);
  };

  useEffect(() => {
    loadData();
  }, [statusFilter]);

  const handleCancelRequest = async (requestId: string) => {
    const reason = window.prompt('Please enter cancellation reason:');
    if (reason !== null) {
      const res = await updateRequestStatus(requestId, 'CANCELLED' as any, reason);
      if (res.success) {
        loadData();
      } else {
        alert(res.error || 'Failed to cancel request');
      }
    }
  };

  const handleRemoveFavorite = async (techId: string) => {
    await toggleFavorite(techId);
    setFavorites((prev) => prev.filter((f) => f.technicianProfileId !== techId));
  };

  const activeCount = requests.filter(
    (r) => r.status === 'PENDING' || r.status === 'ACCEPTED' || r.status === 'IN_PROGRESS'
  ).length;
  const completedCount = requests.filter((r) => r.status === 'COMPLETED').length;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDING':
        return <Badge variant="warning">Pending Confirmation</Badge>;
      case 'ACCEPTED':
        return <Badge variant="info">Accepted & Confirmed</Badge>;
      case 'IN_PROGRESS':
        return <Badge variant="secondary">In Progress 🔧</Badge>;
      case 'COMPLETED':
        return <Badge variant="success">Completed ✅</Badge>;
      case 'CANCELLED':
      case 'REJECTED':
        return <Badge variant="danger">{status}</Badge>;
      default:
        return <Badge variant="neutral">{status}</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-[#fafbfc] py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header Banner */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-card flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <span className="text-[11px] font-bold text-blue-600 uppercase tracking-wider">
              Customer Portal
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-0.5">
              My Dashboard & Bookings
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Track active service dispatches, view job history, and manage saved pros.
            </p>
          </div>

          <Link href="/technicians">
            <Button variant="primary" size="md">
              <Wrench className="w-4 h-4 mr-2" /> Book a New Technician
            </Button>
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-card">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Active Bookings</span>
              <Clock className="w-4 h-4 text-blue-600" />
            </div>
            <p className="text-2xl font-extrabold text-slate-900">{activeCount}</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-card">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Completed Jobs</span>
              <CheckCircle className="w-4 h-4 text-emerald-600" />
            </div>
            <p className="text-2xl font-extrabold text-slate-900">{completedCount}</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-card">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Saved Pros</span>
              <Heart className="w-4 h-4 text-rose-500" />
            </div>
            <p className="text-2xl font-extrabold text-slate-900">{favorites.length}</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-card">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Notifications</span>
              <Bell className="w-4 h-4 text-amber-500" />
            </div>
            <p className="text-2xl font-extrabold text-slate-900">{notifications.length}</p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="border-b border-slate-200 flex items-center gap-2 sm:gap-4 overflow-x-auto pb-1">
          <button
            onClick={() => setActiveTab('requests')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'requests'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white border border-transparent hover:border-slate-200/80'
            }`}
          >
            My Service Requests ({requests.length})
          </button>
          <button
            onClick={() => setActiveTab('favorites')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'favorites'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white border border-transparent hover:border-slate-200/80'
            }`}
          >
            Saved Technicians ({favorites.length})
          </button>
          <button
            onClick={() => setActiveTab('notifications')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'notifications'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white border border-transparent hover:border-slate-200/80'
            }`}
          >
            Notifications ({notifications.length})
          </button>
        </div>

        {/* Tab 1: Service Requests */}
        {activeTab === 'requests' && (
          <div className="space-y-6 animate-fade-in">
            {/* Status Filter Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2">
              {['ALL', 'PENDING', 'ACCEPTED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'].map((st) => (
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
              ))}
            </div>

            {isLoading ? (
              <div className="text-center py-16 text-slate-400 text-sm">Loading bookings...</div>
            ) : requests.length === 0 ? (
              <div className="bg-white rounded-3xl border border-slate-200/80 p-12 text-center max-w-md mx-auto shadow-card">
                <Calendar className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <h3 className="font-bold text-slate-900 text-base">No Service Requests Found</h3>
                <p className="text-xs text-slate-500 mt-1 mb-6">
                  You haven&apos;t booked any services matching this filter status yet.
                </p>
                <Link href="/technicians">
                  <Button variant="primary" size="sm">
                    Discover Technicians
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {requests.map((req) => {
                  const tech = req.technicianProfile;
                  const avatar =
                    tech?.profileImage ||
                    tech?.user?.avatar ||
                    'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=120&auto=format&fit=crop&q=80';

                  return (
                    <div
                      key={req.id}
                      className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-card flex flex-col md:flex-row md:items-center justify-between gap-6"
                    >
                      {/* Left: Tech info & booking meta */}
                      <div className="flex items-start gap-4 flex-1">
                        <div className="w-16 h-16 rounded-2xl overflow-hidden bg-slate-100 relative shrink-0 border border-slate-200/60">
                          <Image src={avatar} alt={tech?.user?.name || 'Technician'} fill className="object-cover" />
                        </div>

                        <div className="space-y-1.5 flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="font-bold text-base text-slate-900 truncate">
                              {tech?.user?.name}
                            </h3>
                            <span className="text-xs text-slate-400 font-medium">
                              ({tech?.category?.name})
                            </span>
                            {getStatusBadge(req.status)}
                          </div>

                          <p className="text-sm font-bold text-blue-700">{req.serviceTitle}</p>
                          <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                            {req.description}
                          </p>

                          <div className="flex items-center gap-4 flex-wrap text-xs text-slate-500 pt-1">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3.5 h-3.5 text-blue-500" />
                              {req.preferredDate} ({req.preferredTime})
                            </span>
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3.5 h-3.5 text-rose-500" />
                              {req.address}
                            </span>
                            {tech?.user?.phone && (
                              <span className="flex items-center gap-1 font-semibold text-slate-700">
                                <Phone className="w-3.5 h-3.5 text-emerald-600" />
                                {tech.user.phone}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Right: Actions */}
                      <div className="flex flex-col sm:flex-row md:flex-col items-end justify-center gap-2 shrink-0 border-t md:border-t-0 pt-4 md:pt-0 border-slate-100">
                        {req.status === 'PENDING' && (
                          <Button
                            size="sm"
                            variant="danger"
                            onClick={() => handleCancelRequest(req.id)}
                          >
                            Cancel Request
                          </Button>
                        )}

                        {req.status === 'COMPLETED' && !req.review && (
                          <Button
                            size="sm"
                            variant="primary"
                            onClick={() => setReviewRequest(req)}
                          >
                            <Star className="w-3.5 h-3.5 mr-1" /> Leave Review
                          </Button>
                        )}

                        {req.status === 'COMPLETED' && req.review && (
                          <div className="text-right">
                            <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                              ⭐ Rated {req.review.rating}/5
                            </span>
                          </div>
                        )}

                        <Link href={`/technicians/${tech?.id}`}>
                          <Button size="sm" variant="outline">
                            View Pro Profile
                          </Button>
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Saved Technicians */}
        {activeTab === 'favorites' && (
          <div className="animate-fade-in">
            {favorites.length === 0 ? (
              <div className="bg-white rounded-3xl border border-slate-200/80 p-12 text-center max-w-md mx-auto shadow-card">
                <Heart className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <h3 className="font-bold text-slate-900 text-base">No Saved Technicians</h3>
                <p className="text-xs text-slate-500 mt-1 mb-6">
                  Save your favorite technicians by clicking the heart icon on their profiles for quick re-booking!
                </p>
                <Link href="/technicians">
                  <Button variant="primary" size="sm">
                    Browse Technicians
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {favorites.map((fav) => {
                  const tech = fav.technicianProfile;
                  if (!tech) return null;
                  const avatar =
                    tech.profileImage ||
                    tech.user?.avatar ||
                    'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=120&auto=format&fit=crop&q=80';

                  return (
                    <div
                      key={fav.id}
                      className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-card flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-start justify-between gap-3 mb-4">
                          <div className="flex items-center gap-3">
                            <div className="w-14 h-14 rounded-2xl overflow-hidden bg-slate-100 relative shrink-0 border border-slate-200/60">
                              <Image src={avatar} alt={tech.user?.name} fill className="object-cover" />
                            </div>
                            <div>
                              <h3 className="font-bold text-sm text-slate-900">{tech.user?.name}</h3>
                              <span className="text-xs text-slate-500">{tech.category?.name}</span>
                              <div className="mt-1">
                                <StarRating rating={tech.rating} reviewCount={tech.reviewCount} size="sm" />
                              </div>
                            </div>
                          </div>

                          <button
                            onClick={() => handleRemoveFavorite(tech.id)}
                            className="text-rose-500 p-1.5 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                            title="Remove favorite"
                          >
                            <Heart className="w-4 h-4 fill-rose-500" />
                          </button>
                        </div>

                        <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-4">
                          {tech.bio}
                        </p>

                        <div className="text-xs text-slate-500 space-y-1 mb-4">
                          <div className="flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5 text-slate-400" />
                            <span>{tech.city}, Nepal</span>
                          </div>
                          <div className="flex items-center justify-between font-bold text-slate-900">
                            <span>Starts at:</span>
                            <span>Rs. {tech.startingPrice}</span>
                          </div>
                        </div>
                      </div>

                      <div className="pt-4 border-t border-slate-100 flex items-center gap-2">
                        <Button
                          variant="primary"
                          size="sm"
                          className="flex-1"
                          onClick={() => setRebookTech(tech)}
                        >
                          Book Service
                        </Button>
                        <Link href={`/technicians/${tech.id}`} className="flex-1">
                          <Button variant="outline" size="sm" className="w-full">
                            Profile
                          </Button>
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Notifications */}
        {activeTab === 'notifications' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-card animate-fade-in">
            <h2 className="text-lg font-bold text-slate-900 mb-4">Notification History</h2>
            {notifications.length === 0 ? (
              <p className="text-xs text-slate-400 py-12 text-center">No notifications yet.</p>
            ) : (
              <div className="divide-y divide-slate-100">
                {notifications.map((n) => (
                  <div key={n.id} className="py-4 first:pt-0 last:pb-0 flex items-start justify-between gap-4">
                    <div>
                      <h4 className="font-bold text-xs text-slate-900">{n.title}</h4>
                      <p className="text-xs text-slate-600 mt-0.5">{n.message}</p>
                      <span className="text-[10px] text-slate-400 block mt-1">
                        {new Date(n.createdAt).toLocaleString()}
                      </span>
                    </div>
                    {n.link && (
                      <Link href={n.link} className="shrink-0">
                        <Button size="sm" variant="outline">
                          View
                        </Button>
                      </Link>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Review Modal */}
      {reviewRequest && (
        <ReviewModal
          isOpen={!!reviewRequest}
          onClose={() => setReviewRequest(null)}
          serviceRequest={reviewRequest}
          onSuccess={() => {
            loadData();
            setReviewRequest(null);
          }}
        />
      )}

      {/* Re-book Modal */}
      {rebookTech && (
        <RequestServiceModal
          isOpen={!!rebookTech}
          onClose={() => setRebookTech(null)}
          technician={rebookTech}
        />
      )}
    </div>
  );
}
