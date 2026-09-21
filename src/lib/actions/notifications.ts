'use server';

import prisma from '../prisma';
import { getSession } from '../auth/session';
import { revalidatePath } from 'next/cache';

export async function getUserNotifications() {
  try {
    const session = await getSession();
    if (!session) {
      return { success: false, data: [], unreadCount: 0 };
    }

    const [notifications, unreadCount] = await Promise.all([
      prisma.notification.findMany({
        where: { userId: session.id },
        orderBy: { createdAt: 'desc' },
        take: 15,
      }),
      prisma.notification.count({
        where: { userId: session.id, isRead: false },
      }),
    ]);

    return {
      success: true,
      data: notifications,
      unreadCount,
    };
  } catch (error: any) {
    console.error('getUserNotifications error:', error);
    return { success: false, data: [], unreadCount: 0, error: error.message };
  }
}

export async function markNotificationRead(id: string) {
  try {
    const session = await getSession();
    if (!session) return { success: false, error: 'Unauthorized' };

    await prisma.notification.updateMany({
      where: { id, userId: session.id },
      data: { isRead: true },
    });

    revalidatePath('/');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function markAllNotificationsRead() {
  try {
    const session = await getSession();
    if (!session) return { success: false, error: 'Unauthorized' };

    await prisma.notification.updateMany({
      where: { userId: session.id, isRead: false },
      data: { isRead: true },
    });

    revalidatePath('/');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
