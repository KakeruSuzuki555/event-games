'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@event-games/ui';
import { JOB_TYPES, JobType } from '@/lib/aruaru';

// カスタムドロップダウンコンポーネント
interface CustomDropdownProps {
  value: JobType;
  onChange: (value: JobType) => void;
  options: Record<string, string>;
  id: string;
}

function CustomDropdown({ value, onChange, options, id }: CustomDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const optionEntries = Object.entries(options);

  // 外部クリックでドロップダウンを閉じる
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setFocusedIndex(-1);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // キーボードナビゲーション
  const handleKeyDown = (event: React.KeyboardEvent) => {
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        if (!isOpen) {
          setIsOpen(true);
          setFocusedIndex(0);
        } else {
          setFocusedIndex((prev) => (prev + 1) % optionEntries.length);
        }
        break;
      case 'ArrowUp':
        event.preventDefault();
        if (!isOpen) {
          setIsOpen(true);
          setFocusedIndex(optionEntries.length - 1);
        } else {
          setFocusedIndex((prev) => (prev - 1 + optionEntries.length) % optionEntries.length);
        }
        break;
      case 'Enter':
      case ' ':
        event.preventDefault();
        if (isOpen && focusedIndex >= 0) {
          const [key] = optionEntries[focusedIndex];
          onChange(key as JobType);
          setIsOpen(false);
          setFocusedIndex(-1);
          buttonRef.current?.focus();
        } else {
          setIsOpen(!isOpen);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        setFocusedIndex(-1);
        buttonRef.current?.focus();
        break;
    }
  };

  const handleOptionClick = (key: string) => {
    onChange(key as JobType);
    setIsOpen(false);
    setFocusedIndex(-1);
    buttonRef.current?.focus();
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        ref={buttonRef}
        type="button"
        id={id}
        onClick={() => setIsOpen(!isOpen)}
        onKeyDown={handleKeyDown}
        className="block w-full appearance-none rounded-lg border border-neutral-700 bg-neutral-800/70 px-4 py-2.5 pr-10 text-neutral-100 outline-none transition-colors focus:border-brand-500 focus:shadow-[0_0_0_3px_rgba(79,70,229,0.25)] hover:bg-neutral-700/70"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-labelledby={`${id}-label`}
      >
        <span className="block truncate text-left">{options[value]}</span>
        <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-neutral-400">
          <svg
            className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>

      {isOpen && (
        <div
          className="absolute z-50 mt-1 w-full rounded-lg border border-neutral-700 bg-neutral-800 shadow-lg"
          role="listbox"
          aria-labelledby={`${id}-label`}
        >
          {optionEntries.map(([key, name], index) => (
            <button
              key={key}
              type="button"
              onClick={() => handleOptionClick(key)}
              className={`block w-full px-4 py-2.5 text-left text-neutral-100 transition-colors first:rounded-t-lg last:rounded-b-lg ${
                index === focusedIndex
                  ? 'bg-brand-600 text-white'
                  : 'hover:bg-neutral-700 focus:bg-neutral-700'
              } ${key === value ? 'bg-brand-500/20 text-brand-300' : ''}`}
              role="option"
              aria-selected={key === value}
            >
              {name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

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
    <main className="flex flex-grow items-center justify-center px-4 py-10 sm:px-6">
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
                  className="block w-full rounded-lg border border-neutral-700 bg-neutral-800 px-4 py-2.5 text-neutral-50 placeholder-neutral-500 outline-none ring-0 transition-shadow focus:border-brand-500 focus:shadow-[0_0_0_3px_rgba(79,70,229,0.25)]"
                  placeholder="例: すごいエンジニア"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="job"
                id="job-label"
                className="block text-xs font-medium text-neutral-400"
              >
                職種
              </label>
              <div className="mt-1.5">
                <CustomDropdown id="job" value={job} onChange={setJob} options={JOB_TYPES} />
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
