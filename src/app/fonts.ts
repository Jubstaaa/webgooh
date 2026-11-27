import { Inter, JetBrains_Mono, Space_Grotesk } from 'next/font/google'

const inter = Inter({
    display: 'swap',
    subsets: ['latin', 'latin-ext'],
    variable: '--font-inter',
})

const spaceGrotesk = Space_Grotesk({
    display: 'swap',
    subsets: ['latin', 'latin-ext'],
    variable: '--font-space-grotesk',
})

const jetbrainsMono = JetBrains_Mono({
    display: 'swap',
    subsets: ['latin', 'latin-ext'],
    variable: '--font-jetbrains',
})

export const fontVariables = `${inter.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable}`
