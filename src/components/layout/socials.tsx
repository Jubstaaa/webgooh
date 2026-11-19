import type { IconType } from 'react-icons'

import {
    PiFacebookLogoBold,
    PiInstagramLogoBold,
    PiLinkedinLogoBold,
    PiPinterestLogoBold,
    PiXLogoBold,
    PiYoutubeLogoBold,
} from 'react-icons/pi'

import type { SiteSetting } from '@payload-types'

interface SocialsProps {
    socials: SiteSetting['socials']
}

// Brand marks come from Phosphor via react-icons: lucide dropped brand icons in
// 1.0, and simple-icons no longer carries LinkedIn. Phosphor's bold outline is
// the closest match to the 2px stroke of the site's lucide icons.
const brandIcons: Record<string, IconType> = {
    facebook: PiFacebookLogoBold,
    instagram: PiInstagramLogoBold,
    linkedin: PiLinkedinLogoBold,
    pinterest: PiPinterestLogoBold,
    x: PiXLogoBold,
    youtube: PiYoutubeLogoBold,
}

export function Socials({ socials }: SocialsProps) {
    if (!socials?.length) return null

    return (
        <div className="flex flex-wrap gap-2">
            {socials.map(social => {
                const Icon = brandIcons[social.platform]

                return (
                    <a
                        key={social.id}
                        aria-label={social.platform}
                        className="hover:border-brand/60 hover:text-brand-bright text-muted border-line grid size-9 place-items-center rounded-full border transition-colors"
                        href={social.url}
                        rel="noreferrer"
                        target="_blank">
                        {Icon ? <Icon aria-hidden className="size-4" /> : null}
                    </a>
                )
            })}
        </div>
    )
}
