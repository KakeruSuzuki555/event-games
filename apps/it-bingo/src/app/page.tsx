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
    <main className="flex min-h-screen flex-col items-center justify-center p-8 bg-gray-50">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-800">
            IT業界あるあるBINGO
          </h1>
          <p className="mt-2 text-gray-600">
            プロフィールを入力してBINGOを始めよう！
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <label
              htmlFor="nickname"
              className="block text-sm font-medium text-gray-700"
            >
              ニックネーム
            </label>
            <input
              id="nickname"
              type="text"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-brand-500 focus:border-brand-500 sm:text-sm"
              placeholder="例: すごいエンジニア"
            />
          </div>

          <div>
            <label
              htmlFor="job"
              className="block text-sm font-medium text-gray-700"
            >
              職種
            </label>
            <select
              id="job"
              value={job}
              onChange={(e) => setJob(e.target.value as JobType)}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-brand-500 focus:border-brand-500 sm:text-sm rounded-md"
            >
              {Object.entries(JOB_TYPES).map(([key, name]) => (
                <option key={key} value={key}>
                  {name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <Button
          onClick={handleStartClick}
          className="w-full !bg-brand-600 !hover:bg-brand-500"
        >
          BINGOカードを生成
        </Button>
      </div>
    </main>
  );
}
