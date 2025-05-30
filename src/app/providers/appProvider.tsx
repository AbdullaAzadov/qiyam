'use client';
import { useAutoTheme } from '@/src/shared/hooks/useAutoTheme';
import React from 'react';

const AppProvider = ({ children }: { children: React.ReactNode }) => {
  useAutoTheme();

  return <>{children}</>;
};

export default AppProvider;
