'use client';
import { useAutoTheme } from '@/src/shared/hooks/useAutoTheme';
import StoreProvider from './storeProvider';
import { useInitBridge } from '@/src/shared/hooks/useInitBridge';

const AppProvider = ({ children }: { children: React.ReactNode }) => {
  useAutoTheme();
  useInitBridge()

  return <StoreProvider>{children}</StoreProvider>;
};

export default AppProvider;
