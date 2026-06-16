import prisma from '../config/prisma';
import { LeaveFilters } from '../types';
import { LeaveStatus, Prisma } from '@prisma/client';
import { sendLeaveStatusEmail } from '../utils/email';

export const getLeaves = async (filters: LeaveFilters) => {
  const where: Prisma.LeaveWhereInput = {};

  if (filters.status) {
    where.status = filters.status as LeaveStatus;
  }

  if (filters.employeeId) {
    where.employeeId = filters.employeeId;
  }

  return prisma.leave.findMany({
    where,
    include: { employee: { select: { id: true, name: true, email: true, department: true } } },
    orderBy: { createdAt: 'desc' },
  });
};

export const createLeave = async (data: {
  employeeId: string; reason: string; fromDate: string; toDate: string;
}) => {
  return prisma.leave.create({
    data: {
      employeeId: data.employeeId,
      reason: data.reason,
      fromDate: new Date(data.fromDate),
      toDate: new Date(data.toDate),
    },
    include: { employee: { select: { id: true, name: true, email: true, department: true } } },
  });
};

export const updateLeaveStatus = async (id: string, status: LeaveStatus) => {
  const leave = await prisma.leave.update({
    where: { id },
    data: { status },
    include: { employee: { select: { id: true, name: true, email: true, department: true } } },
  });

  // Send email notification
  if (leave.employee.email) {
    sendLeaveStatusEmail(
      leave.employee.email,
      leave.employee.name,
      status,
      leave.fromDate.toISOString().split('T')[0],
      leave.toDate.toISOString().split('T')[0]
    ).catch(() => {});
  }

  return leave;
};
