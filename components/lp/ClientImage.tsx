"use client";

import React, { ImgHTMLAttributes } from 'react';

interface ClientImageProps extends ImgHTMLAttributes<HTMLImageElement> {
  fallbackMode?: 'brand' | 'portrait';
}

export default function ClientImage({ fallbackMode, ...props }: ClientImageProps) {
  const handleError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    if (fallbackMode === 'brand') {
      e.currentTarget.style.display = 'none';
      if (e.currentTarget.nextElementSibling) {
        (e.currentTarget.nextElementSibling as HTMLElement).style.display = 'flex';
      }
    } else if (fallbackMode === 'portrait') {
      e.currentTarget.closest('.portrait')?.classList.add('noimg');
      e.currentTarget.remove();
    }
  };

  return <img {...props} onError={fallbackMode ? handleError : undefined} />;
}
