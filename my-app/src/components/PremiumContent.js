"use client";

import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Star, Banknote, Shield, Crown, Check } from "lucide-react";
import { fetchUserProfile, isPremiumUser, getPremiumStatus, requestPremium, pollPremiumStatus } from "@/lib/api";
import { useState, useEffect } from "react";

const benefits = [
  {
    icon: Star,
    title: "Enhanced Referral Rewards",
    description: "Earn up to 4x more points for every referral milestone."
  },
  {
    icon: Crown,
    title: "Premium Referral Bonus",
    description: "Get a massive 200 points for each friend who goes premium."
  },
  {
    icon: Banknote,
    title: "Unlock Withdrawals",
    description: "Be eligible to withdraw your first ₹100 and future earnings."
  },
  {
    icon: Shield,
    title: "Priority Support",
    description: "Get faster, prioritized responses from our admin team."
  }
];

export default function PremiumContent({ onUpgradeClick }) {
  const [userProfile, setUserProfile] = useState(null);
  const [profileLoading, setProfileLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  // If user is premium or has pending request, show appropriate status
  const premiumStatus = getPremiumStatus(userProfile);
  
  if (premiumStatus === "PREMIUM") {
    return (
      <Card className="p-6 shadow-moderate border-border bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/10 dark:to-orange-900/10">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center">
            <Crown size={32} className="text-white" />
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-2">
            Premium Active
          </h2>
          <p className="text-muted-foreground text-sm mb-4">
            You have access to all premium features
          </p>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-yellow-200 dark:border-yellow-800">
            <div className="text-center">
              <div className="flex items-center justify-center space-x-2 mb-2">
                <span className="text-2xl font-bold text-green-600">✓</span>
                <span className="text-lg font-semibold text-foreground">Premium Status</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Enjoy all premium benefits
              </p>
            </div>
          </div>
        </div>
      </Card>
    );
  }

  if (premiumStatus === "PENDING") {
    return (
      <Card className="p-6 shadow-moderate border-border bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/10 dark:to-indigo-900/10">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center">
            <Crown size={32} className="text-white" />
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-2">
            Request Pending
          </h2>
          <p className="text-muted-foreground text-sm mb-4">
            Your premium request is under review
          </p>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
            <div className="text-center">
              <div className="flex items-center justify-center space-x-2 mb-2">
                <span className="text-2xl font-bold text-blue-600">⏳</span>
                <span className="text-lg font-semibold text-foreground">Under Review</span>
              </div>
              <p className="text-sm text-muted-foreground">
                We'll notify you once approved
              </p>
            </div>
          </div>
        </div>
      </Card>
    );
  }

  const handleUpgradeNow = async () => {
    try {
      setIsSubmitting(true);
      await requestPremium();
      
      // Poll for status updates
      const updatedProfile = await pollPremiumStatus(3, 2000); // Poll for 6 seconds
      
      if (typeof onUpgradeClick === 'function') {
        onUpgradeClick(updatedProfile);
      }
    } catch (e) {
      console.error("Failed to request premium:", e);
      alert(`Upgrade failed: ${e.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="p-6 shadow-moderate border-border bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/10 dark:to-orange-900/10">
      {/* Header */}
      <div className="text-center mb-6">
        <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center">
          <Crown size={32} className="text-white" />
        </div>
        <h2 className="text-2xl font-bold text-foreground mb-2">
          Upgrade to Premium
        </h2>
        <p className="text-muted-foreground text-sm">
          Unlock exclusive features and enhance your reading experience
        </p>
      </div>

      {/* Benefits Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {benefits.map((benefit, index) => {
          const Icon = benefit.icon;
          return (
            <div key={index} className="flex items-start space-x-3 p-3 rounded-lg bg-white/50 dark:bg-gray-800/50">
              <div className="flex-shrink-0 w-10 h-10 bg-yellow-100 dark:bg-yellow-900/30 rounded-full flex items-center justify-center">
                <Icon size={20} className="text-yellow-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-foreground mb-1">
                  {benefit.title}
                </h3>
                <p className="text-xs text-muted-foreground">
                  {benefit.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Pricing Section */}
  {/* Import at the top of your file: import { Check, MessageSquare } from "lucide-react"; */}

{/* Import at the top of your file: import { MessageSquare } from "lucide-react"; */}

<div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
  <div className="text-center">
    <h3 className="text-xl font-bold text-foreground mb-2">
      Ready for Premium?
    </h3>
    <p className="text-sm text-muted-foreground mb-4">
      Get lifetime access to enhanced rewards, withdrawals, and more by requesting an upgrade directly from an admin.
    </p>
    
    {/* Action Button */}
    <Button
      onClick={handleRequestUpgrade} // Assuming you have a function with this name
      className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold py-3 rounded-lg transition-all duration-200 shadow-moderate hover:shadow-strong"
    >
      <MessageSquare className="mr-2 h-5 w-5" />
      Contact Admin to Upgrade
    </Button>
  </div>
</div>

      {/* Trust Indicators */}
      <div className="flex items-center justify-center space-x-8 text-xs text-muted-foreground">
        <div className="flex items-center space-x-2">
          <Shield size={14} />
          <span>Secure Payment</span>
        </div>
        <div className="flex items-center space-x-2">
          <Check size={14} />
          <span>30-Day Guarantee</span>
        </div>
      </div>
    </Card>
  );
}
