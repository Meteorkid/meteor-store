import { NextRequest, NextResponse } from 'next/server';
import { getHelpArticle } from '@/data/help';
import { renderHelpMarkdown } from '@/lib/help-markdown';
import type { Locale } from '@/i18n/routing';

export async function GET(req: NextRequest) {
  const slug = req.nextUrl.searchParams.get('slug');
  const locale = (req.nextUrl.searchParams.get('locale') || 'zh') as Locale;

  if (!slug) {
    return NextResponse.json({ error: 'Missing slug' }, { status: 400 });
  }

  try {
    const article = await getHelpArticle(locale, slug);
    if (!article) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    const { html, headings } = renderHelpMarkdown({
      content: article.content,
      slug: article.slug,
      locale,
    });

    return NextResponse.json({
      title: article.title,
      html,
      headings: headings.map((h) => ({ id: h.id, text: h.text, level: h.level })),
      category: article.category,
    });
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
