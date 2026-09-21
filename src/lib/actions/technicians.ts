'use server';

import prisma from '../prisma';
import { getSession } from '../auth/session';
import { Availability, VerificationStatus, UserStatus, Prisma } from '@prisma/client';
import { revalidatePath } from 'next/cache';

export interface SearchTechniciansParams {
  query?: string;
  category?: string;
  location?: string;
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  minExperience?: number;
  availability?: string;
  verifiedOnly?: boolean;
  sortBy?: 'recommended' | 'rating' | 'price_asc' | 'price_desc' | 'experience' | 'newest';
  page?: number;
  limit?: number;
}

export async function getTechnicians(params: SearchTechniciansParams = {}) {
  try {
    const {
      query,
      category,
      location,
      minPrice,
      maxPrice,
      minRating,
      minExperience,
      availability,
      verifiedOnly,
      sortBy = 'recommended',
      page = 1,
      limit = 9,
    } = params;

    const skip = (Math.max(1, page) - 1) * limit;

    const where: Prisma.TechnicianProfileWhereInput = {
      verificationStatus: VerificationStatus.APPROVED,
      user: {
        status: UserStatus.ACTIVE,
      },
    };

    // Category filter (slug or ID)
    if (category && category !== 'all') {
      where.OR = [
        { categoryId: category },
        { category: { slug: category } },
      ];
    }

    // Keyword Search (Name, Bio, Skills, Business Name)
    if (query && query.trim() !== '') {
      const q = query.trim();
      where.AND = [
        ...(Array.isArray(where.AND) ? where.AND : where.AND ? [where.AND] : []),
        {
          OR: [
            { user: { name: { contains: q } } },
            { businessName: { contains: q } },
            { bio: { contains: q } },
            { skills: { contains: q } },
            { services: { some: { title: { contains: q } } } },
          ],
        },
      ];
    }

    // Location Filter
    if (location && location.trim() !== '') {
      const loc = location.trim();
      where.AND = [
        ...(Array.isArray(where.AND) ? where.AND : where.AND ? [where.AND] : []),
        {
          OR: [
            { city: { contains: loc } },
            { district: { contains: loc } },
            { province: { contains: loc } },
            { locality: { contains: loc } },
            { municipality: { contains: loc } },
            { address: { contains: loc } },
          ],
        },
      ];
    }

    // Price Filter
    if (minPrice !== undefined || maxPrice !== undefined) {
      where.startingPrice = {};
      if (minPrice !== undefined) where.startingPrice.gte = Number(minPrice);
      if (maxPrice !== undefined) where.startingPrice.lte = Number(maxPrice);
    }

    // Rating Filter
    if (minRating !== undefined && minRating > 0) {
      where.rating = { gte: Number(minRating) };
    }

    // Experience Filter
    if (minExperience !== undefined && minExperience > 0) {
      where.experienceYears = { gte: Number(minExperience) };
    }

    // Availability Filter
    if (availability && availability !== 'ALL') {
      where.availability = availability as Availability;
    }

    // Sorting
    let orderBy: Prisma.TechnicianProfileOrderByWithRelationInput = { rating: 'desc' };
    switch (sortBy) {
      case 'rating':
        orderBy = { rating: 'desc' };
        break;
      case 'price_asc':
        orderBy = { startingPrice: 'asc' };
        break;
      case 'price_desc':
        orderBy = { startingPrice: 'desc' };
        break;
      case 'experience':
        orderBy = { experienceYears: 'desc' };
        break;
      case 'newest':
        orderBy = { createdAt: 'desc' };
        break;
      case 'recommended':
      default:
        orderBy = { isFeatured: 'desc' };
        break;
    }

    const [technicians, totalCount] = await Promise.all([
      prisma.technicianProfile.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              phone: true,
              avatar: true,
            },
          },
          category: true,
          services: {
            take: 3,
          },
          _count: {
            select: { reviews: true },
          },
        },
        orderBy: [orderBy, { reviewCount: 'desc' }],
        skip,
        take: limit,
      }),
      prisma.technicianProfile.count({ where }),
    ]);

    return {
      success: true,
      data: technicians,
      pagination: {
        total: totalCount,
        page,
        limit,
        totalPages: Math.ceil(totalCount / limit),
      },
    };
  } catch (error: any) {
    console.error('getTechnicians error:', error);
    return {
      success: false,
      data: [],
      pagination: { total: 0, page: 1, limit: 9, totalPages: 0 },
      error: error.message,
    };
  }
}

export async function getFeaturedTechnicians(limit = 6) {
  try {
    const technicians = await prisma.technicianProfile.findMany({
      where: {
        verificationStatus: VerificationStatus.APPROVED,
        user: { status: UserStatus.ACTIVE },
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
        category: true,
        services: { take: 3 },
      },
      orderBy: [{ isFeatured: 'desc' }, { rating: 'desc' }, { reviewCount: 'desc' }],
      take: limit,
    });

    return { success: true, data: technicians };
  } catch (error: any) {
    console.error('getFeaturedTechnicians error:', error);
    return { success: false, data: [], error: error.message };
  }
}

