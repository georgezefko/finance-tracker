#!/bin/bash
set -e

# Execute migration SQL files
for f in /sql/migrations/*.sql; do
    [ -f "$f" ] && psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" < "$f"
done

# Execute seed SQL files
for f in /sql/seeds/*.sql; do
    [ -f "$f" ] && psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" < "$f"
done
