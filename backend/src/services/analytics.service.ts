import prisma from '../config/prisma';

export const getDashboardStats = async () => {
  const [totalEmployees, activeEmployees, pendingLeaves, todayAttendance, departments, recentActivity] =
    await Promise.all([
      prisma.employee.count(),
      prisma.employee.count({ where: { status: 'ACTIVE' } }),
      prisma.leave.count({ where: { status: 'PENDING' } }),
      (() => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        return prisma.attendance.findMany({
          where: { date: { gte: today, lt: tomorrow } },
        });
      })(),
      prisma.employee.groupBy({
        by: ['department'],
        _count: { id: true },
        where: { status: 'ACTIVE' },
      }),
      prisma.activityLog.findMany({
        take: 10,
        orderBy: { createdAt: 'desc' },
        include: { user: { select: { id: true, name: true, email: true, role: true } } },
      }),
    ]);

  const totalToday = todayAttendance.length;
  const presentToday = todayAttendance.filter(
    (a) => a.status === 'PRESENT' || a.status === 'LATE'
  ).length;
  const attendanceRate = totalToday > 0 ? Math.round((presentToday / totalToday) * 100) : 0;

  const departmentDistribution = departments.map((d) => ({
    department: d.department,
    count: d._count.id,
  }));

  return {
    totalEmployees,
    activeEmployees,
    attendanceRate,
    pendingLeaves,
    departmentDistribution,
    recentActivity,
  };
};
