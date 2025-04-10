"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import { Toaster } from "sonner";
import { ReactNode, useEffect, useState } from "react";

export function Providers({ children }: { children: ReactNode }) {
  // Add this to prevent hydration mismatch
  const [mounted, setMounted] = useState(false);

  // Force dark theme on mount to avoid flicker
  useEffect(() => {
    // Apply dark theme immediately to avoid flash
    document.documentElement.classList.add("dark");
    setMounted(true);
  }, []);

  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem={false}
      forcedTheme="dark" // Force dark theme to avoid hydration mismatch
    >
      {/* Only render children when mounted to avoid hydration mismatch */}
      <div suppressHydrationWarning>
        {mounted ? (
          children
        ) : (
          <div style={{ visibility: "hidden" }}>{children}</div>
        )}
      </div>
      <Toaster />
    </NextThemesProvider>
  );
}
