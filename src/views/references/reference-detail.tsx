import Image from 'next/image'
import Link from 'next/link'

import { ArrowLeft, ExternalLink } from 'lucide-react'

import type { Project } from '@payload-types'

import { CtaBand } from '@/components/sections/cta-band'
import { ButtonLink } from '@/components/ui/button'
import { RichText } from '@/components/ui/rich-text'
import { mediaAlt, mediaUrl } from '@/lib/media'

interface ReferenceDetailProps {
    project: Project
}

export function ReferenceDetail({ project }: ReferenceDetailProps) {
    const image = mediaUrl(project.image, 'feature')

    return (
        <article className="flex flex-col gap-16 pb-8">
            <header className="border-line relative overflow-hidden border-b pt-14 pb-12">
                <div
                    aria-hidden
                    className="grid-backdrop absolute inset-0 -z-10"
                />
                <div
                    aria-hidden
                    className="glow absolute top-0 left-1/2 -z-10 h-64 w-[560px] -translate-x-1/2 opacity-40"
                />
                <div className="container-x flex flex-col gap-5">
                    <Link
                        className="text-muted hover:text-paper inline-flex w-fit items-center gap-1 font-mono text-xs transition-colors"
                        href="/referanslar">
                        <ArrowLeft className="size-3.5" /> Referanslara dön
                    </Link>
                    <span className="eyebrow">{'// başarı hikayesi'}</span>
                    <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
                        {project.title}
                    </h1>
                    {project.summary ? (
                        <p className="text-muted text-lg leading-relaxed">
                            {project.summary}
                        </p>
                    ) : null}
                    <div className="flex flex-wrap items-center gap-3 pt-1">
                        {project.tags?.map(tag => (
                            <span
                                key={tag}
                                className="border-line text-faint rounded-full border px-3 py-1 font-mono text-xs">
                                {tag}
                            </span>
                        ))}
                        {project.url ? (
                            <ButtonLink
                                className="ml-1"
                                href={project.url}
                                rel="noreferrer"
                                size="sm"
                                target="_blank">
                                Siteyi ziyaret et
                                <ExternalLink className="size-3.5" />
                            </ButtonLink>
                        ) : null}
                    </div>
                </div>
            </header>

            {image ? (
                <div className="container-x">
                    <div className="border-line relative mx-auto aspect-[16/9] max-w-5xl overflow-hidden rounded-2xl border">
                        <Image
                            fill
                            priority
                            alt={mediaAlt(project.image, project.title)}
                            className="object-cover object-top"
                            sizes="(max-width: 1024px) 100vw, 1024px"
                            src={image}
                        />
                    </div>
                </div>
            ) : null}

            {project.stats?.length ? (
                <section className="container-x">
                    <div className="card-surface grid grid-cols-2 gap-px overflow-hidden rounded-2xl md:grid-cols-4">
                        {project.stats.map(stat => (
                            <div
                                key={stat.id}
                                className="bg-surface/30 flex flex-col items-center gap-1 px-4 py-7 text-center">
                                <span className="text-gradient font-display text-3xl font-bold">
                                    {stat.value}
                                </span>
                                <span className="text-faint font-mono text-xs tracking-wider uppercase">
                                    {stat.label}
                                </span>
                            </div>
                        ))}
                    </div>
                </section>
            ) : null}

            {project.content ? (
                <div className="container-x mx-auto">
                    <RichText data={project.content} />
                </div>
            ) : null}

            <CtaBand
                description="Sizin markanız için de eskiyi modernle değiştirelim. İlk görüşme ücretsiz."
                title="Sıradaki başarı hikayesi sizinki olsun"
            />
        </article>
    )
}
