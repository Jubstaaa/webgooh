import { Home } from '@/app/(frontend)/_components/home/home'

// The image is built against an empty database, so this route renders per
// request from the tagged data cache instead of baking empty content into HTML
// (README: Rendering & revalidation).
export const dynamic = 'force-dynamic'

export default function HomePage() {
    return <Home />
}
