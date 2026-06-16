import { PrismaClient } from '@prisma/client';

export const logActivity = async (
  prisma: PrismaClient,
  userId: string,
  action: string,
  details?: string
): Promise<void> => {
  try {
    await prisma.activityLog.create({
      data: { userId, action, details },
    });
  } catch (error) {
    console.error('Failed to log activity:', error);
  }
};
