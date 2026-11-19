// Plain ESM so next.config.mjs can import it too; everything else goes through
// @/lib/site.

// next.config.mjs also inlines this into the bundle, so app code always sees
// the deployed value; the fallback only matters to tooling run outside Next.
export const SITE_URL =
    process.env.NEXT_PUBLIC_SITE_URL || 'https://www.webgooh.com'

// Uploads and static brand assets live in a DigitalOcean Spaces bucket and are
// served from its CDN edge, so the droplet never streams image bytes.
export const S3_REGION = 'fra1'
export const S3_BUCKET = 'webgooh'
export const CDN_HOSTNAME = `${S3_BUCKET}.${S3_REGION}.cdn.digitaloceanspaces.com`
export const CDN_BASE = `https://${CDN_HOSTNAME}`
