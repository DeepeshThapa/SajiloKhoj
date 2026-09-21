import { z } from 'zod';
import { Availability } from '@prisma/client';

export const updateTechnicianProfileSchema = z.object({
  businessName: z.string().min(2, 'Business name must be at least 2 characters').optional(),
  bio: z.string().min(10, 'Bio must be at least 10 characters').optional(),
  skills: z.string().optional(),
  certifications: z.string().optional(),
  startingPrice: z.coerce.number().min(0, 'Starting price cannot be negative').optional(),
  hourlyRate: z.coerce.number().min(0, 'Hourly rate cannot be negative').optional(),
  workingHours: z.string().optional(),
  province: z.string().optional(),
  district: z.string().optional(),
  city: z.string().optional(),
  municipality: z.string().optional(),
  locality: z.string().optional(),
  address: z.string().optional(),
  phone: z.string().optional(),
  avatar: z.string().url().optional().or(z.literal('')),
});

export const addTechnicianServiceSchema = z.object({
  title: z.string().min(3, 'Service title must be at least 3 characters'),
  price: z.coerce.number().min(50, 'Price must be at least Rs. 50'),
  description: z.string().optional(),
});

export const updateAvailabilitySchema = z.object({
  availability: z.nativeEnum(Availability, {
    errorMap: () => ({ message: 'Invalid availability status' }),
  }),
});

export type UpdateTechnicianProfileInput = z.infer<typeof updateTechnicianProfileSchema>;
export type AddTechnicianServiceInput = z.infer<typeof addTechnicianServiceSchema>;
export type UpdateAvailabilityInput = z.infer<typeof updateAvailabilitySchema>;
