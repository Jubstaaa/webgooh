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
                src="/webgooh-logo.webp"
                width={2164}
            />
        </Link>
    )
}
