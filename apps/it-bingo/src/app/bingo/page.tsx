'use client';

import { Suspense, useEffect, useState, useRef, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import { ARUARU_THEMES, JobType } from '@/lib/aruaru';
import { toPng } from 'html-to-image';
import { Download, Star, Twitter, RotateCcw } from 'lucide-react';

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
  [0, 1, 2, 3, 4], [5, 6, 7, 8, 9], [10, 11, 12, 13, 14], [15, 16, 17, 18, 19], [20, 21, 22, 23, 24],
  [0, 5, 10, 15, 20], [1, 6, 11, 16, 21], [2, 7, 12, 17, 22], [3, 8, 13, 18, 23], [4, 9, 14, 19, 24],
  [0, 6, 12, 18, 24], [4, 8, 12, 16, 20],
];

function BingoClientPage() {
  const searchParams = useSearchParams();
  const nickname = searchParams.get('nickname') || '名無しさん';
  const job = (searchParams.get('job') as JobType) || 'other';

  const [board, setBoard] = useState<string[]>([]);
  const [clearedCells, setClearedCells] = useState<Set<number>>(new Set([FREE_CELL_INDEX]));
  const [bingoCount, setBingoCount] = useState(0);
  const [isBingoAnimating, setIsBingoAnimating] = useState(false);
  const boardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const themes = ARUARU_THEMES[job] || ARUARU_THEMES.other;
    const shuffledThemes = shuffle([...themes]).slice(0, BINGO_SIZE * BINGO_SIZE - 1);
    const newBoard = [...shuffledThemes];
    newBoard.splice(FREE_CELL_INDEX, 0, 'FREE');
    setBoard(newBoard);
  }, [job]);

  const checkBingo = (currentCells: Set<number>) => {
    const newBingoCount = WINNING_LINES.filter(line => line.every(cell => currentCells.has(cell))).length;
    if (newBingoCount > bingoCount) {
      setIsBingoAnimating(true);
      setTimeout(() => setIsBingoAnimating(false), 2500);
    }
    setBingoCount(newBingoCount);
  };

  const handleCellClick = (index: number) => {
    if (index === FREE_CELL_INDEX) return;
    const newClearedCells = new Set(clearedCells);
    newClearedCells.has(index) ? newClearedCells.delete(index) : newClearedCells.add(index);
    setClearedCells(newClearedCells);
    checkBingo(newClearedCells);
  };

  const handleSaveImage = useCallback(() => {
    if (!boardRef.current) return;
    toPng(boardRef.current, {
        cacheBust: true,
        backgroundColor: '#f0f9ff',
        style: { padding: '20px' }
      })
      .then((dataUrl) => {
        const link = document.createElement('a');
        link.download = `it-aruaru-bingo-${nickname}.png`;
        link.href = dataUrl;
        link.click();
      })
      .catch((err) => {
        console.error('Image generation failed', err);
        alert('画像の保存に失敗しました。');
      });
  }, [boardRef, nickname]);

  const handleShareOnX = () => {
    const text = `IT業界あるあるBINGOで ${bingoCount} BINGO!! でした！🎉`;
    const hashtags = "IT業界あるあるBINGO";
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&hashtags=${encodeURIComponent(hashtags)}`;
    window.open(url, '_blank');
  };

  if (board.length === 0) {
    return <main className="flex min-h-screen items-center justify-center bg-gradient-main"><p>BINGOカードを生成中...</p></main>;
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-gradient-main">
      {isBingoAnimating && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
          <p className="text-9xl font-black text-white drop-shadow-lg animate-bounce">BINGO!</p>
        </div>
      )}
      <div className="w-full max-w-3xl mx-auto">
        <div className="mb-4 text-center">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 break-words drop-shadow-sm">
                {nickname}さんのBINGO
            </h1>
            <p className="mt-1 text-xl font-semibold text-blue-600 drop-shadow-sm">
                {bingoCount > 0 ? `${bingoCount} BINGO!` : 'BINGOを目指そう！'}
            </p>
        </div>

        <div className="p-4 bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl" ref={boardRef}>
            <div className="grid grid-cols-5 gap-2">
            {board.map((item, index) => (
                <div
                key={index}
                onClick={() => handleCellClick(index)}
                className={`relative aspect-square flex items-center justify-center text-center p-2 rounded-lg transition-all duration-300 ease-in-out shadow-md
                    ${clearedCells.has(index)
                    ? 'bg-gradient-to-br from-blue-400 to-cyan-400 text-white font-bold transform -rotate-3 scale-105 shadow-lg'
                    : 'bg-white hover:bg-blue-50 hover:scale-105 cursor-pointer'
                    }
                    ${index === FREE_CELL_INDEX ? 'text-blue-600' : 'text-gray-700 text-xs sm:text-sm'}`}
                >
                {index === FREE_CELL_INDEX ? <Star className="w-8 h-8" /> : item}
                </div>
            ))}
            </div>
        </div>

        <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
            <button onClick={handleSaveImage} className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-base font-semibold text-white bg-green-500 hover:bg-green-600 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300 ease-in-out">
                <Download size={18} />画像で保存
            </button>
            <button onClick={handleShareOnX} className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-base font-semibold text-white bg-gray-800 hover:bg-black shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300 ease-in-out">
                <Twitter size={18} />Xでシェア
            </button>
            <button onClick={() => window.location.href = '/'} className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-base font-semibold text-gray-700 bg-white hover:bg-gray-100 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300 ease-in-out">
                <RotateCcw size={18} />やり直す
            </button>
        </div>
      </div>
    </main>
  );
}

export default function BingoPage() {
    return (
        <Suspense fallback={<main className="flex min-h-screen items-center justify-center bg-gradient-main">読み込み中...</main>}>
            <BingoClientPage />
        </Suspense>
    );
}
