import { Response, NextFunction } from 'express';
import { AuthRequest } from '../types';
import * as reportService from '../services/report.service';

export const employeesCSV = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const csv = await reportService.getEmployeesCSV();
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=employees.csv');
    res.send(csv);
  } catch (error) {
    next(error);
  }
};

export const attendanceCSV = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const month = parseInt(req.query.month as string) || new Date().getMonth() + 1;
    const year = parseInt(req.query.year as string) || new Date().getFullYear();
    const csv = await reportService.getAttendanceCSV(month, year);
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename=attendance-${year}-${month}.csv`);
    res.send(csv);
  } catch (error) {
    next(error);
  }
};
