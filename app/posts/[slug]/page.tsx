import { notFound } from 'next/navigation';
import { getAllPosts, getPostBySlug } from '../../../lib/posts';
import { remark } from 'remark';
import html from 'remark-html';

type Params = { params: { slug: string } };

export default async function PostPage({ params }: Params) {
  const post = getPostBySlug(params.slug);
  if (!post) return notFound();

  const processed = await remark().use(html).process(post.content);
  const contentHtml = processed.toString();

  return (
    <article className="post">
      <h2>{post.title}</h2>
      <div className="meta">{new Date(post.date).toISOString().slice(0, 10)}</div>
      <div dangerouslySetInnerHTML={{ __html: contentHtml }} />
    </article>
  );
}

export async function generateStaticParams() {
  return getAllPosts().map(p => ({ slug: p.slug }));
}


