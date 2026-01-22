-- Up Migration
BEGIN;

ALTER TABLE networth_insitutions RENAME TO networth_institutions;

ALTER TABLE networth_institutions RENAME COLUMN instituion_name TO institution_name;

COMMIT;
-- Down Migration