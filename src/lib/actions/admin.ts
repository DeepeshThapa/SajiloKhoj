'use server';

import prisma from '../prisma';
import { getSession } from '../auth/session';
import { Role, UserStatus, VerificationStatus, RequestStatus } from '@prisma/client';
import { revalidatePath } from 'next/cache';

async function verifyAdmin() {
  const session = await getSession();
  if (!session || session.role !== Role.ADMIN) {
    throw new Error('Unauthorized: Admin access required');
  }
  return session;
}

export async function getAdminStats() {
  try {
    await verifyAdmin();

    const [
      totalUsers,
      totalTechnicians,
      pendingTechnicians,
      approvedTechnicians,
      totalRequests,
      completedRequests,
      totalReviews,
      categoriesCount,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.technicianProfile.count(),
      prisma.technicianProfile.count({ where: { verificationStatus: VerificationStatus.PENDING } }),
      prisma.technicianProfile.count({ where: { verificationStatus: VerificationStatus.APPROVED } }),
      prisma.serviceRequest.count(),
      prisma.serviceRequest.count({ where: { status: RequestStatus.COMPLETED } }),
      prisma.review.count(),
      prisma.category.count(),
    ]);

    const reviews = await prisma.review.findMany({ select: { rating: true } });
    const avgRating = reviews.length > 0
      ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
      : '5.0';

    return {
      success: true,
      data: {
        totalUsers,
        totalTechnicians,
        pendingTechnicians,
        approvedTechnicians,
        totalRequests,
        completedRequests,
        totalReviews,
        categoriesCount,
        avgRating,
      },
    };
  } catch (error: any) {
    console.error('getAdminStats error:', error);
    return { success: false, error: error.message };
  }
}

