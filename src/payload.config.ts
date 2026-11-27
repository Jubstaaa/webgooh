import { sqliteAdapter } from '@payloadcms/db-sqlite'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { s3Storage } from '@payloadcms/storage-s3'
import { tr } from '@payloadcms/translations/languages/tr'
import path from 'path'
import { buildConfig } from 'payload'
import sharp from 'sharp'
import { fileURLToPath } from 'url'

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

const s3Enabled = process.env.NODE_ENV === 'production'

export default buildConfig({
    admin: {
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

        prodMigrations: migrations,
    }),
    editor: lexicalEditor(),
    globals: [SiteSettings],

    graphQL: { disable: true },
    i18n: {
        fallbackLanguage: 'tr',
        supportedLanguages: { tr },
    },
    plugins: [
        s3Storage({
            acl: 'public-read',

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
                    accessKeyId: process.env.S3_ACCESS_KEY_ID ?? '',
                    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY ?? '',
                },
                endpoint: `https://${S3_REGION}.digitaloceanspaces.com`,
                forcePathStyle: false,
                region: S3_REGION,
            },
            enabled: s3Enabled,
        }),
    ],
    secret: process.env.PAYLOAD_SECRET ?? '',
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
