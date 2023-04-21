import { prismaMock } from '@tests/unit/dbMock';
import * as shiftsDao from '@src/dao/shifts-dao';
import * as facilitiesDao from '@src/dao/facilities-dao';
import * as workersDao from '@src/dao/workers-dao';
import * as documentsDao from '@src/dao/documents-dao';
import { getFacilityOpenShifts } from '@src/services/shifts-service';
import { buildDocument, buildFacility, buildGetOpenShiftsParams, buildShift, buildWorker } from '@tests/generate';

describe('shifts-service test suite', () => {
  beforeEach(() => jest.resetAllMocks());

  it('should throw when there is no worker', async () => {
    const params = buildGetOpenShiftsParams();

    prismaMock.worker.findFirst.mockResolvedValueOnce(null);
    prismaMock.facility.findFirst.mockResolvedValueOnce(null);
    prismaMock.document.findMany.mockResolvedValue([]);

    const getOpenShiftsByFacilityAndWorkerSpy = jest
      .spyOn(shiftsDao, 'getOpenShiftsByFacilityAndWorker')
      .mockResolvedValueOnce([]);

    await expect(getFacilityOpenShifts(params)).rejects.toThrow('Worker not found');

    expect(getOpenShiftsByFacilityAndWorkerSpy).not.toHaveBeenCalled();
  });

  it('should throw when there is no facility', async () => {
    const params = buildGetOpenShiftsParams();
    const worker = buildWorker();

    prismaMock.worker.findFirst.mockResolvedValueOnce(worker);
    prismaMock.facility.findFirst.mockResolvedValueOnce(null);
    prismaMock.document.findMany.mockResolvedValue([]);

    const getOpenShiftsByFacilityAndWorkerSpy = jest
      .spyOn(shiftsDao, 'getOpenShiftsByFacilityAndWorker')
      .mockResolvedValueOnce([]);

    await expect(getFacilityOpenShifts(params)).rejects.toThrow('Facility not found');

    expect(getOpenShiftsByFacilityAndWorkerSpy).not.toHaveBeenCalled();
  });

  it('should throw when the worker does not have required documents', async () => {
    const params = buildGetOpenShiftsParams();
    const worker = buildWorker();
    const facility = buildFacility();
    const requiredDocuments = [buildDocument({ id: 1 }), buildDocument({ id: 2 })];
    const workerDocuments = [buildDocument({ id: 3 }), buildDocument({ id: 4 })];

    prismaMock.worker.findFirst.mockResolvedValueOnce(worker);
    prismaMock.facility.findFirst.mockResolvedValueOnce(facility);
    prismaMock.document.findMany.mockResolvedValueOnce(requiredDocuments);
    prismaMock.document.findMany.mockResolvedValueOnce(workerDocuments);

    const getOpenShiftsByFacilityAndWorkerSpy = jest
      .spyOn(shiftsDao, 'getOpenShiftsByFacilityAndWorker')
      .mockResolvedValueOnce([]);

    await expect(getFacilityOpenShifts(params)).rejects.toThrow('Worker does not have required documents');

    expect(getOpenShiftsByFacilityAndWorkerSpy).not.toHaveBeenCalled();
  });

  it(' should return open shifts grouped by date', async () => {
    const params = buildGetOpenShiftsParams();
    const worker = buildWorker();
    const facility = buildFacility();
    const documents = [buildDocument({ id: 1 }), buildDocument({ id: 2 })];
    const openShift1 = buildShift({ start: new Date('2023-01-05') });
    const openShift2 = buildShift({ start: new Date('2023-01-07') });

    prismaMock.worker.findFirst.mockResolvedValueOnce(worker);
    prismaMock.facility.findFirst.mockResolvedValueOnce(facility);
    prismaMock.document.findMany.mockResolvedValue(documents);

    const getActiveWorkerSpy = jest.spyOn(workersDao, 'getActiveWorker');
    const getActiveFacilitySpy = jest.spyOn(facilitiesDao, 'getActiveFacility');
    const getWorkerDocumentsSpy = jest.spyOn(documentsDao, 'getWorkerDocuments');
    const getFacilityRequiredDocumentsSpy = jest.spyOn(documentsDao, 'getFacilityRequiredDocuments');

    const getOpenShiftsByFacilityAndWorkerSpy = jest
      .spyOn(shiftsDao, 'getOpenShiftsByFacilityAndWorker')
      .mockResolvedValueOnce([openShift1, openShift2]);

    const result = await getFacilityOpenShifts(params);

    expect(getOpenShiftsByFacilityAndWorkerSpy).toHaveBeenCalledWith({
      ...params,
      profession: worker.profession,
    });

    expect(result).toEqual([
      { date: '2023-01-05', shifts: [openShift1] },
      { date: '2023-01-07', shifts: [openShift2] },
    ]);

    expect(getActiveWorkerSpy).toHaveBeenCalledWith(params.workerId);
    expect(getActiveFacilitySpy).toHaveBeenCalledWith(params.facilityId);
    expect(getWorkerDocumentsSpy).toHaveBeenCalledWith(params.workerId);
    expect(getFacilityRequiredDocumentsSpy).toHaveBeenCalledWith(params.facilityId);
  });
});
