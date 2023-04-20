import type { Shift } from '@prisma/client';
import prisma from '@src/db';
import { format } from 'date-fns';

type GetOpenShiftsByFacilityAndWorkerParams = {
  facilityId: number;
  workerId: number;
  profession: string;
  start: Date;
  end: Date;
};

export function getOpenShiftsByFacilityAndWorker(params: GetOpenShiftsByFacilityAndWorkerParams) {
  const { facilityId, workerId, profession, start, end } = params;

  return prisma.$queryRawUnsafe<Shift[]>(`
  SELECT
    s.*
  FROM
    "Shift" s
  WHERE
    s.facility_id = ${facilityId}
    AND s.is_deleted = FALSE
    AND s.worker_id IS NULL
    AND s.profession = '${profession}'
    AND s.start >= '${format(start, 'yyyy-MM-dd HH:mm:ss')}'
    AND s. "end" <= '${format(end, 'yyyy-MM-dd HH:mm:ss')}'
    AND NOT EXISTS (
      SELECT
        1
      FROM
        "Shift" claimed_shift
      WHERE
        claimed_shift.worker_id = ${workerId}
        AND claimed_shift.is_deleted = FALSE
        AND s.facility_id = claimed_shift.facility_id
        AND NOT(s. "start" >= claimed_shift. "end"
          OR s. "end" <= claimed_shift. "start"))`);
}
