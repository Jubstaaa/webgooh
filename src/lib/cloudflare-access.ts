import type { AuthStrategy, Payload } from 'payload'

import {
    createRemoteJWKSet,
    errors,
    jwtVerify,
    type JWTVerifyGetKey,
} from 'jose'
import { generatePayloadCookie, getFieldsToSign, jwtSign } from 'payload'
import { z } from 'zod'

import { errorSummary } from './error-summary'

const ASSERTION_HEADER = 'cf-access-jwt-assertion'

const accessClaims = z.object({ email: z.email() })

interface AccessConfig {
    audience: string
    issuer: string
    keys: JWTVerifyGetKey
}

let fromEnv: AccessConfig | null | undefined

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

function isOrdinaryRejection(error: unknown) {
    return (
        error instanceof errors.JWTExpired ||
        error instanceof errors.JWSSignatureVerificationFailed
    )
}

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
                name: email.split('@')[0] ?? email,
                password: crypto.randomUUID(),
            },
            overrideAccess: true,
        })
    } catch (error) {
        console.error(
            'Registering a Cloudflare Access user failed',
            errorSummary(error)
        )
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

function rejectionSummary(error: unknown) {
    if (error instanceof errors.JWTClaimValidationFailed) {
        const { claim, code, name, reason } = error

        return { claim, code, name, reason }
    }
    if (error instanceof errors.JOSEError) {
        const { code, name } = error

        return { code, name }
    }

    return { name: error instanceof Error ? error.name : typeof error }
}

async function verifiedEmail(token: string, config: AccessConfig) {
    const payload = await jwtVerify(token, config.keys, {
        algorithms: ['RS256'],
        audience: config.audience,
        issuer: config.issuer,
    }).then(
        verified => verified.payload,
        (error: unknown) => {
            if (!isOrdinaryRejection(error)) {
                console.error(
                    'Cloudflare Access assertion rejected',
                    rejectionSummary(error)
                )
            }

            return null
        }
    )
    if (!payload) return null

    const claims = accessClaims.safeParse(payload)
    if (!claims.success) {
        console.error(
            'Cloudflare Access assertion has no usable email claim',
            claims.error.issues.map(({ code, path }) => ({ code, path }))
        )

        return null
    }

    return claims.data.email.toLowerCase()
}

export const cloudflareAccess =
    createCloudflareAccessStrategy(accessConfigFromEnv)
