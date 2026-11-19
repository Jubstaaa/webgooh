import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { ReferenceDetail } from '@/app/(frontend)/referanslar/_components/reference-detail'
import { getProjectBySlug, getProjects } from '@/lib/queries'
import { buildMetadata } from '@/lib/seo'

interface PageProps {
    params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
    const projects = await getProjects()

    return projects
        .filter(project => Boolean(project.slug))
        .map(project => ({ slug: project.slug as string }))
}

export async function generateMetadata({
    params,
}: PageProps): Promise<Metadata> {
    const { slug } = await params
    const project = await getProjectBySlug(slug)

    if (!project) return {}

    return buildMetadata({
        description: project.summary,
        image: project.image,
        path: `/referanslar/${slug}`,
        seo: project.seo,
        title: `${project.title} — Başarı Hikayesi`,
    })
}

export default async function ReferenceDetailPage({ params }: PageProps) {
    const { slug } = await params
    const project = await getProjectBySlug(slug)

    if (!project) notFound()

    return <ReferenceDetail project={project} />
}
