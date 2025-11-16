// src/components/LoadingDots.tsx
import React from "react";

export function LoadingDots({ isDarkMode }: { isDarkMode: boolean }) {
  return (
    <div className="flex items-center gap-3">
      <div
        className={`size-4 rounded-full animate-bounce transition-colors ${
          isDarkMode ? "bg-white" : "bg-black"
        }`}
        style={{ animationDelay: "0s", animationDuration: "0.6s" }}
      />
      <div
        className={`size-4 rounded-full animate-bounce transition-colors ${
          isDarkMode ? "bg-white" : "bg-black"
        }`}
        style={{ animationDelay: "0.2s", animationDuration: "0.6s" }}
      />
      <div
        className={`size-4 rounded-full animate-bounce transition-colors ${
          isDarkMode ? "bg-white" : "bg-black"
        }`}
        style={{ animationDelay: "0.4s", animationDuration: "0.6s" }}
      />
    </div>
  );
}
