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
import { fetchUserProfile, isPremiumUser, getPremiumStatus, updateUserProfile } from "@/lib/api";
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
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({ name: "", email: "", password: "", confirmPassword: "" });
  const [editErrors, setEditErrors] = useState({});
  const [saving, setSaving] = useState(false);

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

  const openEdit = () => {
    setEditForm({ name: userProfile?.name || "", email: userProfile?.email || "", password: "", confirmPassword: "" });
    setEditErrors({});
    setIsEditing(true);
  };

  const closeEdit = () => {
    setIsEditing(false);
    setEditErrors({});
  };

  const validateEdit = () => {
    const errs = {};
    if (!editForm.name.trim()) errs.name = "Name is required";
    if (!editForm.email.trim()) errs.email = "Email is required";
    if (editForm.password && editForm.password !== editForm.confirmPassword) {
      errs.confirmPassword = "Passwords do not match";
    }
    setEditErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const submitEdit = async (e) => {
    e.preventDefault();
    if (!validateEdit()) return;
    try {
      setSaving(true);
      const payload = { name: editForm.name, email: editForm.email };
      if (editForm.password) payload.password = editForm.password;
      await updateUserProfile(payload);
      // refresh displayed profile
      const refreshed = await fetchUserProfile();
      setUserProfile(refreshed);
      setIsEditing(false);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

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
            <Avatar className={`h-20 w-20 ring-2 shadow-moderate flex-shrink-0 ${
              getPremiumStatus(userProfile) === "PREMIUM" 
                ? "ring-yellow-400 ring-4 shadow-lg shadow-yellow-400/25" 
                : "ring-newzia-primary/20"
            }`}>
                        <AvatarImage src={getPremiumStatus(userProfile) === "PREMIUM" ? "/images/premium_avatar_image.avif" : "/images/avatar_image.avif"} alt= "User" />
              <AvatarFallback className={`text-2xl font-bold ${
                getPremiumStatus(userProfile) === "PREMIUM"
                  ? "bg-gradient-to-br from-yellow-400 to-yellow-600 text-white"
                  : "bg-gradient-to-br from-newzia-primary to-newzia-primary-hover text-white"
              }`}>
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
              <div className="mt-3">
                <Button variant="outline" className="rounded-lg" onClick={openEdit}>Edit Profile</Button>
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
                <p className={`font-medium ${
                  getPremiumStatus(userProfile) === "PREMIUM" 
                    ? "text-yellow-600" 
                    : "text-newzia-primary"
                }`}>
                  {getPremiumStatus(userProfile) === "PREMIUM" ? "Premium" : getPremiumStatus(userProfile) === "PENDING" ? "Pending" : "Normal"}
                </p>
              </div>
              <div>
                <span className="text-xs text-muted-foreground">Status</span>
                <p className="font-medium text-foreground">{userProfile?.status || "—"}</p>
              </div>
              <div>
                <span className="text-xs text-muted-foreground">Referral Code</span>
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
          onUpgrade={async (updatedProfile) => {
            setShowPremiumPopup(false);
            if (updatedProfile) {
              // Use the updated profile from polling
              setUserProfile(updatedProfile);
            } else {
              // Fallback: refresh the profile
              try {
                const refreshed = await fetchUserProfile();
                setUserProfile(refreshed);
              } catch (error) {
                console.error("Failed to refresh profile:", error);
              }
            }
          }}
        />
      )}

      {/* Edit Profile Modal */}
      {isEditing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <Card className="w-full max-w-md p-6 shadow-strong border-border bg-card">
            <h3 className="text-lg font-semibold text-foreground mb-4">Edit Profile</h3>
            <form onSubmit={submitEdit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Name</label>
                <input
                  type="text"
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  className={`w-full h-11 px-3 rounded-lg bg-input-background border border-border focus:border-newzia-primary focus:ring-2 focus:ring-newzia-primary/20 ${editErrors.name ? 'border-destructive' : ''}`}
                />
                {editErrors.name && <p className="text-destructive text-xs">{editErrors.name}</p>}
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Email</label>
                <input
                  type="email"
                  value={editForm.email}
                  onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                  className={`w-full h-11 px-3 rounded-lg bg-input-background border border-border focus:border-newzia-primary focus:ring-2 focus:ring-newzia-primary/20 ${editErrors.email ? 'border-destructive' : ''}`}
                />
                {editErrors.email && <p className="text-destructive text-xs">{editErrors.email}</p>}
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">New Password</label>
                <input
                  type="password"
                  value={editForm.password}
                  onChange={(e) => setEditForm({ ...editForm, password: e.target.value })}
                  placeholder="Leave blank to keep current password"
                  className="w-full h-11 px-3 rounded-lg bg-input-background border border-border focus:border-newzia-primary focus:ring-2 focus:ring-newzia-primary/20"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Confirm Password</label>
                <input
                  type="password"
                  value={editForm.confirmPassword}
                  onChange={(e) => setEditForm({ ...editForm, confirmPassword: e.target.value })}
                  className={`w-full h-11 px-3 rounded-lg bg-input-background border border-border focus:border-newzia-primary focus:ring-2 focus:ring-newzia-primary/20 ${editErrors.confirmPassword ? 'border-destructive' : ''}`}
                />
                {editErrors.confirmPassword && <p className="text-destructive text-xs">{editErrors.confirmPassword}</p>}
              </div>

              <div className="flex gap-3 pt-2">
                <Button type="button" variant="outline" className="flex-1 rounded-lg" onClick={closeEdit} disabled={saving}>Cancel</Button>
                <Button type="submit" className="flex-1 rounded-lg" disabled={saving}>{saving ? 'Saving...' : 'Save Changes'}</Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
}
