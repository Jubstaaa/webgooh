import type { ProcessStep, TerminalLine } from '@/views/home/home.types'

export const terminalLines: TerminalLine[] = [
    { prompt: '~/webgooh', text: 'deploy --prod' },
    { text: '✓ build           next@16  ·  turbopack', tone: 'ok' },
    { text: '✓ audit           0 kritik açık', tone: 'ok' },
    { text: '✓ lighthouse      performans 100 / seo 100', tone: 'ok' },
    { text: '✓ ssg             142 sayfa · edge cache', tone: 'ok' },
    { text: '→ canlı: https://webgooh.com', tone: 'accent' },
]

export const processSteps: ProcessStep[] = [
    {
        description:
            'İhtiyaçlarınızı, hedef kitlenizi ve iş hedeflerinizi analiz eder, yol haritasını çıkarırız.',
        title: 'Keşif & Strateji',
    },
    {
        description:
            'Kullanıcı deneyimini merkeze alan arayüzleri tasarlar, tıklanabilir prototiplerle doğrularız.',
        title: 'Tasarım & Prototip',
    },
    {
        description:
            'Modern teknolojilerle geliştirir, her katmanda güvenlik testleriyle üretime hazırlarız.',
        title: 'Geliştirme & Güvenlik',
    },
    {
        description:
            'CI/CD hatlarıyla yayına alır, performans ve SEO’yu sürekli izleyip büyütürüz.',
        title: 'Yayın & Büyüme',
    },
]

export const techStack: string[] = [
    'Next.js',
    'React',
    'TypeScript',
    'Node.js',
    'React Native',
    'PostgreSQL',
    'Docker',
    'Kubernetes',
    'AWS',
    'Cloudflare',
    'Payload CMS',
    'Tailwind',
    'GraphQL',
    'CI/CD',
]
