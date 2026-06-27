'use client';

import Link from 'next/link';

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-xl">
      <div className="container mx-auto px-4 py-4">
        <nav className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl">🚀</span>
            <span className="text-xl font-bold bg-gradient-to-r from-purple-6 to-pink-6 bg-clip-text text-transparent">
              Meteor Store
            </span>
          </Link>
          <div className="flex items-center gap-6">
            <Link
              href="/products"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              产品
            </Link>
            <Link
              href="https://github.com/Meteorkid"
              target="_blank"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              GitHub
            </Link>
            <Link
              href="#pricing"
              className="px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
            >
              开始使用
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
}
