'use client';

import React, { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { StarRating } from '@/components/ui/StarRating';
import { createReview } from '@/lib/actions/reviews';
import { Star, CheckCircle, AlertCircle } from 'lucide-react';

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  serviceRequest: {
    id: string;
    serviceTitle: string;
    technicianProfile: {
      user: {
        name: string;
      };
      category: {
        name: string;
      };
    };
  } | null;
  onSuccess?: () => void;
}

export function ReviewModal({
  isOpen,
  onClose,
  serviceRequest,
  onSuccess,
}: ReviewModalProps) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  if (!serviceRequest) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    const res = await createReview({
      serviceRequestId: serviceRequest.id,
      rating,
      comment,
    });

    setIsLoading(false);

    if (res.success) {
      setIsSuccess(true);
      onSuccess?.();
    } else {
      setError(res.error || 'Failed to submit review.');
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Leave a Review"
      description={`Share your experience with ${serviceRequest.technicianProfile.user.name}`}
      maxWidth="md"
    >
      {isSuccess ? (
        <div className="text-center py-6 space-y-4">
          <div className="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center mx-auto">
            <CheckCircle className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">Review Submitted!</h3>
          <p className="text-xs text-slate-600 max-w-sm mx-auto">
            Thank you for rating {serviceRequest.technicianProfile.user.name}. Your feedback helps other homeowners find trusted professionals.
          </p>
          <div className="pt-2">
            <Button variant="primary" onClick={onClose}>
              Done
            </Button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="p-3 bg-slate-50/80 border border-slate-200/70 rounded-2xl text-xs text-slate-600">
            <span className="font-bold text-slate-900">Completed Service:</span>{' '}
            {serviceRequest.serviceTitle}
          </div>

          {/* Interactive Star Rating */}
          <div className="text-center py-2">
            <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-2">
              Your Overall Rating
            </label>
            <div className="flex justify-center">
              <StarRating
                rating={rating}
                interactive={true}
                onChange={(val) => setRating(val)}
                size="lg"
                showNumber={false}
              />
            </div>
            <span className="text-xs font-semibold text-amber-700 mt-2 inline-block">
              {rating === 5
                ? '⭐⭐⭐⭐⭐ Exceptional (5.0)'
                : rating === 4
                ? '⭐⭐⭐⭐ Very Good (4.0)'
                : rating === 3
                ? '⭐⭐⭐ Average (3.0)'
                : rating === 2
                ? '⭐⭐ Below Average (2.0)'
                : '⭐ Poor (1.0)'}
            </span>
          </div>

          {/* Written Feedback */}
          <div>
            <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Written Review & Feedback *
            </label>
            <textarea
              required
              rows={4}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="How was their punctuality, skill quality, cleanliness, and attitude? Was the price reasonable?"
              className="w-full p-3 rounded-xl border border-slate-200/90 bg-slate-50/60 text-slate-900 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:bg-white"
            />
          </div>

          <div className="pt-3 flex items-center justify-end gap-2.5 border-t border-slate-100">
            <Button type="button" variant="outline" size="sm" onClick={onClose} disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm" isLoading={isLoading}>
              Publish Review
            </Button>
          </div>
        </form>
      )}
    </Modal>
  );
}
