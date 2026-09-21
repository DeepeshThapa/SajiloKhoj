import { z } from 'zod';
import { RequestStatus } from '@prisma/client';

export const createServiceRequestSchema = z.object({
  technicianProfileId: z.string().min(1, 'Technician ID is required'),
  serviceTitle: z.string().min(3, 'Service title must be at least 3 characters'),
  description: z.string().min(10, 'Please describe the problem in detail (min 10 characters)'),
  preferredDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Please select a valid date (YYYY-MM-DD)'),
  preferredTime: z.string().min(2, 'Please select a preferred time slot'),
  address: z.string().min(3, 'Service address / locality is required'),
  phone: z.string().min(10, 'Please enter a valid 10-digit phone number (e.g. 98XXXXXXXX)'),
  notes: z.string().optional(),
  imageUrl: z.string().url('Invalid image URL').optional().or(z.literal('')),
});

export const updateRequestStatusSchema = z.object({
  requestId: z.string().min(1, 'Request ID is required'),
  status: z.nativeEnum(RequestStatus, {
    errorMap: () => ({ message: 'Invalid request status enum value' }),
  }),
  cancelReason: z.string().optional(),
});

export type CreateServiceRequestInput = z.infer<typeof createServiceRequestSchema>;
export type UpdateRequestStatusInput = z.infer<typeof updateRequestStatusSchema>;
