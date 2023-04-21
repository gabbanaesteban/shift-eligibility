/* eslint-disable prettier/prettier */
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

  const formattedStart = format(start, 'yyyy-MM-dd HH:mm:ss');
  const formattedEnd = format(end, 'yyyy-MM-dd HH:mm:ss');

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
      AND tsrange(s.start, s. "end") && tsrange('${formattedStart}', '${formattedEnd}')
      AND NOT EXISTS (
        SELECT
          1
        FROM
          "Shift" claimed_shift
        WHERE
          claimed_shift.worker_id = ${workerId}
          AND claimed_shift.is_deleted = FALSE
          AND tsrange(claimed_shift.start, claimed_shift. "end", '()') && tsrange(s.start, s. "end", '()')
        )`);
}
