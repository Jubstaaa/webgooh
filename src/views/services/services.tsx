import { ServiceCard } from '@/components/cards/service-card'
import { Reveal } from '@/components/motion/reveal'
import { CtaBand } from '@/components/sections/cta-band'
import { PageHero } from '@/components/sections/page-hero'
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
                    {services.map((service, index) => (
                        <Reveal key={service.id} delay={(index % 3) * 0.08}>
                            <ServiceCard service={service} />
                        </Reveal>
                    ))}
                </div>
            </section>

            <CtaBand />
        </div>
    )
}
