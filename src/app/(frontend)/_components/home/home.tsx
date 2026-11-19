import Link from 'next/link'

import { ArrowRight } from 'lucide-react'

import { CtaBand } from '@/components/cta-band/cta-band'
import { PostCard } from '@/components/post-card'
import { Reveal } from '@/components/reveal'
import { SectionHeading } from '@/components/section-heading'
import { ServiceCard } from '@/components/service-card/service-card'
import { getPosts, getServices } from '@/lib/queries'

import { HomeHero } from './home-hero'
import { HomeMarquee } from './home-marquee'
import { HomeProcess } from './home-process'

export async function Home() {
    const [services, posts] = await Promise.all([
        getServices(),
        getPosts({ limit: 3 }),
    ])

    return (
        <div className="flex flex-col gap-24 pb-8">
            <HomeHero />

            <HomeMarquee />

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
                    {services.map(service => (
                        <Reveal key={service.id}>
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
                        {posts.map(post => (
                            <Reveal key={post.id}>
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
