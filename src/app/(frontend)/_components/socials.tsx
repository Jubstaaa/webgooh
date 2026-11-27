import type { SiteSetting } from '@payload-types'
import type { IconType } from 'react-icons'

import {
    PiFacebookLogoBold,
    PiInstagramLogoBold,
    PiLinkedinLogoBold,
    PiPinterestLogoBold,
    PiXLogoBold,
    PiYoutubeLogoBold,
} from 'react-icons/pi'

interface SocialsProps {
    socials: SiteSetting['socials']
}

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
                        aria-label={social.platform}
                        className="hover:border-brand/60 hover:text-brand-bright text-muted border-line grid size-9 place-items-center rounded-full border transition-colors"
                        href={social.url}
                        key={social.id}
                        rel="noreferrer"
                        target="_blank">
                        {Icon ? <Icon aria-hidden className="size-4" /> : null}
                    </a>
                )
            })}
        </div>
    )
}
