import Link from 'next/link'

import { ArrowUpRight, Check } from 'lucide-react'

import type { Service } from '@payload-types'

import { ServiceIcon } from '@/components/ui/service-icon'

interface ServiceCardProps {
    service: Service
}

export function ServiceCard({ service }: ServiceCardProps) {
    return (
        <Link
            className="card-surface group hover:border-brand/50 relative flex flex-col gap-4 overflow-hidden rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1"
            href={`/hizmetlerimiz/${service.slug}`}>
            <div
                aria-hidden
                className="bg-brand/10 pointer-events-none absolute -top-10 -right-10 size-32 rounded-full opacity-0 blur-2xl transition-opacity duration-300 group-hover:opacity-100"
            />

            <div className="bg-brand/12 text-brand-bright ring-brand/25 grid size-12 place-items-center rounded-xl ring-1">
                <ServiceIcon name={service.icon} />
            </div>

            <div className="flex flex-col gap-2">
                <h3 className="text-paper group-hover:text-brand-bright text-lg font-semibold transition-colors">
                    {service.title}
                </h3>
                <p className="text-muted text-sm leading-relaxed">
                    {service.summary}
                </p>
            </div>

            {service.features?.length ? (
                <ul className="flex flex-col gap-1.5">
                    {service.features.slice(0, 3).map(feature => (
                        <li
                            key={feature.id}
                            className="text-faint flex items-center gap-2 text-sm">
                            <Check className="text-accent size-3.5" />
                            {feature.label}
                        </li>
                    ))}
                </ul>
            ) : null}

            <span className="text-accent mt-auto inline-flex items-center gap-1 pt-2 font-mono text-xs">
                İncele
                <ArrowUpRight className="size-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </span>
        </Link>
    )
}
