'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@event-games/ui";
import { JOB_TYPES, JobType } from "@/lib/aruaru";
import { Send } from "lucide-react";

export default function Home() {
  const router = useRouter();
  const [nickname, setNickname] = useState("");
  const [job, setJob] = useState<JobType>("engineer");

  const handleStartClick = () => {
    if (!nickname.trim()) {
      alert("ニックネームを入力してください。");
      return;
    }
    router.push(`/bingo?nickname=${encodeURIComponent(nickname)}&job=${job}`);
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-gradient-main">
      <div className="w-full max-w-md mx-auto bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl p-8 space-y-6 transition-all">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-800 tracking-tight">
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
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              ニックネーム
            </label>
            <input
              id="nickname"
              type="text"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              className="mt-1 block w-full px-4 py-2.5 bg-white/80 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
              placeholder="例: すごいエンジニア"
            />
          </div>

          <div>
            <label
              htmlFor="job"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              職種
            </label>
            <select
              id="job"
              value={job}
              onChange={(e) => setJob(e.target.value as JobType)}
              className="mt-1 block w-full pl-4 pr-10 py-2.5 text-base border-gray-300 bg-white/80 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
            >
              {Object.entries(JOB_TYPES).map(([key, name]) => (
                <option key={key} value={key}>
                  {name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="pt-2">
          <button
            onClick={handleStartClick}
            className="w-full flex items-center justify-center gap-2 rounded-lg px-4 py-3 text-base font-semibold text-white bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Send size={18} />
            BINGOカードを生成
          </button>
        </div>
      </div>
       <footer className="text-center mt-8">
        <p className="text-sm text-gray-500">
          Created for IT industry professionals.
        </p>
      </footer>
    </main>
  );
}
