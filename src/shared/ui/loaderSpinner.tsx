import React from 'react';
import { cn } from '../cn/lib/utils';

const BARS_COUNT = 12;

type Props = {
  className?: string;
};

export function LoaderSpinner({ className }: Props) {
  const bars = Array.from({ length: BARS_COUNT }, (_, i) => {
    const rotation = i * (360 / BARS_COUNT); // 12 * 30 = 360 градусов
    const delay = -(1 - i * (1 / BARS_COUNT)).toFixed(2) + 's'; // задержка

    return (
      <div
        key={i}
        className='absolute w-[8%] h-[24%] dark:bg-neutral-200 bg-neutral-500 rounded-full shadow-[0_0_3px_rgba(0,0,0,0.2)] animate-fade458'
        style={{
          left: '50%',
          top: '30%',
          opacity: 0,
          transform: `rotate(${rotation}deg) translate(0, -130%)`,
          animationDelay: delay,
          transformOrigin: 'center bottom',
        }}
      />
    );
  });

  return <div className={cn('relative size-9', className)}>{bars}</div>;
}
