import {
    Facebook,
    Instagram,
    Linkedin,
    type LucideIcon,
    Youtube,
} from 'lucide-react'

import type { SiteSetting } from '@payload-types'

interface SocialsProps {
    socials: SiteSetting['socials']
}

const lucideMap: Record<string, LucideIcon> = {
    facebook: Facebook,
    instagram: Instagram,
    linkedin: Linkedin,
    youtube: Youtube,
}

function XIcon() {
    return (
        <svg
            aria-hidden
            className="size-4"
            fill="currentColor"
            viewBox="0 0 24 24">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
    )
}

function PinterestIcon() {
    return (
        <svg
            aria-hidden
            className="size-4"
            fill="currentColor"
            viewBox="0 0 24 24">
            <path d="M12 0C5.373 0 0 5.372 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 0 1 .083.345c-.091.378-.293 1.194-.333 1.361-.052.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.966 7.398 6.931 0 4.136-2.607 7.464-6.226 7.464-1.216 0-2.359-.632-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0" />
        </svg>
    )
}

export function Socials({ socials }: SocialsProps) {
    if (!socials?.length) return null

    return (
        <div className="flex flex-wrap gap-2">
            {socials.map(social => {
                const Icon = lucideMap[social.platform]

                return (
                    <a
                        key={social.id}
                        aria-label={social.platform}
                        className="hover:border-brand/60 hover:text-brand-bright text-muted border-line grid size-9 place-items-center rounded-full border transition-colors"
                        href={social.url}
                        rel="noreferrer"
                        target="_blank">
                        {Icon ? (
                            <Icon className="size-4" />
                        ) : social.platform === 'x' ? (
                            <XIcon />
                        ) : (
                            <PinterestIcon />
                        )}
                    </a>
                )
            })}
        </div>
    )
}
