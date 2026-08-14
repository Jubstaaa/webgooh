import { generatePayloadCookie, getFieldsToSign, jwtSign } from 'payload'
import type { AuthStrategy, Payload } from 'payload'

const IDENTITY_HEADER = 'cf-access-authenticated-user-email'

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
