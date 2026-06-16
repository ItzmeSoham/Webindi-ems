import { z } from 'zod';

export const createLeaveSchema = z.object({
  employeeId: z.string().min(1, 'Employee ID is required'),
  reason: z.string().min(3, 'Reason must be at least 3 characters'),
  fromDate: z.string().min(1, 'From date is required'),
  toDate: z.string().min(1, 'To date is required'),
});

export const updateLeaveStatusSchema = z.object({
  status: z.enum(['APPROVED', 'REJECTED'], {
    errorMap: () => ({ message: 'Status must be APPROVED or REJECTED' }),
  }),
});
