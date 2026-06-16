import { Response, NextFunction } from 'express';
import { AuthRequest } from '../types';
import * as activityLogService from '../services/activityLog.service';

export const getAll = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const result = await activityLogService.getLogs({
      page: parseInt(req.query.page as string) || 1,
      limit: parseInt(req.query.limit as string) || 20,
      userId: req.query.userId as string,
    });
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};
