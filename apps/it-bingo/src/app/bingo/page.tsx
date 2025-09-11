'use client';

import { Suspense, useEffect, useState, useRef, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import { ARUARU_THEMES, JobType } from '@/lib/aruaru';
import { Button } from '@event-games/ui';
import { toPng } from 'html-to-image';

const BINGO_SIZE = 5;
const FREE_CELL_INDEX = Math.floor((BINGO_SIZE * BINGO_SIZE) / 2);

const shuffle = (array: string[]) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

const WINNING_LINES = [
  // Rows
  [0, 1, 2, 3, 4],
  [5, 6, 7, 8, 9],
  [10, 11, 12, 13, 14],
  [15, 16, 17, 18, 19],
  [20, 21, 22, 23, 24],
  // Columns
  [0, 5, 10, 15, 20],
  [1, 6, 11, 16, 21],
  [2, 7, 12, 17, 22],
  [3, 8, 13, 18, 23],
  [4, 9, 14, 19, 24],
  // Diagonals
  [0, 6, 12, 18, 24],
  [4, 8, 12, 16, 20],
];

const StarIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className="w-8 h-8 sm:w-10 sm:h-10 text-yellow-300"
  >
    <path
      fillRule="evenodd"
      d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.116 3.986 1.24 5.383c.218 1.121-.956 2.023-1.956 1.442L12 18.354l-4.573 2.98c-.996.58-2.174-.32-1.956-1.442l1.24-5.383L2.28 10.955c-.886-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.007z"
      clipRule="evenodd"
    />
  </svg>
);

