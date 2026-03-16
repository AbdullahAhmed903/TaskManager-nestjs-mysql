// prisma/seed.ts
import { PrismaClient } from '../src/generated/prisma/client'; 
import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import * as bcrypt from 'bcrypt';
import 'dotenv/config';

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
  
  const hashedPassword = await bcrypt.hash('Admin@1234', 10);

  const user = await prisma.user.upsert({
    where: { email: 'admin@app.com' },
    update: {},
    create: {
      userName: 'SuperAdmin',
      email: 'admin@app.com',
      password: hashedPassword,
      role:'SUPER_ADMIN',
      isVerified: true,
    },
  });
  
  console.log('SuperAdmin created ✅', user);
}

main()
  .catch((error) => {
    console.error('Seed error:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });