import Image from 'next/image'

import { Check } from 'lucide-react'

import type { Service } from '@payload-types'

import { CtaBand } from '@/components/sections/cta-band'
import { PageHero } from '@/components/sections/page-hero'
import { JsonLd } from '@/components/seo/json-ld'
import { RichText } from '@/components/ui/rich-text'
import { ServiceIcon } from '@/components/ui/service-icon'
import { mediaAlt, mediaUrl } from '@/lib/media'

interface ServiceDetailProps {
    service: Service
}

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.webgooh.com'

export function ServiceDetail({ service }: ServiceDetailProps) {
    const cover = mediaUrl(service.coverImage, 'feature')

    return (
        <div className="flex flex-col gap-20 pb-8">
            <JsonLd
                data={{
                    '@context': 'https://schema.org',
                    '@type': 'Service',
                    'areaServed': 'TR',
                    'description': service.summary,
                    'name': service.title,
                    'provider': {
                        '@type': 'Organization',
                        'name': 'Webgooh',
                        'url': SITE_URL,
                    },
                    'url': `${SITE_URL}/hizmetlerimiz/${service.slug}`,
                }}
            />
            <PageHero
                description={service.summary}
                eyebrow="hizmet"
                title={service.title}
            />

            <section className="container-x grid gap-12 lg:grid-cols-[1.6fr_1fr]">
                <div className="flex flex-col gap-8">
                    {cover ? (
                        <div className="relative aspect-[16/9] overflow-hidden rounded-2xl">
                            <Image
                                fill
                                className="object-cover"
                                sizes="(max-width: 1024px) 100vw, 720px"
                                src={cover}
                                alt={mediaAlt(
                                    service.coverImage,
                                    service.title
                                )}
                            />
                        </div>
                    ) : null}

                    {service.content ? (
                        <RichText data={service.content} />
                    ) : (
                        <p className="text-muted text-lg leading-relaxed">
                            {service.summary}
                        </p>
                    )}
                </div>

                <aside className="flex h-fit flex-col gap-6 lg:sticky lg:top-24">
                    <div className="card-surface flex flex-col gap-4 rounded-2xl p-6">
                        <div className="bg-brand/12 text-brand-bright ring-brand/25 grid size-12 place-items-center rounded-xl ring-1">
                            <ServiceIcon name={service.icon} />
                        </div>
                        {service.features?.length ? (
                            <ul className="flex flex-col gap-3">
                                {service.features.map(feature => (
                                    <li
                                        key={feature.id}
                                        className="text-muted flex items-start gap-2 text-sm">
                                        <Check className="text-accent mt-0.5 size-4 shrink-0" />
                                        {feature.label}
                                    </li>
                                ))}
                            </ul>
                        ) : null}
                    </div>
                </aside>
            </section>

            <CtaBand />
        </div>
    )
}
