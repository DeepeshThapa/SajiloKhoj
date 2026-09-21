'use server';

import prisma from '../prisma';
import { hashPassword, comparePassword } from '../auth/password';
import { createSession, destroySession } from '../auth/session';
import { loginSchema, customerRegisterSchema, technicianRegisterSchema, LoginInput, CustomerRegisterInput, TechnicianRegisterInput } from '../validations/auth';
import { Role, UserStatus, VerificationStatus, Availability } from '@prisma/client';

export type ActionResponse<T = any> = {
  success: boolean;
  message?: string;
  error?: string;
  data?: T;
  redirectUrl?: string;
};

export async function loginUser(input: LoginInput): Promise<ActionResponse> {
  try {
    const validated = loginSchema.safeParse(input);
    if (!validated.success) {
      const err = (validated.error as any).issues?.[0]?.message || (validated.error as any).errors?.[0]?.message || 'Invalid input data';
      return { success: false, error: err };
    }

    const { email, password } = validated.data;
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
      include: { technicianProfile: true },
    });

    if (!user) {
      return { success: false, error: 'No account found with this email' };
    }

    if (user.status === UserStatus.SUSPENDED) {
      return { success: false, error: 'Your account has been suspended. Please contact support.' };
    }

    const isMatch = await comparePassword(password, user.passwordHash);
    if (!isMatch) {
      return { success: false, error: 'Incorrect password' };
    }

    await createSession({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    });

    let redirectUrl = '/dashboard/customer';
    if (user.role === Role.ADMIN) {
      redirectUrl = '/admin';
    } else if (user.role === Role.TECHNICIAN) {
      redirectUrl = '/dashboard/technician';
    }

    return {
      success: true,
      message: 'Logged in successfully',
      redirectUrl,
    };
  } catch (error: any) {
    console.error('Login action error:', error);
    return { success: false, error: error.message || 'An unexpected error occurred during login' };
  }
}

export async function logoutUser(): Promise<ActionResponse> {
  try {
    await destroySession();
    return { success: true, redirectUrl: '/login' };
  } catch (error: any) {
    console.error('Logout error:', error);
    return { success: false, error: 'Failed to log out' };
  }
}

export async function registerCustomer(input: CustomerRegisterInput): Promise<ActionResponse> {
  try {
    const validated = customerRegisterSchema.safeParse(input);
    if (!validated.success) {
      const err = (validated.error as any).issues?.[0]?.message || (validated.error as any).errors?.[0]?.message || 'Invalid input data';
      return { success: false, error: err };
    }

    const { name, email, phone, password } = validated.data;

    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (existingUser) {
      return { success: false, error: 'An account with this email already exists' };
    }

    const passwordHash = await hashPassword(password);

    const user = await prisma.user.create({
      data: {
        name,
        email: email.toLowerCase(),
        phone,
        passwordHash,
        role: Role.CUSTOMER,
        status: UserStatus.ACTIVE,
      },
    });

    await prisma.notification.create({
      data: {
        userId: user.id,
        title: 'Welcome to Sajilo Khoj! 🛠️',
        message: 'Your customer account is active. Start exploring trusted technicians near you.',
        link: '/technicians',
      },
    });

    await createSession({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    });

    return {
      success: true,
      message: 'Account created successfully',
      redirectUrl: '/dashboard/customer',
    };
  } catch (error: any) {
    console.error('Customer register error:', error);
    return { success: false, error: error.message || 'Registration failed' };
  }
}

export async function registerTechnician(input: TechnicianRegisterInput): Promise<ActionResponse> {
  try {
    const validated = technicianRegisterSchema.safeParse(input);
    if (!validated.success) {
      const err = (validated.error as any).issues?.[0]?.message || (validated.error as any).errors?.[0]?.message || 'Invalid input data';
      return { success: false, error: err };
    }

    const data = validated.data;

    const existingUser = await prisma.user.findUnique({
      where: { email: data.email.toLowerCase() },
    });

    if (existingUser) {
      return { success: false, error: 'An account with this email already exists' };
    }

    const passwordHash = await hashPassword(data.password);

    const user = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email.toLowerCase(),
        phone: data.phone,
        passwordHash,
        role: Role.TECHNICIAN,
        status: UserStatus.ACTIVE,
        avatar: data.profileImage || undefined,
        technicianProfile: {
          create: {
            categoryId: data.categoryId,
            businessName: data.businessName || `${data.name}'s Services`,
            bio: data.bio,
            experienceYears: data.experienceYears,
            startingPrice: data.startingPrice,
            hourlyRate: data.hourlyRate,
            skills: data.skills,
            certifications: data.certifications,
            profileImage: data.profileImage || 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=400&auto=format&fit=crop&q=80',
            coverImage: data.coverImage || 'https://images.unsplash.com/photo-1581094288338-2314dddb7ece?w=1200&auto=format&fit=crop&q=80',
            workingHours: data.workingHours || '8:00 AM - 7:00 PM',
            province: data.province,
            district: data.district,
            city: data.city,
            municipality: data.municipality || data.city,
            locality: data.locality,
            address: data.address,
            availability: Availability.AVAILABLE_TODAY,
            verificationStatus: VerificationStatus.PENDING,
          },
        },
      },
    });

    // Notify user
    await prisma.notification.create({
      data: {
        userId: user.id,
        title: 'Application Received 📋',
        message: 'Your technician profile has been submitted and is currently pending admin review. You can manage your profile in the meantime.',
        link: '/dashboard/technician',
      },
    });

    // Notify admin(s)
    const admins = await prisma.user.findMany({ where: { role: Role.ADMIN } });
    for (const admin of admins) {
      await prisma.notification.create({
        data: {
          userId: admin.id,
          title: 'New Technician Application 🔔',
          message: `${data.name} applied for technician verification.`,
          link: '/admin/technicians',
          type: 'WARNING',
        },
      });
    }

    await createSession({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    });

    return {
      success: true,
      message: 'Registration submitted successfully. Your profile is awaiting admin approval.',
      redirectUrl: '/dashboard/technician',
    };
  } catch (error: any) {
    console.error('Technician register error:', error);
    return { success: false, error: error.message || 'Registration failed' };
  }
}
