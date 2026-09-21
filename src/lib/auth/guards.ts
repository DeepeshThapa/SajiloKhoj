import { getSession } from './session';
import prisma from '../prisma';
import { Role } from '@prisma/client';
import { redirect } from 'next/navigation';

export async function getCurrentUser() {
  const session = await getSession();
  if (!session?.userId) return null;

  try {
    const user = await prisma.user.findUnique({
      where: { id: session.userId },
      include: {
        technicianProfile: {
          include: {
            category: true,
          },
        },
      },
    });

    if (!user || user.status === 'SUSPENDED') {
      return null;
    }

    return user;
  } catch (error) {
    console.error('Error fetching current user:', error);
    return null;
  }
}

export async function requireAuth() {
  const user = await getCurrentUser();
  if (!user) {
    redirect('/login');
  }
  return user;
}

export async function requireRole(allowedRoles: Role[]) {
  const user = await requireAuth();
  if (!allowedRoles.includes(user.role)) {
    redirect('/unauthorized');
  }
  return user;
}
