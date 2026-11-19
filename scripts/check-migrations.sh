#!/bin/sh
# Fails when the Payload config describes a schema that src/migrations does not.
# migrate:create diffs the config against the newest snapshot in src/migrations
# and, with --skip-empty, writes nothing when the two agree; any file it does
# write is a schema change production would never receive. Run it on a clean
# tree: other uncommitted files under src/migrations count as drift too.
set -eu

# Production's config, not development's: it is the one the migrations must
# describe. migrate:create never connects to the database.
NODE_ENV=production PAYLOAD_SECRET="${PAYLOAD_SECRET:-schema-check}" \
    payload migrate:create schema-drift --skip-empty

drift=$(git status --porcelain -- src/migrations)
if [ -n "$drift" ]; then
    echo "$drift" >&2
    echo 'The Payload config no longer matches src/migrations. Create the migration with `bun run migrate:create <name>`, review it, and commit it.' >&2
    exit 1
fi
echo 'src/migrations matches the Payload config.'
