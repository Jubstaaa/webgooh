import Image from 'next/image'
import Link from 'next/link'

import type { LogoProps } from '@/components/layout/logo.types'
import { cn } from '@/lib/utils'

export function Logo({ className }: LogoProps) {
    return (
        <Link
            aria-label="Webgooh ana sayfa"
            className={cn('inline-flex items-center', className)}
            href="/">
            <Image
                priority
                alt="Webgooh — Web'in Van Gogh'u"
                className="h-8 w-auto sm:h-9"
                height={310}
                // Without this the 2164px intrinsic width makes Next offer a
                // srcSet up to 3840, and retina screens pick it — a 3840px
                // render for a ~224px slot. These are the real painted widths
                // (h-8/h-9 at a 6.98 aspect ratio).
                sizes="(min-width: 640px) 251px, 223px"
                src="https://webgooh.fra1.cdn.digitaloceanspaces.com/static/webgooh-logo.webp"
                width={2164}
            />
        </Link>
    )
}
