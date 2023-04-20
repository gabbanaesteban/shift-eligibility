import type { getOpenShiftsSchema } from '@src/schemas/schemas';
import type { z } from 'zod';

export type GetFacilityOpenShiftsParams = z.infer<typeof getOpenShiftsSchema>;
