import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const POSTS_DIR = path.join(process.cwd(), '_posts');

export type PostMeta = {
  slug: string;
  title: string;
  date: string;
};

function normalizeDate(value: any): string {
  if (!value) return '';
  const d = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(d.getTime())) return '';
  return d.toISOString().slice(0, 10);
}

export function getAllPosts(): PostMeta[] {
  if (!fs.existsSync(POSTS_DIR)) return [];
  const files = fs.readdirSync(POSTS_DIR).filter(f => f.endsWith('.md'));
  return files
    .map((filename) => {
      const filePath = path.join(POSTS_DIR, filename);
      const file = fs.readFileSync(filePath, 'utf8');
      const { data } = matter(file);
      const slug = filename.replace(/^\d{4}-\d{2}-\d{2}-/, '').replace(/\.md$/, '');
      const rawDate = (data as any).date ?? filename.slice(0, 10);
      const date = normalizeDate(rawDate);
      return {
        slug,
        title: (data as any).title ?? slug,
        date,
      } as PostMeta;
    })
    .sort((a, b) => {
      const ta = a.date ? new Date(a.date).getTime() : 0;
      const tb = b.date ? new Date(b.date).getTime() : 0;
      return tb - ta;
    });
}

export function getPostBySlug(slug: string) {
  const filename = fs
    .readdirSync(POSTS_DIR)
    .find((f) => f.endsWith('.md') && f.replace(/^\d{4}-\d{2}-\d{2}-/, '').replace(/\.md$/, '') === slug);
  if (!filename) return null;
  const filePath = path.join(POSTS_DIR, filename);
  const raw = fs.readFileSync(filePath, 'utf8');
  const { data, content } = matter(raw);
  const date = normalizeDate((data as any).date ?? filename.slice(0, 10));
  const title = (data as any).title ?? slug;
  return { slug, title, date, content };
}


