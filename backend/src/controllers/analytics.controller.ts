import { Response, NextFunction } from 'express';
import { AuthRequest } from '../types';
import * as analyticsService from '../services/analytics.service';

export const getDashboard = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const stats = await analyticsService.getDashboardStats();
    res.json({ success: true, data: stats });
  } catch (error) {
    next(error);
  }
};
