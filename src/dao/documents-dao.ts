import prisma from '@src/db';

export function getFacilityRequiredDocuments(facilityId: number) {
  return prisma.document.findMany({
    distinct: ['id'],
    where: {
      is_active: true,
      requirements: {
        some: {
          facility: {
            id: facilityId,
          },
        },
      },
    },
  });
}

export async function getWorkerDocuments(workerId: number) {
  return prisma.document.findMany({
    distinct: ['id'],
    where: {
      is_active: true,
      workers: {
        some: {
          worker_id: workerId,
        },
      },
    },
  });
}
