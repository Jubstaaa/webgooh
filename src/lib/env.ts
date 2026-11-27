import { z } from 'zod'

const required = z.string().trim().min(1)

const runtimeEnv = z.object({
    CF_ACCESS_TEAM_DOMAIN: z.url().optional(),
    DATABASE_URI: required,
    PAYLOAD_SECRET: required,
    S3_ACCESS_KEY_ID: required,
    S3_SECRET_ACCESS_KEY: required,

    TURNSTILE_SECRET_KEY: required,
})

export function parseRuntimeEnv(env: Record<string, string | undefined>) {
    const result = runtimeEnv.safeParse(env)
    if (!result.success) {
        throw new Error(
            `Invalid server environment:\n${z.prettifyError(result.error)}`
        )
    }

    return result.data
}
