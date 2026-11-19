import { CDN_BASE } from '@/lib/site.mjs'

export function Icon() {
    return (
        // eslint-disable-next-line @next/next/no-img-element
        <img
            alt="Webgooh"
            src={`${CDN_BASE}/static/webgooh-mark.png`}
            style={{ height: '24px', objectFit: 'contain', width: '24px' }}
        />
    )
}
