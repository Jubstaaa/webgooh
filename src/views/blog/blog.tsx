import { CategoryChips } from '@/components/blog/category-chips'
import { PostCard } from '@/components/cards/post-card'
import { Reveal } from '@/components/motion/reveal'
import { PageHero } from '@/components/sections/page-hero'
import { getCategories, getPosts } from '@/lib/queries'

interface BlogProps {
    categorySlug?: string
}

export async function Blog({ categorySlug }: BlogProps) {
    const [posts, categories] = await Promise.all([
        getPosts({ categorySlug }),
        getCategories(),
    ])

    const activeCategory = categories.find(c => c.slug === categorySlug)

    return (
        <div className="flex flex-col gap-14 pb-8">
            <PageHero
                description="Yazılım, tasarım, siber güvenlik ve dijital büyüme üzerine güncel içerikler."
                eyebrow="blog"
                title={
                    activeCategory ? activeCategory.title : 'Blog & İçgörüler'
                }
            />

            <section className="container-x flex flex-col gap-10">
                <CategoryChips
                    activeSlug={categorySlug}
                    categories={categories}
                />

                {posts.length ? (
                    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                        {posts.map((post, index) => (
                            <Reveal key={post.id} delay={(index % 3) * 0.06}>
                                <PostCard post={post} priority={index < 3} />
                            </Reveal>
                        ))}
                    </div>
                ) : (
                    <p className="border-line bg-surface/30 text-muted rounded-2xl border p-10 text-center">
                        Bu kategoride henüz yazı bulunmuyor.
                    </p>
                )}
            </section>
        </div>
    )
}
