"use client"; // if you're using Next.js App Router (app/ folder)

import { useEffect, useState, useCallback } from "react";
import { Button } from "./ui/button";
import { Moon, Sun } from "lucide-react";
import { fetchUserProfile, getPremiumStatus } from "@/lib/api";

export function DarkModeToggle({ isDark: isDarkProp, onToggle, className = "" }) {
  const [isDarkInternal, setIsDarkInternal] = useState(false);
  const [userProfile, setUserProfile] = useState(null);

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

  // Fetch user profile for premium styling
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const profile = await fetchUserProfile();
        setUserProfile(profile);
      } catch (error) {
        console.error("Error loading profile:", error);
      }
    };
    loadProfile();
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
          getPremiumStatus(userProfile) === "PREMIUM"
            ? effectiveIsDark
              ? "border-yellow-400/30 bg-yellow-900/20 text-yellow-400 hover:bg-yellow-900/30 hover:border-yellow-400/50"
              : "border-yellow-200 bg-yellow-50 text-yellow-600 hover:bg-yellow-100 hover:border-yellow-300"
            : effectiveIsDark
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
