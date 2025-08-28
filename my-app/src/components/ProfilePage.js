"use client";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import {
  ArrowLeft,
  Mail,
  Phone,
  Home,
  Plus,
  MessageCircle,
  Gift,
  DollarSign,
  HelpCircle,
  ChevronRight,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import PremiumUpgradePopup from "./PremiumUpgradePopup";
import PremiumContent from "./PremiumContent";
import { fetchUserProfile, isPremiumUser, getPremiumStatus } from "@/lib/api";
import { Crown } from "lucide-react";

const menuItems = [
  { id: "newsfeed", label: "News Feed", icon: Home, action:"/coming-soon", color: "text-blue-600" },
  { id: "post", label: "Create Post", icon: Plus, action:"/coming-soon", color: "text-green-600" },
  { id: "message", label: "Messages", icon: MessageCircle, action: "/coming-soon", color: "text-purple-600" },
  { id: "refer", label: "Refer & Earn", icon: Gift, action: "/refer-earn", color: "text-orange-600" },
  { id: "withdraw", label: "Withdraw", icon: DollarSign, action: "/withdraw", color: "text-emerald-600" },
  { id: "support", label: "Help & Support", icon: HelpCircle, action: "/coming-soon", color: "text-red-600" },
];

const stats = [
  { label: "Articles", value: "24", description: "Published" },
  { label: "Followers", value: "1.2K", description: "Following you" },
  { label: "Following", value: "242", description: "You follow" },
];

export default function ProfilePage() {
  const router = useRouter();
  const [showPremiumPopup, setShowPremiumPopup] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const [profileLoading, setProfileLoading] = useState(false);

  const formatDate = (isoString) => {
    if (!isoString) return "—";
    try {
      const date = new Date(isoString);
      return date.toLocaleDateString(undefined, { year: 'numeric', month: 'long' });
    } catch {
      return "—";
    }
  };

  const handleMenuClick = (action) => {
    if (typeof action === "string") {
      router.push(action); // navigate to Next.js route
    } else {
      action(); // call function
    }
  };

  // Fetch user profile
  useEffect(() => {
    const loadProfile = async () => {
      setProfileLoading(true);
      try {
        const profile = await fetchUserProfile();
        setUserProfile(profile);
      } catch (error) {
        console.error("Error loading profile:", error);
      } finally {
        setProfileLoading(false);
      }
    };
    loadProfile();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto px-4 py-4 space-y-4">
        {/* Profile Header Card */}
      {/* Profile + Premium Section */}
      <Card className="p-6 shadow-moderate border-border">
        {getPremiumStatus(userProfile) === "NONE" && (
          <div className="bg-gradient-to-br from-yellow-400 via-yellow-500 to-yellow-700 p-4 rounded-xl text-white shadow-inner flex-shrink-0 w-full lg:w-auto mb-6">
            <div className="w-full">
              <h3 className="text-base font-extrabold">Premium User</h3>
              <p className="text-xs opacity-80 mb-3">Unlock exclusive features ✨</p>

              <Button 
                onClick={() => setShowPremiumPopup(true)}
                className="w-full bg-white text-yellow-700 font-bold hover:bg-yellow-100 rounded-lg"
              >
                Upgrade to Premium
              </Button>
            </div>
          </div>
        )}

        {getPremiumStatus(userProfile) === "PENDING" && (
          <div className="bg-gradient-to-br from-blue-400 via-blue-500 to-blue-700 p-4 rounded-xl text-white shadow-inner flex-shrink-0 w-full lg:w-auto mb-6">
            <div className="w-full flex items-center justify-between">
              <div>
                <h3 className="text-base font-extrabold flex items-center">
                  <Crown className="h-5 w-5 mr-2" />
                  Premium Request
                </h3>
                <p className="text-xs opacity-80">Your premium request is under review ✨</p>
              </div>
              <div className="bg-white/20 px-3 py-1 rounded-full">
                <span className="text-xs font-bold">PENDING</span>
              </div>
            </div>
          </div>
        )}

        {getPremiumStatus(userProfile) === "PREMIUM" && (
          <div className="bg-gradient-to-br from-yellow-400 via-yellow-500 to-yellow-700 p-4 rounded-xl text-white shadow-inner flex-shrink-0 w-full lg:w-auto mb-6">
            <div className="w-full flex items-center justify-between">
              <div>
                <h3 className="text-base font-extrabold flex items-center">
                  <Crown className="h-5 w-5 mr-2" />
                  Premium User
                </h3>
                <p className="text-xs opacity-80">You have access to all premium features ✨</p>
              </div>
              <div className="bg-white/20 px-3 py-1 rounded-full">
                <span className="text-xs font-bold">ACTIVE</span>
              </div>
            </div>
          </div>
        )}
        <div className="flex flex-col lg:flex-row items-start lg:items-center space-y-6 lg:space-y-0 lg:space-x-6">
          {/* Left Side - Profile Info */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4 flex-1">
            {/* Avatar */}
            <Avatar className="h-20 w-20 ring-2 ring-newzia-primary/20 shadow-moderate flex-shrink-0">
              <AvatarImage src="/images/avatar_image.avif" alt={userProfile?.name || "User"} />
              <AvatarFallback className="bg-gradient-to-br from-newzia-primary to-newzia-primary-hover text-white text-2xl font-bold">
                {profileLoading ? "..." : "U"}
              </AvatarFallback>
            </Avatar>
            
            {/* Profile Info */}
            <div className="flex-1 min-w-0">
              <h2 className="text-lg font-bold text-foreground mb-2">
                {profileLoading ? "Loading..." : (userProfile?.name || "User")}
              </h2>
              <div className="space-y-1">
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <Mail size={16} className="flex-shrink-0" />
                  <span className="truncate">{userProfile?.email || "—"}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <Phone size={16} className="flex-shrink-0" />
                  <span>{userProfile?.mobile || "—"}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Premium Section */}
         
        </div>
      </Card>


      {/* Right Side - Premium Card */}

        {/* Menu List */}
        <Card className="divide-y divide-border border-border shadow-moderate">
          <div className="p-4">
            <h3 className="text-base font-semibold text-foreground mb-1">Quick Actions</h3>
            <p className="text-xs text-muted-foreground">Manage your account and preferences</p>
          </div>

          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => handleMenuClick(item.action)}
                className="w-full flex items-center justify-between p-4 text-left hover:bg-accent transition-all duration-200 group"
              >
                <div className="flex items-center space-x-3">
                  <div
                    className={`p-2 rounded-lg bg-accent group-hover:bg-background transition-colors ${item.color}`}
                  >
                    <Icon size={18} />
                  </div>
                  <div>
                    <span className="text-sm text-foreground font-medium group-hover:text-newzia-primary transition-colors">
                      {item.label}
                    </span>
                  </div>
                </div>
                <ChevronRight
                  size={16}
                  className="text-muted-foreground group-hover:text-newzia-primary transition-colors"
                />
              </button>
            );
          })}
        </Card>

        {/* Additional Info Card */}
        <Card className="p-4 border-border shadow-moderate">
          <div className="space-y-3">
            <h3 className="text-base font-semibold text-foreground">Account Details</h3>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <span className="text-xs text-muted-foreground">Member since</span>
                <p className="font-medium text-foreground">{formatDate(userProfile?.createdAt)}</p>
              </div>
              <div>
                <span className="text-xs text-muted-foreground">Account type</span>
                <p className="font-medium text-newzia-primary">
                  {getPremiumStatus(userProfile) === "PREMIUM" ? "Premium" : getPremiumStatus(userProfile) === "PENDING" ? "Pending" : "Normal"}
                </p>
              </div>
              <div>
                <span className="text-xs text-muted-foreground">Status</span>
                <p className="font-medium text-foreground">{userProfile?.status || "—"}</p>
              </div>
              <div>
                <span className="text-xs text-muted-foreground">Referral ID</span>
                <p className="font-medium text-foreground">{userProfile?.referralId || "—"}</p>
              </div>
            </div>
          </div>
        </Card>
      </div>
      
      {/* Premium Upgrade Popup */}
      {getPremiumStatus(userProfile) === "NONE" && (
        <PremiumUpgradePopup
          isOpen={showPremiumPopup}
          onClose={() => setShowPremiumPopup(false)}
          onUpgrade={() => {
            setShowPremiumPopup(false);
            // Handle successful upgrade
            console.log('User upgraded to premium!');
          }}
        />
      )}
    </div>
  );
}
