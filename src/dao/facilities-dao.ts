import prisma from '@src/db';

export function getActiveFacility(facilityId: number) {
  return prisma.facility.findFirst({
    where: { id: facilityId, is_active: true },
  });
}
