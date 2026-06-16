import { Response, NextFunction } from 'express';
import { AuthRequest } from '../types';
import * as attendanceService from '../services/attendance.service';
import { logActivity } from '../utils/logger';
import prisma from '../config/prisma';
import { getIO } from '../sockets';
import { EVENTS } from '../sockets/events';

export const getAll = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const attendance = await attendanceService.getAttendance({
      date: req.query.date as string,
      employeeId: req.query.employeeId as string,
      department: req.query.department as string,
    });
    res.json({ success: true, data: attendance });
  } catch (error) {
    next(error);
  }
};

export const mark = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const record = await attendanceService.markAttendance(req.body);
    await logActivity(prisma, req.user!.id, `Marked attendance: ${record.employee.name} - ${record.status}`);
    getIO().emit(EVENTS.ATTENDANCE_MARKED, record);
    getIO().emit(EVENTS.DASHBOARD_REFRESH);
    res.json({ success: true, data: record });
  } catch (error) {
    next(error);
  }
};

export const bulkMark = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const records = await attendanceService.bulkMarkAttendance(req.body.records);
    await logActivity(prisma, req.user!.id, `Bulk marked attendance for ${records.length} employees`);
    getIO().emit(EVENTS.ATTENDANCE_MARKED, { bulk: true, count: records.length });
    getIO().emit(EVENTS.DASHBOARD_REFRESH);
    res.json({ success: true, data: records });
  } catch (error) {
    next(error);
  }
};

export const getReport = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const month = parseInt(req.query.month as string) || new Date().getMonth() + 1;
    const year = parseInt(req.query.year as string) || new Date().getFullYear();
    const report = await attendanceService.getMonthlyReport(month, year);
    res.json({ success: true, data: report });
  } catch (error) {
    next(error);
  }
};
