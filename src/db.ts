import { PrismaClient } from '@prisma/client';
import pc from 'picocolors';

const logThreshold = 500;

const prisma = new PrismaClient({
  log: [
    { level: 'query', emit: 'event' },
    { level: 'error', emit: 'stdout' },
    { level: 'info', emit: 'stdout' },
    { level: 'warn', emit: 'stdout' },
  ],
});

prisma.$on('query', async (e) => {
  if (e.duration < logThreshold) return;
  const color =
    e.duration < logThreshold * 1.1
      ? pc.green
      : e.duration < logThreshold * 1.2
      ? pc.blue
      : e.duration < logThreshold * 1.3
      ? pc.yellow
      : e.duration < logThreshold * 1.4
      ? pc.magenta
      : pc.red;
  const dur = color(`${e.duration}ms`);
  console.info(`prisma:query - ${dur} - ${e.query}`);
});

export default prisma;
