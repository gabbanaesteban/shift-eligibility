/* eslint-disable prettier/prettier */
import { parseISO, addHours } from 'date-fns';
import type { Facility, Worker } from '@prisma/client';
import { Profession } from '@prisma/client';
import { buildFacility, buildShift, buildWorker } from '@tests/generate';
import prisma from '@src/db';
import { getOpenShiftsByFacilityAndWorker } from '@src/dao/shifts-dao';

async function prepareTestData() {
  const [worker, anotherWorker, facility, anotherFacility] = await Promise.all([
    prisma.worker.create({ data: buildWorker({ profession: Profession.CNA }) }),
    prisma.worker.create({ data: buildWorker({ profession: Profession.LVN }) }),
    prisma.facility.create({ data: buildFacility({ name: 'CEMDOE' }) }),
    prisma.facility.create({ data: buildFacility({ name: 'Hospiten' }) }),
  ]);

  return { worker, anotherWorker, facility, anotherFacility };
}

describe('shifts-dao test suite', () => {
  let worker: Worker;
  let anotherWorker: Worker;
  let facility: Facility;
  let anotherFacility: Facility;

  beforeAll(async () => {
    const testData = await prepareTestData();
    worker = testData.worker;
    anotherWorker = testData.anotherWorker;
    facility = testData.facility;
    anotherFacility = testData.anotherFacility;
  });

  afterEach(async () => {
    await prisma.shift.deleteMany();
  });

  it('should not return shifts with different profession', async () => {
    const date = parseISO('2023-02-05T00:00:00.000Z');

    await prisma.shift.create({
      data: buildShift({
        profession: Profession.LVN,
        start: addHours(date, 1),
        end: addHours(date, 2),
        facility_id: facility.id,
      }),
    });

    const result = await getOpenShiftsByFacilityAndWorker({
      profession: Profession.CNA,
      facilityId: facility.id,
      workerId: worker.id,
      start: date,
      end: addHours(date, 23),
    });

    expect(result).toHaveLength(0);
  });

  it('should not return deleted shifts', async () => {
    const date = parseISO('2023-02-05T00:00:00.000Z');

    await prisma.shift.create({
      data: buildShift({
        is_deleted: true,
        start: addHours(date, 1),
        end: addHours(date, 2),
        profession: Profession.LVN,
        facility_id: facility.id,
      }),
    });

    const result = await getOpenShiftsByFacilityAndWorker({
      facilityId: facility.id,
      workerId: worker.id,
      profession: Profession.LVN,
      start: date,
      end: addHours(date, 23),
    });

    expect(result).toHaveLength(0);
  });

  it('should not return shifts from another facility', async () => {
    const date = parseISO('2023-02-05T00:00:00.000Z');

    await prisma.shift.create({
      data: buildShift({
        facility_id: anotherFacility.id,
        start: addHours(date, 1),
        end: addHours(date, 2),
        profession: Profession.LVN,
      }),
    });

    const result = await getOpenShiftsByFacilityAndWorker({
      facilityId: facility.id,
      workerId: worker.id,
      profession: Profession.LVN,
      start: date,
      end: addHours(date, 23),
    });

    expect(result).toHaveLength(0);
  });

  it('should not return shifts out of the time range', async () => {
    const date = parseISO('2023-02-05T00:00:00.000Z');

    await prisma.shift.create({
      data: buildShift({
        start: addHours(date, 1),
        end: addHours(date, 3),
        profession: Profession.LVN,
        facility_id: facility.id,
      }),
    });

    const result = await getOpenShiftsByFacilityAndWorker({
      facilityId: facility.id,
      workerId: worker.id,
      profession: Profession.LVN,
      start: addHours(date, 1),
      end: addHours(date, 2), // Out of range
    });

    expect(result).toHaveLength(0);
  });

  it('should not return shifts within the same time range as claimed shifts', async () => {
    const date = parseISO('2023-02-05T00:00:00.000Z');

    await prisma.shift.createMany({
      data: [
        buildShift({
          worker_id: worker.id,
          facility_id: anotherFacility.id, // Different facility
          profession: Profession.CNA,
          start: addHours(date, 1),
          end: addHours(date, 2),
        }),
        buildShift({
          worker_id: null,
          facility_id: facility.id,
          profession: Profession.CNA,
          start: addHours(date, 1),
          end: addHours(date, 2),
        }),
      ],
    });

    const result = await getOpenShiftsByFacilityAndWorker({
      facilityId: facility.id,
      workerId: worker.id,
      profession: Profession.CNA,
      start: date,
      end: addHours(date, 23),
    });

    expect(result).toHaveLength(0);
  });

  it('should return shifts within the same time range as claimed shifts if deleted', async () => {
    const date = parseISO('2023-02-05T00:00:00.000Z');

    await prisma.shift.createMany({
      data: [
        buildShift({
          is_deleted: true,
          worker_id: worker.id,
          facility_id: facility.id,
          profession: Profession.CNA,
          start: addHours(date, 1),
          end: addHours(date, 2),
        }),
        buildShift({
          worker_id: null,
          facility_id: facility.id,
          profession: Profession.CNA,
          start: addHours(date, 1),
          end: addHours(date, 2),
        }),
      ],
    });

    const result = await getOpenShiftsByFacilityAndWorker({
      facilityId: facility.id,
      workerId: worker.id,
      profession: Profession.CNA,
      start: date,
      end: addHours(date, 23),
    });

    expect(result).toHaveLength(1);
  });

  it('should not return shifts claimed by another worker', async () => {
    const date = parseISO('2023-02-05T00:00:00.000Z');

    await prisma.shift.createMany({
      data: [
        buildShift({
          worker_id: anotherWorker.id,
          facility_id: facility.id,
          profession: Profession.CNA,
          start: addHours(date, 1),
          end: addHours(date, 2),
        }),
        buildShift({
          worker_id: null,
          facility_id: facility.id,
          profession: Profession.CNA,
          start: addHours(date, 1),
          end: addHours(date, 2),
        }),
      ],
    });

    const result = await getOpenShiftsByFacilityAndWorker({
      facilityId: facility.id,
      workerId: worker.id,
      profession: Profession.CNA,
      start: date,
      end: addHours(date, 23),
    });

    expect(result).toHaveLength(1);
  });

  it('should return shifts that not overlaps worker claimed shifts', async () => {
    const date = parseISO('2023-02-05T00:00:00.000Z');

    await prisma.shift.createMany({
      data: [
        buildShift({
          worker_id: worker.id, // claimed shift
          facility_id: facility.id,
          profession: Profession.CNA,
          start: addHours(date, 7),
          end: addHours(date, 8),
        }),

        // open shifts
        buildShift({
          worker_id: null,
          facility_id: facility.id,
          profession: Profession.CNA,
          start: addHours(date, 6),
          end: addHours(date, 7), // finishes when worker shift starts
        }),
        buildShift({
          worker_id: null,
          facility_id: facility.id,
          profession: Profession.CNA,
          start: addHours(date, 8), // starts when worker shift starts
          end: addHours(date, 9),
        }),
      ],
    });

    const result = await getOpenShiftsByFacilityAndWorker({
      facilityId: facility.id,
      workerId: worker.id,
      profession: Profession.CNA,
      start: date,
      end: addHours(date, 23),
    });

    expect(result).toHaveLength(2);
  });
});
