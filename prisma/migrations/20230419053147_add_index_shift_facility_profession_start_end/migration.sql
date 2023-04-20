-- CreateIndex
CREATE INDEX idx_shift_facility_profession_start_end ON "Shift" (facility_id, profession, "start", "end")
WHERE
  is_deleted = false;