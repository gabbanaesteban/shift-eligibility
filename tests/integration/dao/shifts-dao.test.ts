/* eslint-disable prettier/prettier */
import { parseISO, addHours } from 'date-fns';
import type { Facility, Worker } from '@prisma/client';
import { Profession } from '@prisma/client';
import { buildFacility, buildShift, buildWorker } from '@tests/generate';
import prisma from '@src/db';
import { getOpenShiftsByFacilityAndWorker } from '@src/dao/shifts-dao';

async function prepareTestData() {
  const date = parseISO('2023-02-05T00:00:00.000Z');

  const [worker, anotherWorker, facility, anotherFacility] = await Promise.all([
    prisma.worker.create({ data: buildWorker({ profession: Profession.CNA }) }),
    prisma.worker.create({ data: buildWorker({ profession: Profession.LVN }) }),
    prisma.facility.create({ data: buildFacility({ name: 'CEMDOE' }) }),
    prisma.facility.create({ data: buildFacility({ name: 'Hospiten' }) }),
  ]);

  await Promise.all([
    // Shifts
    prisma.shift.createMany({
      data: [
        // Claimed shifts
        buildShift({
          start: addHours(date, 7),
          end: addHours(date, 8),
          profession: worker.profession,
          facility_id: facility.id,
          worker_id: worker.id,
        }),
        buildShift({
          start: addHours(date, 9),
          end: addHours(date, 10),
          profession: worker.profession,
          facility_id: anotherFacility.id,
          worker_id: worker.id,
        }),
        buildShift({
          start: addHours(date, 11),
          end: addHours(date, 12),
          profession: worker.profession,
          facility_id: facility.id,
          worker_id: worker.id,
          is_deleted: true,
        }),

        // Claimed shifts by another worker
        buildShift({
          start: addHours(date, 10),
          end: addHours(date, 11),
          profession: anotherWorker.profession,
          facility_id: facility.id,
          worker_id: anotherWorker.id,
        }),

        // Open shifts
        buildShift({
          start: addHours(date, 6),
          end: addHours(date, 7),
          profession: worker.profession,
          facility_id: facility.id,
        }),
        buildShift({
          start: addHours(date, 8),
          end: addHours(date, 9),
          profession: worker.profession,
          facility_id: facility.id,
        }),
        buildShift({
          start: addHours(date, 11),
          end: addHours(date, 12),
          profession: worker.profession,
          facility_id: facility.id,
        }),

        // Busy shifts
        buildShift({
          start: addHours(date, 9),
          end: addHours(date, 10),
          profession: worker.profession,
          facility_id: facility.id,
        }),

        // Shifts with different profession
        buildShift({
          start: addHours(date, 6),
          end: addHours(date, 7),
          profession: anotherWorker.profession,
          facility_id: facility.id,
        }),

        // Shifts with different facility
        buildShift({
          start: addHours(date, 7),
          end: addHours(date, 7),
          profession: worker.profession,
          facility_id: anotherFacility.id,
        }),

        // Deleted shift
        buildShift({
          start: addHours(date, 13),
          end: addHours(date, 14),
          profession: worker.profession,
          facility_id: facility.id,
          is_deleted: true,
        }),
      ],
    }),
  ]);

  return { worker, facility, date };
}

describe('shifts-dao test suite', () => {
  let worker: Worker;
  let facility: Facility;
  let date: Date;

  beforeAll(async () => {
    const testData = await prepareTestData();
    worker = testData.worker;
    facility = testData.facility;
    date = testData.date;
  });

  it('should not return shift with different profession', async () => {
    const result = await getOpenShiftsByFacilityAndWorker({
      facilityId: facility.id,
      workerId: worker.id,
      profession: Profession.LVN,
      start: date,
      end: addHours(date, 23),
    });

  });

  // it('should return all shifts', async () => {
  //   const result = await getOpenShiftsByFacilityAndWorker({
  //     facilityId: facility.id,
  //     workerId: worker.id,
  //     profession: worker.profession,
  //     start: addHours(date, -4),
  //     end: addHours(date, 20),
  //   });

  //   console.log({ result });
  //   expect(1).toBe(1);
  // });
});
