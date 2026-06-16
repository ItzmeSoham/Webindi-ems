import prisma from '../config/prisma';
import { EmployeeFilters } from '../types';
import { uploadImage } from '../utils/cloudinary';
import { EmployeeStatus, Prisma } from '@prisma/client';

export const getAllEmployees = async (filters: EmployeeFilters) => {
  const where: Prisma.EmployeeWhereInput = {};

  if (filters.search) {
    where.OR = [
      { name: { contains: filters.search, mode: 'insensitive' } },
      { email: { contains: filters.search, mode: 'insensitive' } },
    ];
  }

  if (filters.department) {
    where.department = filters.department;
  }

  if (filters.status) {
    where.status = filters.status as EmployeeStatus;
  }

  return prisma.employee.findMany({
    where,
    orderBy: { createdAt: 'desc' },
  });
};

export const getEmployeeById = async (id: string) => {
  const employee = await prisma.employee.findUnique({
    where: { id },
    include: {
      attendance: { orderBy: { date: 'desc' }, take: 30 },
      leaves: { orderBy: { createdAt: 'desc' } },
    },
  });

  if (!employee) {
    const error = new Error('Employee not found');
    (error as any).statusCode = 404;
    throw error;
  }

  return employee;
};

export const createEmployee = async (data: {
  name: string; email: string; phone?: string; department: string;
  designation: string; salary: number; status?: EmployeeStatus;
}) => {
  return prisma.employee.create({ data });
};

export const updateEmployee = async (id: string, data: Partial<{
  name: string; email: string; phone: string | null; department: string;
  designation: string; salary: number; status: EmployeeStatus;
}>) => {
  return prisma.employee.update({ where: { id }, data });
};

export const deleteEmployee = async (id: string) => {
  return prisma.employee.delete({ where: { id } });
};

export const uploadEmployeeAvatar = async (id: string, fileBuffer: Buffer) => {
  const { url } = await uploadImage(fileBuffer, 'ems-avatars');
  return prisma.employee.update({
    where: { id },
    data: { avatarUrl: url },
  });
};
