import path from 'path'
import { fileURLToPath } from 'url'

import { sqliteAdapter } from '@payloadcms/db-sqlite'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { s3Storage } from '@payloadcms/storage-s3'
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
import { CDN_BASE, S3_BUCKET, S3_REGION, SITE_URL } from '@/lib/site.mjs'
import { migrations } from '@/migrations'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

const S3_MEDIA_PREFIX = 'media'

// Keyed off NODE_ENV rather than the credentials: the Docker build has no
// credentials, so gating on those would give anything it prerenders
// `/api/media/file/...` URLs instead of CDN ones. The S3 client is created
// lazily, so being "enabled" without credentials during the build is harmless.
// Local dev keeps writing uploads to disk.
const s3Enabled = process.env.NODE_ENV === 'production'

export default buildConfig({
    admin: {
        // Payload defaults to Gravatar, which the CSP blocks — and which would
        // hand a hash of every editor's email to a third party.
        avatar: 'default',
        components: {
            graphics: {
                Icon: '/components/payload/icon#Icon',
                Logo: '/components/payload/logo#Logo',
            },
            logout: {
                Button: '/components/payload/logout-button#LogoutButton',
            },
        },
        importMap: {
            baseDir: path.resolve(dirname),
        },
        meta: {
            icons: [
                {
                    rel: 'icon',
                    type: 'image/png',
                    url: `${CDN_BASE}/static/webgooh-mark.png`,
                },
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
        // Production never pushes schema, so pending migrations run when Payload
        // initialises there: at server start (src/instrumentation.ts), before
        // any request. The image build migrates only its own empty database
        // (Dockerfile); the deploy snapshots the live one before this runs.
        prodMigrations: migrations,
    }),
    editor: lexicalEditor(),
    globals: [SiteSettings],
    // Nothing consumes it: the admin panel talks to the REST API and the site
    // reads through the Local API, so this only ever exposed a second query
    // surface — and one that can nest arbitrarily deep — to the internet.
    graphQL: { disable: true },
    i18n: {
        fallbackLanguage: 'tr',
        supportedLanguages: { tr },
    },
    plugins: [
        s3Storage({
            acl: 'public-read',
            // Production runs with NODE_ENV=production, where the SQLite adapter
            // never pushes schema — so the injected `prefix` column has to exist
            // in every environment, plugin enabled or not.
            alwaysInsertFields: true,
            bucket: S3_BUCKET,
            collections: {
                media: {
                    disablePayloadAccessControl: true,
                    generateFileURL: ({ filename, prefix }) =>
                        `${CDN_BASE}/${prefix || S3_MEDIA_PREFIX}/${filename}`,
                    prefix: S3_MEDIA_PREFIX,
                },
            },
            config: {
                credentials: {
                    accessKeyId: process.env.S3_ACCESS_KEY_ID as string,
                    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY as string,
                },
                endpoint: `https://${S3_REGION}.digitaloceanspaces.com`,
                forcePathStyle: false,
                region: S3_REGION,
            },
            enabled: s3Enabled,
        }),
    ],
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
