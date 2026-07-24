export interface TerminalLine {
    prompt?: string
    text: string
    tone?: 'ok' | 'accent'
}

export interface ProcessStep {
    description: string
    title: string
}
