import { Response, NextFunction } from 'express';
import { AuthRequest } from '../types';
import * as employeeService from '../services/employee.service';
import { logActivity } from '../utils/logger';
import prisma from '../config/prisma';
import { getIO } from '../sockets';
import { EVENTS } from '../sockets/events';

export const getAll = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const employees = await employeeService.getAllEmployees({
      search: req.query.search as string,
      department: req.query.department as string,
      status: req.query.status as string,
    });
    res.json({ success: true, data: employees });
  } catch (error) {
    next(error);
  }
};

export const getById = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const employee = await employeeService.getEmployeeById(req.params.id);
    res.json({ success: true, data: employee });
  } catch (error) {
    next(error);
  }
};

export const create = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const employee = await employeeService.createEmployee(req.body);
    await logActivity(prisma, req.user!.id, `Created employee: ${employee.name}`, `Department: ${employee.department}`);
    getIO().emit(EVENTS.EMPLOYEE_CREATED, employee);
    getIO().emit(EVENTS.DASHBOARD_REFRESH);
    res.status(201).json({ success: true, data: employee });
  } catch (error) {
    next(error);
  }
};

export const update = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const employee = await employeeService.updateEmployee(req.params.id, req.body);
    await logActivity(prisma, req.user!.id, `Updated employee: ${employee.name}`, JSON.stringify(req.body));
    getIO().emit(EVENTS.EMPLOYEE_UPDATED, employee);
    getIO().emit(EVENTS.DASHBOARD_REFRESH);
    res.json({ success: true, data: employee });
  } catch (error) {
    next(error);
  }
};

export const remove = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    await employeeService.deleteEmployee(req.params.id);
    await logActivity(prisma, req.user!.id, `Deleted employee ID: ${req.params.id}`);
    getIO().emit(EVENTS.EMPLOYEE_DELETED, { id: req.params.id });
    getIO().emit(EVENTS.DASHBOARD_REFRESH);
    res.json({ success: true, message: 'Employee deleted successfully' });
  } catch (error) {
    next(error);
  }
};

export const uploadAvatar = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.file) {
      res.status(400).json({ success: false, message: 'No file uploaded' });
      return;
    }
    const employee = await employeeService.uploadEmployeeAvatar(req.params.id, req.file.buffer);
    await logActivity(prisma, req.user!.id, `Updated avatar for: ${employee.name}`);
    getIO().emit(EVENTS.EMPLOYEE_UPDATED, employee);
    res.json({ success: true, data: employee });
  } catch (error) {
    next(error);
  }
};
