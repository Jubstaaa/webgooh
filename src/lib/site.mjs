export const SITE_URL =
    process.env.NEXT_PUBLIC_SITE_URL || 'https://www.webgooh.com'

export const S3_REGION = 'fra1'
export const S3_BUCKET = 'webgooh'
export const CDN_HOSTNAME = `${S3_BUCKET}.${S3_REGION}.cdn.digitaloceanspaces.com`
export const CDN_BASE = `https://${CDN_HOSTNAME}`
