import { Response, NextFunction } from 'express';
import { AuthRequest } from '../types';
import * as userService from '../services/user.service';
import { logActivity } from '../utils/logger';
import prisma from '../config/prisma';

export const getAll = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const users = await userService.getAllUsers();
    res.json({ success: true, data: users });
  } catch (error) {
    next(error);
  }
};

export const create = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const user = await userService.createUser(req.body);
    await logActivity(prisma, req.user!.id, `Created user: ${user.name} (${user.role})`);
    res.status(201).json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};

export const update = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const user = await userService.updateUser(req.params.id as string, req.body);
    await logActivity(prisma, req.user!.id, `Updated user: ${user.name}`);
    res.json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};

export const remove = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    await userService.deleteUser(req.params.id as string, req.user!.id);
    await logActivity(prisma, req.user!.id, `Deleted user ID: ${req.params.id}`);
    res.json({ success: true, message: 'User deleted successfully' });
  } catch (error) {
    next(error);
  }
};
