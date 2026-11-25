ALTER TABLE "Inquiry"
  ALTER COLUMN "assignedTo" TYPE VARCHAR(255)
  USING "assignedTo"::text;
