import { z } from 'zod';

export const createReviewSchema = z.object({
  serviceRequestId: z.string().min(1, 'Service Request ID is required'),
  rating: z.coerce
    .number()
    .int('Rating must be a whole number')
    .min(1, 'Rating must be at least 1 star')
    .max(5, 'Rating cannot exceed 5 stars'),
  comment: z.string().min(5, 'Review feedback must be at least 5 characters'),
});

export const replyReviewSchema = z.object({
  reviewId: z.string().min(1, 'Review ID is required'),
  reply: z.string().min(2, 'Reply message cannot be empty'),
});

export type CreateReviewInput = z.infer<typeof createReviewSchema>;
export type ReplyReviewInput = z.infer<typeof replyReviewSchema>;
