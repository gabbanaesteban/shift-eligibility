import { parse } from 'date-fns';
import { z } from 'zod';

const dateSchema = z.preprocess((value) => parse(value as string, 'yyyy-MM-dd HH:mm:ss', new Date()), z.date());

const entityIdSchema = z.preprocess((value) => parseInt(value as string, 10), z.number().min(1));

export const getOpenShiftsSchema = z.object({
  workerId: entityIdSchema,
  facilityId: entityIdSchema,
  start: dateSchema,
  end: dateSchema,
});
