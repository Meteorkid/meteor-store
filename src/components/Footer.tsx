import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="border-t border-border bg-background/50">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl">🚀</span>
              <span className="text-xl font-bold bg-gradient-to-r from-purple-6 to-pink-6 bg-clip-text text-transparent">
                Meteor Store
              </span>
            </div>
            <p className="text-muted-foreground text-sm">
              高质量的开发者工具和 AI 应用
            </p>
          </div>
          <div>
            <h3 className="text-foreground font-semibold mb-4">产品</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/products/omnicrawl" className="text-muted-foreground hover:text-foreground text-sm transition-colors">
                  OmniCrawl
                </Link>
              </li>
              <li>
                <Link href="/products/ex-memory" className="text-muted-foreground hover:text-foreground text-sm transition-colors">
                  Ex-Memory
                </Link>
              </li>
              <li>
                <Link href="/products/skeleton-anatomy" className="text-muted-foreground hover:text-foreground text-sm transition-colors">
                  Skeleton Anatomy
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-foreground font-semibold mb-4">资源</h3>
            <ul className="space-y-2">
              <li>
                <Link href="https://github.com/Meteorkid" target="_blank" className="text-muted-foreground hover:text-foreground text-sm transition-colors">
                  GitHub
                </Link>
              </li>
              <li>
                <Link href="/docs" className="text-muted-foreground hover:text-foreground text-sm transition-colors">
                  文档
                </Link>
              </li>
              <li>
                <Link href="/support" className="text-muted-foreground hover:text-foreground text-sm transition-colors">
                  支持
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-foreground font-semibold mb-4">法律</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/privacy" className="text-muted-foreground hover:text-foreground text-sm transition-colors">
                  隐私政策
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-muted-foreground hover:text-foreground text-sm transition-colors">
                  服务条款
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-border mt-8 pt-8 text-center">
          <p className="text-muted-foreground text-sm">
            © {new Date().getFullYear()} Meteor Store. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
