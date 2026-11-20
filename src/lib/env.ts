import { z } from 'zod'

// A value that is only whitespace (a stray space in .env) counts as missing.
const required = z.string().trim().min(1)

// What the production server cannot run without. Checked when the server
// starts (src/instrumentation.ts), not when payload.config.ts is imported:
// the image and CI builds load that config with NODE_ENV=production, a
// placeholder secret and no Spaces credentials.
const runtimeEnv = z.object({
    // Optional: without it Access sign-in is off and the password form remains
    // (src/lib/cloudflare-access.ts). Set, it has to be a URL the JWKS lives at.
    CF_ACCESS_TEAM_DOMAIN: z.url().optional(),
    DATABASE_URI: required,
    PAYLOAD_SECRET: required,
    S3_ACCESS_KEY_ID: required,
    S3_SECRET_ACCESS_KEY: required,
    // The contact form rejects every submit without it (verify-turnstile.ts).
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
