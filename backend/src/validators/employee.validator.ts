import { z } from 'zod';

export const createEmployeeSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  department: z.string().min(1, 'Department is required'),
  designation: z.string().min(1, 'Designation is required'),
  salary: z.number().positive('Salary must be a positive number'),
  status: z.enum(['ACTIVE', 'INACTIVE']).optional(),
});

export const updateEmployeeSchema = z.object({
  name: z.string().min(2).optional(),
  email: z.string().email().optional(),
  phone: z.string().optional().nullable(),
  department: z.string().min(1).optional(),
  designation: z.string().min(1).optional(),
  salary: z.number().positive().optional(),
  status: z.enum(['ACTIVE', 'INACTIVE']).optional(),
});
