import prisma from '../config/prisma';
import { LogFilters } from '../types';
import { Prisma } from '@prisma/client';

export const getLogs = async (filters: LogFilters) => {
  const page = filters.page || 1;
  const limit = filters.limit || 20;
  const skip = (page - 1) * limit;

  const where: Prisma.ActivityLogWhereInput = {};

  if (filters.userId) {
    where.userId = filters.userId;
  }

  const [logs, total] = await Promise.all([
    prisma.activityLog.findMany({
      where,
      include: { user: { select: { id: true, name: true, email: true, role: true } } },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
    }),
    prisma.activityLog.count({ where }),
  ]);

  return {
    logs,
    total,
    page,
    totalPages: Math.ceil(total / limit),
  };
};
