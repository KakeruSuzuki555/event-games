'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@event-games/ui';
import { JOB_TYPES, JobType } from '@/lib/aruaru';

export default function Home() {
  const router = useRouter();
  const [nickname, setNickname] = useState('');
  const [job, setJob] = useState<JobType>('engineer');

  const handleStartClick = () => {
    if (!nickname.trim()) {
      alert('ニックネームを入力してください。');
      return;
    }
    // URLにパラメータを付けてbingoページへ遷移
    router.push(`/bingo?nickname=${encodeURIComponent(nickname)}&job=${job}`);
  };

  return (
    <main className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-10 sm:px-6">
      <div className="w-full max-w-lg">
        <div className="relative rounded-2xl border border-neutral-800/70 bg-neutral-900/60 p-6 sm:p-8 shadow-[0_0_0_1px_rgba(255,255,255,0.02)] backdrop-blur supports-[backdrop-filter]:bg-neutral-900/40">
          {/* カード上部の装飾バー */}
          <div className="absolute -top-px left-0 right-0 h-px bg-gradient-to-r from-transparent via-brand-500/40 to-transparent" />
          <div className="text-center">
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-neutral-50">
              IT業界あるあるBINGO2.0
            </h1>
            <p className="mt-3 text-neutral-300 text-sm">プロフィールを入力してBINGOを始めよう</p>
          </div>

          <div className="mt-8 space-y-6">
            <div>
              <label htmlFor="nickname" className="block text-xs font-medium text-neutral-400">
                ニックネーム
              </label>
              <div className="mt-1.5 relative">
                <input
                  id="nickname"
                  type="text"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  className="block w-full rounded-lg border border-neutral-700 bg-neutral-800/70 px-4 py-2.5 text-neutral-100 placeholder-neutral-500 outline-none ring-0 transition-shadow focus:border-brand-500 focus:shadow-[0_0_0_3px_rgba(79,70,229,0.25)]"
                  placeholder="例: すごいエンジニア"
                />
              </div>
            </div>

            <div>
              <label htmlFor="job" className="block text-xs font-medium text-neutral-400">
                職種
              </label>
              <div className="mt-1.5 relative">
                <select
                  id="job"
                  value={job}
                  onChange={(e) => setJob(e.target.value as JobType)}
                  className="block w-full appearance-none rounded-lg border border-neutral-700 bg-neutral-800/70 px-4 py-2.5 pr-10 text-neutral-100 outline-none focus:border-brand-500 focus:shadow-[0_0_0_3px_rgba(79,70,229,0.25)]"
                >
                  {Object.entries(JOB_TYPES).map(([key, name]) => (
                    <option key={key} value={key} className="bg-neutral-800 text-neutral-100">
                      {name}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-neutral-400">
                  ▾
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8">
            <Button onClick={handleStartClick} size="lg" fullWidth>
              BINGOカードを生成
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
}
