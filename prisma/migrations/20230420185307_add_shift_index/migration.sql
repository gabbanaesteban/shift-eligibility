-- CreateIndex
CREATE INDEX "idx_shift_facility_profession_time_worker" ON "Shift"(
  "facility_id",
  "is_deleted",
  "profession",
  "start",
  "end",
  "worker_id"
);

-- CreateIndex
CREATE INDEX time_range_index ON "Shift" USING gist (tsrange("start", "end"))
WHERE
  is_deleted = FALSE
  AND worker_id IS NOT NULL;