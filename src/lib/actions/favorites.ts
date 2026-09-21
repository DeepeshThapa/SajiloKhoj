'use server';

import prisma from '../prisma';
import { getSession } from '../auth/session';
import { revalidatePath } from 'next/cache';

export async function toggleFavorite(technicianProfileId: string) {
  try {
    const session = await getSession();
    if (!session) {
      return { success: false, error: 'Please log in to save favorites.', isFavorite: false };
    }

    const existing = await prisma.favorite.findUnique({
      where: {
        customerId_technicianProfileId: {
          customerId: session.id,
          technicianProfileId,
        },
      },
    });

    if (existing) {
      await prisma.favorite.delete({
        where: { id: existing.id },
      });
      revalidatePath('/dashboard/customer');
      return { success: true, isFavorite: false, message: 'Removed from saved favorites.' };
    } else {
      await prisma.favorite.create({
        data: {
          customerId: session.id,
          technicianProfileId,
        },
      });
      revalidatePath('/dashboard/customer');
      return { success: true, isFavorite: true, message: 'Saved to your favorites! ❤️' };
    }
  } catch (error: any) {
    console.error('toggleFavorite error:', error);
    return { success: false, error: error.message, isFavorite: false };
  }
}

export async function getCustomerFavorites() {
  try {
    const session = await getSession();
    if (!session) {
      return { success: false, data: [], error: 'Not logged in' };
    }

    const favorites = await prisma.favorite.findMany({
      where: { customerId: session.id },
      include: {
        technicianProfile: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                phone: true,
                avatar: true,
              },
            },
            category: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return { success: true, data: favorites };
  } catch (error: any) {
    console.error('getCustomerFavorites error:', error);
    return { success: false, data: [], error: error.message };
  }
}

export async function getFavoriteIds(): Promise<string[]> {
  try {
    const session = await getSession();
    if (!session) return [];

    const favs = await prisma.favorite.findMany({
      where: { customerId: session.id },
      select: { technicianProfileId: true },
    });

    return favs.map((f) => f.technicianProfileId);
  } catch {
    return [];
  }
}
