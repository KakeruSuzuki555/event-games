'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@event-games/ui";
import { JOB_TYPES, JobType } from "@/lib/aruaru";

export default function Home() {
  const router = useRouter();
  const [nickname, setNickname] = useState("");
  const [job, setJob] = useState<JobType>("engineer");

  const handleStartClick = () => {
    if (!nickname.trim()) {
      alert("ニックネームを入力してください。");
      return;
    }
    // URLにパラメータを付けてbingoページへ遷移
    router.push(`/bingo?nickname=${encodeURIComponent(nickname)}&job=${job}`);
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 sm:p-8 bg-neutral-900 text-neutral-100">
      <div className="w-full max-w-md p-8 space-y-8 bg-neutral-800/50 rounded-lg shadow-2xl">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-neutral-50 tracking-tight">
            IT業界あるあるBINGO
          </h1>
          <p className="mt-3 text-neutral-300">
            プロフィールを入力してBINGOを始めよう！
          </p>
        </div>

        <div className="space-y-6">
          <div>
            <label
              htmlFor="nickname"
              className="block text-sm font-medium text-neutral-300 mb-1"
            >
              ニックネーム
            </label>
            <input
              id="nickname"
              type="text"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              className="mt-1 block w-full px-4 py-2 bg-neutral-700 border border-neutral-600 rounded-md shadow-sm placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-neutral-800 focus:ring-brand-500 sm:text-sm text-neutral-100"
              placeholder="例: すごいエンジニア"
            />
          </div>

          <div>
            <label
              htmlFor="job"
              className="block text-sm font-medium text-neutral-300 mb-1"
            >
              職種
            </label>
            <select
              id="job"
              value={job}
              onChange={(e) => setJob(e.target.value as JobType)}
              className="mt-1 block w-full pl-4 pr-10 py-2 bg-neutral-700 border border-neutral-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-neutral-800 focus:ring-brand-500 sm:text-sm text-neutral-100"
            >
              {Object.entries(JOB_TYPES).map(([key, name]) => (
                <option key={key} value={key} className="bg-neutral-700 text-neutral-100">
                  {name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <Button
          onClick={handleStartClick}
          className="w-full !text-lg !py-3"
        >
          BINGOカードを生成
        </Button>
      </div>
    </main>
  );
}
