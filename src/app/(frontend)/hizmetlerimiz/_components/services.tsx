import { CtaBand } from '@/components/cta-band/cta-band'
import { PageHero } from '@/components/page-hero'
import { Reveal } from '@/components/reveal'
import { ServiceCard } from '@/components/service-card/service-card'
import { getServices } from '@/lib/queries'

export async function Services() {
    const services = await getServices()

    return (
        <div className="flex flex-col gap-24 pb-8">
            <PageHero
                description="Web ve mobil geliştirmeden siber güvenliğe, tasarımdan DevOps’a kadar markanızı büyütecek uçtan uca dijital hizmetler."
                eyebrow="hizmetlerimiz"
                title="Markanız için tam kapsamlı çözümler"
            />

            <section className="container-x">
                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    {services.map(service => (
                        <Reveal key={service.id}>
                            <ServiceCard headingLevel="h2" service={service} />
                        </Reveal>
                    ))}
                </div>
            </section>

            <CtaBand />
        </div>
    )
}
