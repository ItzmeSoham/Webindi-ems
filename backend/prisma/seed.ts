import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  const adminEmail = process.env.SUPERADMIN_EMAIL || 'admin@ems.com';
  const adminPassword = process.env.SUPERADMIN_PASSWORD || 'Admin@123456';

  // Create SuperAdmin
  const hashedAdmin = await bcrypt.hash(adminPassword, 12);
  const superadmin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      name: 'Super Admin',
      email: adminEmail,
      password: hashedAdmin,
      role: 'SUPERADMIN',
    },
  });
  console.log(`✅ SuperAdmin: ${superadmin.email}`);

  // Create sample HR users
  const hrUsers = [
    { name: 'Ananya', email: 'ananya@ems.com', password: 'Hr1@123456' },
    { name: 'Tiyasha', email: 'tiyasha@ems.com', password: 'Hr2@123456' },
    { name: 'Moubani', email: 'moubani@ems.com', password: 'Hr3@123456' },
  ];

  for (const hr of hrUsers) {
    const hashed = await bcrypt.hash(hr.password, 12);
    await prisma.user.upsert({
      where: { email: hr.email },
      update: {},
      create: { name: hr.name, email: hr.email, password: hashed, role: 'HR' },
    });
    console.log(`✅ HR User: ${hr.email}`);
  }

  // Create Director
  const directorHash = await bcrypt.hash('Director@123456', 12);
  await prisma.user.upsert({
    where: { email: 'director@ems.com' },
    update: {},
    create: {
      name: 'James Wilson',
      email: 'director@ems.com',
      password: directorHash,
      role: 'DIRECTOR',
    },
  });
  console.log('✅ Director: director@ems.com');

  // Create sample employees
  const employees = [
    { name: 'Alice Brown', email: 'alice@company.com', phone: '+1234567890', department: 'Engineering', designation: 'Senior Developer', salary: 95000 },
    { name: 'Bob Williams', email: 'bob@company.com', phone: '+1234567891', department: 'Engineering', designation: 'Full Stack Developer', salary: 85000 },
    { name: 'Carol Martinez', email: 'carol@company.com', phone: '+1234567892', department: 'Design', designation: 'UI/UX Designer', salary: 78000 },
    { name: 'David Lee', email: 'david@company.com', phone: '+1234567893', department: 'Marketing', designation: 'Marketing Manager', salary: 82000 },
    { name: 'Eva Garcia', email: 'eva@company.com', phone: '+1234567894', department: 'HR', designation: 'HR Coordinator', salary: 65000 },
    { name: 'Frank Taylor', email: 'frank@company.com', phone: '+1234567895', department: 'Finance', designation: 'Financial Analyst', salary: 88000 },
    { name: 'Grace Kim', email: 'grace@company.com', phone: '+1234567896', department: 'Engineering', designation: 'DevOps Engineer', salary: 92000 },
    { name: 'Henry Patel', email: 'henry@company.com', phone: '+1234567897', department: 'Operations', designation: 'Operations Lead', salary: 75000 },
    { name: 'Iris Nguyen', email: 'iris@company.com', phone: '+1234567898', department: 'Sales', designation: 'Sales Executive', salary: 70000 },
    { name: 'Jack Robinson', email: 'jack@company.com', phone: '+1234567899', department: 'Engineering', designation: 'Junior Developer', salary: 60000 },
  ];

  for (const emp of employees) {
    await prisma.employee.upsert({
      where: { email: emp.email },
      update: {},
      create: emp,
    });
  }
  console.log(`✅ Created ${employees.length} sample employees`);

  // Create sample attendance for today
  const allEmployees = await prisma.employee.findMany();
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const statuses: Array<'PRESENT' | 'ABSENT' | 'LATE'> = ['PRESENT', 'PRESENT', 'PRESENT', 'LATE', 'ABSENT'];

  for (const emp of allEmployees) {
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    await prisma.attendance.upsert({
      where: { employeeId_date: { employeeId: emp.id, date: today } },
      update: { status },
      create: { employeeId: emp.id, date: today, status },
    });
  }
  console.log('✅ Created sample attendance records');

  // Create sample leave requests
  const leaveEmployees = allEmployees.slice(0, 3);
  for (const emp of leaveEmployees) {
    await prisma.leave.create({
      data: {
        employeeId: emp.id,
        reason: 'Personal leave for family event',
        fromDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        toDate: new Date(Date.now() + 9 * 24 * 60 * 60 * 1000),
        status: 'PENDING',
      },
    });
  }
  console.log('✅ Created sample leave requests');

  // Log seed activity
  await prisma.activityLog.create({
    data: { userId: superadmin.id, action: 'Database seeded with sample data' },
  });

  console.log('\n🎉 Database seeding complete!');
  console.log('\n📋 Login Credentials:');
  console.log('  SuperAdmin: admin@ems.com / Admin@123456');
  console.log('  HR: ananya@ems.com / Hr1@123456');
  console.log('  HR: tiyasha@ems.com / Hr2@123456');
  console.log('  HR: moubani@ems.com / Hr3@123456');
  console.log('  Director: director@ems.com / Director@123456');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
