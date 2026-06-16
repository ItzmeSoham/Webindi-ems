import prisma from '../config/prisma';
import { AttendanceFilters } from '../types';
import { AttendanceStatus, Prisma } from '@prisma/client';

export const getAttendance = async (filters: AttendanceFilters) => {
  const where: Prisma.AttendanceWhereInput = {};

  if (filters.date) {
    const dateStart = new Date(filters.date);
    dateStart.setHours(0, 0, 0, 0);
    const dateEnd = new Date(filters.date);
    dateEnd.setHours(23, 59, 59, 999);
    where.date = { gte: dateStart, lte: dateEnd };
  }

  if (filters.employeeId) {
    where.employeeId = filters.employeeId;
  }

  if (filters.department) {
    where.employee = { department: filters.department };
  }

  return prisma.attendance.findMany({
    where,
    include: { employee: { select: { id: true, name: true, department: true } } },
    orderBy: { date: 'desc' },
  });
};

export const markAttendance = async (data: { employeeId: string; date: string; status: AttendanceStatus }) => {
  const attendanceDate = new Date(data.date);
  attendanceDate.setHours(0, 0, 0, 0);

  return prisma.attendance.upsert({
    where: {
      employeeId_date: {
        employeeId: data.employeeId,
        date: attendanceDate,
      },
    },
    update: { status: data.status },
    create: {
      employeeId: data.employeeId,
      date: attendanceDate,
      status: data.status,
    },
    include: { employee: { select: { id: true, name: true, department: true } } },
  });
};

export const bulkMarkAttendance = async (
  records: { employeeId: string; date: string; status: AttendanceStatus }[]
) => {
  return prisma.$transaction(
    records.map((record) => {
      const attendanceDate = new Date(record.date);
      attendanceDate.setHours(0, 0, 0, 0);
      return prisma.attendance.upsert({
        where: {
          employeeId_date: {
            employeeId: record.employeeId,
            date: attendanceDate,
          },
        },
        update: { status: record.status },
        create: {
          employeeId: record.employeeId,
          date: attendanceDate,
          status: record.status,
        },
      });
    })
  );
};

export const getMonthlyReport = async (month: number, year: number) => {
  const startDate = new Date(year, month - 1, 1);
  const endDate = new Date(year, month, 0, 23, 59, 59, 999);

  const attendance = await prisma.attendance.findMany({
    where: { date: { gte: startDate, lte: endDate } },
    include: { employee: { select: { id: true, name: true, department: true } } },
  });

  const employees = await prisma.employee.findMany({
    where: { status: 'ACTIVE' },
    select: { id: true, name: true, department: true },
  });

  const report = employees.map((emp) => {
    const empAttendance = attendance.filter((a) => a.employeeId === emp.id);
    const present = empAttendance.filter((a) => a.status === 'PRESENT').length;
    const absent = empAttendance.filter((a) => a.status === 'ABSENT').length;
    const late = empAttendance.filter((a) => a.status === 'LATE').length;
    const totalDays = present + absent + late;

    return {
      employeeId: emp.id,
      employeeName: emp.name,
      department: emp.department,
      present,
      absent,
      late,
      totalDays,
      attendanceRate: totalDays > 0 ? Math.round(((present + late) / totalDays) * 100) : 0,
    };
  });

  return report;
};
