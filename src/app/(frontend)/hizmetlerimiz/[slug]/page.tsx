import type { Metadata } from 'next'

import { notFound } from 'next/navigation'

import { ServiceDetail } from '@/app/(frontend)/hizmetlerimiz/_components/service-detail'
import { getServiceBySlug, getServices } from '@/lib/queries'
import { buildMetadata } from '@/lib/seo'

interface PageProps {
    params: Promise<{ slug: string }>
}

export async function generateMetadata({
    params,
}: PageProps): Promise<Metadata> {
    const { slug } = await params
    const service = await getServiceBySlug(slug)

    if (!service) return {}

    return buildMetadata({
        description: service.summary,
        image: service.coverImage,
        path: `/hizmetlerimiz/${slug}`,
        seo: service.seo,
        title: service.title,
    })
}

export async function generateStaticParams() {
    const services = await getServices()

    return services.flatMap(service =>
        service.slug ? [{ slug: service.slug }] : []
    )
}

export default async function ServiceDetailPage({ params }: PageProps) {
    const { slug } = await params
    const service = await getServiceBySlug(slug)

    if (!service) notFound()

    return <ServiceDetail service={service} />
}
