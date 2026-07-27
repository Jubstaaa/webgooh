interface JsonLdProps {
    data: Record<string, unknown>
}

export function JsonLd({ data }: JsonLdProps) {
    return (
        <script
            // Escaped so a "</script>" inside any CMS string can't close this
            // tag and turn structured data into markup.
            type="application/ld+json"
            dangerouslySetInnerHTML={{
                __html: JSON.stringify(data).replace(/</g, '\\u003c'),
            }}
        />
    )
}
