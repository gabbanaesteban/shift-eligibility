import { BadRequest } from 'http-errors';
import { getFacilityOpenShifts } from '@src/controllers/shifts';
import { buildReq, buildRes } from '@tests/generate';
import * as service from '@src/services/shifts-service';
import * as helpers from '@src/helpers/utils';

describe('shifts controller test suite', () => {
  describe('getFacilityOpenShifts', () => {
    it('should throw a Bad Request error when params are invalid', async () => {
      const req = buildReq();
      const res = buildRes();

      const getFacilityOpenShiftsSpy = jest.spyOn(service, 'getFacilityOpenShifts').mockResolvedValueOnce([]);
      const validateParamsSpy = jest.spyOn(helpers, 'validateParams');

      await expect(getFacilityOpenShifts(req, res)).rejects.toThrowError(BadRequest);

      expect(getFacilityOpenShiftsSpy).not.toHaveBeenCalled();
      expect(validateParamsSpy).toHaveBeenCalled();
    });

    it('should return facility open shifts', async () => {
      const workerId = '1';
      const facilityId = '1';
      const start = '2021-01-01 00:00:00';
      const end = '2021-01-02 00:00:00';
      const req = buildReq({
        params: { facilityId, workerId },
        query: { start, end },
      });

      const res = buildRes({
        json: jest.fn(),
      });

      const getFacilityOpenShiftsSpy = jest.spyOn(service, 'getFacilityOpenShifts').mockResolvedValueOnce([]);
      const validateParamsSpy = jest.spyOn(helpers, 'validateParams');

      await getFacilityOpenShifts(req, res);

      const shifts = await getFacilityOpenShiftsSpy.mock.results[0].value;

      expect(getFacilityOpenShiftsSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          workerId: parseInt(workerId, 10),
          facilityId: parseInt(facilityId, 10),
          start: expect.any(Date),
          end: expect.any(Date),
        }),
      );
      expect(res.json).toHaveBeenCalledWith(shifts);
      expect(validateParamsSpy).toHaveBeenCalled();
      expect(getFacilityOpenShiftsSpy).toHaveBeenCalled();
    });
  });
});
