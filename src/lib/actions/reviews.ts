'use server';

import prisma from '../prisma';
import { getSession } from '../auth/session';
import { RequestStatus } from '@prisma/client';
import { revalidatePath } from 'next/cache';

export interface CreateReviewInput {
  serviceRequestId: string;
  rating: number;
  comment: string;
}

export async function createReview(input: CreateReviewInput) {
  try {
    const session = await getSession();
    if (!session) {
      return { success: false, error: 'You must be logged in to submit a review.' };
    }

    const { serviceRequestId, rating, comment } = input;

    if (!serviceRequestId || !rating || !comment || comment.trim() === '') {
      return { success: false, error: 'Please provide a star rating and written review.' };
    }

    if (rating < 1 || rating > 5) {
      return { success: false, error: 'Rating must be between 1 and 5 stars.' };
    }

    // 1. Verify service request is valid, completed, and belongs to customer
    const serviceRequest = await prisma.serviceRequest.findUnique({
      where: { id: serviceRequestId },
      include: {
        review: true,
        technicianProfile: { include: { user: true } },
      },
    });

    if (!serviceRequest) {
      return { success: false, error: 'Service request not found.' };
    }

    if (serviceRequest.customerId !== session.id) {
      return { success: false, error: 'You can only review services requested by your account.' };
    }

    if (serviceRequest.status !== RequestStatus.COMPLETED) {
      return { success: false, error: 'You can only review a service after it has been marked as completed.' };
    }

    if (serviceRequest.review) {
      return { success: false, error: 'You have already submitted a review for this service.' };
    }

    // 2. Create the review
    const review = await prisma.review.create({
      data: {
        customerId: session.id,
        technicianProfileId: serviceRequest.technicianProfileId,
        serviceRequestId: serviceRequest.id,
        rating: Math.round(rating),
        comment: comment.trim(),
      },
    });

    // 3. Recalculate average rating & reviewCount for the technician
    const allReviews = await prisma.review.findMany({
      where: { technicianProfileId: serviceRequest.technicianProfileId },
      select: { rating: true },
    });

    const totalRatings = allReviews.reduce((sum, r) => sum + r.rating, 0);
    const avgRating = allReviews.length > 0 ? Number((totalRatings / allReviews.length).toFixed(1)) : 0;

    await prisma.technicianProfile.update({
      where: { id: serviceRequest.technicianProfileId },
      data: {
        rating: avgRating,
        reviewCount: allReviews.length,
      },
    });

    // 4. Notify technician
    await prisma.notification.create({
      data: {
        userId: serviceRequest.technicianProfile.userId,
        title: 'New Review Received! ⭐',
        message: `${session.name} left a ${rating}-star review for "${serviceRequest.serviceTitle}".`,
        link: '/dashboard/technician',
        type: 'SUCCESS',
      },
    });

    revalidatePath('/dashboard/customer');
    revalidatePath(`/technicians/${serviceRequest.technicianProfileId}`);
    revalidatePath('/technicians');
    revalidatePath('/');

    return {
      success: true,
      message: 'Thank you! Your review has been published.',
      data: review,
    };
  } catch (error: any) {
    console.error('createReview error:', error);
    return { success: false, error: error.message || 'Failed to submit review.' };
  }
}

export async function replyToReview(reviewId: string, reply: string) {
  try {
    const session = await getSession();
    if (!session || session.role !== 'TECHNICIAN') {
      return { success: false, error: 'Unauthorized.' };
    }

    const review = await prisma.review.findUnique({
      where: { id: reviewId },
      include: { technicianProfile: true },
    });

    if (!review) {
      return { success: false, error: 'Review not found.' };
    }

    if (review.technicianProfile.userId !== session.id) {
      return { success: false, error: 'You can only reply to reviews on your own profile.' };
    }

    const updated = await prisma.review.update({
      where: { id: reviewId },
      data: { technicianReply: reply.trim() },
    });

    revalidatePath('/dashboard/technician');
    revalidatePath(`/technicians/${review.technicianProfileId}`);

    return { success: true, message: 'Reply posted successfully.', data: updated };
  } catch (error: any) {
    console.error('replyToReview error:', error);
    return { success: false, error: error.message };
  }
}
