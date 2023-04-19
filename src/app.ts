import { PrismaClient } from '@prisma/client';
import groupBy from 'lodash.groupby';

const prisma = new PrismaClient({
  // log: ['query'],
});

async function main() {
  const shiftsByDate = await prisma.$queryRaw`
  SELECT s.*
  FROM "Shift" s
  INNER JOIN "Worker" w ON s.profession = w.profession
  LEFT JOIN (
    SELECT *
    FROM "Shift"
    WHERE worker_id = 1 AND is_deleted = false
  ) claimed_shift ON s.facility_id = claimed_shift.facility_id 
                  AND s.start <= claimed_shift.end 
                  AND claimed_shift.start <= s.end
  WHERE s.facility_id = 1 
    AND s.is_deleted = false 
    AND s.worker_id IS NULL 
    AND w.id = 1
    AND claimed_shift.id IS NULL`;

  return shiftsByDate;
}

main()
  .then((result) => {
    const result2 = groupBy(
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      result,
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      (shift) => new Date(shift.start).toISOString().split('T')[0],
    );
    console.log(result2);
  })
  .catch(console.error)
  .finally(() => prisma.$disconnect());