export async function getAdminTechnicians(statusFilter?: string, query?: string) {
  try {
    await verifyAdmin();

    const where: any = {};

    if (statusFilter && statusFilter !== 'ALL') {
      where.verificationStatus = statusFilter as VerificationStatus;
    }

    if (query && query.trim() !== '') {
      const q = query.trim();
      where.OR = [
        { user: { name: { contains: q } } },
        { user: { email: { contains: q } } },
        { user: { phone: { contains: q } } },
        { businessName: { contains: q } },
        { city: { contains: q } },
      ];
    }

    const technicians = await prisma.technicianProfile.findMany({
      where,
      include: {
        user: true,
        category: true,
        services: true,
        _count: {
          select: {
            serviceRequests: true,
            reviews: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return { success: true, data: technicians };
  } catch (error: any) {
    console.error('getAdminTechnicians error:', error);
    return { success: false, data: [], error: error.message };
  }
}

export async function updateTechnicianVerification(
  technicianId: string,
  newStatus: VerificationStatus,
  rejectionReason?: string
) {
  try {
    const adminSession = await verifyAdmin();

    const tech = await prisma.technicianProfile.findUnique({
      where: { id: technicianId },
      include: { user: true },
    });

    if (!tech) return { success: false, error: 'Technician not found' };

    const updated = await prisma.technicianProfile.update({
      where: { id: technicianId },
      data: {
        verificationStatus: newStatus,
        rejectionReason: rejectionReason || null,
      },
    });

    // Notify technician
    let message = '';
    let notificationType = 'INFO';
    if (newStatus === VerificationStatus.APPROVED) {
      message = 'Congratulations! 🎉 Your technician application has been APPROVED by the admin. Your profile is now live and searchable by customers.';
      notificationType = 'SUCCESS';
    } else if (newStatus === VerificationStatus.REJECTED) {
      message = `Your technician application was not approved. Reason: ${rejectionReason || 'Documents or criteria did not match requirements.'}`;
      notificationType = 'DANGER';
    } else if (newStatus === VerificationStatus.SUSPENDED) {
      message = 'Your technician account has been suspended by platform administration.';
      notificationType = 'DANGER';
    }

    if (message) {
      await prisma.notification.create({
        data: {
          userId: tech.userId,
          title: `Account Status: ${newStatus}`,
          message,
          link: '/dashboard/technician',
          type: notificationType,
        },
      });
    }

    // Write Admin Log
    await prisma.adminLog.create({
      data: {
        adminId: adminSession.id,
        action: `SET_TECHNICIAN_${newStatus}`,
        targetType: 'TechnicianProfile',
        targetId: technicianId,
        details: `Changed verification status of ${tech.user.name} to ${newStatus}.${rejectionReason ? ` Reason: ${rejectionReason}` : ''}`,
      },
    });

    revalidatePath('/admin');
    revalidatePath('/technicians');
    revalidatePath(`/technicians/${technicianId}`);

    return { success: true, message: `Technician status updated to ${newStatus}`, data: updated };
  } catch (error: any) {
    console.error('updateTechnicianVerification error:', error);
    return { success: false, error: error.message };
  }
}

export async function toggleTechnicianFeatured(technicianId: string, isFeatured: boolean) {
  try {
    const adminSession = await verifyAdmin();

    const updated = await prisma.technicianProfile.update({
      where: { id: technicianId },
      data: { isFeatured },
      include: { user: true },
    });

    await prisma.adminLog.create({
      data: {
        adminId: adminSession.id,
        action: isFeatured ? 'FEATURE_TECHNICIAN' : 'UNFEATURE_TECHNICIAN',
        targetType: 'TechnicianProfile',
        targetId: technicianId,
        details: `${isFeatured ? 'Featured' : 'Unfeatured'} technician ${updated.user.name} on homepage.`,
      },
    });

    revalidatePath('/admin');
    revalidatePath('/');
    revalidatePath('/technicians');

    return { success: true, message: `Technician ${isFeatured ? 'featured' : 'unfeatured'} successfully.`, data: updated };
  } catch (error: any) {
    console.error('toggleTechnicianFeatured error:', error);
    return { success: false, error: error.message };
  }
}

export async function getAdminUsers(roleFilter?: string, query?: string) {
  try {
    await verifyAdmin();

    const where: any = {};
    if (roleFilter && roleFilter !== 'ALL') {
      where.role = roleFilter as Role;
    }

    if (query && query.trim() !== '') {
      const q = query.trim();
      where.OR = [
        { name: { contains: q } },
        { email: { contains: q } },
        { phone: { contains: q } },
      ];
    }

    const users = await prisma.user.findMany({
      where,
      include: {
        technicianProfile: {
          include: { category: true },
        },
        _count: {
          select: {
            serviceRequests: true,
            reviews: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return { success: true, data: users };
  } catch (error: any) {
    console.error('getAdminUsers error:', error);
    return { success: false, data: [], error: error.message };
  }
}

export async function updateUserStatus(userId: string, newStatus: UserStatus) {
  try {
    const adminSession = await verifyAdmin();

    const user = await prisma.user.update({
      where: { id: userId },
      data: { status: newStatus },
    });

    await prisma.adminLog.create({
      data: {
        adminId: adminSession.id,
        action: `SET_USER_STATUS_${newStatus}`,
        targetType: 'User',
        targetId: userId,
        details: `Changed status of user ${user.name} (${user.email}) to ${newStatus}.`,
      },
    });

    revalidatePath('/admin');
    return { success: true, message: `User status changed to ${newStatus}.`, data: user };
  } catch (error: any) {
    console.error('updateUserStatus error:', error);
    return { success: false, error: error.message };
  }
}

export async function deleteUser(userId: string) {
  try {
    const adminSession = await verifyAdmin();

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) return { success: false, error: 'User not found' };

    if (user.id === adminSession.id) {
      return { success: false, error: 'You cannot delete your own admin account.' };
    }

    await prisma.user.delete({ where: { id: userId } });

    await prisma.adminLog.create({
      data: {
        adminId: adminSession.id,
        action: 'DELETE_USER',
        targetType: 'User',
        targetId: userId,
        details: `Deleted user ${user.name} (${user.email}).`,
      },
    });

    revalidatePath('/admin');
    return { success: true, message: 'User deleted successfully.' };
  } catch (error: any) {
    console.error('deleteUser error:', error);
    return { success: false, error: error.message };
  }
}

export async function getAdminCategories() {
  try {
    await verifyAdmin();

    const categories = await prisma.category.findMany({
      include: {
        _count: {
          select: { technicians: true },
        },
      },
      orderBy: { name: 'asc' },
    });

    return { success: true, data: categories };
  } catch (error: any) {
    console.error('getAdminCategories error:', error);
    return { success: false, data: [], error: error.message };
  }
}

export async function createCategory(data: {
  name: string;
  slug: string;
  icon: string;
  description?: string;
}) {
  try {
    const adminSession = await verifyAdmin();

    const existing = await prisma.category.findFirst({
      where: {
        OR: [{ name: data.name }, { slug: data.slug.toLowerCase() }],
      },
    });

    if (existing) {
      return { success: false, error: 'Category with this name or slug already exists.' };
    }

    const created = await prisma.category.create({
      data: {
        name: data.name,
        slug: data.slug.toLowerCase().replace(/\s+/g, '-'),
        icon: data.icon,
        description: data.description,
      },
    });

    await prisma.adminLog.create({
      data: {
        adminId: adminSession.id,
        action: 'CREATE_CATEGORY',
        targetType: 'Category',
        targetId: created.id,
        details: `Created category "${created.name}".`,
      },
    });

    revalidatePath('/admin');
    revalidatePath('/');
    revalidatePath('/services');

    return { success: true, message: 'Category created successfully.', data: created };
  } catch (error: any) {
    console.error('createCategory error:', error);
    return { success: false, error: error.message };
  }
}

export async function updateCategory(
  id: string,
  data: { name?: string; slug?: string; icon?: string; description?: string; isActive?: boolean }
) {
  try {
    const adminSession = await verifyAdmin();

    const updated = await prisma.category.update({
      where: { id },
      data,
    });

    await prisma.adminLog.create({
      data: {
        adminId: adminSession.id,
        action: 'UPDATE_CATEGORY',
        targetType: 'Category',
        targetId: id,
        details: `Updated category "${updated.name}".`,
      },
    });

    revalidatePath('/admin');
    revalidatePath('/');
    revalidatePath('/services');

    return { success: true, message: 'Category updated successfully.', data: updated };
  } catch (error: any) {
    console.error('updateCategory error:', error);
    return { success: false, error: error.message };
  }
}

export async function deleteCategory(id: string) {
  try {
    const adminSession = await verifyAdmin();

    const techs = await prisma.technicianProfile.count({ where: { categoryId: id } });
    if (techs > 0) {
      return { success: false, error: `Cannot delete category: ${techs} technician(s) are assigned to it.` };
    }

    const cat = await prisma.category.delete({ where: { id } });

    await prisma.adminLog.create({
      data: {
        adminId: adminSession.id,
        action: 'DELETE_CATEGORY',
        targetType: 'Category',
        targetId: id,
        details: `Deleted category "${cat.name}".`,
      },
    });

    revalidatePath('/admin');
    revalidatePath('/');
    return { success: true, message: 'Category deleted successfully.' };
  } catch (error: any) {
    console.error('deleteCategory error:', error);
    return { success: false, error: error.message };
  }
}

export async function getAdminRequests(statusFilter?: string) {
  try {
    await verifyAdmin();

    const where: any = {};
    if (statusFilter && statusFilter !== 'ALL') {
      where.status = statusFilter as RequestStatus;
    }

    const requests = await prisma.serviceRequest.findMany({
      where,
      include: {
        customer: true,
        technicianProfile: {
          include: {
            user: true,
            category: true,
          },
        },
        review: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return { success: true, data: requests };
  } catch (error: any) {
    console.error('getAdminRequests error:', error);
    return { success: false, data: [], error: error.message };
  }
}

export async function getAdminReviews() {
  try {
    await verifyAdmin();

    const reviews = await prisma.review.findMany({
      include: {
        customer: true,
        technicianProfile: {
          include: { user: true, category: true },
        },
        serviceRequest: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return { success: true, data: reviews };
  } catch (error: any) {
    console.error('getAdminReviews error:', error);
    return { success: false, data: [], error: error.message };
  }
}

export async function deleteReview(reviewId: string) {
  try {
    const adminSession = await verifyAdmin();

    const review = await prisma.review.findUnique({
      where: { id: reviewId },
      include: { technicianProfile: true },
    });

    if (!review) return { success: false, error: 'Review not found' };

    await prisma.review.delete({ where: { id: reviewId } });

    // Recalculate average rating for the technician
    const allReviews = await prisma.review.findMany({
      where: { technicianProfileId: review.technicianProfileId },
      select: { rating: true },
    });

    const totalRatings = allReviews.reduce((sum, r) => sum + r.rating, 0);
    const avgRating = allReviews.length > 0 ? Number((totalRatings / allReviews.length).toFixed(1)) : 0;

    await prisma.technicianProfile.update({
      where: { id: review.technicianProfileId },
      data: {
        rating: avgRating,
        reviewCount: allReviews.length,
      },
    });

    await prisma.adminLog.create({
      data: {
        adminId: adminSession.id,
        action: 'DELETE_REVIEW',
        targetType: 'Review',
        targetId: reviewId,
        details: `Deleted review ID ${reviewId} for technician ${review.technicianProfile.businessName || review.technicianProfileId}.`,
      },
    });

    revalidatePath('/admin');
    revalidatePath(`/technicians/${review.technicianProfileId}`);

    return { success: true, message: 'Review deleted and technician rating recalculated.' };
  } catch (error: any) {
    console.error('deleteReview error:', error);
    return { success: false, error: error.message };
  }
}

export async function getAdminLogs() {
  try {
    await verifyAdmin();

    const logs = await prisma.adminLog.findMany({
      include: {
        admin: {
          select: { id: true, name: true, email: true },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: 40,
    });

    return { success: true, data: logs };
  } catch (error: any) {
    console.error('getAdminLogs error:', error);
    return { success: false, data: [], error: error.message };
  }
}

export async function getSiteSettings() {
  try {
    const settings = await prisma.siteSetting.findMany();
    const settingsMap: Record<string, string> = {};
    settings.forEach((s) => {
      settingsMap[s.key] = s.value;
    });
    return { success: true, data: settingsMap };
  } catch (error: any) {
    console.error('getSiteSettings error:', error);
    return { success: false, data: {}, error: error.message };
  }
}

export async function updateSiteSetting(key: string, value: string) {
  try {
    const adminSession = await verifyAdmin();

    const setting = await prisma.siteSetting.upsert({
      where: { key },
      update: { value },
      create: { key, value },
    });

    await prisma.adminLog.create({
      data: {
        adminId: adminSession.id,
        action: 'UPDATE_SITE_SETTING',
        targetType: 'SiteSetting',
        targetId: key,
        details: `Updated setting ${key} = "${value}".`,
      },
    });

    revalidatePath('/admin');
    return { success: true, message: 'Setting updated successfully.', data: setting };
  } catch (error: any) {
    console.error('updateSiteSetting error:', error);
    return { success: false, error: error.message };
  }
}
