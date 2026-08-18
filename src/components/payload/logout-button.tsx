'use client'

import { useCallback } from 'react'

// Signing out of Payload alone achieves nothing here: the Cloudflare Access
// header would authenticate the very next request, so the panel reopened as if
// nothing had happened. Ending the Cloudflare session is what actually signs
// someone out, and one call does it — Cloudflare revokes the session across every
// application it protects. Asking a second endpoint to repeat it only earns a
// "Failed to log out" page, because the session it looks for is already gone.
//
// Payload's own token is cleared before leaving, because it outlives the
// Cloudflare session by up to its expiry and would otherwise still be sitting
// there, valid, when the visitor came back.
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://webgooh.tech'

const logoutUrl = `${SITE_URL}/cdn-cgi/access/logout?returnTo=${encodeURIComponent(`${SITE_URL}/admin`)}`

export function LogoutButton() {
    const handleClick = useCallback(
        async (event: React.MouseEvent<HTMLAnchorElement>) => {
            event.preventDefault()

            try {
                await fetch('/api/users/logout', {
                    credentials: 'include',
                    method: 'POST',
                })
            } catch {
                // Losing the Cloudflare session is what matters; a failure here only
                // leaves a token behind that nothing can reach the panel with.
            }

            window.location.replace(logoutUrl)
        },
        []
    )

    return (
        <a
            aria-label="Çıkış yap"
            className="nav__log-out"
            href={logoutUrl}
            tabIndex={0}
            title="Çıkış yap"
            onClick={handleClick}>
            <svg
                className="icon icon--logout"
                fill="none"
                height="20"
                viewBox="0 0 20 20"
                width="20"
                xmlns="http://www.w3.org/2000/svg">
                <path
                    className="stroke"
                    d="M12 16H14.6667C15.0203 16 15.3594 15.8595 15.6095 15.6095C15.8595 15.3594 16 15.0203 16 14.6667V5.33333C16 4.97971 15.8595 4.64057 15.6095 4.39052C15.3594 4.14048 15.0203 4 14.6667 4H12M7.33333 13.3333L4 10M4 10L7.33333 6.66667M4 10H12"
                    strokeLinecap="square"
                />
            </svg>
        </a>
    )
}
