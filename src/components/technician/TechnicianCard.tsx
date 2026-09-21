'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  MapPin,
  ShieldCheck,
  Clock,
  Briefcase,
  Heart,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { StarRating } from '@/components/ui/StarRating';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { toggleFavorite } from '@/lib/actions/favorites';

export interface TechnicianCardProps {
  technician: {
    id: string;
    userId: string;
    bio: string;
    businessName?: string | null;
    experienceYears: number;
    startingPrice: number;
    hourlyRate?: number | null;
    profileImage?: string | null;
    province: string;
    district: string;
    city: string;
    locality?: string | null;
    availability: string;
    verificationStatus: string;
    rating: number;
    reviewCount: number;
    isFeatured?: boolean;
    user: {
      id: string;
      name: string;
      avatar?: string | null;
      phone?: string | null;
    };
    category: {
      id: string;
      name: string;
      slug: string;
    };
    services?: Array<{ id: string; title: string; price: number }>;
  };
  initialIsFavorite?: boolean;
  onRequestClick?: (technician: any) => void;
}

export function TechnicianCard({
  technician,
  initialIsFavorite = false,
  onRequestClick,
}: TechnicianCardProps) {
  const [isFavorite, setIsFavorite] = useState(initialIsFavorite);
  const [isFavLoading, setIsFavLoading] = useState(false);

  const handleFavoriteToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsFavLoading(true);
    const res = await toggleFavorite(technician.id);
    setIsFavLoading(false);
    if (res.success !== undefined) {
      setIsFavorite(res.isFavorite);
    }
  };

  const getAvailabilityBadge = (status: string) => {
    switch (status) {
      case 'AVAILABLE_NOW':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200/80 px-2 py-0.5 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Available Now
          </span>
        );
      case 'AVAILABLE_TODAY':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-700 bg-blue-50 border border-blue-200/80 px-2 py-0.5 rounded-full">
            <Clock className="w-3 h-3 text-blue-500" />
            Available Today
          </span>
        );
      case 'AVAILABLE_THIS_WEEK':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-700 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-full">
            Available This Week
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-800 bg-amber-50 border border-amber-200/80 px-2 py-0.5 rounded-full">
            Busy
          </span>
        );
    }
  };

  const avatarSrc =
    technician.profileImage ||
    technician.user.avatar ||
    'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=200&auto=format&fit=crop&q=80';

  return (
    <div className="group bg-white rounded-2xl border border-slate-200/80 shadow-card shadow-card-hover flex flex-col justify-between overflow-hidden relative">
      {/* Featured Ribbon */}
      {technician.isFeatured && (
        <div className="absolute top-3 left-3 z-10">
          <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider bg-amber-50 text-amber-900 border border-amber-200/80 px-2.5 py-0.5 rounded-full shadow-2xs">
            <Sparkles className="w-3 h-3 text-amber-600" /> Featured
          </span>
        </div>
      )}

      {/* Favorite Button */}
      <button
        onClick={handleFavoriteToggle}
        disabled={isFavLoading}
        className="absolute top-3 right-3 z-10 p-2 rounded-full bg-white/95 border border-slate-200/80 text-slate-400 hover:text-rose-600 hover:bg-white shadow-2xs transition-all active:scale-95 cursor-pointer"
        aria-label="Save technician"
      >
        <Heart
          className={`w-3.5 h-3.5 transition-colors ${
            isFavorite ? 'fill-rose-500 text-rose-500' : ''
          }`}
        />
      </button>

      {/* Card Header & Profile */}
      <div className="p-5 sm:p-6 pb-4">
        <div className="flex items-start gap-4">
          <Link href={`/technicians/${technician.id}`} className="shrink-0 relative group-hover:opacity-90 transition-opacity">
            <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200/70 shadow-2xs relative">
              <Image
                src={avatarSrc}
                alt={technician.user.name}
                fill
                className="object-cover"
                sizes="72px"
              />
            </div>
          </Link>

          <div className="flex-1 min-w-0 pr-6">
            <div className="flex items-center gap-1.5 flex-wrap mb-1">
              <Link
                href={`/technicians/${technician.id}`}
                className="font-bold text-base text-slate-900 hover:text-blue-600 transition-colors truncate block"
              >
                {technician.user.name}
              </Link>
              {technician.verificationStatus === 'APPROVED' && (
                <span title="CTEVT & Sajilo Verified Pro" className="text-blue-600">
                  <ShieldCheck className="w-4 h-4 fill-blue-50 text-blue-600" />
                </span>
              )}
            </div>

            <p className="text-xs font-medium text-slate-500 truncate mb-2">
              {technician.businessName || `${technician.category.name} Specialist`}
            </p>

            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant="primary" size="sm">
                {technician.category.name}
              </Badge>
              <span className="text-[11px] font-medium text-slate-500 flex items-center gap-1">
                <Briefcase className="w-3 h-3 text-slate-400" />
                {technician.experienceYears}+ yrs exp
              </span>
            </div>
          </div>
        </div>

        {/* Ratings & Location */}
        <div className="mt-4 pt-3.5 border-t border-slate-100 flex items-center justify-between text-xs">
          <StarRating
            rating={technician.rating}
            reviewCount={technician.reviewCount}
            size="sm"
          />

          <div className="flex items-center gap-1 text-slate-500 font-medium truncate max-w-[140px]">
            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="truncate text-xs">
              {technician.locality ? `${technician.locality}, ` : ''}
              {technician.city}
            </span>
          </div>
        </div>

        {/* Short Bio snippet */}
        <p className="mt-3 text-xs text-slate-500 line-clamp-2 leading-relaxed">
          {technician.bio}
        </p>

        {/* Services / Tags preview */}
        {technician.services && technician.services.length > 0 && (
          <div className="mt-3 flex items-center gap-1.5 overflow-hidden">
            {technician.services.slice(0, 2).map((srv) => (
              <span
                key={srv.id}
                className="text-[10px] font-medium text-slate-600 bg-slate-50 border border-slate-200/60 px-2 py-0.5 rounded-lg truncate max-w-[130px]"
              >
                {srv.title}
              </span>
            ))}
            {technician.services.length > 2 && (
              <span className="text-[10px] text-slate-400 font-semibold">
                +{technician.services.length - 2} more
              </span>
            )}
          </div>
        )}
      </div>

      {/* Card Footer with Price & Actions */}
      <div className="px-5 sm:px-6 py-4 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between gap-2">
        <div>
          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">
            Starting Rate
          </span>
          <span className="text-sm sm:text-base font-bold text-slate-900">
            Rs. {technician.startingPrice.toLocaleString()}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {onRequestClick ? (
            <Button
              size="sm"
              variant="primary"
              onClick={() => onRequestClick(technician)}
            >
              Book Now
            </Button>
          ) : (
            <Link href={`/technicians/${technician.id}`}>
              <Button size="sm" variant="primary">
                View Profile <ArrowRight className="w-3 h-3" />
              </Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
