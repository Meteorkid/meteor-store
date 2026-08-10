import { readFileSync } from 'fs';
import { join } from 'path';
import { NextResponse } from 'next/server';

export async function GET() {
  const md = readFileSync(join(process.cwd(), 'docs/blog-publishing-api.md'), 'utf-8');
  return new NextResponse(md, {
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
      'Content-Disposition': 'attachment; filename="blog-publishing-api.md"',
    },
  });
}
