import asyncHandler from 'express-async-handler';
import { Router } from 'express';
import { getFacilityOpenShifts } from '@src/controllers/shifts';
import { errorHandler, notFound } from '@src/middlewares/error';

const router = Router();

router.get('/workers/:workerId/facilities/:facilityId/open-shifts', asyncHandler(getFacilityOpenShifts));

router.use(notFound);
router.use(errorHandler);

export default router;
