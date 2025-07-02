"use client";
import StoreProvider from "./storeProvider";
import { useInitBridge } from "@/src/shared/hooks/useInitBridge";
import { ThemeProvider } from "./themeProvider";

const AppProvider = ({ children }: { children: React.ReactNode }) => {
  useInitBridge();

  return (
    <ThemeProvider
      attribute={"class"}
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <StoreProvider>
        <div data-vaul-drawer-wrapper>
          <div className="bg-background min-h-screen">{children}</div>
        </div>
      </StoreProvider>
      ;
    </ThemeProvider>
  );
};

export default AppProvider;
