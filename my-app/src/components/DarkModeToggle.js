"use client"; // if you're using Next.js App Router (app/ folder)

import { useEffect, useState, useCallback } from "react";
import { Button } from "./ui/button";
import { Moon, Sun } from "lucide-react";

export function DarkModeToggle({ isDark: isDarkProp, onToggle, className = "" }) {
  const [isDarkInternal, setIsDarkInternal] = useState(false);

  const effectiveIsDark = typeof isDarkProp === "boolean" ? isDarkProp : isDarkInternal;

  useEffect(() => {
    // Initialize from localStorage or system preference
    const stored = typeof window !== "undefined" ? localStorage.getItem("theme") : null;
    const prefersDark = typeof window !== "undefined" && window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
    const shouldBeDark = stored ? stored === "dark" : prefersDark;

    setIsDarkInternal(shouldBeDark);
    const root = document.documentElement;
    root.classList.toggle("dark", shouldBeDark);
  }, []);

  const handleToggle = useCallback(() => {
    const next = !effectiveIsDark;
    // Update local state if uncontrolled
    if (typeof isDarkProp !== "boolean") {
      setIsDarkInternal(next);
    }
    // Toggle the html.dark class and persist
    const root = document.documentElement;
    root.classList.toggle("dark", next);
    try {
      localStorage.setItem("theme", next ? "dark" : "light");
    } catch {}
    // Notify parent if provided
    if (typeof onToggle === "function") onToggle(next);
  }, [effectiveIsDark, isDarkProp, onToggle]);

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleToggle}
      className={`
        relative h-10 w-10 p-0 rounded-xl border-2 
        ${
          effectiveIsDark
            ? "border-newzia-blue-400/30 bg-newzia-gray-800 text-newzia-blue-400 hover:bg-newzia-gray-700 hover:border-newzia-blue-400/50"
            : "border-newzia-blue-200 bg-white text-newzia-blue-600 hover:bg-newzia-blue-50 hover:border-newzia-blue-300"
        }
        transition-all duration-300 ease-in-out shadow-subtle hover:shadow-moderate
        focus:outline-none focus:ring-2 focus:ring-newzia-primary focus:ring-offset-2 focus:ring-offset-background
        ${className}
      `}
      aria-label={effectiveIsDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      <div className="relative w-5 h-5">
        <Sun
          className={`
            absolute inset-0 h-5 w-5 transition-all duration-300 ease-in-out
            ${effectiveIsDark ? "rotate-90 scale-0 opacity-0" : "rotate-0 scale-100 opacity-100"}
          `}
        />
        <Moon
          className={`
            absolute inset-0 h-5 w-5 transition-all duration-300 ease-in-out
            ${effectiveIsDark ? "rotate-0 scale-100 opacity-100" : "-rotate-90 scale-0 opacity-0"}
          `}
        />
      </div>
    </Button>
  );
}
