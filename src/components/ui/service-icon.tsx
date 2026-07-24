import {
    Cloud,
    Code2,
    type LucideIcon,
    Palette,
    Search,
    Shield,
    ShoppingCart,
    Smartphone,
    Sparkles,
} from 'lucide-react'

import { cn } from '@/lib/utils'

const iconMap: Record<string, LucideIcon> = {
    'cloud': Cloud,
    'code': Code2,
    'palette': Palette,
    'search': Search,
    'shield': Shield,
    'shopping-cart': ShoppingCart,
    'smartphone': Smartphone,
    'sparkles': Sparkles,
}

interface ServiceIconProps {
    className?: string
    name: string
}

export function ServiceIcon({ className, name }: ServiceIconProps) {
    const Icon = iconMap[name] ?? Code2

    return <Icon className={cn('size-6', className)} strokeWidth={1.5} />
}
