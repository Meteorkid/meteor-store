import { notFound } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { blogPosts, blogCategoryLabels } from '@/data/blog';

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = blogPosts.find((p) => p.slug === slug);
  return post
    ? { title: `${post.title} | Meteor Store 博客`, description: post.excerpt }
    : { title: '文章未找到 - Meteor Store' };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = blogPosts.find((p) => p.slug === slug);
  if (!post) notFound();

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      <main className="container mx-auto px-4 py-16">
        <article className="mx-auto max-w-3xl">
          <Link
            href="/blog"
            className="mb-10 inline-flex items-center gap-2 text-gray-400 transition-colors hover:text-white"
          >
            <span aria-hidden>←</span> 返回博客
          </Link>

          <div className="mb-6 flex flex-wrap items-center gap-3 text-sm">
            <span className="rounded-full bg-violet-500/10 px-3 py-1 text-xs font-medium text-violet-300">
              {blogCategoryLabels[post.category]}
            </span>
            <time className="text-gray-500" dateTime={post.date}>
              {new Date(post.date).toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' })}
            </time>
            <span className="text-gray-600">{post.readingTime} 分钟阅读</span>
          </div>

          <h1 className="mb-6 text-3xl font-bold leading-tight md:text-4xl">{post.title}</h1>
          <p className="mb-10 text-lg leading-relaxed text-gray-400">{post.excerpt}</p>

          <div className="prose-invert prose prose-lg max-w-none prose-headings:font-bold prose-headings:text-white prose-p:text-gray-300 prose-p:leading-relaxed prose-a:text-violet-300 prose-strong:text-white prose-code:rounded prose-code:bg-white/10 prose-code:px-1.5 prose-code:py-0.5 prose-code:text-emerald-300 prose-code:before:content-none prose-code:after:content-none prose-pre:rounded-xl prose-pre:border prose-pre:border-white/10 prose-pre:bg-zinc-950 prose-table:text-sm prose-th:text-white prose-td:text-gray-300 prose-td:border-white/10 prose-th:border-white/10">
            <BlogContent content={post.content} />
          </div>

          <div className="mt-12 flex flex-wrap gap-2 border-t border-white/10 pt-8">
            {post.tags.map((tag) => (
              <span key={tag} className="rounded-full bg-white/[0.06] px-3 py-1 text-sm text-gray-400">
                {tag}
              </span>
            ))}
          </div>

          <div className="mt-12 rounded-2xl border border-white/10 bg-white/[0.03] p-8 text-center">
            <p className="mb-4 text-gray-400">喜欢这篇文章？</p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/products"
                className="rounded-full bg-white px-6 py-2.5 text-sm font-semibold text-black transition-colors hover:bg-gray-200"
              >
                看看我们的产品
              </Link>
              <Link
                href="/blog"
                className="rounded-full border border-white/15 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-white/10"
              >
                更多文章
              </Link>
            </div>
          </div>
        </article>
      </main>
      <Footer />
    </div>
  );
}

function BlogContent({ content }: { content: string }) {
  const html = markdownToHtml(content);
  return <div dangerouslySetInnerHTML={{ __html: html }} />;
}

function markdownToHtml(md: string): string {
  const blocks: string[] = [];
  const lines = md.split('\n');
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    if (line.startsWith('```')) {
      const lang = line.slice(3).trim();
      const codeLines: string[] = [];
      i++;
      while (i < lines.length && !lines[i].startsWith('```')) {
        codeLines.push(lines[i]);
        i++;
      }
      i++;
      const escaped = codeLines.join('\n').replace(/</g, '&lt;').replace(/>/g, '&gt;');
      blocks.push(`<pre><code class="language-${lang || 'text'}">${escaped}</code></pre>`);
      continue;
    }

    if (line.startsWith('### ')) {
      blocks.push(`<h3>${inline(line.slice(4))}</h3>`);
      i++;
      continue;
    }
    if (line.startsWith('## ')) {
      blocks.push(`<h2>${inline(line.slice(3))}</h2>`);
      i++;
      continue;
    }

    if (line.startsWith('|')) {
      const tableLines: string[] = [line];
      i++;
      while (i < lines.length && lines[i].startsWith('|')) {
        tableLines.push(lines[i]);
        i++;
      }
      const rows = tableLines.filter((l) => !l.match(/^\|[\s-:|]+\|$/));
      if (rows.length > 0) {
        const headerCells = rows[0].split('|').filter(Boolean).map((c) => `<th>${inline(c.trim())}</th>`).join('');
        const bodyRows = rows.slice(1).map((r) => {
          const cells = r.split('|').filter(Boolean).map((c) => `<td>${inline(c.trim())}</td>`).join('');
          return `<tr>${cells}</tr>`;
        }).join('');
        blocks.push(`<table><thead><tr>${headerCells}</tr></thead><tbody>${bodyRows}</tbody></table>`);
      }
      continue;
    }

    if (/^\d+\. /.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^\d+\. /.test(lines[i])) {
        items.push(`<li>${inline(lines[i].replace(/^\d+\.\s*/, ''))}</li>`);
        i++;
      }
      blocks.push(`<ol>${items.join('')}</ol>`);
      continue;
    }

    if (line.startsWith('- ')) {
      const items: string[] = [];
      while (i < lines.length && lines[i].startsWith('- ')) {
        items.push(`<li>${inline(lines[i].slice(2))}</li>`);
        i++;
      }
      blocks.push(`<ul>${items.join('')}</ul>`);
      continue;
    }

    if (line.trim() === '') {
      i++;
      continue;
    }

    blocks.push(`<p>${inline(line)}</p>`);
    i++;
  }

  return blocks.join('\n');
}

function inline(text: string): string {
  return text
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/`([^`]+)`/g, '<code>$1</code>');
}
