"use client";

import React from "react";
import { Sparkles } from "lucide-react";

interface LoadingSpinnerProps {
  label?: string;
  sublabel?: string;
  size?: "sm" | "md" | "lg";
}

export default function LoadingSpinner({
  label = "Loading SalonBook...",
  sublabel,
  size = "md",
}: LoadingSpinnerProps) {
  const spinnerSizes = {
    sm: "w-6 h-6 border-2",
    md: "w-10 h-10 border-3",
    lg: "w-16 h-16 border-4",
  };

  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center animate-in fade-in duration-300">
      <div className="relative mb-4">
        {/* Outer glowing ring */}
        <div
          className={`${spinnerSizes[size]} rounded-full border-amber-500/20 border-t-amber-500 animate-spin`}
        />
        <div className="absolute inset-0 flex items-center justify-center text-amber-500">
          <Sparkles className={size === "lg" ? "w-6 h-6" : "w-4 h-4"} />
        </div>
      </div>
      <p className="text-sm font-medium text-stone-800 tracking-wide font-serif">
        {label}
      </p>
      {sublabel && (
        <p className="text-xs text-stone-600 mt-1 max-w-xs">{sublabel}</p>
      )}
    </div>
  );
}
