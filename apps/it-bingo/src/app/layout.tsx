import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'IT業界あるあるBINGO 2.0',
  description: 'IT業界のあるあるネタでBINGOを楽しもう！',
  viewport: {
    width: 'device-width',
    initialScale: 1,
    viewportFit: 'cover',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" className="h-full">
      <body
        className={
          inter.className +
          ' h-full bg-neutral-950 text-neutral-100 antialiased selection:bg-brand-600/30 selection:text-white'
        }
      >
        <div className="min-h-screen flex flex-col relative">
          {/* 背景のグラデーション装飾 */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="absolute -top-24 left-1/2 -translate-x-1/2 h-80 w-[60rem] rounded-full bg-gradient-to-r from-brand-600/20 via-accent-400/10 to-pink-500/10 blur-3xl" />
            <div className="absolute -bottom-24 right-1/2 translate-x-1/2 h-80 w-[60rem] rounded-full bg-gradient-to-r from-emerald-500/10 via-indigo-500/10 to-sky-400/10 blur-3xl" />
          </div>

          {/* ヘッダー */}
          <header className="relative z-10 border-b border-neutral-800/60 backdrop-blur supports-[backdrop-filter]:bg-neutral-900/40">
            <div className="mx-auto max-w-5xl px-4 sm:px-6 py-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-6 w-6 rounded bg-brand-600" />
                <span className="text-sm font-semibold tracking-wide text-neutral-200">
                  IT業界あるあるBINGO2.0
                </span>
              </div>
              <nav className="hidden sm:flex items-center gap-4 text-sm text-neutral-300">
                <a href="/" className="hover:text-white transition-colors">
                  ホーム
                </a>
                <a href="/bingo" className="hover:text-white transition-colors">
                  BINGO
                </a>
              </nav>
            </div>
          </header>

          {/* コンテンツ */}
          <main className="relative z-10 flex-1">{children}</main>

          {/* フッター */}
          <footer className="relative z-10 border-t border-neutral-800/60">
            <div className="mx-auto max-w-5xl px-4 sm:px-6 pt-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] text-center text-xs text-neutral-500">
              © {new Date().getFullYear()} IT業界あるあるBINGO2.0
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
