import type { Request, Response } from 'express';
import type { GetFacilityOpenShiftsParams } from '@src/types';
import type { Facility, Shift, Worker, Document } from '@prisma/client';
import { Profession } from '@prisma/client';
import { getOpenShiftsSchema } from '@src/schemas/schemas';

export function buildReq(params: Partial<Request> = {}) {
  return {
    params: {},
    query: {},
    ...params,
  } as Request;
}

export function buildRes(params: Partial<Response> = {}) {
  return {
    ...params,
  } as Response;
}

export function buildWorker(params: Partial<Worker> = {}) {
  return {
    name: 'John Doe',
    is_active: true,
    profession: Profession.CNA,
    ...params,
  } as Worker;
}

export function buildFacility(params: Partial<Facility> = {}) {
  return {
    name: 'CEMDOE',
    is_active: true,
    ...params,
  } as Facility;
}

export function buildShift(params: Partial<Shift> = {}) {
  return {
    start: new Date(),
    end: new Date(),
    profession: Profession.CNA,
    is_deleted: false,
    facility_id: 1,
    worker_id: null,
    ...params,
  } as Shift;
}

export function buildGetOpenShiftsPayload(params = {}) {
  return {
    workerId: 1,
    facilityId: 1,
    start: '2021-01-01 00:00:00',
    end: '2021-02-01 00:00:00',
    ...params,
  };
}

export function buildGetOpenShiftsParams(params = {}): GetFacilityOpenShiftsParams {
  return getOpenShiftsSchema.parse(buildGetOpenShiftsPayload(params));
}

export function buildDocument(params: Partial<Document> = {}) {
  return {
    name: 'Dumb Document',
    is_active: true,
    ...params,
  } as Document;
}
