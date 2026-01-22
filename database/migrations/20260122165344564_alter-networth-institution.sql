-- Up Migration
BEGIN;

ALTER TABLE networth_insitutions RENAME TO networth_institutions;

ALTER TABLE networth_insitutions RENAME COLUMN insitution_name TO institution_name;

COMMIT;
-- Down Migration