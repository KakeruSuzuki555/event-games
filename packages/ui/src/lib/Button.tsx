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
        'inline-flex items-center justify-center rounded-md px-4 py-2 font-semibold text-white shadow-sm transition-colors duration-200 ease-in-out ' +
        'bg-brand-600 hover:bg-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 ' +
        'disabled:opacity-50 disabled:cursor-not-allowed ' +
        className
      }
      {...props}
    />
  );
};
