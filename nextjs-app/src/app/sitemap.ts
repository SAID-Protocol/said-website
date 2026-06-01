import type { MetadataRoute } from 'next';
import { getAllPosts } from '@/lib/blog';

const SITE = 'https://www.saidprotocol.com';

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = [
    '',
    '/agents',
    '/leaderboard',
    '/token',
    '/docs',
    '/docs/integrate',
    '/create-agent',
    '/mint-passport',
    '/grants/apply',
    '/security',
    '/blog',
    '/terms',
    '/privacy',
  ].map((path) => ({
    url: `${SITE}${path}`,
    changeFrequency: 'weekly' as const,
    priority: path === '' ? 1 : 0.7,
  }));

  const postRoutes = getAllPosts().map((post) => ({
    url: `${SITE}/blog/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }));

  return [...staticRoutes, ...postRoutes];
}
