import type { MigrateUpArgs } from '@payloadcms/db-sqlite'

import { sql } from '@payloadcms/db-sqlite'
import { drizzle } from '@payloadcms/db-sqlite/drizzle/libsql'
import { describe, expect, it } from 'bun:test'

import { migrations } from '@/migrations'

const [baseline] = migrations

type Db = ReturnType<typeof drizzle>

function runBaseline(db: Db) {
    if (!baseline) throw new Error('No baseline migration')
    return baseline.up({
        db,
        payload: { logger: { info: () => undefined } },
        req: {},
    } as unknown as MigrateUpArgs)
}

async function tableNames(db: Db) {
    const rows = await db.all<{ name: string }>(
        sql`SELECT name FROM sqlite_master WHERE type = 'table' ORDER BY name`
    )
    return rows.map(row => row.name)
}

describe('baseline migration', () => {
    it('builds the schema on an empty database', async () => {
        const db = drizzle(':memory:')
        await runBaseline(db)
        const names = await tableNames(db)
        expect(names).toContain('payload_migrations')
        expect(names).toContain('users')
    })

    it('leaves a database Payload already initialised untouched', async () => {
        const db = drizzle(':memory:')
        await db.run(
            sql`CREATE TABLE payload_migrations (id integer PRIMARY KEY)`
        )
        await runBaseline(db)
        expect(await tableNames(db)).toEqual(['payload_migrations'])
    })
})