function BingoClientPage() {
  const searchParams = useSearchParams();
  const nickname = searchParams.get('nickname') || '名無しさん';
  const job = (searchParams.get('job') as JobType) || 'other';

  const [board, setBoard] = useState<string[]>([]);
  const [clearedCells, setClearedCells] = useState<Set<number>>(new Set([FREE_CELL_INDEX]));
  const [bingoCount, setBingoCount] = useState(0);
  const [showBingo, setShowBingo] = useState(false);
  const boardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const themes = ARUARU_THEMES[job] || ARUARU_THEMES.other;
    const shuffledThemes = shuffle([...themes]);
    const selectedThemes = shuffledThemes.slice(0, BINGO_SIZE * BINGO_SIZE - 1);

    const newBoard = [...selectedThemes];
    newBoard.splice(FREE_CELL_INDEX, 0, 'FREE');
    setBoard(newBoard);
  }, [job]);

  const checkBingo = (currentCells: Set<number>) => {
    let count = 0;
    for (const line of WINNING_LINES) {
      if (line.every((cell) => currentCells.has(cell))) {
        count++;
      }
    }
    if (count > bingoCount) {
      setShowBingo(true);
      setTimeout(() => setShowBingo(false), 2500);
    }
    setBingoCount(count);
  };

  const handleCellClick = (index: number) => {
    if (index === FREE_CELL_INDEX) return;

    const newClearedCells = new Set(clearedCells);
    if (newClearedCells.has(index)) {
      newClearedCells.delete(index);
    } else {
      newClearedCells.add(index);
    }
    setClearedCells(newClearedCells);
    checkBingo(newClearedCells);
  };

  const handleSaveImage = useCallback(() => {
    if (boardRef.current === null) return;
    toPng(boardRef.current, {
      cacheBust: true,
      backgroundColor: '#1e293b', // neutral-800
    })
      .then((dataUrl) => {
        const link = document.createElement('a');
        link.download = 'it-aruaru-bingo.png';
        link.href = dataUrl;
        link.click();
      })
      .catch((err) => {
        console.error('oops, something went wrong!', err);
        alert('画像の保存に失敗しました。');
      });
  }, [boardRef]);

  const handleShareOnX = () => {
    const text = `IT業界あるあるBINGOで ${bingoCount} BINGO!! でした！`;
    const hashtags = 'IT業界あるあるBINGO';
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&hashtags=${encodeURIComponent(hashtags)}`;
    window.open(url, '_blank');
  };

  if (board.length === 0) {
    return (
      <div className="flex-grow flex items-center justify-center">
        <p className="text-lg animate-pulse text-neutral-300">BINGOカードを生成中...</p>
      </div>
    );
  }

  return (
    <main className="flex-grow flex flex-col items-center justify-center p-2 sm:p-4">
      {showBingo && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 transition-opacity duration-300 animate-fadeIn">
          <div
            className="text-7xl sm:text-9xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-red-500 to-pink-500 animate-zoomIn"
            style={{ textShadow: '0 0 20px rgba(255,255,255,0.5)' }}
          >
            BINGO!
          </div>
        </div>
      )}
      <div className="w-full max-w-3xl mx-auto p-4 sm:p-6 md:p-8">
        <header className="text-center mb-4 sm:mb-6">
          <h1 className="text-2xl sm:text-4xl font-bold text-neutral-50 break-words tracking-wide">
            {nickname}のBINGO
          </h1>
          <p className="mt-2 text-lg sm:text-xl font-semibold text-accent-400">
            {bingoCount > 0 ? `${bingoCount} BINGO!` : 'BINGOを目指そう！'}
          </p>
        </header>

        <div
          className="relative p-2 sm:p-3 md:p-4 rounded-2xl border border-neutral-800/70 bg-neutral-900/60 shadow-[0_0_0_1px_rgba(255,255,255,0.02)] backdrop-blur supports-[backdrop-filter]:bg-neutral-900/40"
          ref={boardRef}
        >
          <div className="absolute -top-px left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent-400/40 to-transparent" />
          <div className="grid grid-cols-5 gap-1 sm:gap-2 md:gap-3">
            {board.map((item, index) => {
              const isCleared = clearedCells.has(index);
              const isFree = index === FREE_CELL_INDEX;
              return (
                <div
                  key={index}
                  onClick={() => handleCellClick(index)}
                  className={`aspect-square flex items-center justify-center text-center p-0.5 sm:p-1 md:p-2 rounded-lg sm:rounded-xl transition-all duration-300 ease-in-out border
                    ${
                      isCleared
                        ? 'bg-gradient-to-br from-emerald-500 to-teal-600 border-emerald-400 text-white font-bold shadow-lg ring-2 ring-emerald-200/60 transform scale-105'
                        : `bg-neutral-800/70 border-neutral-700 ${isFree ? '' : 'cursor-pointer hover:bg-neutral-700 hover:border-accent-400 hover:-translate-y-0.5 active:scale-95 active:bg-accent-500/20'}`
                    }
                  `}
                >
                  {isCleared ? (
                    isFree ? (
                      <StarIcon />
                    ) : (
                      <span className="text-[10px] sm:text-xs md:text-sm text-white font-bold drop-shadow">
                        {item}
                      </span>
                    )
                  ) : (
                    <span
                      className={`text-[10px] sm:text-xs md:text-sm ${isFree ? 'font-bold text-accent-400' : 'text-neutral-300'}`}
                    >
                      {item}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-8 flex flex-col sm:flex-row justify-center items-center gap-4">
          <Button onClick={handleSaveImage} size="md" variant="primary">
            結果を画像で保存
          </Button>
          <Button onClick={handleShareOnX} variant="secondary">
            Xで結果をシェア
          </Button>
        </div>
        <div className="mt-8 text-center">
          <button
            onClick={() => (window.location.href = '/')}
            className="text-sm text-neutral-400 hover:text-neutral-200 hover:underline"
          >
            やり直す
          </button>
        </div>
      </div>
    </main>
  );
}

export default function BingoPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-neutral-900 text-neutral-100">
          読み込み中...
        </div>
      }
    >
      <BingoClientPage />
    </Suspense>
  );
}
