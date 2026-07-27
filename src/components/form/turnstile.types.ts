export interface TurnstileApi {
    remove: (id: string) => void
    render: (
        container: HTMLElement,
        options: { sitekey: string; theme: string }
    ) => string
    reset: (id: string) => void
}
