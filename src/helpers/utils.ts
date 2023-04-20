import type { z } from 'zod';
import { BadRequest } from 'http-errors';

export const validateParams = <T extends z.ZodSchema<any>>(data: unknown, schema: T): z.infer<T> => {
  const validation = schema.safeParse(data);

  if (validation.success) {
    return validation.data;
  }

  const [error] = validation.error.issues;

  throw new BadRequest(`Validation Error - ${error.path.join('.')}: ${error.message}`);
};
