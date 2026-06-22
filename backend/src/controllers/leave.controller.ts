import { Response, NextFunction } from 'express';
import { AuthRequest } from '../types';
import * as leaveService from '../services/leave.service';
import { logActivity } from '../utils/logger';
import prisma from '../config/prisma';
import { getIO } from '../sockets';
import { EVENTS } from '../sockets/events';

export const getAll = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const leaves = await leaveService.getLeaves({
      status: req.query.status as string,
      employeeId: req.query.employeeId as string,
    });
    res.json({ success: true, data: leaves });
  } catch (error) {
    next(error);
  }
};

export const create = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const leave = await leaveService.createLeave(req.body);
    await logActivity(prisma, req.user!.id, `Created leave request for: ${leave.employee.name}`);
    getIO().emit(EVENTS.LEAVE_CREATED, leave);
    getIO().emit(EVENTS.DASHBOARD_REFRESH);
    res.status(201).json({ success: true, data: leave });
  } catch (error) {
    next(error);
  }
};

export const updateStatus = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const leave = await leaveService.updateLeaveStatus(req.params.id as string, req.body.status);
    await logActivity(
      prisma,
      req.user!.id,
      `${req.body.status} leave for: ${leave.employee.name}`,
      `Leave ID: ${leave.id}`
    );
    getIO().emit(EVENTS.LEAVE_STATUS_CHANGED, leave);
    getIO().emit(EVENTS.DASHBOARD_REFRESH);
    res.json({ success: true, data: leave });
  } catch (error) {
    next(error);
  }
};
