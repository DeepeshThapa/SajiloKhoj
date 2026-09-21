'use server';

import prisma from '../prisma';

export async function getCategories() {
  try {
    const categories = await prisma.category.findMany({
      where: { isActive: true },
      include: {
        _count: {
          select: {
            technicians: {
              where: {
                verificationStatus: 'APPROVED',
                user: { status: 'ACTIVE' },
              },
            },
          },
        },
      },
      orderBy: { name: 'asc' },
    });
    return { success: true, data: categories };
  } catch (error: any) {
    console.error('Error fetching categories:', error);
    return { success: false, data: [], error: error.message };
  }
}

export async function getLocations() {
  try {
    const locations = await prisma.locationItem.findMany({
      orderBy: { name: 'asc' },
    });
    return { success: true, data: locations };
  } catch (error: any) {
    console.error('Error fetching locations:', error);
    return { success: false, data: [], error: error.message };
  }
}
