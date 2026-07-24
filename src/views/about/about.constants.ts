import { Rocket, ShieldCheck, Sparkles, Users } from 'lucide-react'

import type { ValueItem } from '@/views/about/about.types'

export const values: ValueItem[] = [
    {
        description:
            'Her satır kodu, siber güvenlik uzmanlığımızla üretime hazırlarız. Güvenlik sonradan eklenmez, baştan tasarlanır.',
        icon: ShieldCheck,
        title: 'Güvenlik önce gelir',
    },
    {
        description:
            'Hız bir özellik değil, zorunluluktur. SSG, edge cache ve ölçülebilir metriklerle en hızlısını hedefleriz.',
        icon: Rocket,
        title: 'Performans takıntısı',
    },
    {
        description:
            'En güncel teknolojileri ve yapay zekâyı işinize değer katacak yerlerde, doğru şekilde kullanırız.',
        icon: Sparkles,
        title: 'Yenilikçilik',
    },
    {
        description:
            'Tedarikçi değil, teknoloji ortağınız oluruz. Şeffaf iletişim ve uzun vadeli iş birliği önceliğimizdir.',
        icon: Users,
        title: 'Ortaklık',
    },
]
