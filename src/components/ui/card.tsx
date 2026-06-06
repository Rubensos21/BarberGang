import { cn } from '@/lib/utils';
import type { HTMLAttributes, PropsWithChildren } from 'react';

type CardProps = PropsWithChildren<HTMLAttributes<HTMLDivElement>>;

export function Card({ className, ...props }: CardProps) {
  return <div className={cn('rounded-[1.8rem] border border-white/10 bg-white/5 backdrop-blur-md', className)} {...props} />;
}

export function CardBody({ className, ...props }: CardProps) {
  return <div className={cn('p-5', className)} {...props} />;
}