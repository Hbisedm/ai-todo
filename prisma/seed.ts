import { hash } from 'bcryptjs';

import { db } from '../lib/db';

async function main() {
  const email = 'demo@todoweb.dev';
  const passwordHash = await hash('password123', 10);

  const user = await db.user.upsert({
    where: { email },
    update: {
      name: 'Demo User',
      passwordHash
    },
    create: {
      name: 'Demo User',
      email,
      passwordHash
    }
  });

  await db.todo.deleteMany({ where: { userId: user.id } });

  await db.todo.createMany({
    data: [
      {
        userId: user.id,
        title: 'Ship the portfolio TODO app',
        description: 'Tighten the last UI details and verify all routes.',
        priority: 'HIGH',
        status: 'IN_PROGRESS'
      },
      {
        userId: user.id,
        title: 'Prepare deployment environment variables',
        description: 'Set production database and auth secrets before deploy.',
        priority: 'MEDIUM',
        status: 'TODO'
      },
      {
        userId: user.id,
        title: 'Capture polished screenshots',
        description: 'Use the marketing page and dashboard states for your portfolio entry.',
        priority: 'LOW',
        status: 'DONE'
      }
    ]
  });

  console.log('Seed complete');
  console.log(`Demo login: ${email} / password123`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
