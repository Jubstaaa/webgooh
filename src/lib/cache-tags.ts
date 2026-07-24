export const cacheTags = {
    categories: 'categories',
    category: (slug: string) => `category:${slug}`,
    post: (slug: string) => `post:${slug}`,
    posts: 'posts',
    project: (slug: string) => `project:${slug}`,
    projects: 'projects',
    service: (slug: string) => `service:${slug}`,
    services: 'services',
    settings: 'settings',
    sitemap: 'sitemap',
} as const
