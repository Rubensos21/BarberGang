import { cn } from '@/lib/utils';
import type { ButtonHTMLAttributes, PropsWithChildren } from 'react';

type ButtonProps = PropsWithChildren<ButtonHTMLAttributes<HTMLButtonElement>> & {
  variant?: 'default' | 'ghost' | 'outline';
};

export function Button({ className, variant = 'default', children, ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-bold uppercase tracking-[0.24em] transition duration-200 disabled:cursor-not-allowed disabled:opacity-50',
        variant === 'default' && 'bg-neon text-black shadow-neon hover:scale-[1.02] hover:shadow-[0_0_32px_rgba(163,255,0,.5)]',
        variant === 'ghost' && 'bg-white/5 text-white hover:bg-white/10',
        variant === 'outline' && 'border border-white/20 bg-transparent text-white hover:border-neon hover:text-neon',
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}