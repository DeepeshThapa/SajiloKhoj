'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { RequestServiceModal } from '@/components/technician/RequestServiceModal';
import { toggleFavorite } from '@/lib/actions/favorites';
import {
  Calendar,
  Heart,
  Phone,
  ShieldCheck,
  Award,
  Sparkles,
  Share2,
} from 'lucide-react';

interface TechnicianProfileActionsProps {
  technician: any;
}

export function TechnicianProfileActions({ technician }: TechnicianProfileActionsProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isFavLoading, setIsFavLoading] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const handleFavoriteToggle = async () => {
    setIsFavLoading(true);
    const res = await toggleFavorite(technician.id);
    setIsFavLoading(false);
    if (res.success !== undefined) {
      setIsFavorite(res.isFavorite);
    }
  };

  const handleShare = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  return (
    <>
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-md space-y-6">
        {/* Pricing Summary */}
        <div className="flex items-center justify-between pb-5 border-b border-slate-100">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Estimated Starting Rate
            </span>
            <span className="text-2xl font-black text-slate-900">
              Rs. {technician.startingPrice.toLocaleString()}
            </span>
          </div>
          {technician.hourlyRate && (
            <div className="text-right">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Hourly Tariff
              </span>
              <span className="text-base font-bold text-slate-700">
                Rs. {technician.hourlyRate}/hr
              </span>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="space-y-2.5">
          <Button
            size="lg"
            variant="primary"
            className="w-full text-base font-bold py-3.5 shadow-lg shadow-blue-600/20"
            onClick={() => setIsModalOpen(true)}
          >
            <Calendar className="w-5 h-5 mr-2" /> Request Service
          </Button>

          <div className="grid grid-cols-2 gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={isFavLoading}
              onClick={handleFavoriteToggle}
              className={`w-full text-xs font-semibold ${isFavorite ? 'text-rose-600 border-rose-200 bg-rose-50' : ''}`}
            >
              <Heart className={`w-4 h-4 mr-1.5 ${isFavorite ? 'fill-rose-500 text-rose-500' : ''}`} />
              {isFavorite ? 'Saved' : 'Save'}
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={handleShare}
              className="w-full text-xs font-semibold"
            >
              <Share2 className="w-4 h-4 mr-1.5" />
              {isCopied ? 'Link Copied!' : 'Share Profile'}
            </Button>
          </div>
        </div>

        {/* Guarantees */}
        <div className="pt-4 border-t border-slate-100 space-y-2.5 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0" />
            <span>CTEVT Verified Background & Identity</span>
          </div>
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-teal-600 shrink-0" />
            <span>Zero Advance Booking Deposit Required</span>
          </div>
          <div className="flex items-center gap-2">
            <Phone className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Direct helpline support: +977-1-4567890</span>
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      <RequestServiceModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        technician={technician}
      />
    </>
  );
}
