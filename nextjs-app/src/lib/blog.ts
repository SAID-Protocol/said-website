import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const POSTS_DIR = path.join(process.cwd(), 'content', 'blog');

/** Fallback thumbnail for posts that don't set their own `cover:`. */
export const DEFAULT_COVER = '/blog-cover.jpg';

export type PostCategory = 'Milestones' | 'Integrations' | 'Announcements' | 'Engineering';

export interface PostMeta {
  slug: string;
  title: string;
  date: string; // ISO yyyy-mm-dd
  excerpt: string;
  category: PostCategory;
  cover?: string;
  author?: string;
  /** Tweet IDs surfaced on the card / used for OG fallback */
  tweets?: string[];
}

export interface Post extends PostMeta {
  content: string; // raw MDX body
}

function readPostFile(slug: string): Post | null {
  const fullPath = path.join(POSTS_DIR, `${slug}.mdx`);
  if (!fs.existsSync(fullPath)) return null;

  const raw = fs.readFileSync(fullPath, 'utf8');
  const { data, content } = matter(raw);

  if (data.draft) return null;

  return {
    slug,
    title: data.title ?? slug,
    date: data.date ? new Date(data.date).toISOString().slice(0, 10) : '1970-01-01',
    excerpt: data.excerpt ?? '',
    category: (data.category as PostCategory) ?? 'Announcements',
    cover: data.cover ?? DEFAULT_COVER,
    author: data.author ?? 'SAID Protocol',
    tweets: Array.isArray(data.tweets) ? data.tweets.map(String) : undefined,
    content,
  };
}

/** All published posts, newest first. */
export function getAllPosts(): Post[] {
  if (!fs.existsSync(POSTS_DIR)) return [];

  return fs
    .readdirSync(POSTS_DIR)
    .filter((f) => f.endsWith('.mdx'))
    .map((f) => readPostFile(f.replace(/\.mdx$/, '')))
    .filter((p): p is Post => p !== null)
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getPostSlugs(): string[] {
  if (!fs.existsSync(POSTS_DIR)) return [];
  return fs
    .readdirSync(POSTS_DIR)
    .filter((f) => f.endsWith('.mdx'))
    .map((f) => f.replace(/\.mdx$/, ''));
}

export function getPost(slug: string): Post | null {
  return readPostFile(slug);
}

export const CATEGORIES: PostCategory[] = [
  'Milestones',
  'Integrations',
  'Announcements',
  'Engineering',
];
