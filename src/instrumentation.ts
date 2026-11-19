export async function register() {
    if (
        process.env.NEXT_RUNTIME !== 'nodejs' ||
        process.env.NODE_ENV !== 'production'
    ) {
        return
    }

    // Initialising Payload here runs its pending migrations (prodMigrations)
    // before the server accepts requests, so a failing migration stops the
    // container from ever turning healthy and the deploy rolls back, instead
    // of surfacing on the first admin request after the release went live.
    const { getPayload } = await import('payload')
    const { default: config } = await import('@payload-config')
    await getPayload({ config })
}
