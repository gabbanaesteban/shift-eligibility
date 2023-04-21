import { getOpenShiftsSchema } from '@src/schemas/schemas';
import { buildGetOpenShiftsPayload } from '@tests/generate';

describe('getOpenShiftsSchema test suite', () => {
  describe('workerId', () => {
    it('should not throw', () => {
      const data = buildGetOpenShiftsPayload({ workerId: '1' });
      expect(() => getOpenShiftsSchema.parse(data)).not.toThrow();
    });

    it('should throw when an invalid value is given', () => {
      const data = buildGetOpenShiftsPayload({ workerId: undefined });
      expect(() => getOpenShiftsSchema.parse(data)).toThrow(/Expected number/);
    });

    it('should throw when the number is less than 1', () => {
      const data = buildGetOpenShiftsPayload({ workerId: '0' });
      expect(() => getOpenShiftsSchema.parse(data)).toThrow(/Number must be greater than or equal to 1/);
    });
  });

  describe('facilityId', () => {
    it('should not throw', () => {
      const data = buildGetOpenShiftsPayload({ facilityId: '1' });
      expect(() => getOpenShiftsSchema.parse(data)).not.toThrow();
    });

    it('should throw when an invalid value is given', () => {
      const data = buildGetOpenShiftsPayload({ facilityId: undefined });
      expect(() => getOpenShiftsSchema.parse(data)).toThrow(/Expected number/);
    });

    it('should throw when the number is less than 1', () => {
      const data = buildGetOpenShiftsPayload({ facilityId: '0' });
      expect(() => getOpenShiftsSchema.parse(data)).toThrow(/Number must be greater than or equal to 1/);
    });
  });

  describe('start', () => {
    it('should not throw', () => {
      const data = buildGetOpenShiftsPayload({ start: '2021-01-01 00:00:00' });
      expect(() => getOpenShiftsSchema.parse(data)).not.toThrow();
    });

    it('should throw when undefined', () => {
      const data = buildGetOpenShiftsPayload({ start: undefined });
      expect(() => getOpenShiftsSchema.parse(data)).toThrow(/Invalid date/);
    });

    it('should throw when the date does not match the format', () => {
      const data = buildGetOpenShiftsPayload({ start: '2023-02-05' });
      expect(() => getOpenShiftsSchema.parse(data)).toThrow(/Invalid date/);
    });
  });

  describe('end', () => {
    it('should not throw', () => {
      const data = buildGetOpenShiftsPayload({ end: '2021-01-01 00:00:00' });
      expect(() => getOpenShiftsSchema.parse(data)).not.toThrow();
    });

    it('should throw when undefined', () => {
      const data = buildGetOpenShiftsPayload({ end: undefined });
      expect(() => getOpenShiftsSchema.parse(data)).toThrow(/Invalid date/);
    });

    it('should throw when the date does not match the format', () => {
      const data = buildGetOpenShiftsPayload({ end: '2023-02-05' });
      expect(() => getOpenShiftsSchema.parse(data)).toThrow(/Invalid date/);
    });
  });
});
