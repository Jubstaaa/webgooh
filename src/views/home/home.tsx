import Link from 'next/link'

import { ArrowRight } from 'lucide-react'

import { PostCard } from '@/components/cards/post-card'
import { ServiceCard } from '@/components/cards/service-card'
import { Reveal } from '@/components/motion/reveal'
import { CtaBand } from '@/components/sections/cta-band'
import { SectionHeading } from '@/components/ui/section-heading'
import { getPosts, getServices } from '@/lib/queries'
import { HomeHero } from '@/views/home/home-hero'
import { HomeMarquee } from '@/views/home/home-marquee'
import { HomeProcess } from '@/views/home/home-process'
import { HomeStats } from '@/views/home/home-stats'

export async function Home() {
    const [services, posts] = await Promise.all([
        getServices(),
        getPosts({ limit: 3 }),
    ])

    return (
        <div className="flex flex-col gap-24 pb-8">
            <HomeHero />

            <HomeMarquee />

            <HomeStats />

            <section className="container-x flex flex-col gap-12">
                <div className="flex flex-wrap items-end justify-between gap-6">
                    <SectionHeading
                        description="Uçtan uca dijital ürün geliştirme. İhtiyacınıza göre tek bir hizmet ya da komple ekip."
                        eyebrow="hizmetler"
                        title="Ne yapıyoruz?"
                    />
                    <Link
                        className="text-accent inline-flex items-center gap-1 font-mono text-sm hover:underline"
                        href="/hizmetlerimiz">
                        Tümü <ArrowRight className="size-4" />
                    </Link>
                </div>

                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    {services.map((service, index) => (
                        <Reveal key={service.id} delay={(index % 3) * 0.08}>
                            <ServiceCard service={service} />
                        </Reveal>
                    ))}
                </div>
            </section>

            <HomeProcess />

            {posts.length ? (
                <section className="container-x flex flex-col gap-12">
                    <div className="flex flex-wrap items-end justify-between gap-6">
                        <SectionHeading
                            description="Yazılım, tasarım ve güvenlik üzerine güncel içerikler."
                            eyebrow="blog"
                            title="Son yazılar"
                        />
                        <Link
                            className="text-accent inline-flex items-center gap-1 font-mono text-sm hover:underline"
                            href="/blog">
                            Tüm yazılar <ArrowRight className="size-4" />
                        </Link>
                    </div>

                    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                        {posts.map((post, index) => (
                            <Reveal key={post.id} delay={(index % 3) * 0.08}>
                                <PostCard post={post} />
                            </Reveal>
                        ))}
                    </div>
                </section>
            ) : null}

            <CtaBand />
        </div>
    )
}
