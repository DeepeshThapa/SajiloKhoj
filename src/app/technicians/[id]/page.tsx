import React from 'react';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import {
  MapPin,
  ShieldCheck,
  Clock,
  Briefcase,
  Star,
  Award,
  Phone,
  CheckCircle2,
  Calendar,
  Sparkles,
  ArrowLeft,
  Share2,
  MessageSquare,
  Wrench,
} from 'lucide-react';
import { getTechnicianById } from '@/lib/actions/technicians';
import { StarRating } from '@/components/ui/StarRating';
import { Badge } from '@/components/ui/Badge';
import { TechnicianProfileActions } from './TechnicianProfileActions';

export default async function TechnicianDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  const res = await getTechnicianById(resolvedParams.id);

  if (!res.success || !res.data) {
    notFound();
  }

  const tech = res.data;
  const avatarSrc =
    tech.profileImage ||
    tech.user.avatar ||
    'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=400&auto=format&fit=crop&q=80';
  const coverSrc =
    tech.coverImage ||
    'https://images.unsplash.com/photo-1581094288338-2314dddb7ece?w=1200&auto=format&fit=crop&q=80';

  const skillsList = tech.skills ? tech.skills.split(',').map((s: string) => s.trim()) : [];

  return (
    <div className="min-h-screen bg-[#fafbfc] py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumbs */}
        <div className="mb-6 flex items-center justify-between">
          <Link
            href="/technicians"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-blue-600 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to all technicians
          </Link>
          <span className="text-xs text-slate-400">
            Technician ID: <span className="font-mono text-slate-600">{tech.id.slice(-8)}</span>
          </span>
        </div>

        {/* Profile Hero Card */}
        <div className="bg-white rounded-3xl border border-slate-200/80 overflow-hidden shadow-card mb-8">
          {/* Cover Photo */}
          <div className="h-44 sm:h-60 relative bg-slate-800">
            <Image
              src={coverSrc}
              alt={tech.user.name}
              fill
              className="object-cover opacity-80"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />
          </div>

          {/* Profile Header Details */}
          <div className="px-6 sm:px-10 pb-8 relative">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 -mt-16 sm:-mt-20">
              {/* Avatar & Basic Info */}
              <div className="flex flex-col sm:flex-row items-center sm:items-end gap-5 text-center sm:text-left">
                <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-3xl overflow-hidden bg-white border-4 border-white shadow-card relative shrink-0">
                  <Image src={avatarSrc} alt={tech.user.name} fill className="object-cover" />
                </div>

                <div className="space-y-1 pt-2">
                  <div className="flex items-center justify-center sm:justify-start gap-2 flex-wrap">
                    <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                      {tech.user.name}
                    </h1>
                    {tech.verificationStatus === 'APPROVED' && (
                      <span
                        title="CTEVT & Platform Verified Pro"
                        className="inline-flex items-center gap-1 bg-blue-50/80 text-blue-700 text-xs font-semibold px-2.5 py-0.5 rounded-full border border-blue-200/60"
                      >
                        <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                        Verified Pro
                      </span>
                    )}
                  </div>

                  <p className="text-xs sm:text-sm font-medium text-slate-500">
                    {tech.businessName || `${tech.category.name} Specialist`}
                  </p>

                  <div className="flex items-center justify-center sm:justify-start gap-3 flex-wrap text-xs text-slate-500 pt-1">
                    <StarRating rating={tech.rating} reviewCount={tech.reviewCount} size="sm" />
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-rose-500" />
                      {tech.locality ? `${tech.locality}, ` : ''}
                      {tech.city}, Nepal
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Briefcase className="w-3.5 h-3.5 text-slate-400" />
                      {tech.experienceYears}+ years exp
                    </span>
                  </div>
                </div>
              </div>

              {/* Status Badge */}
              <div className="self-center sm:self-end">
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200/80 px-3.5 py-1.5 rounded-full">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  {tech.availability.replace(/_/g, ' ')}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 2-Column Grid: Detailed Content & Sticky Booking Card */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Info Column (2/3) */}
          <div className="lg:col-span-2 space-y-8">
            {/* About / Bio */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-card">
              <h2 className="text-base sm:text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-blue-600" /> About Technician
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                {tech.bio}
              </p>
            </div>

            {/* Services & Itemized Pricing */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-card">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
                  <Wrench className="w-4 h-4 text-blue-600" /> Services & Pricing
                </h2>
                <span className="text-xs text-slate-400 font-medium">Clear Upfront Rates</span>
              </div>

              {tech.services && tech.services.length > 0 ? (
                <div className="divide-y divide-slate-100">
                  {tech.services.map((service: any) => (
                    <div
                      key={service.id}
                      className="py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div>
                        <h3 className="font-bold text-xs sm:text-sm text-slate-900">{service.title}</h3>
                        {service.description && (
                          <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                            {service.description}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center gap-3 shrink-0">
                        <span className="font-bold text-slate-900 text-sm">
                          Rs. {service.price.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-500">
                  General {tech.category.name} diagnostic & repair work starting from Rs.{' '}
                  {tech.startingPrice}.
                </p>
              )}
            </div>

            {/* Skills & Certifications */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-card">
              <h2 className="text-base sm:text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Award className="w-4 h-4 text-teal-600" /> Skills & CTEVT Credentials
              </h2>

              {skillsList.length > 0 && (
                <div className="mb-6">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                    Specialized Skills
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {skillsList.map((skill: string, idx: number) => (
                      <span
                        key={idx}
                        className="px-3 py-1.5 rounded-xl bg-blue-50/80 text-blue-700 text-xs font-semibold border border-blue-200/60"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {tech.certifications && (
                <div>
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                    Verified Certifications & Licenses
                  </span>
                  <div className="p-3.5 rounded-2xl bg-slate-50/80 border border-slate-200/80 text-xs font-semibold text-slate-700 flex items-center gap-2.5">
                    <ShieldCheck className="w-4 h-4 text-teal-600 shrink-0" />
                    <span>{tech.certifications}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Customer Reviews List */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-card">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-blue-600" /> Customer Reviews ({tech.reviews.length})
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Authentic feedback from completed service requests
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-bold text-slate-900">{tech.rating.toFixed(1)}</span>
                  <div className="flex items-center text-amber-400 text-xs">
                    {'★'.repeat(Math.round(tech.rating))}
                  </div>
                </div>
              </div>

              {tech.reviews.length === 0 ? (
                <div className="text-center py-8 text-slate-400 text-xs">
                  <Star className="w-8 h-8 mx-auto mb-2 opacity-30 text-amber-400" />
                  No reviews submitted yet. Be the first to book and rate {tech.user.name}!
                </div>
              ) : (
                <div className="divide-y divide-slate-100 space-y-4">
                  {tech.reviews.map((rev: any) => (
                    <div key={rev.id} className="pt-4 first:pt-0 space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-slate-100 overflow-hidden relative border border-slate-200">
                            <Image
                              src={
                                rev.customer.avatar ||
                                'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80'
                              }
                              alt={rev.customer.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div>
                            <h4 className="font-bold text-xs text-slate-900">{rev.customer.name}</h4>
                            <div className="flex items-center text-amber-400 text-xs">
                              {'★'.repeat(rev.rating)}
                            </div>
                          </div>
                        </div>
                        <span className="text-[11px] text-slate-400">
                          {new Date(rev.createdAt).toLocaleDateString(undefined, {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                          })}
                        </span>
                      </div>

                      <p className="text-xs text-slate-600 leading-relaxed pl-10">
                        {rev.comment}
                      </p>

                      {/* Technician Reply */}
                      {rev.technicianReply && (
                        <div className="ml-10 p-3 bg-blue-50/60 rounded-xl border border-blue-100 text-xs text-slate-700 space-y-1">
                          <span className="font-bold text-blue-800 block text-[11px]">
                            Reply from {tech.user.name}:
                          </span>
                          <p>{rev.technicianReply}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Sticky Booking CTA Sidebar (1/3) */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              <TechnicianProfileActions technician={tech} />

              {/* Service Area & Hours Info Card */}
              <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-card space-y-4 text-xs">
                <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-blue-600" /> Service Coverage Area
                </h3>
                <div className="space-y-2 text-slate-600">
                  <div className="flex justify-between py-1.5 border-b border-slate-100">
                    <span className="text-slate-400 font-medium">Province</span>
                    <span className="font-semibold text-slate-800">{tech.province}</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-slate-100">
                    <span className="text-slate-400 font-medium">District</span>
                    <span className="font-semibold text-slate-800">{tech.district}</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-slate-100">
                    <span className="text-slate-400 font-medium">City / Municipality</span>
                    <span className="font-semibold text-slate-800">
                      {tech.municipality || tech.city}
                    </span>
                  </div>
                  {tech.locality && (
                    <div className="flex justify-between py-1.5 border-b border-slate-100">
                      <span className="text-slate-400 font-medium">Local Area</span>
                      <span className="font-semibold text-slate-800">{tech.locality}</span>
                    </div>
                  )}
                  <div className="flex justify-between py-1.5">
                    <span className="text-slate-400 font-medium">Working Hours</span>
                    <span className="font-semibold text-slate-800">
                      {tech.workingHours || '7:00 AM - 7:00 PM'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
