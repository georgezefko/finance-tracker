-- Up Migration

BEGIN;

-- 1) Delete the duplicate Pension type (adjust id if needed)
DELETE FROM networth_types
WHERE type_name = 'Pension'
  AND id = 4;

-- 2) Make sure each (type_name, category_id) pair is unique
ALTER TABLE networth_types
ADD CONSTRAINT IF NOT EXISTS unique_type_per_category
UNIQUE (type_name, category_id);

COMMIT;


-- Down Migration