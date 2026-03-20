import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
    // Respect domain configuration dynamically, typically via Env Vars on Vercel/Production
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL
        ? process.env.NEXT_PUBLIC_APP_URL
        : process.env.VERCEL_PROJECT_PRODUCTION_URL
            ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
            : 'https://neetstand.com'

    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: ['/dashboard/', '/onboarding/', '/profile/'],
        },
        sitemap: `${baseUrl}/sitemap.xml`,
    }
}
