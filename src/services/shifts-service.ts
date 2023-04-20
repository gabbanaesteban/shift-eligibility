import type { GetFacilityOpenShiftsParams } from '@src/types';
import { NotFound, BadRequest } from 'http-errors';
import { getFacilityRequiredDocuments, getWorkerDocuments } from '@src/dao/documents-dao';
import { getActiveWorker } from '@src/dao/workers-dao';
import { getActiveFacility } from '@src/dao/facilities-dao';
import { getOpenShiftsByFacilityAndWorker } from '@src/dao/shifts-dao';
import groupBy from 'lodash.groupby';

export async function getFacilityOpenShifts(params: GetFacilityOpenShiftsParams) {
  const { facilityId, workerId, start, end } = params;

  const [worker, facility, workerDocuments, facilityRequirements] = await Promise.all([
    getActiveWorker(workerId),
    getActiveFacility(facilityId),
    getWorkerDocuments(workerId),
    getFacilityRequiredDocuments(facilityId),
  ]);

  if (!worker) {
    throw new NotFound('Worker not found');
  }

  if (!facility) {
    throw new NotFound('Facility not found');
  }

  const workerDocumentsIds = workerDocuments.map((doc) => doc.id);

  const hasRequiredDocuments = facilityRequirements.every((doc) => workerDocumentsIds.includes(doc.id));

  if (!hasRequiredDocuments) {
    throw new BadRequest('Worker does not have required documents');
  }

  const shifts = await getOpenShiftsByFacilityAndWorker({
    facilityId,
    workerId,
    profession: worker.profession,
    start,
    end,
  });

  return groupBy(shifts, (shift) => new Date(shift.start).toISOString().split('T')[0]);
}
