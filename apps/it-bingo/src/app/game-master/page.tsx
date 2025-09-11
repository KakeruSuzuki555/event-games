'use client';

import { useState, useMemo } from 'react';
import { Button } from '@event-games/ui';
import { JOB_TYPES, JobType, ARUARU_THEMES } from '@/lib/aruaru';

type JobCounts = Record<JobType, number>;

const themeToJobMap = new Map<string, JobType>();
Object.entries(ARUARU_THEMES).forEach(([job, themes]) => {
  themes.forEach((theme) => {
    themeToJobMap.set(theme, job as JobType);
  });
});

export default function GameMasterPage() {
  const [jobCounts, setJobCounts] = useState<JobCounts>(
    Object.keys(JOB_TYPES).reduce((acc, key) => {
      acc[key as JobType] = 0;
      return acc;
    }, {} as JobCounts)
  );
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [availableThemes, setAvailableThemes] = useState<string[]>([]);
  const [drawnThemes, setDrawnThemes] = useState<string[]>([]);
  const [currentTheme, setCurrentTheme] = useState<string | null>(null);

  const handleCountChange = (job: JobType, count: number) => {
    setJobCounts((prev) => ({ ...prev, [job]: Math.max(0, count) }));
  };

  const totalParticipants = useMemo(
    () => Object.values(jobCounts).reduce((sum, count) => sum + count, 0),
    [jobCounts]
  );

  const startGame = () => {
    const themePool = Object.entries(jobCounts)
      .filter(([, count]) => count > 0)
      .flatMap(([job]) => ARUARU_THEMES[job as JobType]);

    setAvailableThemes(Array.from(new Set(themePool)));
    setDrawnThemes([]);
    setCurrentTheme(null);
    setIsGameStarted(true);
  };

  const drawNextTheme = () => {
    if (availableThemes.length === 0) return;

    const weightedThemes = availableThemes.map(theme => {
      const job = themeToJobMap.get(theme)!;
      const weight = jobCounts[job];
      return { theme, weight };
    });

    const totalWeight = weightedThemes.reduce((sum, { weight }) => sum + weight, 0);
    let randomWeight = Math.random() * totalWeight;

    let chosenTheme: string | null = null;
    for (const { theme, weight } of weightedThemes) {
      randomWeight -= weight;
      if (randomWeight <= 0) {
        chosenTheme = theme;
        break;
      }
    }

    if (chosenTheme) {
      setCurrentTheme(chosenTheme);
      setDrawnThemes((prev) => [...prev, chosenTheme!]);
      setAvailableThemes((prev) => prev.filter((t) => t !== chosenTheme));
    }
  };

  const resetGame = () => {
    setIsGameStarted(false);
    setCurrentTheme(null);
    setAvailableThemes([]);
    setDrawnThemes([]);
    setJobCounts(Object.keys(JOB_TYPES).reduce((acc, key) => {
      acc[key as JobType] = 0;
      return acc;
    }, {} as JobCounts));
  };


  if (isGameStarted) {
    return (
      <main className="flex flex-grow flex-col items-center justify-center px-4 py-10 sm:px-6">
        <div className="w-full max-w-4xl text-center">
          <div className="mb-8 min-h-[160px] flex items-center justify-center">
            {currentTheme && (
              <div className="relative rounded-2xl border border-neutral-700 bg-neutral-800/80 p-8 shadow-lg backdrop-blur-sm">
                 <div className="absolute -top-px left-1/2 -translate-x-1/2 w-1/2 h-px bg-gradient-to-r from-transparent via-brand-500 to-transparent" />
                 <div className="absolute -bottom-px left-1/2 -translate-x-1/2 w-1/2 h-px bg-gradient-to-r from-transparent via-brand-500 to-transparent" />
                <p className="text-3xl sm:text-5xl font-bold tracking-wider text-brand-300 break-words">
                  {currentTheme}
                </p>
              </div>
            )}
          </div>

          <div className="space-x-4">
            <Button
              onClick={drawNextTheme}
              size="lg"
              disabled={availableThemes.length === 0}
              className="px-10 py-6 text-xl"
            >
              次のテーマを引く
            </Button>
            <Button onClick={resetGame} size="lg" variant="secondary" className="px-10 py-6 text-xl">
              リセット
            </Button>
          </div>

          <div className="mt-8 text-neutral-400">
            <p>残りテーマ数: {availableThemes.length}</p>
          </div>
        </div>

        {drawnThemes.length > 0 && (
          <div className="mt-12 w-full max-w-6xl">
            <h2 className="text-xl font-bold text-neutral-200 text-center mb-4">抽選済みテーマ一覧</h2>
            <div className="h-48 overflow-y-auto rounded-lg border border-neutral-800 bg-neutral-900/50 p-4">
              <ul className="space-y-2 text-neutral-400">
                {drawnThemes.map((theme, index) => (
                  <li key={index} className="border-b border-neutral-800 pb-1">
                    {theme}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </main>
    );
  }

  return (
    <main className="flex flex-grow items-center justify-center px-4 py-10 sm:px-6">
      <div className="w-full max-w-2xl">
        <div className="relative rounded-2xl border border-neutral-800/70 bg-neutral-900/60 p-6 sm:p-8 shadow-[0_0_0_1px_rgba(255,255,255,0.02)] backdrop-blur supports-[backdrop-filter]:bg-neutral-900/40">
          <div className="absolute -top-px left-0 right-0 h-px bg-gradient-to-r from-transparent via-brand-500/40 to-transparent" />
          <div className="text-center">
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-neutral-50">
              ゲームマスターパネル
            </h1>
            <p className="mt-3 text-neutral-300 text-sm">
              各職種の参加人数を入力して抽選を開始してください。
            </p>
          </div>

          <div className="mt-8 space-y-4">
            {Object.entries(JOB_TYPES).map(([key, name]) => (
              <div key={key} className="flex items-center justify-between">
                <label htmlFor={`job-count-${key}`} className="text-neutral-300">
                  {name}
                </label>
                <input
                  id={`job-count-${key}`}
                  type="number"
                  min="0"
                  value={jobCounts[key as JobType]}
                  onChange={(e) => handleCountChange(key as JobType, parseInt(e.target.value, 10) || 0)}
                  className="w-24 rounded-lg border border-neutral-700 bg-neutral-800 px-3 py-2 text-neutral-50 placeholder-neutral-500 outline-none ring-0 transition-shadow focus:border-brand-500 focus:shadow-[0_0_0_3px_rgba(79,70,229,0.25)]"
                />
              </div>
            ))}
          </div>

          <div className="mt-6 border-t border-neutral-800 pt-6 text-center">
            <p className="text-lg text-neutral-200">
              合計参加人数: <span className="font-bold text-brand-400">{totalParticipants}</span>人
            </p>
          </div>

          <div className="mt-8">
            <Button
              onClick={startGame}
              size="lg"
              fullWidth
              disabled={totalParticipants === 0}
            >
              抽選を開始
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
}
