'use client';
import * as React from 'react';

/**
 * シンプルなボタンコンポーネント（Tailwindと組み合わせ可能）
 * イベント用ゲームのUIで共通的に使える最小実装です。
 */
export const Button: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement>> = ({
  className = '',
  ...props
}) => {
  return (
    <button
      className={
        'inline-flex items-center rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-500 disabled:opacity-50 ' +
        className
      }
      {...props}
    />
  );
};
