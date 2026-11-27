export async function register() {
    if (
        process.env.NEXT_RUNTIME !== 'nodejs' ||
        process.env.NODE_ENV !== 'production'
    ) {
        return
    }

    const { parseRuntimeEnv } = await import('@/lib/env')
    parseRuntimeEnv(process.env)

    const { getPayload } = await import('payload')
    const { default: config } = await import('@payload-config')
    await getPayload({ config })
}
