import prisma from '@src/db';

export function getActiveWorker(workerId: number) {
  return prisma.worker.findFirst({
    where: { id: workerId, is_active: true },
  });
}