export async function getTechnicianById(id: string) {
  try {
    const technician = await prisma.technicianProfile.findFirst({
      where: {
        OR: [{ id }, { userId: id }],
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            avatar: true,
            createdAt: true,
          },
        },
        category: true,
        services: {
          orderBy: { price: 'asc' },
        },
        reviews: {
          include: {
            customer: {
              select: {
                id: true,
                name: true,
                avatar: true,
              },
            },
          },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!technician) {
      return { success: false, error: 'Technician profile not found' };
    }

    return { success: true, data: technician };
  } catch (error: any) {
    console.error('getTechnicianById error:', error);
    return { success: false, error: error.message };
  }
}

export async function updateTechnicianAvailability(availability: Availability) {
  try {
    const session = await getSession();
    if (!session || session.role !== 'TECHNICIAN') {
      return { success: false, error: 'Unauthorized. Only technicians can update availability.' };
    }

    const profile = await prisma.technicianProfile.update({
      where: { userId: session.id },
      data: { availability },
    });

    revalidatePath('/dashboard/technician');
    revalidatePath(`/technicians/${profile.id}`);
    revalidatePath('/technicians');

    return { success: true, message: 'Availability updated', data: profile };
  } catch (error: any) {
    console.error('updateTechnicianAvailability error:', error);
    return { success: false, error: error.message };
  }
}

export async function updateTechnicianProfile(data: {
  businessName?: string;
  bio?: string;
  skills?: string;
  certifications?: string;
  startingPrice?: number;
  hourlyRate?: number;
  workingHours?: string;
  province?: string;
  district?: string;
  city?: string;
  municipality?: string;
  locality?: string;
  address?: string;
  phone?: string;
  avatar?: string;
}) {
  try {
    const session = await getSession();
    if (!session || session.role !== 'TECHNICIAN') {
      return { success: false, error: 'Unauthorized.' };
    }

    const { phone, avatar, ...profileData } = data;

    // Update user table info if phone or avatar changed
    if (phone !== undefined || avatar !== undefined) {
      await prisma.user.update({
        where: { id: session.id },
        data: {
          ...(phone !== undefined ? { phone } : {}),
          ...(avatar !== undefined ? { avatar } : {}),
        },
      });
    }

    // Update profile
    const profile = await prisma.technicianProfile.update({
      where: { userId: session.id },
      data: profileData,
    });

    revalidatePath('/dashboard/technician');
    revalidatePath(`/technicians/${profile.id}`);

    return { success: true, message: 'Profile updated successfully', data: profile };
  } catch (error: any) {
    console.error('updateTechnicianProfile error:', error);
    return { success: false, error: error.message };
  }
}

export async function addTechnicianService(title: string, price: number, description?: string) {
  try {
    const session = await getSession();
    if (!session || session.role !== 'TECHNICIAN') {
      return { success: false, error: 'Unauthorized' };
    }

    const profile = await prisma.technicianProfile.findUnique({
      where: { userId: session.id },
    });

    if (!profile) return { success: false, error: 'Profile not found' };

    const service = await prisma.service.create({
      data: {
        technicianProfileId: profile.id,
        title,
        price: Number(price),
        description,
      },
    });

    revalidatePath('/dashboard/technician');
    revalidatePath(`/technicians/${profile.id}`);

    return { success: true, message: 'Service added successfully', data: service };
  } catch (error: any) {
    console.error('addTechnicianService error:', error);
    return { success: false, error: error.message };
  }
}

export async function deleteTechnicianService(serviceId: string) {
  try {
    const session = await getSession();
    if (!session || session.role !== 'TECHNICIAN') {
      return { success: false, error: 'Unauthorized' };
    }

    const profile = await prisma.technicianProfile.findUnique({
      where: { userId: session.id },
    });

    if (!profile) return { success: false, error: 'Profile not found' };

    await prisma.service.deleteMany({
      where: {
        id: serviceId,
        technicianProfileId: profile.id,
      },
    });

    revalidatePath('/dashboard/technician');
    revalidatePath(`/technicians/${profile.id}`);

    return { success: true, message: 'Service removed successfully' };
  } catch (error: any) {
    console.error('deleteTechnicianService error:', error);
    return { success: false, error: error.message };
  }
}

export async function getMyTechnicianProfile() {
  try {
    const session = await getSession();
    if (!session || session.role !== 'TECHNICIAN') {
      return { success: false, error: 'Unauthorized' };
    }

    const profile = await prisma.technicianProfile.findUnique({
      where: { userId: session.id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            avatar: true,
          },
        },
        category: true,
        services: true,
        reviews: {
          include: {
            customer: {
              select: {
                name: true,
                avatar: true,
              },
            },
          },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!profile) return { success: false, error: 'Profile not found' };

    return { success: true, data: profile };
  } catch (error: any) {
    console.error('getMyTechnicianProfile error:', error);
    return { success: false, error: error.message };
  }
}

