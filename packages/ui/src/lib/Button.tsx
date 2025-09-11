'use client';
import * as React from 'react';

/**
 * ボタンコンポーネント（バリアント/サイズ対応）
 * - variant: 見た目（primary, secondary, outline, ghost, danger）
 * - size: 大きさ（sm, md, lg）
 * - fullWidth: 横幅いっぱいにする
 */
type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg';

export interface UIButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
}

function mergeClassNames(...classes: Array<string | undefined | false>): string {
  return classes.filter(Boolean).join(' ');
}

export const Button = React.forwardRef<HTMLButtonElement, UIButtonProps>(
  (
    {
      className = '',
      variant = 'primary',
      size = 'md',
      fullWidth = false,
      type = 'button',
      ...props
    },
    ref,
  ) => {
    const base =
      'inline-flex items-center justify-center rounded-lg font-semibold transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 disabled:opacity-50 disabled:cursor-not-allowed';

    const sizeClassMap: Record<ButtonSize, string> = {
      sm: 'text-sm px-3 py-1.5',
      md: 'text-sm px-4 py-2',
      lg: 'text-base px-5 py-3',
    };

    const variantClassMap: Record<ButtonVariant, string> = {
      primary: 'bg-brand-600 hover:bg-brand-500 text-white shadow-sm focus:ring-brand-500',
      secondary:
        'bg-neutral-800 text-neutral-100 border border-neutral-700 hover:bg-neutral-700 focus:ring-neutral-600',
      outline:
        'bg-transparent text-neutral-100 border border-neutral-700 hover:bg-neutral-800 focus:ring-neutral-600',
      ghost: 'bg-transparent text-neutral-200 hover:bg-neutral-800 focus:ring-neutral-600',
      danger: 'bg-red-600 hover:bg-red-500 text-white shadow-sm focus:ring-red-500',
    };

    const widthClass = fullWidth ? 'w-full' : '';

    return (
      <button
        className={mergeClassNames(
          base,
          sizeClassMap[size],
          variantClassMap[variant],
          widthClass,
          className,
        )}
        ref={ref}
        type={type}
        {...props}
      />
    );
  },
);

Button.displayName = 'Button';
