// prisma/seed.js
const { PrismaClient } = require('../dist/src/generated/prisma/client');
const { PrismaMariaDb } = require('@prisma/adapter-mariadb');
const bcrypt = require('bcrypt');
require('dotenv/config');

const adapter = new PrismaMariaDb({
  host: process.env.DB_HOST ?? 'localhost',
  port: Number(process.env.DB_PORT) ?? 3306,
  user: process.env.DB_USER ?? 'root',
  password: process.env.DB_PASSWORD ?? '',
  database: process.env.DB_NAME ?? 'nestjs',
});

const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Starting seed...');
  
  // Create regular admin
  const adminPassword = await bcrypt.hash('Admin@1234', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@app.com' },
    update: {},
    create: {
      userName: 'Admin',
      email: 'admin@app.com',
      password: adminPassword,
      role: 'ADMIN',
      isVerified: true,
    },
  });
  console.log('Admin created ✅', admin);

  // Create super admin
  const superAdminPassword = await bcrypt.hash('SuperAdmin@1234', 10);
  const superAdmin = await prisma.user.upsert({
    where: { email: 'superadmin@app.com' },
    update: {},
    create: {
      userName: 'SuperAdmin',
      email: 'superadmin@app.com',
      password: superAdminPassword,
      role: 'SUPER_ADMIN',
      isVerified: true,
    },
  });
  console.log('SuperAdmin created ✅', superAdmin);
}

main()
  .catch((error) => {
    console.error('Seed error:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
