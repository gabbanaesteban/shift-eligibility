import type { Facility, Shift } from '@prisma/client';
import type { Request, Response } from 'express';
import { Profession } from '@prisma/client';

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

export function buildWorker(params = {}) {
  return {
    name: 'John Doe',
    is_active: true,
    profession: Profession.CNA,
    ...params,
  };
}

export function buildFacility(params = {}) {
  return {
    name: 'CEMDOE',
    is_active: true,
    ...params,
  };
}

export function buildShift(params = {}) {
  return {
    start: new Date(),
    end: new Date(),
    profession: Profession.CNA,
    is_deleted: false,
    facility_id: 1,
    worker_id: null,
    ...params,
  };
}
