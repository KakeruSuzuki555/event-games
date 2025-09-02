'use client';

import { Suspense, useEffect, useState, useRef, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import { ARUARU_THEMES, JobType } from '@/lib/aruaru';
import { Button } from '@event-games/ui';
import { toPng } from 'html-to-image';

const BINGO_SIZE = 5;
const FREE_CELL_INDEX = Math.floor((BINGO_SIZE * BINGO_SIZE) / 2);

// Fisher-Yates shuffle algorithm
const shuffle = (array: string[]) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

const WINNING_LINES = [
  // Rows
  [0, 1, 2, 3, 4], [5, 6, 7, 8, 9], [10, 11, 12, 13, 14], [15, 16, 17, 18, 19], [20, 21, 22, 23, 24],
  // Columns
  [0, 5, 10, 15, 20], [1, 6, 11, 16, 21], [2, 7, 12, 17, 22], [3, 8, 13, 18, 23], [4, 9, 14, 19, 24],
  // Diagonals
  [0, 6, 12, 18, 24], [4, 8, 12, 16, 20],
];

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
      if (line.every(cell => currentCells.has(cell))) {
        count++;
      }
    }
    if (count > bingoCount) {
      setShowBingo(true);
      setTimeout(() => setShowBingo(false), 2000);
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
    if (boardRef.current === null) {
      return;
    }
    toPng(boardRef.current, { cacheBust: true, })
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
    const hashtags = "IT業界あるあるBINGO";
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&hashtags=${encodeURIComponent(hashtags)}`;
    window.open(url, '_blank');
  };

  if (board.length === 0) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-8 bg-gray-100">
        <p>BINGOカードを生成中...</p>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-start p-4 sm:p-8 bg-gray-100">
      {showBingo && (
        <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-8xl font-extrabold text-red-500 z-20" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.5)' }}>
          BINGO!
        </div>
      )}
      <div className="w-full max-w-2xl mx-auto" ref={boardRef}>
        <div className="p-4 bg-gray-100">
            <div className="text-center mb-4">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 break-words">
                {nickname}のBINGO
            </h1>
            <p className="text-lg font-semibold text-brand-600">
                {bingoCount > 0 ? `${bingoCount} BINGO!` : 'BINGOを目指そう！'}
            </p>
            </div>
            <div className="grid grid-cols-5 gap-1.5 sm:gap-2">
            {board.map((item, index) => (
                <div
                key={index}
                onClick={() => handleCellClick(index)}
                className={`aspect-square flex items-center justify-center text-center p-1 sm:p-2 rounded-md transition-all duration-200 cursor-pointer shadow-sm
                    ${clearedCells.has(index)
                    ? 'bg-brand-500 text-white transform -rotate-3 scale-105'
                    : 'bg-white hover:bg-blue-50'
                    }
                    ${index === FREE_CELL_INDEX ? 'font-bold text-lg' : 'text-xs sm:text-sm'}`}
                >
                {item}
                </div>
            ))}
            </div>
        </div>
      </div>
      <div className="mt-6 flex flex-col sm:flex-row gap-4">
        <Button onClick={handleSaveImage}>
            結果を画像で保存
        </Button>
        <Button onClick={handleShareOnX} className="!bg-black hover:!bg-gray-800">
            Xで結果をシェア
        </Button>
      </div>
      <div className="mt-6 text-center">
        <button onClick={() => window.location.href = '/'} className="text-sm text-gray-600 hover:underline">
            やり直す
        </button>
      </div>
    </main>
  );
}

export default function BingoPage() {
    return (
        <Suspense fallback={<div className="flex min-h-screen items-center justify-center">読み込み中...</div>}>
            <BingoClientPage />
        </Suspense>
    );
}
