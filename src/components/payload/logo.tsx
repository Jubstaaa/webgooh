import { CDN_BASE } from '@/lib/site.mjs'

export function Logo() {
    return (
        // eslint-disable-next-line @next/next/no-img-element
        <img
            alt="Webgooh"
            src={`${CDN_BASE}/static/webgooh-logo.webp`}
            style={{ height: 'auto', maxWidth: '220px', width: '100%' }}
        />
    )
}
