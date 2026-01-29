-- Up Migration

BEGIN;

DELETE FROM networth_types
WHERE type_name = 'Pension'
  AND id = 4;

ALTER TABLE networth_types
DROP CONSTRAINT IF EXISTS unique_type_per_category;

ALTER TABLE networth_types
ADD CONSTRAINT unique_type_per_category
UNIQUE (type_name, category_id);

COMMIT;


-- Down Migration