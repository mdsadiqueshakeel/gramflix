"use client";
import { useEffect, useState, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { DarkModeToggle } from "./DarkModeToggle";
import { Bell } from "lucide-react";

function Navbar({ isLoggedIn, isDarkMode, onToggleDarkMode }) {
  const router = useRouter();
  const [isAuthed, setIsAuthed] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const checkToken = () => {
      const token = typeof window !== "undefined" ? localStorage.getItem("authToken") : null;
      setIsAuthed(Boolean(token && token.trim()));
    };
    checkToken();
    const onStorage = (e) => {
      if (e.key === "authToken") {
        checkToken();
      }
    };
    window.addEventListener("storage", onStorage);
    window.addEventListener("focus", checkToken);
    window.addEventListener("authchange", checkToken);
    const intervalId = window.setInterval(checkToken, 1000);
    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("focus", checkToken);
      window.removeEventListener("authchange", checkToken);
      window.clearInterval(intervalId);
    };
  }, []);

  // Re-check auth on route changes
  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("authToken") : null;
    setIsAuthed(Boolean(token && token.trim()));
  }, [pathname]);

  const handleLogout = useCallback(() => {
    try {
      localStorage.removeItem("authToken");
    } catch {}
    setIsAuthed(false);
    setMenuOpen(false);
    router.replace("/login");
  }, [router]);

  return (
    <header className="sticky top-0 w-full z-50 bg-background/95 backdrop-blur-md border-b border-border px-4 py-4 shadow-subtle">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        {/* Logo */}
        <div className="flex items-center space-x-2"
        onClick={() => router.push("/")}>
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-newzia-primary to-newzia-primary-hover flex items-center justify-center">
            <span className="text-white font-bold text-sm">G</span>
          </div>
          <h1 className="text-2xl font-bold text-foreground">GramFlix</h1>
        </div>

        {/* Right side */}
        <div className="flex items-center space-x-3 relative">
          <DarkModeToggle isDark={isDarkMode} onToggle={onToggleDarkMode} />

          {/* Notification Icon */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push("/coming-soon")}
            className="h-9 w-9 p-0 text-muted-foreground hover:text-newzia-primary hover:bg-accent transition-all duration-200"
          >
            <Bell size={20} />
          </Button>

          {(isAuthed || isLoggedIn) ? (
            <div className="relative">
              <Avatar
                className="h-9 w-9 cursor-pointer ring-2 ring-newzia-primary/20 hover:ring-newzia-primary/40 transition-all duration-200"
                onClick={() => setMenuOpen((v) => !v)}
              >
                <AvatarImage src="" />
                <AvatarFallback className="bg-newzia-primary text-white text-sm font-medium">
                  U
                </AvatarFallback>
              </Avatar>
              {menuOpen && (
                <div className="absolute right-0 mt-2 w-40 rounded-xl border border-border bg-popover shadow-moderate p-2 z-50">
                  <button
                    onClick={() => { setMenuOpen(false); router.push("/profile"); }}
                    className="w-full text-left px-3 py-2 rounded-lg hover:bg-accent text-foreground"
                  >
                    Profile
                  </button>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-3 py-2 rounded-lg hover:bg-accent text-destructive"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Button
              onClick={() => router.push("/login")}
              className="bg-newzia-primary hover:bg-newzia-primary-hover text-white px-6 py-2 rounded-xl font-medium shadow-subtle hover:shadow-moderate transition-all duration-200"
            >
              Sign In
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}

export default Navbar;
