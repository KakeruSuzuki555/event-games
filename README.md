# event-games Monorepo

イベント用ブラウザゲームを複数管理するモノレポです。pnpm + Turborepo + TypeScript + Next.js をベースにしています。

## 概要
- 各ゲームは `apps/` 配下の Next.js アプリとして並列管理
- 共通の UI/設定/ユーティリティは `packages/` に集約して再利用
- Turborepo による横断ビルド・キャッシュ・並列実行を利用

## 技術スタック
- パッケージ管理: pnpm
- モノレポ: Turborepo
- 言語: TypeScript
- Web フレームワーク: Next.js (App Router)
- Lint/Format: ESLint + Prettier
- スタイル: Tailwind CSS
- Node: 20+

## リポジトリ構成
- apps/
  - example-game/ … サンプル Next.js アプリ
- packages/
  - tsconfig/ … TypeScript 共通設定
  - eslint-config/ … ESLint 共通設定
  - tailwind-config/ … Tailwind 共通設定
  - ui/ … 共有 UI コンポーネント
  - utils/ … 共有ユーティリティ
- turbo.json / pnpm-workspace.yaml / tsconfig.base.json … ルート共通設定

## 前提
- Node 20+
- pnpm 9 系（推奨）
  - Volta を使用している場合: `volta install pnpm@9`

## セットアップ
```bash
# 依存関係をインストール（ルートで）
pnpm install
```

## 開発
```bash
# サンプルアプリのみ起動
pnpm --filter example-game dev
# 任意アプリ名の起動
pnpm --filter <app-name> dev
```

## ビルド
```bash
# モノレポ全体をビルド
pnpm -w build
# 特定パッケージのみビルド（例: 共有UI）
pnpm --filter @event-games/ui build
```

## Lint / Format / Test
```bash
pnpm -w lint
pnpm -w format
pnpm -w test
```

## 新しいゲームアプリの追加
```bash
# Next.js アプリを作成（例）
pnpm dlx create-next-app apps/<game-name> --ts --eslint --tailwind --app --use-pnpm --import-alias "@/*"

# 共有パッケージを依存に追加（必要に応じて）
pnpm --filter <game-name> add "@event-games/ui@workspace:*" "@event-games/utils@workspace:*"

# Next.js 側でワークスペースをトランスパイル対象に追加（apps/<game-name>/next.config.ts）
export default {
  transpilePackages: ['@event-games/ui', '@event-games/utils'],
}
```

ヒント:
- クライアントでイベントハンドラを使うコンポーネントは先頭に `'use client'` を付ける
- `tsconfig` は `extends: ../../packages/tsconfig/nextjs.json` など、相対参照を推奨

## 共有パッケージの使い方
- UI コンポーネント
```tsx
import { Button } from '@event-games/ui';

<Button onClick={() => alert('clicked!')}>Start</Button>
```

- ユーティリティ
```ts
import { formatMilliseconds } from '@event-games/utils';
formatMilliseconds(90000) // => "01:30"
```

- Tailwind 共通設定（必要な場合）
```js
// apps/<game-name>/tailwind.config.js
module.exports = {
  presets: [require('@event-games/tailwind-config')],
}
```

## 環境変数
- Next.js アプリ内の `.env.local` を使用（値は各アプリで定義）
- CI/デプロイ時は各プラットフォームの Secret/Environment を利用

## デプロイ
- Vercel 推奨（アプリ単位でプロジェクトを作成）
  - Build Command: `pnpm --filter <app-name> build`
  - Output: `.next/`
- Cloudflare Pages / Netlify / GitHub Pages でも構成可能

## トラブルシューティング
- Module not found: `@event-games/ui` / `@event-games/utils`
  - `apps/<app>/package.json` に `"@event-games/ui": "workspace:*"` があるか確認
  - ルートで `pnpm install` を実行してリンク生成
  - `next.config.ts` の `transpilePackages` に追加済みか確認
- イベントハンドラに関するエラー（Client Components）
  - ページ/コンポーネントに `'use client'` を付与
- TypeScript が出力されない
  - 共有パッケージ（`ui`, `utils`）の `tsconfig.json` で `"noEmit": false` を指定
- Turborepo 設定エラー
  - `turbo.json` は `tasks` キーを使用（旧 `pipeline` は非推奨）
- ビルド対象の選択
  - `pnpm --filter <name> <script>` で範囲を限定

## ライセンス
MIT

## 追記しておくと良い情報（運用に合わせて拡張）
- 目的/方針（ゲームの種類、運用方針）
- 対応ブラウザ/デバイス（モバイル/PC、対応ブラウザ）
- コーディング規約（命名・ディレクトリ規約・コミット規約など）
- UI/UX ガイド（共通コンポーネントの使い方、アクセシビリティ方針）
- パフォーマンス基準（Lighthouse 目標値、バンドルサイズ基準）
- リリース/デプロイ手順（環境ごとの差異、本番切替手順）
- 監視・ログ（Sentry など導入時）
- セキュリティ（依存更新方針、秘密情報の扱い）
- ゲーム特有のTips（入力遅延対策、音声自動再生ポリシー、FPS/タイマー制御）
