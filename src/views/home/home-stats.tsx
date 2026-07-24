import { CountUp } from '@/components/motion/count-up'
import { Reveal } from '@/components/motion/reveal'
import {
    getCategories,
    getPosts,
    getProjects,
    getServices,
} from '@/lib/queries'

export async function HomeStats() {
    const [posts, services, projects, categories] = await Promise.all([
        getPosts(),
        getServices(),
        getProjects(),
        getCategories(),
    ])

    const pages =
        6 + posts.length + services.length + projects.length + categories.length

    const stats = [
        { label: 'yayınlanan sayfa', to: pages },
        { label: 'Lighthouse skoru', to: 100 },
        { label: 'uzmanlık alanı', to: services.length },
        { label: 'kritik güvenlik açığı', to: 0 },
    ]

    return (
        <section className="container-x">
            <div className="border-line bg-line grid gap-px overflow-hidden rounded-3xl border sm:grid-cols-2 lg:grid-cols-4">
                {stats.map((stat, index) => (
                    <Reveal
                        key={stat.label}
                        className="card-surface flex flex-col items-center gap-2 px-6 py-10 text-center"
                        delay={index * 0.08}>
                        <span className="font-display text-4xl font-semibold sm:text-5xl">
                            <CountUp to={stat.to} />
                        </span>
                        <span className="text-muted text-sm">{stat.label}</span>
                    </Reveal>
                ))}
            </div>
        </section>
    )
}
