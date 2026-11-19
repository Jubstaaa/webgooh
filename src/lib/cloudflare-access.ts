import { createRemoteJWKSet, jwtVerify, type JWTVerifyGetKey } from 'jose'
import { generatePayloadCookie, getFieldsToSign, jwtSign } from 'payload'
import type { AuthStrategy, Payload } from 'payload'
import { z } from 'zod'

// Only the signed assertion is trusted. The plain
// cf-access-authenticated-user-email header is just as easy to send by hand on
// any path Access does not cover, so it is never read.
const ASSERTION_HEADER = 'cf-access-jwt-assertion'

const accessClaims = z.object({ email: z.email() })

interface AccessConfig {
    audience: string
    issuer: string
    keys: JWTVerifyGetKey
}

let fromEnv: AccessConfig | null | undefined

// Lazy so the build, which loads this config without the Access settings, does
// not need them; at runtime a missing value disables the strategy (password
// login still works) instead of trusting anything.
function accessConfigFromEnv(): AccessConfig | null {
    if (fromEnv !== undefined) return fromEnv

    const teamDomain = process.env.CF_ACCESS_TEAM_DOMAIN
    const audience = process.env.CF_ACCESS_AUD

    if (!teamDomain || !audience) {
        if (process.env.NODE_ENV === 'production') {
            console.error(
                'Cloudflare Access sign-in is disabled: set CF_ACCESS_TEAM_DOMAIN and CF_ACCESS_AUD.'
            )
        }
        fromEnv = null

        return fromEnv
    }

    const issuer = new URL(teamDomain).origin
    fromEnv = {
        audience,
        issuer,
        keys: createRemoteJWKSet(new URL('/cdn-cgi/access/certs', issuer)),
    }

    return fromEnv
}

async function verifiedEmail(token: string, config: AccessConfig) {
    try {
        const { payload } = await jwtVerify(token, config.keys, {
            algorithms: ['RS256'],
            audience: config.audience,
            issuer: config.issuer,
        })
        const claims = accessClaims.safeParse(payload)

        return claims.success ? claims.data.email.toLowerCase() : null
    } catch {
        // A bad signature, audience, issuer or expiry is an ordinary
        // unauthenticated request, not a server fault.
        return null
    }
}

// The Access policy is the only list of people worth keeping, so an address it
// allows that has never signed in here gets an account on arrival rather than a
// login form it could never pass. Everyone in the policy therefore has the run of
// the CMS — that policy is the thing to be careful with, not this.
//
// The password is random and never told to anyone: signing in happens through
// Access, and the field is only required because the collection has one.
async function register({
    email,
    payload,
}: {
    email: string
    payload: Payload
}) {
    try {
        return await payload.create({
            collection: 'users',
            data: {
                email,
                name: email.split('@')[0],
                password: crypto.randomUUID(),
            },
            overrideAccess: true,
        })
    } catch {
        // Two first requests at once: whichever lost the race reads back the row
        // the winner wrote, since email is unique.
        const { docs } = await payload.find({
            collection: 'users',
            depth: 0,
            limit: 1,
            overrideAccess: true,
            where: { email: { equals: email } },
        })

        return docs[0]
    }
}

export function createCloudflareAccessStrategy(
    getConfig: () => AccessConfig | null
): AuthStrategy {
    return {
        authenticate: async ({ canSetHeaders, headers, payload }) => {
            const assertion = headers.get(ASSERTION_HEADER)
            const config = getConfig()

            if (!assertion || !config) return { user: null }

            const email = await verifiedEmail(assertion, config)

            if (!email) return { user: null }

            const { docs } = await payload.find({
                collection: 'users',
                depth: 0,
                limit: 1,
                overrideAccess: true,
                where: { email: { equals: email } },
            })

            const found = docs[0] ?? (await register({ email, payload }))

            if (!found) return { user: null }

            const user = { ...found, collection: 'users' as const }

            if (!canSetHeaders) return { user }

            // Access guards /admin only, so the panel's own requests to /api would
            // arrive without the header and read as logged out. Issuing the normal
            // Payload session on the way in means everything after this behaves like
            // an ordinary login.
            const collection = payload.collections.users
            const { token } = await jwtSign({
                fieldsToSign: getFieldsToSign({
                    collectionConfig: collection.config,
                    email,
                    user,
                }),
                secret: payload.secret,
                tokenExpiration: collection.config.auth.tokenExpiration,
            })

            return {
                responseHeaders: new Headers({
                    'Set-Cookie': generatePayloadCookie({
                        collectionAuthConfig: collection.config.auth,
                        cookiePrefix: payload.config.cookiePrefix,
                        token,
                    }),
                }),
                user,
            }
        },
        name: 'cloudflare-access',
    }
}

export const cloudflareAccess =
    createCloudflareAccessStrategy(accessConfigFromEnv)
