'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Shield,
  Users,
  Briefcase,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Clock,
  Star,
  Settings,
  Activity,
  Plus,
  Trash2,
  Eye,
  Filter,
  Search,
  Wrench,
  Sparkles,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Award,
  ExternalLink,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import {
  getAdminStats,
  getAdminTechnicians,
  updateTechnicianVerification,
  toggleTechnicianFeatured,
  getAdminUsers,
  updateUserStatus,
  deleteUser,
  getAdminCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  getAdminRequests,
  getAdminReviews,
  deleteReview,
  getAdminLogs,
  getSiteSettings,
  updateSiteSetting,
} from '@/lib/actions/admin';
import { VerificationStatus, UserStatus, Role } from '@prisma/client';

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState<
    'overview' | 'technicians' | 'users' | 'categories' | 'requests' | 'reviews' | 'logs' | 'settings'
  >('overview');

  const [stats, setStats] = useState<any>(null);
  const [technicians, setTechnicians] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [requests, setRequests] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [logs, setLogs] = useState<any[]>([]);
  const [siteSettings, setSiteSettings] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(true);

  // Filters & Search
  const [techFilter, setTechFilter] = useState('ALL');
  const [techSearch, setTechSearch] = useState('');
  const [userRoleFilter, setUserRoleFilter] = useState('ALL');
  const [userSearch, setUserSearch] = useState('');

  // Selected tech for review modal
  const [selectedTech, setSelectedTech] = useState<any>(null);

  // New Category Modal
  const [isNewCatModalOpen, setIsNewCatModalOpen] = useState(false);
  const [newCatName, setNewCatName] = useState('');
  const [newCatSlug, setNewCatSlug] = useState('');
  const [newCatIcon, setNewCatIcon] = useState('Wrench');
  const [newCatDesc, setNewCatDesc] = useState('');

  const loadData = async () => {
    setIsLoading(true);
    const [
      statsRes,
      techsRes,
      usersRes,
      catsRes,
      reqsRes,
      revsRes,
      logsRes,
      settingsRes,
    ] = await Promise.all([
      getAdminStats(),
      getAdminTechnicians(techFilter, techSearch),
      getAdminUsers(userRoleFilter, userSearch),
      getAdminCategories(),
      getAdminRequests(),
      getAdminReviews(),
      getAdminLogs(),
      getSiteSettings(),
    ]);

    if (statsRes.success) setStats(statsRes.data);
    if (techsRes.success) setTechnicians(techsRes.data);
    if (usersRes.success) setUsers(usersRes.data);
    if (catsRes.success) setCategories(catsRes.data);
    if (reqsRes.success) setRequests(reqsRes.data);
    if (revsRes.success) setReviews(revsRes.data);
    if (logsRes.success) setLogs(logsRes.data);
    if (settingsRes.success) setSiteSettings(settingsRes.data);
    setIsLoading(false);
  };

  useEffect(() => {
    loadData();
  }, [techFilter, userRoleFilter]);

  // Actions
  const handleVerifyTech = async (techId: string, status: VerificationStatus) => {
    let reason = undefined;
    if (status === 'REJECTED' || status === 'SUSPENDED') {
      const promptReason = window.prompt(`Please provide a reason for setting status to ${status}:`);
      if (promptReason === null) return;
      reason = promptReason;
    }

    const res = await updateTechnicianVerification(techId, status, reason);
    if (res.success) {
      if (selectedTech?.id === techId) setSelectedTech(null);
      loadData();
    } else {
      alert(res.error || 'Action failed');
    }
  };

  const handleToggleFeatured = async (techId: string, current: boolean) => {
    const res = await toggleTechnicianFeatured(techId, !current);
    if (res.success) {
      loadData();
    }
  };

  const handleUpdateUserStatus = async (userId: string, newStatus: UserStatus) => {
    const res = await updateUserStatus(userId, newStatus);
    if (res.success) {
      loadData();
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (window.confirm('Are you sure you want to permanently delete this user?')) {
      const res = await deleteUser(userId);
      if (res.success) {
        loadData();
      } else {
        alert(res.error || 'Failed to delete user');
      }
    }
  };

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await createCategory({
      name: newCatName,
      slug: newCatSlug || newCatName.toLowerCase().replace(/\s+/g, '-'),
      icon: newCatIcon,
      description: newCatDesc,
    });

    if (res.success) {
      setIsNewCatModalOpen(false);
      setNewCatName('');
      setNewCatSlug('');
      setNewCatDesc('');
      loadData();
    } else {
      alert(res.error || 'Failed to create category');
    }
  };

  const handleDeleteCategory = async (catId: string) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      const res = await deleteCategory(catId);
      if (res.success) {
        loadData();
      } else {
        alert(res.error || 'Failed to delete category');
      }
    }
  };

  const handleDeleteReview = async (reviewId: string) => {
    if (window.confirm('Are you sure you want to delete this review? The technician rating will be recalculated.')) {
      const res = await deleteReview(reviewId);
      if (res.success) {
        loadData();
      }
    }
  };

  const handleToggleRequireApproval = async () => {
    const current = siteSettings['require_approval'] === 'true';
    const nextVal = current ? 'false' : 'true';
    await updateSiteSetting('require_approval', nextVal);
    setSiteSettings((prev) => ({ ...prev, require_approval: nextVal }));
  };

  return (
    <div className="min-h-screen bg-[#fafbfc] text-slate-800 py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Admin Header Banner */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-card flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-13 h-13 rounded-2xl bg-purple-50 border border-purple-200/70 text-purple-700 flex items-center justify-center font-bold text-xl shadow-xs shrink-0">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-purple-700 uppercase tracking-wider">
                System Administration
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-0.5">
                Sajilo Khoj Control Center
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Supervise verified technician registrations, track booking metrics, and moderate marketplace content.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/" target="_blank">
              <Button size="sm" variant="outline">
                <ExternalLink className="w-4 h-4 mr-1.5" /> View Live Site
              </Button>
            </Link>
          </div>
        </div>

        {/* Global Metric Cards */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-card">
              <div className="flex items-center justify-between text-slate-400 mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Total Users</span>
                <Users className="w-4 h-4 text-blue-600" />
              </div>
              <p className="text-2xl sm:text-3xl font-extrabold text-slate-900">{stats.totalUsers}</p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-card">
              <div className="flex items-center justify-between text-slate-400 mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-600">Pending Approvals</span>
                <Clock className="w-4 h-4 text-amber-500" />
              </div>
              <p className="text-2xl sm:text-3xl font-extrabold text-amber-600">
                {stats.pendingTechnicians}
              </p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-card">
              <div className="flex items-center justify-between text-slate-400 mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-teal-700">Approved Pros</span>
                <Briefcase className="w-4 h-4 text-teal-600" />
              </div>
              <p className="text-2xl sm:text-3xl font-extrabold text-teal-800">
                {stats.approvedTechnicians}
              </p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-card">
              <div className="flex items-center justify-between text-slate-400 mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-blue-700">Completed Jobs</span>
                <CheckCircle className="w-4 h-4 text-blue-600" />
              </div>
              <p className="text-2xl sm:text-3xl font-extrabold text-blue-700">
                {stats.completedRequests}
              </p>
            </div>
          </div>
        )}

        {/* Admin Navigation Tabs */}
        <div className="border-b border-slate-200 flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-1">
          {[
            { id: 'overview', label: 'Overview', icon: Activity },
            { id: 'technicians', label: `Technicians (${stats?.pendingTechnicians ? `⚡${stats.pendingTechnicians}` : technicians.length})`, icon: Briefcase },
            { id: 'users', label: `Users (${users.length})`, icon: Users },
            { id: 'categories', label: `Categories (${categories.length})`, icon: Wrench },
            { id: 'requests', label: `Bookings (${requests.length})`, icon: Calendar },
            { id: 'reviews', label: `Reviews (${reviews.length})`, icon: Star },
            { id: 'logs', label: 'Audit Logs', icon: Clock },
            { id: 'settings', label: 'Settings', icon: Settings },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white border border-transparent hover:border-slate-200/80'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* 1. OVERVIEW TAB */}
        {activeTab === 'overview' && (
          <div className="space-y-8 animate-fade-in">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Pending Approvals Quick Box */}
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-card space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                    <Clock className="w-5 h-5 text-amber-500" /> Pending Applications
                  </h3>
                  <Badge variant="warning">{stats?.pendingTechnicians || 0} Pending</Badge>
                </div>

                <div className="divide-y divide-slate-100">
                  {technicians
                    .filter((t) => t.verificationStatus === 'PENDING')
                    .slice(0, 4)
                    .map((tech) => (
                      <div key={tech.id} className="py-3.5 flex items-center justify-between gap-4">
                        <div>
                          <p className="font-bold text-sm text-slate-900">{tech.user.name}</p>
                          <p className="text-xs text-slate-500">{tech.category?.name} • {tech.city}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-xs"
                            onClick={() => setSelectedTech(tech)}
                          >
                            Inspect
                          </Button>
                          <Button
                            size="sm"
                            variant="success"
                            onClick={() => handleVerifyTech(tech.id, 'APPROVED')}
                          >
                            Approve
                          </Button>
                        </div>
                      </div>
                    ))}
                  {technicians.filter((t) => t.verificationStatus === 'PENDING').length === 0 && (
                    <p className="text-xs text-slate-500 py-8 text-center">
                      All technician applications have been reviewed! ✅
                    </p>
                  )}
                </div>
              </div>

              {/* Recent Platform Activity */}
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-card space-y-4">
                <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                  <Activity className="w-5 h-5 text-purple-600" /> System Activity Logs
                </h3>

                <div className="divide-y divide-slate-100 max-h-80 overflow-y-auto pr-1">
                  {logs.slice(0, 6).map((l) => (
                    <div key={l.id} className="py-2.5 space-y-0.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-purple-800">{l.action}</span>
                        <span className="text-[10px] text-slate-400">
                          {new Date(l.createdAt).toLocaleTimeString()}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600">{l.details}</p>
                    </div>
                  ))}
                  {logs.length === 0 && (
                    <p className="text-xs text-slate-400 py-8 text-center">No logs recorded yet.</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 2. TECHNICIANS & APPROVALS TAB */}
        {activeTab === 'technicians' && (
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-card space-y-6 animate-fade-in">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Technician Verification & Management</h2>
                <p className="text-xs text-slate-500">
                  Approve, reject, suspend or feature technicians across Nepal.
                </p>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                {['ALL', 'PENDING', 'APPROVED', 'SUSPENDED', 'REJECTED'].map((st) => (
                  <button
                    key={st}
                    onClick={() => setTechFilter(st)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      techFilter === st
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'bg-slate-50 border border-slate-200/80 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            {/* Technicians Table */}
            <div className="overflow-x-auto rounded-2xl border border-slate-200/70">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-50 text-slate-500 uppercase font-semibold text-[10px] tracking-wider border-b border-slate-200/70">
                  <tr>
                    <th className="p-3.5">Technician</th>
                    <th className="p-3.5">Trade & City</th>
                    <th className="p-3.5">Experience</th>
                    <th className="p-3.5">Starting Rate</th>
                    <th className="p-3.5">Status</th>
                    <th className="p-3.5">Featured</th>
                    <th className="p-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {technicians.map((t) => (
                    <tr key={t.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="p-3.5 font-bold text-slate-900 flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-slate-100 overflow-hidden relative shrink-0">
                          <Image
                            src={
                              t.profileImage ||
                              t.user.avatar ||
                              'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=100&auto=format&fit=crop&q=80'
                            }
                            alt={t.user.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <span>{t.user.name}</span>
                          <span className="block text-[10px] text-slate-400 font-normal">
                            {t.user.email}
                          </span>
                        </div>
                      </td>
                      <td className="p-3.5">
                        <span className="text-teal-800 font-semibold">{t.category?.name}</span>
                        <span className="block text-[10px] text-slate-400">{t.city}</span>
                      </td>
                      <td className="p-3.5 font-medium">{t.experienceYears} yrs</td>
                      <td className="p-3.5 font-bold text-slate-900">Rs. {t.startingPrice}</td>
                      <td className="p-3.5">
                        <Badge
                          variant={
                            t.verificationStatus === 'APPROVED'
                              ? 'success'
                              : t.verificationStatus === 'PENDING'
                              ? 'warning'
                              : 'danger'
                          }
                          size="sm"
                        >
                          {t.verificationStatus}
                        </Badge>
                      </td>
                      <td className="p-3.5">
                        <button
                          onClick={() => handleToggleFeatured(t.id, t.isFeatured)}
                          className={`p-1.5 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer ${
                            t.isFeatured ? 'text-amber-500' : 'text-slate-300 hover:text-slate-500'
                          }`}
                          title="Toggle homepage featured"
                        >
                          <Star className={`w-4 h-4 ${t.isFeatured ? 'fill-amber-400' : ''}`} />
                        </button>
                      </td>
                      <td className="p-3.5 text-right space-x-1.5 whitespace-nowrap">
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-[11px]"
                          onClick={() => setSelectedTech(t)}
                        >
                          Details
                        </Button>
                        {t.verificationStatus === 'PENDING' && (
                          <Button
                            size="sm"
                            variant="success"
                            className="text-[11px]"
                            onClick={() => handleVerifyTech(t.id, 'APPROVED')}
                          >
                            Approve
                          </Button>
                        )}
                        {t.verificationStatus === 'APPROVED' && (
                          <Button
                            size="sm"
                            variant="danger"
                            className="text-[11px]"
                            onClick={() => handleVerifyTech(t.id, 'SUSPENDED')}
                          >
                            Suspend
                          </Button>
                        )}
                        {t.verificationStatus === 'SUSPENDED' && (
                          <Button
                            size="sm"
                            variant="success"
                            className="text-[11px]"
                            onClick={() => handleVerifyTech(t.id, 'APPROVED')}
                          >
                            Reactivate
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 3. USERS MANAGEMENT TAB */}
        {activeTab === 'users' && (
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-card space-y-6 animate-fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Platform Users Directory</h2>
                <p className="text-xs text-slate-500">View and manage customer and technician accounts.</p>
              </div>

              <div className="flex items-center gap-2">
                {['ALL', 'CUSTOMER', 'TECHNICIAN', 'ADMIN'].map((r) => (
                  <button
                    key={r}
                    onClick={() => setUserRoleFilter(r)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      userRoleFilter === r
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'bg-slate-50 border border-slate-200/80 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-slate-200/70">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-50 text-slate-500 uppercase font-semibold text-[10px] tracking-wider border-b border-slate-200/70">
                  <tr>
                    <th className="p-3.5">Name</th>
                    <th className="p-3.5">Email</th>
                    <th className="p-3.5">Phone</th>
                    <th className="p-3.5">Role</th>
                    <th className="p-3.5">Status</th>
                    <th className="p-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {users.map((u) => (
                    <tr key={u.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="p-3.5 font-bold text-slate-900">{u.name}</td>
                      <td className="p-3.5 text-slate-600">{u.email}</td>
                      <td className="p-3.5 text-slate-600">{u.phone || '—'}</td>
                      <td className="p-3.5">
                        <Badge
                          variant={
                            u.role === 'ADMIN'
                              ? 'danger'
                              : u.role === 'TECHNICIAN'
                              ? 'secondary'
                              : 'primary'
                          }
                          size="sm"
                        >
                          {u.role}
                        </Badge>
                      </td>
                      <td className="p-3.5">
                        <Badge variant={u.status === 'ACTIVE' ? 'success' : 'danger'} size="sm">
                          {u.status}
                        </Badge>
                      </td>
                      <td className="p-3.5 text-right space-x-2">
                        {u.status === 'ACTIVE' ? (
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-xs"
                            onClick={() => handleUpdateUserStatus(u.id, 'SUSPENDED')}
                          >
                            Suspend
                          </Button>
                        ) : (
                          <Button
                            size="sm"
                            variant="success"
                            className="text-xs"
                            onClick={() => handleUpdateUserStatus(u.id, 'ACTIVE')}
                          >
                            Activate
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="danger"
                          className="text-xs"
                          onClick={() => handleDeleteUser(u.id)}
                        >
                          Delete
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 4. CATEGORIES TAB */}
        {activeTab === 'categories' && (
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-card space-y-6 animate-fade-in">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Trade Categories</h2>
                <p className="text-xs text-slate-500">Manage all services displayed across the platform.</p>
              </div>
              <Button size="sm" variant="primary" onClick={() => setIsNewCatModalOpen(true)}>
                <Plus className="w-4 h-4 mr-1" /> Add Category
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {categories.map((c) => (
                <div
                  key={c.id}
                  className="bg-slate-50/70 p-5 rounded-2xl border border-slate-200/80 space-y-3 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-base text-slate-900">{c.name}</h3>
                      <Badge variant="primary" size="sm">
                        {c._count?.technicians || 0} Pros
                      </Badge>
                    </div>
                    <span className="text-xs text-blue-600 font-mono">/{c.slug}</span>
                    <p className="text-xs text-slate-500 mt-2 line-clamp-2">{c.description}</p>
                  </div>

                  <div className="pt-3 border-t border-slate-200/60 flex justify-end">
                    <Button
                      size="sm"
                      variant="danger"
                      className="text-xs"
                      onClick={() => handleDeleteCategory(c.id)}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 5. BOOKINGS SUPERVISION TAB */}
        {activeTab === 'requests' && (
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-card space-y-6 animate-fade-in">
            <h2 className="text-lg font-bold text-slate-900">All Platform Service Bookings</h2>
            <div className="overflow-x-auto rounded-2xl border border-slate-200/70">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-50 text-slate-500 uppercase font-semibold text-[10px] tracking-wider border-b border-slate-200/70">
                  <tr>
                    <th className="p-3.5">Customer</th>
                    <th className="p-3.5">Technician</th>
                    <th className="p-3.5">Service Requested</th>
                    <th className="p-3.5">Date & Time</th>
                    <th className="p-3.5">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {requests.map((r) => (
                    <tr key={r.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="p-3.5 font-bold text-slate-900">{r.customer?.name}</td>
                      <td className="p-3.5 font-semibold text-teal-800">
                        {r.technicianProfile?.user?.name}
                      </td>
                      <td className="p-3.5 text-slate-600">{r.serviceTitle}</td>
                      <td className="p-3.5 text-slate-500">{r.preferredDate} ({r.preferredTime})</td>
                      <td className="p-3.5">
                        <Badge
                          variant={
                            r.status === 'COMPLETED'
                              ? 'success'
                              : r.status === 'PENDING'
                              ? 'warning'
                              : 'neutral'
                          }
                          size="sm"
                        >
                          {r.status}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 6. REVIEWS MODERATION TAB */}
        {activeTab === 'reviews' && (
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-card space-y-6 animate-fade-in">
            <h2 className="text-lg font-bold text-slate-900">Reviews Moderation</h2>
            <div className="divide-y divide-slate-100">
              {reviews.map((rev) => (
                <div key={rev.id} className="py-4 first:pt-0 flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-slate-900">{rev.customer?.name}</span>
                      <span className="text-xs text-slate-400">reviewed</span>
                      <span className="font-bold text-sm text-teal-800">
                        {rev.technicianProfile?.user?.name}
                      </span>
                      <span className="text-amber-400 text-xs">{'★'.repeat(rev.rating)}</span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed italic">
                      &ldquo;{rev.comment}&rdquo;
                    </p>
                    <span className="text-[10px] text-slate-400 block">
                      {new Date(rev.createdAt).toLocaleString()}
                    </span>
                  </div>

                  <Button
                    size="sm"
                    variant="danger"
                    onClick={() => handleDeleteReview(rev.id)}
                    className="text-xs"
                  >
                    Delete Review
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 7. AUDIT LOGS TAB */}
        {activeTab === 'logs' && (
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-card space-y-6 animate-fade-in">
            <h2 className="text-lg font-bold text-slate-900">Full System Audit Trail</h2>
            <div className="divide-y divide-slate-100 max-h-[600px] overflow-y-auto pr-1">
              {logs.map((l) => (
                <div key={l.id} className="py-3 flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-purple-700">{l.action}</span>
                      <span className="text-[10px] text-slate-400">
                        by {l.admin?.name || 'Admin'}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 mt-0.5">{l.details}</p>
                  </div>
                  <span className="text-[10px] text-slate-400 whitespace-nowrap">
                    {new Date(l.createdAt).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 8. SETTINGS TAB */}
        {activeTab === 'settings' && (
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-card space-y-6 max-w-2xl animate-fade-in">
            <h2 className="text-lg font-bold text-slate-900">Platform Settings</h2>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-slate-50/80 rounded-2xl border border-slate-200/80">
                <div>
                  <h4 className="font-bold text-sm text-slate-900">Require Admin Verification</h4>
                  <p className="text-xs text-slate-500">
                    Technicians must be manually approved before appearing in public searches.
                  </p>
                </div>
                <button
                  onClick={handleToggleRequireApproval}
                  className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors ${
                    siteSettings['require_approval'] === 'true' ? 'bg-blue-600' : 'bg-slate-300'
                  }`}
                >
                  <div
                    className={`bg-white w-4 h-4 rounded-full shadow-xs transform transition-transform ${
                      siteSettings['require_approval'] === 'true' ? 'translate-x-6' : ''
                    }`}
                  />
                </button>
              </div>

              <div className="p-4 bg-slate-50/80 rounded-2xl border border-slate-200/80 space-y-2">
                <h4 className="font-bold text-sm text-slate-900">Customer Support Helpline</h4>
                <input
                  type="text"
                  value={siteSettings['support_phone'] || '+977-1-4567890'}
                  onChange={(e) =>
                    setSiteSettings((prev) => ({ ...prev, support_phone: e.target.value }))
                  }
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="p-4 bg-slate-50/80 rounded-2xl border border-slate-200/80 space-y-2">
                <h4 className="font-bold text-sm text-slate-900">Support Email</h4>
                <input
                  type="email"
                  value={siteSettings['support_email'] || 'support@sajilokhoj.com'}
                  onChange={(e) =>
                    setSiteSettings((prev) => ({ ...prev, support_email: e.target.value }))
                  }
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Technician Inspect Modal */}
      {selectedTech && (
        <Modal
          isOpen={!!selectedTech}
          onClose={() => setSelectedTech(null)}
          title={`Technician Profile: ${selectedTech.user?.name}`}
          maxWidth="lg"
        >
          <div className="space-y-4 text-xs text-slate-700">
            <div className="flex items-center gap-4 pb-4 border-b border-slate-100">
              <div className="w-16 h-16 rounded-2xl bg-slate-100 relative overflow-hidden shrink-0 border border-slate-200/60">
                <Image
                  src={
                    selectedTech.profileImage ||
                    selectedTech.user?.avatar ||
                    'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=120&auto=format&fit=crop&q=80'
                  }
                  alt={selectedTech.user?.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">{selectedTech.user?.name}</h3>
                <p className="text-slate-500 font-semibold">{selectedTech.businessName}</p>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="primary" size="sm">
                    {selectedTech.category?.name}
                  </Badge>
                  <Badge
                    variant={selectedTech.verificationStatus === 'APPROVED' ? 'success' : 'warning'}
                    size="sm"
                  >
                    {selectedTech.verificationStatus}
                  </Badge>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-100">
              <div>
                <span className="text-slate-400 font-semibold block text-[10px]">EMAIL:</span>
                <span className="font-bold text-slate-900">{selectedTech.user?.email}</span>
              </div>
              <div>
                <span className="text-slate-400 font-semibold block text-[10px]">PHONE:</span>
                <span className="font-bold text-slate-900">{selectedTech.user?.phone || '—'}</span>
              </div>
              <div>
                <span className="text-slate-400 font-semibold block text-[10px]">LOCATION:</span>
                <span className="font-bold text-slate-900">
                  {selectedTech.locality ? `${selectedTech.locality}, ` : ''}
                  {selectedTech.city}, {selectedTech.district}
                </span>
              </div>
              <div>
                <span className="text-slate-400 font-semibold block text-[10px]">EXPERIENCE:</span>
                <span className="font-bold text-slate-900">{selectedTech.experienceYears} Years</span>
              </div>
            </div>

            <div>
              <span className="text-slate-400 font-semibold block mb-1 text-[10px]">BIOGRAPHY:</span>
              <p className="p-3 bg-slate-50 rounded-xl leading-relaxed border border-slate-100 text-slate-700">
                {selectedTech.bio}
              </p>
            </div>

            {selectedTech.certifications && (
              <div>
                <span className="text-slate-400 font-semibold block mb-1 text-[10px]">CERTIFICATIONS:</span>
                <p className="p-3 bg-teal-50/80 text-teal-900 rounded-xl font-semibold border border-teal-200/60">
                  {selectedTech.certifications}
                </p>
              </div>
            )}

            <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2">
              {selectedTech.verificationStatus !== 'APPROVED' && (
                <Button
                  size="sm"
                  variant="success"
                  onClick={() => handleVerifyTech(selectedTech.id, 'APPROVED')}
                >
                  <CheckCircle className="w-4 h-4 mr-1" /> Approve Application
                </Button>
              )}
              {selectedTech.verificationStatus !== 'REJECTED' && (
                <Button
                  size="sm"
                  variant="danger"
                  onClick={() => handleVerifyTech(selectedTech.id, 'REJECTED')}
                >
                  <XCircle className="w-4 h-4 mr-1" /> Reject
                </Button>
              )}
            </div>
          </div>
        </Modal>
      )}

      {/* New Category Modal */}
      {isNewCatModalOpen && (
        <Modal
          isOpen={isNewCatModalOpen}
          onClose={() => setIsNewCatModalOpen(false)}
          title="Add New Category"
          maxWidth="md"
        >
          <form onSubmit={handleCreateCategory} className="space-y-4 text-xs text-slate-700">
            <div>
              <label className="block font-semibold uppercase mb-1">Category Name *</label>
              <input
                type="text"
                required
                value={newCatName}
                onChange={(e) => setNewCatName(e.target.value)}
                placeholder="e.g. Masonry & Bricklaying"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block font-semibold uppercase mb-1">Slug</label>
              <input
                type="text"
                value={newCatSlug}
                onChange={(e) => setNewCatSlug(e.target.value)}
                placeholder="masonry (optional)"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block font-semibold uppercase mb-1">Description</label>
              <textarea
                rows={3}
                value={newCatDesc}
                onChange={(e) => setNewCatDesc(e.target.value)}
                placeholder="Description for customers..."
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="pt-3 flex justify-end gap-2">
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={() => setIsNewCatModalOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" size="sm" variant="primary">
                Create Category
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
