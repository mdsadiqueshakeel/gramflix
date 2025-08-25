"use client";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import {
  ArrowLeft,
  Mail,
  Home,
  Plus,
  MessageCircle,
  Gift,
  DollarSign,
  HelpCircle,
  ChevronRight,
} from "lucide-react";
import { useRouter } from "next/navigation";

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

  const handleMenuClick = (action) => {
    if (typeof action === "string") {
      router.push(action); // navigate to Next.js route
    } else {
      action(); // call function
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto px-4 py-4 space-y-4">
        {/* Profile Header Card */}
        <Card className="p-4 shadow-moderate border-border">
          <div className="space-y-4">
            {/* Profile Info Row */}
            <div className="flex items-center space-x-4">
              {/* Profile Picture */}
              <div className="relative">
                <Avatar className="h-20 w-20 ring-2 ring-newzia-primary/20 shadow-moderate">
                  <AvatarImage src="" />
                  <AvatarFallback className="bg-gradient-to-br from-newzia-primary to-newzia-primary-hover text-white text-2xl font-bold">
                    S
                  </AvatarFallback>
                </Avatar>
                <div className="absolute -bottom-1 -right-1 h-5 w-5 bg-green-500 rounded-full border-2 border-background"></div>
              </div>

              {/* Stats */}
              <div className="flex-1">
                <div className="grid grid-cols-3 gap-2 text-center">
                  {stats.map((stat, index) => (
                    <div key={index} className="space-y-1">
                      <div className="text-lg font-bold text-foreground">{stat.value}</div>
                      <div className="text-xs font-medium text-foreground">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Bio Section */}
            <div className="space-y-2">
              <h2 className="text-lg font-bold text-foreground">Sadique</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                📰 News enthusiast & tech lover
                <br />
                🌍 Always curious about the world around us
                <br />
                ✨ Sharing stories that matter
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-2">
              <Button
                variant="outline"
                className="flex-1 h-9 border-newzia-primary/30 text-newzia-primary hover:bg-newzia-primary hover:text-white text-sm font-medium rounded-lg transition-all duration-200"
              >
                Edit Profile
              </Button>
              <Button
                variant="outline"
                className="flex-1 h-9 border-border text-foreground hover:bg-accent text-sm font-medium rounded-lg transition-all duration-200"
              >
                Share Profile
              </Button>
              <Button
                variant="outline"
                className="px-3 h-9 border-border text-foreground hover:bg-accent rounded-lg transition-all duration-200"
              >
                <Mail size={16} />
              </Button>
            </div>
          </div>
        </Card>

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
                <p className="font-medium text-foreground">January 2024</p>
              </div>
              <div>
                <span className="text-xs text-muted-foreground">Account type</span>
                <p className="font-medium text-newzia-primary">Premium</p>
              </div>
              <div>
                <span className="text-xs text-muted-foreground">Reading streak</span>
                <p className="font-medium text-foreground">15 days</p>
              </div>
              <div>
                <span className="text-xs text-muted-foreground">Points earned</span>
                <p className="font-medium text-foreground">2,450</p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
