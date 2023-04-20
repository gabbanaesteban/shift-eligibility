import type { Request, Response } from 'express';
import { validateParams } from '@src/helpers/utils';
import { getOpenShiftsSchema } from '@src/schemas/schemas';
import * as service from '@src/services/shifts-service';

export async function getFacilityOpenShifts(req: Request, res: Response) {
  const params = await validateParams({ ...req.params, ...req.query }, getOpenShiftsSchema);

  const shifts = await service.getFacilityOpenShifts(params);

  res.json(shifts);
}
