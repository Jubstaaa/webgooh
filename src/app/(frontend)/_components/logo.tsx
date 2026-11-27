import Image from 'next/image'
import Link from 'next/link'

import { CDN_BASE } from '@/lib/site.mjs'
import { cn } from '@/lib/utils'

interface LogoProps {
    className?: string
}

export function Logo({ className }: LogoProps) {
    return (
        <Link
            aria-label="Webgooh ana sayfa"
            className={cn('inline-flex items-center', className)}
            href="/">
            <Image
                alt="Webgooh — Web'in Van Gogh'u"
                className="h-8 w-auto sm:h-9"
                height={310}
                loading="eager"

                sizes="(min-width: 640px) 251px, 223px"
                src={`${CDN_BASE}/static/webgooh-logo.webp`}
                width={2164}
            />
        </Link>
    )
}
