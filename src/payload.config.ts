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

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

// Uploads live in a DigitalOcean Spaces bucket and are served straight from its
// CDN edge, so the droplet never streams image bytes. Bucket and region are
// fixed deployment constants — the CDN hostname derived from them is also
// hardcoded in next.config.mjs remotePatterns, so change both together.
const S3_REGION = 'fra1'
const S3_BUCKET = 'webgooh'
const S3_MEDIA_PREFIX = 'media'
const CDN_BASE = `https://${S3_BUCKET}.${S3_REGION}.cdn.digitaloceanspaces.com`

// Keyed off NODE_ENV rather than the credentials: the Docker build prerenders
// SSG pages against the live DB, and it has no credentials, so gating on those
// would bake `/api/media/file/...` URLs into the HTML instead of CDN ones. The
// S3 client is created lazily, so being "enabled" without credentials during the
// build is harmless. Local dev keeps writing uploads to disk.
const s3Enabled = process.env.NODE_ENV === 'production'

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
