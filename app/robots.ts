import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://terbangbersamakawan.co.id';

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/A9MIN',
          '/A9MIN/*',
          '/a9min',
          '/a9min/*',
          '/admin',
          '/admin/*',
          '/admin-studio',
          '/admin-studio/*',
          '/login',
          '/api/*',
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
