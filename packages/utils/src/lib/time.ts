/**
 * ゲーム内カウントダウン等で使えるユーティリティ
 */
export function formatMilliseconds(ms: number): string {
  // 与えられたミリ秒を mm:ss 形式に整形
  const totalSeconds = Math.max(0, Math.floor(ms / 1000));
  const minutes = Math.floor(totalSeconds / 60)
    .toString()
    .padStart(2, '0');
  const seconds = (totalSeconds % 60).toString().padStart(2, '0');
  return `${minutes}:${seconds}`;
}
