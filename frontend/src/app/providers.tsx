"use client";

import { ThemeProvider } from "next-themes";
import { useEffect } from "react";
import { checkToken, logout } from "@/services/auth";

// Auth validation provider
function AuthValidator() {
  useEffect(() => {
    const validateAuth = async () => {
      try {
        // Check if a token exists in storage first
        const token = localStorage.getItem('token') || sessionStorage.getItem('token');
        
        // Only proceed with validation if a token exists
        if (token) {
          // Check if token is valid
          const result = await checkToken();
          
          if (!result.success) {
            console.log("Invalid token detected, logging out");
            await logout();
          }
        } else {
          // No token found, this is normal for non-logged in users
          // console.log("No token found, user is not logged in");
        }
      } catch (error) {
        // If token check fails, log out
        console.log("Auth validation failed, logging out");
        await logout();
      }
    };

    validateAuth();
  }, []);

  // This component doesn't render anything
  return null;
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" enableSystem={false} defaultTheme="dark">
      <AuthValidator />
      {children}
    </ThemeProvider>
  );
}
