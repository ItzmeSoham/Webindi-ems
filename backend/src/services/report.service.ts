import prisma from '../config/prisma';
import { generateCSV } from '../utils/csvExport';

export const getEmployeesCSV = async (): Promise<string> => {
  const employees = await prisma.employee.findMany({ orderBy: { name: 'asc' } });

  return generateCSV(employees as any[], [
    { id: 'name', title: 'Name' },
    { id: 'email', title: 'Email' },
    { id: 'phone', title: 'Phone' },
    { id: 'department', title: 'Department' },
    { id: 'designation', title: 'Designation' },
    { id: 'salary', title: 'Salary' },
    { id: 'status', title: 'Status' },
    { id: 'joinDate', title: 'Join Date' },
  ]);
};

export const getAttendanceCSV = async (month: number, year: number): Promise<string> => {
  const startDate = new Date(year, month - 1, 1);
  const endDate = new Date(year, month, 0, 23, 59, 59, 999);

  const attendance = await prisma.attendance.findMany({
    where: { date: { gte: startDate, lte: endDate } },
    include: { employee: { select: { name: true, department: true } } },
    orderBy: [{ date: 'asc' }, { employee: { name: 'asc' } }],
  });

  const data = attendance.map((a) => ({
    employeeName: a.employee.name,
    department: a.employee.department,
    date: a.date.toISOString().split('T')[0],
    status: a.status,
  }));

  return generateCSV(data, [
    { id: 'employeeName', title: 'Employee Name' },
    { id: 'department', title: 'Department' },
    { id: 'date', title: 'Date' },
    { id: 'status', title: 'Status' },
  ]);
};
