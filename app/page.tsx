import Link from 'next/link';
import { getAllPosts } from '../lib/posts';

export default function HomePage() {
  const posts = getAllPosts();
  return (
    <div>
      {posts.length === 0 ? (
        <p>No posts found. Add files to <code>_posts</code> using <code>YYYY-MM-DD-title.md</code>.</p>
      ) : (
        <ul>
          {posts.map((p) => (
            <li key={p.slug}>
              <Link href={`/posts/${p.slug}`}>{p.title}</Link>
              <small> — {new Date(p.date).toISOString().slice(0, 10)}</small>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}


