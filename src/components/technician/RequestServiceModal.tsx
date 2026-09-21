'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { createServiceRequest } from '@/lib/actions/requests';
import {
  Calendar,
  Clock,
  MapPin,
  Phone,
  CheckCircle,
  AlertCircle,
  FileText,
  Wrench,
} from 'lucide-react';

interface RequestServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  technician: {
    id: string;
    businessName?: string | null;
    startingPrice: number;
    user: {
      name: string;
      avatar?: string | null;
    };
    category: {
      name: string;
    };
    services?: Array<{ id: string; title: string; price: number }>;
  } | null;
  preselectedServiceTitle?: string;
}

export function RequestServiceModal({
  isOpen,
  onClose,
  technician,
  preselectedServiceTitle = '',
}: RequestServiceModalProps) {
  const [serviceTitle, setServiceTitle] = useState('');
  const [description, setDescription] = useState('');
  const [preferredDate, setPreferredDate] = useState('');
  const [preferredTime, setPreferredTime] = useState('10:00 AM - 01:00 PM');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [notes, setNotes] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsSuccess(false);
      setError('');
      if (preselectedServiceTitle) {
        setServiceTitle(preselectedServiceTitle);
      } else if (technician?.services && technician.services.length > 0) {
        setServiceTitle(technician.services[0].title);
      } else if (technician) {
        setServiceTitle(`General ${technician.category.name} Inspection & Repair`);
      }

      // Default date to tomorrow in YYYY-MM-DD
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      setPreferredDate(tomorrow.toISOString().split('T')[0]);
    }
  }, [isOpen, technician, preselectedServiceTitle]);

  if (!technician) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    const res = await createServiceRequest({
      technicianProfileId: technician.id,
      serviceTitle,
      description,
      preferredDate,
      preferredTime,
      address,
      phone,
      notes,
    });

    setIsLoading(false);

    if (res.success) {
      setIsSuccess(true);
    } else {
      setError(res.error || 'Failed to submit request. Please try again.');
    }
  };

  const timeSlots = [
    '08:00 AM - 11:00 AM (Morning)',
    '11:00 AM - 02:00 PM (Mid-day)',
    '02:00 PM - 05:00 PM (Afternoon)',
    '05:00 PM - 07:30 PM (Evening)',
    'Urgent / As Soon As Possible',
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Request Service"
      description={`Book a certified technician: ${technician.user.name}`}
      maxWidth="lg"
    >
      {isSuccess ? (
        <div className="text-center py-6 space-y-4">
          <div className="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center mx-auto animate-bounce">
            <CheckCircle className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-slate-900">Request Sent Successfully!</h3>
          <p className="text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
            Your booking request for <span className="font-semibold text-slate-900">"{serviceTitle}"</span> has been dispatched to{' '}
            <span className="font-semibold text-slate-900">{technician.user.name}</span>. You can track status updates in your customer dashboard.
          </p>
          <div className="pt-4 flex flex-col sm:flex-row gap-3 justify-center">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
            <Link href="/dashboard/customer?tab=requests" onClick={onClose}>
              <Button variant="primary">Go to My Requests</Button>
            </Link>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Technician mini banner */}
          <div className="p-3.5 rounded-2xl bg-slate-50/80 border border-slate-200/70 flex items-center justify-between text-xs">
            <div>
              <span className="font-bold text-slate-900 block">{technician.user.name}</span>
              <span className="text-slate-500 font-medium">
                {technician.businessName || technician.category.name}
              </span>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-slate-400 font-bold tracking-wider block uppercase">Est. Starting Rate</span>
              <span className="font-bold text-blue-600 text-sm">Rs. {technician.startingPrice}</span>
            </div>
          </div>

          {/* Service Title */}
          <div>
            <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Service Requested *
            </label>
            {technician.services && technician.services.length > 0 ? (
              <div className="space-y-2">
                <select
                  value={serviceTitle}
                  onChange={(e) => setServiceTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200/90 bg-slate-50/60 text-slate-900 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:bg-white"
                >
                  {technician.services.map((s) => (
                    <option key={s.id} value={s.title}>
                      {s.title} — Rs. {s.price}
                    </option>
                  ))}
                  <option value={`Custom ${technician.category.name} Work`}>
                    Other / Custom Repair Work
                  </option>
                </select>
              </div>
            ) : (
              <div className="relative">
                <Wrench className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  required
                  value={serviceTitle}
                  onChange={(e) => setServiceTitle(e.target.value)}
                  placeholder="e.g. Bathroom pipe leakage, switchboard installation"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200/90 bg-slate-50/60 text-slate-900 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:bg-white"
                />
              </div>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Problem Description & Details *
            </label>
            <div className="relative">
              <textarea
                required
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Explain the problem in detail (e.g. continuous leaking pipe under kitchen sink, circuit breaker tripped twice today)..."
                className="w-full p-3 rounded-xl border border-slate-200/90 bg-slate-50/60 text-slate-900 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:bg-white"
              />
            </div>
          </div>

          {/* Date & Time Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Preferred Date *
              </label>
              <div className="relative">
                <input
                  type="date"
                  required
                  min={new Date().toISOString().split('T')[0]}
                  value={preferredDate}
                  onChange={(e) => setPreferredDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200/90 bg-slate-50/60 text-slate-900 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:bg-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Time Slot *
              </label>
              <select
                value={preferredTime}
                onChange={(e) => setPreferredTime(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200/90 bg-slate-50/60 text-slate-900 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:bg-white"
              >
                {timeSlots.map((slot) => (
                  <option key={slot} value={slot}>
                    {slot}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Address & Phone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Full Address / Locality *
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="e.g. New Baneshwor, House #14, Kathmandu"
                  className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-slate-200/90 bg-slate-50/60 text-slate-900 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:bg-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Contact Phone *
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+977 98XXXXXXXX"
                  className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-slate-200/90 bg-slate-50/60 text-slate-900 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:bg-white"
                />
              </div>
            </div>
          </div>

          {/* Additional Notes */}
          <div>
            <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Special Instructions / Landmark (Optional)
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Beside Civil Bank ATM, please bring spare 1-inch PPR valve"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200/90 bg-slate-50/60 text-slate-900 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:bg-white"
            />
          </div>

          <div className="pt-3 flex items-center justify-end gap-2.5 border-t border-slate-100">
            <Button type="button" variant="outline" size="sm" onClick={onClose} disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm" isLoading={isLoading}>
              Confirm & Dispatch Request
            </Button>
          </div>
        </form>
      )}
    </Modal>
  );
}
