import path from 'path'
import { fileURLToPath } from 'url'

import { sqliteAdapter } from '@payloadcms/db-sqlite'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { tr } from '@payloadcms/translations/languages/tr'
import { buildConfig } from 'payload'
import sharp from 'sharp'

import { Categories } from '@/collections/categories'
import { Leads } from '@/collections/leads'
import { Media } from '@/collections/media'
import { Posts } from '@/collections/posts'
import { Projects } from '@/collections/projects'
import { Services } from '@/collections/services'
import { Users } from '@/collections/users'
import { SiteSettings } from '@/globals/site-settings'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

export default buildConfig({
    admin: {
        components: {
            graphics: {
                Icon: '/components/payload/icon#Icon',
                Logo: '/components/payload/logo#Logo',
            },
        },
        importMap: {
            baseDir: path.resolve(dirname),
        },
        meta: {
            icons: [
                { rel: 'icon', type: 'image/png', url: '/webgooh-mark.png' },
            ],
            titleSuffix: '— Webgooh Panel',
        },
        theme: 'dark',
        user: Users.slug,
    },
    collections: [Users, Media, Categories, Posts, Services, Projects, Leads],
    cors: [SITE_URL],
    csrf: [SITE_URL],
    db: sqliteAdapter({
        client: {
            url: process.env.DATABASE_URI || 'file:./webgooh.db',
        },
    }),
    editor: lexicalEditor(),
    globals: [SiteSettings],
    i18n: {
        fallbackLanguage: 'tr',
        supportedLanguages: { tr },
    },
    secret: process.env.PAYLOAD_SECRET || '',
    sharp,
    typescript: {
        outputFile: path.resolve(dirname, 'payload-types.ts'),
    },
    upload: {
        limits: {
            fileSize: 5_000_000,
        },
    },
})
