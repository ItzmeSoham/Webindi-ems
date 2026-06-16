import { z } from 'zod';

export const markAttendanceSchema = z.object({
  employeeId: z.string().min(1, 'Employee ID is required'),
  date: z.string().min(1, 'Date is required'),
  status: z.enum(['PRESENT', 'ABSENT', 'LATE'], {
    errorMap: () => ({ message: 'Status must be PRESENT, ABSENT, or LATE' }),
  }),
});

export const bulkAttendanceSchema = z.object({
  records: z.array(
    z.object({
      employeeId: z.string().min(1),
      date: z.string().min(1),
      status: z.enum(['PRESENT', 'ABSENT', 'LATE']),
    })
  ).min(1, 'At least one record is required'),
});
