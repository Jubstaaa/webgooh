import { z } from 'zod'

const required = z.string().min(1)

// What the production server cannot run without. Checked when the server
// starts (src/instrumentation.ts), not when payload.config.ts is imported:
// the image and CI builds load that config with NODE_ENV=production, a
// placeholder secret and no Spaces credentials.
const runtimeEnv = z.object({
    DATABASE_URI: required,
    PAYLOAD_SECRET: required,
    S3_ACCESS_KEY_ID: required,
    S3_SECRET_ACCESS_KEY: required,
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
