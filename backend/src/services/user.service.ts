import prisma from '../config/prisma';
import { hashPassword } from '../utils/password';
import { Role } from '@prisma/client';

const userSelect = {
  id: true, name: true, email: true, role: true, isActive: true, createdAt: true, updatedAt: true,
};

export const getAllUsers = async () => {
  return prisma.user.findMany({ select: userSelect, orderBy: { createdAt: 'desc' } });
};

export const createUser = async (data: { name: string; email: string; password: string; role: Role }) => {
  const hashed = await hashPassword(data.password);
  return prisma.user.create({
    data: { ...data, password: hashed },
    select: userSelect,
  });
};

export const updateUser = async (id: string, data: { name?: string; email?: string; role?: Role; isActive?: boolean }) => {
  return prisma.user.update({
    where: { id },
    data,
    select: userSelect,
  });
};

export const deleteUser = async (id: string, requesterId: string) => {
  if (id === requesterId) {
    const error = new Error('Cannot delete your own account');
    (error as any).statusCode = 400;
    throw error;
  }
  return prisma.user.delete({ where: { id } });
};
