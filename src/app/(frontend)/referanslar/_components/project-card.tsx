import type { Project } from '@payload-types'

import { ArrowUpRight } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

import { mediaAlt, mediaUrl } from '@/lib/media'

interface ProjectCardProps {
    eager?: boolean

    headingLevel?: 'h2' | 'h3'
    project: Project
}

export function ProjectCard({
    eager = false,
    headingLevel: Heading = 'h3',
    project,
}: ProjectCardProps) {
    const image = mediaUrl(project.image)

    return (
        <Link
            className="card-surface group hover:border-brand/50 relative flex flex-col overflow-hidden rounded-2xl transition-all duration-300 hover:-translate-y-1"
            href={`/referanslar/${project.slug}`}>
            <div className="bg-surface-2 relative aspect-[16/10] overflow-hidden">
                {image ? (
                    <Image
                        alt={mediaAlt(project.image, project.title)}
                        className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
                        fetchPriority={eager ? 'high' : 'auto'}
                        fill
                        loading={eager ? 'eager' : 'lazy'}
                        sizes="(max-width: 768px) 100vw, 500px"
                        src={image}
                    />
                ) : null}
                <div className="from-ink/70 absolute inset-0 bg-gradient-to-t to-transparent" />
            </div>

            <div className="flex flex-1 flex-col gap-2 p-5">
                <div className="flex items-center justify-between gap-2">
                    <Heading className="text-paper group-hover:text-brand-bright text-lg font-semibold transition-colors">
                        {project.title}
                    </Heading>
                    <ArrowUpRight className="text-accent size-4 shrink-0 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </div>
                {project.client ? (
                    <p className="text-faint font-mono text-xs">
                        {project.client}
                    </p>
                ) : null}
                {project.summary ? (
                    <p className="text-muted line-clamp-2 text-sm leading-relaxed">
                        {project.summary}
                    </p>
                ) : null}
                {project.tags?.length ? (
                    <div className="mt-auto flex flex-wrap gap-1.5 pt-2">
                        {project.tags.map(tag => (
                            <span
                                className="border-line text-faint rounded-full border px-2.5 py-0.5 font-mono text-[0.65rem]"
                                key={tag}>
                                {tag}
                            </span>
                        ))}
                    </div>
                ) : null}
            </div>
        </Link>
    )
}
