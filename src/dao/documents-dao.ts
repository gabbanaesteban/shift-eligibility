import type { Document } from '@prisma/client';
import { Prisma } from '@prisma/client';
import prisma from '@src/db';

export function getFacilityRequiredDocuments(facilityId: number) {
  return prisma.$queryRaw<Document[]>(
    Prisma.sql`SELECT DISTINCT ON
                (d.id) d.id AS id,
                d.name AS name,
                d.is_active AS is_active
              FROM
                "Document" d
                LEFT JOIN "FacilityRequirement" fr ON d.id = fr.document_id
              WHERE
                d.is_active = TRUE
                AND fr.facility_id = ${facilityId}`,
  );
}

export async function getWorkerDocuments(workerId: number) {
  return prisma.$queryRaw<Document[]>(
    Prisma.sql`SELECT DISTINCT ON
                (d.id) d.id AS id,
                d.name AS name,
                d.is_active AS is_active
              FROM
                "Document" d
                LEFT JOIN "DocumentWorker" dw ON d.id = dw.document_id
              WHERE
                d.is_active = TRUE
                AND dw.worker_id = ${workerId}`,
  );
}
