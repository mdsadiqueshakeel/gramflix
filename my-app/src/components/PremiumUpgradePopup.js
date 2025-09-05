"use client";

import { pollPremiumStatus, requestPremium } from "@/lib/api";
import { BadgeCheck, Banknote, Crown, Shield, Star, X } from "lucide-react";
import { useState } from "react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";

const benefits = [
  {
    icon: Star,
    title: "Enhanced Referral Rewards",
    description: "Earn up to 4x more points for every referral milestone.",
  },
  {
    icon: Crown,
    title: "Premium Referral Bonus",
    description: "Get a massive 200 points for each friend who goes premium.",
  },
  {
    icon: Banknote,
    title: "Unlock Withdrawals",
    description: "Be eligible to withdraw your first ₹100 and future earnings.",
  },
  {
    icon: Shield,
    title: "Priority Support",
    description: "Get faster, prioritized responses from our admin team.",
  },
];

export default function PremiumUpgradePopup({ isOpen, onClose, onUpgrade }) {
  const [isLoading, setIsLoading] = useState(false);
  const [isPolling, setIsPolling] = useState(false);

const handleUpgrade = async () => {
  setIsLoading(true);
  try {
    // 1. Open WhatsApp immediately (so popup isn't blocked)
    const adminPhoneNumber = "917859086070";
    const message =
      "Hi Admin 👋,\n\nI would like to upgrade to Premium.\nPlease review my request and approve it. 🙏\n\nThanks!\n— Your App User";
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${adminPhoneNumber}?text=${encodedMessage}`;
    window.open(whatsappUrl, "_blank"); // <-- run before await

    // 2. Submit request to backend
    await requestPremium();

    // 3. Poll backend for status update
    setIsPolling(true);
    const updatedProfile = await pollPremiumStatus(3, 2000);

    // 4. Update parent
    if (onUpgrade) {
      onUpgrade(updatedProfile);
    }
  } catch (error) {
    console.error("Upgrade failed:", error);
    alert(`Upgrade failed: ${error.message || "Something went wrong"}`);
  } finally {
    setIsLoading(false);
    setIsPolling(false);
  }
};



  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 lg:p-8">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Popup Content */}
      <Card className="relative w-full max-w-md lg:max-w-2xl lg:max-h-[90vh] lg:overflow-y-auto bg-card border-border shadow-strong animate-in fade-in-0 zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-accent transition-colors z-10"
        >
          <X size={20} className="text-muted-foreground" />
        </button>

        <div className="p-6 lg:p-10">
          {/* Header */}
          <div className="text-center mb-6">
            <div className="w-16 h-16 lg:w-20 lg:h-20 mx-auto mb-4 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center">
              <Crown size={32} className="text-white lg:w-10 lg:h-10" />
            </div>
            <h2 className="text-2xl lg:text-3xl font-bold text-foreground mb-2">
              Upgrade to Premium
            </h2>
            <p className="text-muted-foreground text-sm lg:text-base">
              Unlock exclusive features and enhance your reading experience
            </p>
          </div>

          {/* Benefits */}
          <div className="space-y-4 mb-6 lg:grid lg:grid-cols-2 lg:gap-4 lg:space-y-0">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <div key={index} className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-8 h-8 lg:w-12 lg:h-12 bg-yellow-100 dark:bg-yellow-900/30 rounded-full flex items-center justify-center">
                    <Icon size={16} className="text-yellow-600 lg:w-6 lg:h-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm lg:text-lg font-semibold text-foreground mb-1">
                      {benefit.title}
                    </h3>
                    <p className="text-xs lg:text-sm text-muted-foreground">
                      {benefit.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pricing */}
        {/* You might need to import this icon: import { BadgeCheck } from "lucide-react"; */}

<div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-4 lg:p-6 rounded-lg mb-6">
  <div className="text-center">
    <div className="flex items-center justify-center space-x-2 mb-2">
      <BadgeCheck className="h-8 w-8 lg:h-10 lg:w-10 text-blue-600" />
      <span className="text-xl lg:text-2xl font-bold text-foreground">
        Unlock Premium Access
      </span>
    </div>
    <p className="text-xs lg:text-sm text-muted-foreground">
      Request an upgrade for lifetime access to exclusive features and rewards.
    </p>
  </div>
</div>
          {/* Action Buttons */}
        <div className="space-y-3">
  <Button
    onClick={handleUpgrade}
    disabled={isLoading || isPolling}
    className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white font-semibold py-3 lg:py-4 lg:text-lg rounded-lg transition-all duration-200 shadow-moderate hover:shadow-strong"
  >
    {isLoading ? (
      <div className="flex items-center space-x-2">
        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        <span>Submitting Request...</span>
      </div>
    ) : isPolling ? (
      <div className="flex items-center space-x-2">
        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        <span>Checking Status...</span>
      </div>
    ) : (
      // 👇 Only this line has been changed
      "Request Premium Access"
    )}
  </Button>

  <button
    onClick={onClose}
    className="w-full text-sm text-muted-foreground hover:text-foreground transition-colors py-2"
  >
    Maybe later
  </button>
</div>

          {/* Trust Indicators */}
          <div className="mt-6 pt-4 border-t border-border">
            <div className="flex items-center justify-center space-x-6 text-xs text-muted-foreground">
              <div className="flex items-center space-x-1">
                <Shield size={12} />
                <span>Secure Payment</span>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
