import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Please provide a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const customerRegisterSchema = z
  .object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Please provide a valid email address'),
    phone: z.string().min(10, 'Please provide a valid phone number (e.g. +977-98...)'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string().min(6, 'Please confirm your password'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export const technicianRegisterSchema = z
  .object({
    // Step 1: Account
    name: z.string().min(2, 'Full name is required'),
    email: z.string().email('Valid email is required'),
    phone: z.string().min(10, 'Valid 10-digit phone number is required'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string().min(6, 'Please confirm your password'),

    // Step 2: Professional Info
    categoryId: z.string().min(1, 'Please select a primary service category'),
    businessName: z.string().optional(),
    experienceYears: z.coerce.number().min(0, 'Experience must be 0 or more years'),
    bio: z.string().min(20, 'Please describe your services and experience (min 20 characters)'),
    skills: z.string().min(3, 'Please list at least one skill or specialization'),
    certifications: z.string().optional(),

    // Step 3: Service Area (Nepal)
    province: z.string().min(1, 'Province is required'),
    district: z.string().min(1, 'District is required'),
    city: z.string().min(1, 'City/Municipality is required'),
    municipality: z.string().optional(),
    locality: z.string().min(1, 'Locality / Area is required'),
    address: z.string().min(3, 'Detailed address is required'),

    // Step 4: Pricing
    startingPrice: z.coerce.number().min(50, 'Starting price must be at least Rs. 50'),
    hourlyRate: z.coerce.number().optional(),

    // Step 5: Profile & Availability
    profileImage: z.string().url().optional().or(z.literal('')),
    coverImage: z.string().url().optional().or(z.literal('')),
    workingHours: z.string().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export type LoginInput = z.infer<typeof loginSchema>;
export type CustomerRegisterInput = z.infer<typeof customerRegisterSchema>;
export type TechnicianRegisterInput = z.infer<typeof technicianRegisterSchema>;
