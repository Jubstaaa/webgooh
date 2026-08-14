import { generatePayloadCookie, getFieldsToSign, jwtSign } from 'payload'
import type { AuthStrategy } from 'payload'

const IDENTITY_HEADER = 'cf-access-authenticated-user-email'

export const cloudflareAccess: AuthStrategy = {
    authenticate: async ({ canSetHeaders, headers, payload }) => {
        const email = headers.get(IDENTITY_HEADER)?.trim().toLowerCase()

        if (!email) return { user: null }

        const { docs } = await payload.find({
            collection: 'users',
            depth: 0,
            limit: 1,
            overrideAccess: true,
            where: { email: { equals: email } },
        })

        const found = docs[0]

        // No account is created on the fly: passing Cloudflare only proves who you
        // are, not that you belong in the CMS. An allowed address with no user here
        // falls through to the password form.
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
