"use client";
import { useRouter, usePathname } from "next/navigation";
import { Home, DollarSign, Gift, User } from "lucide-react";
import { useState, useEffect } from "react";
import { fetchUserProfile, getPremiumStatus } from "@/lib/api";

function SidebarNav() {
  const router = useRouter();
  const pathname = usePathname();
  const [userProfile, setUserProfile] = useState(null);

  const navItems = [
    { label: "Home", icon: Home, path: "/" },
    { label: "Withdraw", icon: DollarSign, path: "/withdraw" },
    { label: "Refer", icon: Gift, path: "/refer-earn" },
    { label: "Profile", icon: User, path: "/profile" },
  ];

  // Fetch user profile
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

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 h-screen border-r border-border bg-background px-4 py-6 fixed left-0 top-16 z-40">
        <div className="flex-1 space-y-4">
          {navItems.map((item) => (
            <button
              key={item.label}
              onClick={() => router.push(item.path)}
              className={`flex items-center gap-3 w-full px-3 py-2 rounded-lg transition-colors font-medium ${
                pathname === item.path
                  ? getPremiumStatus(userProfile) === "PREMIUM" 
                    ? "text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20" 
                    : "text-newzia-primary bg-accent"
                  : "text-muted-foreground hover:text-newzia-primary hover:bg-accent"
              }`}
            >
              <item.icon size={22} />
              <span>{item.label}</span>
            </button>
          ))}
        </div>
      </aside>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-t border-border shadow-strong">
        <div className="flex items-center justify-around py-3 px-4">
          {navItems.map((item) => (
            <button
              key={item.label}
              onClick={() => router.push(item.path)}
              className={`flex flex-col items-center space-y-1 p-2 transition-colors ${
                pathname === item.path
                  ? getPremiumStatus(userProfile) === "PREMIUM" 
                    ? "text-yellow-600" 
                    : "text-newzia-primary"
                  : "text-muted-foreground hover:text-newzia-primary"
              }`}
            >
              <item.icon size={20} />
              <span className="text-xs font-medium">{item.label}</span>
            </button>
          ))}
        </div>
      </nav>
    </>
  );
}

export default SidebarNav;
