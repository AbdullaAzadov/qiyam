'use client';
import { useAutoTheme } from '@/src/shared/hooks/useAutoTheme';
import StoreProvider from './storeProvider';

const AppProvider = ({ children }: { children: React.ReactNode }) => {
  useAutoTheme();

  return <StoreProvider>{children}</StoreProvider>;
};

export default AppProvider;
