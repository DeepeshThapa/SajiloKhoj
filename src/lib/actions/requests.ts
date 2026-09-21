'use server';

import prisma from '../prisma';
import { getSession } from '../auth/session';
import { RequestStatus, Role } from '@prisma/client';
import { revalidatePath } from 'next/cache';

export interface CreateRequestInput {
  technicianProfileId: string;
  serviceTitle: string;
  description: string;
  preferredDate: string;
  preferredTime: string;
  address: string;
  phone: string;
  notes?: string;
  imageUrl?: string;
}

export async function createServiceRequest(input: CreateRequestInput) {
  try {
    const session = await getSession();
    if (!session) {
      return { success: false, error: 'You must be logged in to request a service.' };
    }

    if (session.role === Role.TECHNICIAN) {
      return { success: false, error: 'Technician accounts cannot book other technicians. Please use a customer account.' };
    }

    const {
      technicianProfileId,
      serviceTitle,
      description,
      preferredDate,
      preferredTime,
      address,
      phone,
      notes,
      imageUrl,
    } = input;

    if (!technicianProfileId || !serviceTitle || !description || !preferredDate || !preferredTime || !address || !phone) {
      return { success: false, error: 'Please fill in all required fields.' };
    }

    const technician = await prisma.technicianProfile.findUnique({
      where: { id: technicianProfileId },
      include: { user: true },
    });

    if (!technician) {
      return { success: false, error: 'Technician not found.' };
    }

    const newRequest = await prisma.serviceRequest.create({
      data: {
        customerId: session.id,
        technicianProfileId,
        serviceTitle,
        description,
        preferredDate,
        preferredTime,
        address,
        phone,
        notes,
        imageUrl,
        status: RequestStatus.PENDING,
      },
    });

    // Notify the technician
    await prisma.notification.create({
      data: {
        userId: technician.userId,
        title: 'New Service Request 🛠️',
        message: `${session.name} requested "${serviceTitle}" for ${preferredDate} at ${preferredTime}.`,
        link: '/dashboard/technician',
        type: 'INFO',
      },
    });

    revalidatePath('/dashboard/customer');
    revalidatePath('/dashboard/technician');

    return {
      success: true,
      message: 'Service request sent successfully! The technician will review your booking.',
      data: newRequest,
    };
  } catch (error: any) {
    console.error('createServiceRequest error:', error);
    return { success: false, error: error.message || 'Failed to create service request.' };
  }
}

export async function getCustomerRequests(statusFilter?: string) {
  try {
    const session = await getSession();
    if (!session) {
      return { success: false, data: [], error: 'Not authenticated' };
    }

    const where: any = { customerId: session.id };
    if (statusFilter && statusFilter !== 'ALL') {
      where.status = statusFilter as RequestStatus;
    }

    const requests = await prisma.serviceRequest.findMany({
      where,
      include: {
        technicianProfile: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                phone: true,
                avatar: true,
                email: true,
              },
            },
            category: true,
          },
        },
        review: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return { success: true, data: requests };
  } catch (error: any) {
    console.error('getCustomerRequests error:', error);
    return { success: false, data: [], error: error.message };
  }
}

export async function getTechnicianRequests(statusFilter?: string) {
  try {
    const session = await getSession();
    if (!session) {
      return { success: false, data: [], error: 'Not authenticated' };
    }

    const profile = await prisma.technicianProfile.findUnique({
      where: { userId: session.id },
    });

    if (!profile) {
      return { success: false, data: [], error: 'Technician profile not found' };
    }

    const where: any = { technicianProfileId: profile.id };
    if (statusFilter && statusFilter !== 'ALL') {
      where.status = statusFilter as RequestStatus;
    }

    const requests = await prisma.serviceRequest.findMany({
      where,
      include: {
        customer: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            avatar: true,
          },
        },
        review: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return { success: true, data: requests };
  } catch (error: any) {
    console.error('getTechnicianRequests error:', error);
    return { success: false, data: [], error: error.message };
  }
}

export async function updateRequestStatus(
  requestId: string,
  newStatus: RequestStatus,
  cancelReason?: string
) {
  try {
    const session = await getSession();
    if (!session) {
      return { success: false, error: 'Unauthorized.' };
    }

    const request = await prisma.serviceRequest.findUnique({
      where: { id: requestId },
      include: {
        technicianProfile: { include: { user: true } },
        customer: true,
      },
    });

    if (!request) {
      return { success: false, error: 'Request not found.' };
    }

    const isTechnician = request.technicianProfile.userId === session.id;
    const isCustomer = request.customerId === session.id;
    const isAdmin = session.role === Role.ADMIN;

    if (!isTechnician && !isCustomer && !isAdmin) {
      return { success: false, error: 'Permission denied.' };
    }

    // Customer can only cancel if request is still PENDING
    if (isCustomer && !isAdmin && !isTechnician) {
      if (newStatus !== RequestStatus.CANCELLED) {
        return { success: false, error: 'Customers can only cancel pending requests.' };
      }
      if (request.status !== RequestStatus.PENDING) {
        return { success: false, error: 'Cannot cancel a request that has already been accepted or started.' };
      }
    }

    const updated = await prisma.serviceRequest.update({
      where: { id: requestId },
      data: {
        status: newStatus,
        cancelReason: cancelReason || undefined,
      },
    });

    // Notify parties based on status
    if (newStatus === RequestStatus.ACCEPTED) {
      await prisma.notification.create({
        data: {
          userId: request.customerId,
          title: 'Request Accepted! 🎉',
          message: `${request.technicianProfile.user.name} accepted your request for "${request.serviceTitle}".`,
          link: '/dashboard/customer',
          type: 'SUCCESS',
        },
      });
    } else if (newStatus === RequestStatus.REJECTED) {
      await prisma.notification.create({
        data: {
          userId: request.customerId,
          title: 'Request Declined',
          message: `${request.technicianProfile.user.name} was unable to accept your request: "${request.serviceTitle}". Reason: ${cancelReason || 'Technician unavailable'}.`,
          link: '/dashboard/customer',
          type: 'DANGER',
        },
      });
    } else if (newStatus === RequestStatus.IN_PROGRESS) {
      await prisma.notification.create({
        data: {
          userId: request.customerId,
          title: 'Work In Progress 🔧',
          message: `${request.technicianProfile.user.name} has started work on "${request.serviceTitle}".`,
          link: '/dashboard/customer',
          type: 'INFO',
        },
      });
    } else if (newStatus === RequestStatus.COMPLETED) {
      await prisma.notification.create({
        data: {
          userId: request.customerId,
          title: 'Service Completed! ⭐',
          message: `Your service "${request.serviceTitle}" is complete. Please leave a rating and review for ${request.technicianProfile.user.name}.`,
          link: '/dashboard/customer',
          type: 'SUCCESS',
        },
      });
    } else if (newStatus === RequestStatus.CANCELLED) {
      await prisma.notification.create({
        data: {
          userId: request.technicianProfile.userId,
          title: 'Request Cancelled',
          message: `${request.customer.name} cancelled their request for "${request.serviceTitle}". Reason: ${cancelReason || 'No reason provided'}.`,
          link: '/dashboard/technician',
          type: 'WARNING',
        },
      });
    }

    revalidatePath('/dashboard/customer');
    revalidatePath('/dashboard/technician');
    revalidatePath('/admin');

    return {
      success: true,
      message: `Request status updated to ${newStatus}.`,
      data: updated,
    };
  } catch (error: any) {
    console.error('updateRequestStatus error:', error);
    return { success: false, error: error.message };
  }
}
