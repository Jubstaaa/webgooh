import { CtaBand } from '@/components/cta-band/cta-band'
import { PageHero } from '@/components/page-hero'
import { Reveal } from '@/components/reveal'
import { getProjects } from '@/lib/queries'

import { ProjectCard } from './project-card'

export async function References() {
    const projects = await getProjects()

    return (
        <div className="flex flex-col gap-20 pb-8">
            <PageHero
                description="Farklı sektörlerden markalar için geliştirdiğimiz web, mobil ve yazılım projeleri."
                eyebrow="referanslar"
                title="Birlikte ürettiklerimiz"
            />

            <section className="container-x">
                {projects.length ? (
                    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                        {projects.map((project, index) => (
                            <Reveal key={project.id}>
                                <ProjectCard
                                    eager={index === 0}
                                    headingLevel="h2"
                                    project={project}
                                />
                            </Reveal>
                        ))}
                    </div>
                ) : (
                    <p className="border-line bg-surface/30 text-muted rounded-2xl border p-10 text-center">
                        Referans projeleri yakında bu alanda yayınlanacak.
                    </p>
                )}
            </section>

            <CtaBand />
        </div>
    )
}
