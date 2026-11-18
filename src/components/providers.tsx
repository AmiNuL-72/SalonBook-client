"use client";

import React from "react";
import { AuthProvider } from "../context/auth-context";
import { SalonProvider } from "../context/salon-context";
import { Toaster } from "react-hot-toast";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <SalonProvider>
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3500,
            style: {
              background: "#1c1917",
              color: "#fdfbf7",
              border: "1px solid #44403c",
              borderRadius: "0.75rem",
              fontSize: "0.9rem",
              padding: "12px 16px",
            },
            success: {
              iconTheme: {
                primary: "#d4af37",
                secondary: "#1c1917",
              },
            },
            error: {
              iconTheme: {
                primary: "#ef4444",
                secondary: "#ffffff",
              },
            },
          }}
        />
      </SalonProvider>
    </AuthProvider>
  );
}
