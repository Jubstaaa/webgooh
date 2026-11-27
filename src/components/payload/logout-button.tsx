'use client'

import { useCallback } from 'react'

import { SITE_URL } from '@/lib/site.mjs'

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
            } catch {}

            window.location.replace(logoutUrl)
        },
        []
    )

    return (
        <a
            aria-label="Çıkış yap"
            className="nav__log-out"
            href={logoutUrl}
            onClick={event => void handleClick(event)}
            tabIndex={0}
            title="Çıkış yap">
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
