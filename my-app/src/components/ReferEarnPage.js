"use client";

import React, { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import {
  ArrowLeft,
  Copy,
  Gift,
  Users,
  Crown,
  Check,
  Share,
  ExternalLink,
  Share2,
  DollarSign,
  CheckCircle,
  MessageCircle,
  Send,
  Twitter,
  Facebook,
} from "lucide-react";
import { useRouter } from "next/navigation";
import {
  fetchUserProfile,
  isPremiumUser,
  getPremiumStatus,
  fetchChildrenSummary,
  fetchWithdrawRequests,
} from "@/lib/api";

// interface ReferEarnPageProps {
//   onNavigate: (page: string) => void
// }

function ReferEarnPage({ onNavigate }) {
  const [copied, setCopied] = useState(false);
  const [referralLink, setReferralLink] = useState("");
  const router = useRouter();
  const [userProfile, setUserProfile] = useState(null);
  const [childrenSummary, setChildrenSummary] = useState(null);
  const [withdrawRequests, setWithdrawRequests] = useState([]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShareLink = async () => {
    const shareTitle = "Join GramFlix with my referral link!";
    const shareText = `Hey! I'm using GramFlix and thought you might like it too. Join using my referral link and earn rewards! 🎉\n\n${referralLink}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: shareTitle,
          text: shareText,
          url: referralLink,
        });
      } catch (error) {
        console.log("Error sharing:", error);
        // Fallback to copy if sharing fails
        const fallbackMessage = `${shareText}\n\nShare this link with your friends!`;
        navigator.clipboard.writeText(fallbackMessage);
        setCopied(true);
        setTimeout(() => setCopied(false), 3000);
      }
    } else {
      // Fallback for browsers that don't support Web Share API
      const shareMessage = `${shareText}\n\nShare this link with your friends!`;
      navigator.clipboard.writeText(shareMessage);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    }
  };

  const handleSocialShare = (platform) => {
    const shareText = `Hey! I'm using GramFlix and thought you might like it too. Join using my referral link and earn rewards! 🎉`;
    const encodedText = encodeURIComponent(shareText);
    const encodedUrl = encodeURIComponent(referralLink);

    let shareUrl = "";

    switch (platform) {
      case "whatsapp":
        shareUrl = `https://wa.me/?text=${encodedText}%20${encodedUrl}`;
        break;
      case "telegram":
        shareUrl = `https://t.me/share/url?url=${encodedUrl}&text=${encodedText}`;
        break;
      case "twitter":
        shareUrl = `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`;
        break;
      case "facebook":
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodedText}`;
        break;
      default:
        return;
    }

    window.open(shareUrl, "_blank", "width=600,height=400");
  };

  // Fetch user profile
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const profile = await fetchUserProfile();
        setUserProfile(profile);
        if (profile?.referralLink) {
          setReferralLink(profile.referralLink);
        }
      } catch (error) {
        console.error("Error loading profile:", error);
      }
    };
    loadProfile();
  }, []);

  // Fetch children summary
  useEffect(() => {
    const loadChildren = async () => {
      try {
        const summary = await fetchChildrenSummary();
        setChildrenSummary(summary);
      } catch (error) {
        console.error("Error loading children summary:", error);
      }
    };
    loadChildren();
  }, []);

  // Fetch withdrawal requests
  useEffect(() => {
    const loadWithdrawRequests = async () => {
      try {
        const requests = await fetchWithdrawRequests();
        setWithdrawRequests(requests);
      } catch (error) {
        console.error("Error loading withdrawal requests:", error);
      }
    };
    loadWithdrawRequests();
  }, []);

  const beforePremiumPoints = [
    { refers: "1 Referral", points: "5 Points", description: "Basic reward" },
    {
      refers: "25 Referrals",
      points: "125 Points",
      description: "Achievement unlock",
    },
    {
      refers: "100 Referrals",
      points: "500 Points",
      description: "Master achievement",
    },
  ];

  const premiumPoints = [
    { refers: "1 Referral", points: "20 Points", description: "Premium boost" },
    {
      refers: "25 Referrals",
      points: "500 Points",
      description: "Premium milestone",
    },
    {
      refers: "100 Referrals",
      points: "2000 Points",
      description: "Champion level",
    },
  ];

  // Get withdrawal status for specific amounts
  const getWithdrawalStatus = (amount) => {
    const request = withdrawRequests.find((req) => req.amount === amount);
    return request ? request.status : null;
  };

  // Get withdrawal date for specific amounts
  const getWithdrawalDate = (amount) => {
    const request = withdrawRequests.find((req) => req.amount === amount);
    return request ? new Date(request.updatedAt).toLocaleDateString() : null;
  };

  // Check if withdrawal is already claimed (approved) - for one-time withdrawals only
  const isWithdrawalClaimed = (amount) => {
    // FIXED: ₹3000 is unlimited, so never mark as claimed
    if (amount === 3000) return false;
    return getWithdrawalStatus(amount) === "APPROVED";
  };

  // Check if withdrawal is pending
  const isWithdrawalPending = (amount) => {
    return getWithdrawalStatus(amount) === "PENDING";
  };

  return (
    <div className="min-h-screen bg-background pb-[1rem]">
      <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
        {/* Hero Card */}
        <Card
          className={`p-6 text-white border-0 shadow-strong ${
            getPremiumStatus(userProfile) === "PREMIUM"
              ? "bg-gradient-to-br from-yellow-400 to-yellow-600"
              : "bg-gradient-to-br from-newzia-primary to-newzia-primary-hover"
          }`}
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                  <Gift className="h-6 w-6" />
                </div>
                <div>
                  <h2 className="text-xl font-bold">Invite Friends</h2>
                  <p className="text-white/80">
                    Earn points for every successful referral
                  </p>
                </div>
              </div>
              <Button
                onClick={handleShareLink}
                className="bg-white/20 hover:bg-white/30 text-white border-white/30 backdrop-blur-sm"
              >
                <img
                  src="/images/share.avif"
                  alt="Share"
                  className="w-4 h-4 mr-2"
                />
                Share
              </Button>
            </div>
          </div>
        </Card>

        {/* Referral Link Section */}
        <Card className="p-6 border-border shadow-moderate">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground flex items-center space-x-2">
              <Share
                className={`h-5 w-5 ${
                  getPremiumStatus(userProfile) === "PREMIUM"
                    ? "text-yellow-600"
                    : "text-newzia-primary"
                }`}
              />
              <span>Your Referral Link</span>
            </h3>

            <div className="flex space-x-3">
              <div className="flex-1 p-4 bg-accent rounded-xl text-sm text-foreground break-all font-mono">
                {referralLink || "—"}
              </div>
              <Button
                onClick={handleCopyLink}
                className={`px-6 py-4 rounded-xl font-medium transition-all duration-200 ${
                  copied
                    ? "bg-green-600 hover:bg-green-700 text-white"
                    : getPremiumStatus(userProfile) === "PREMIUM"
                    ? "bg-yellow-600 hover:bg-yellow-700 text-white"
                    : "bg-newzia-primary hover:bg-newzia-primary-hover text-white"
                }`}
              >
                {copied ? <Check size={16} /> : <Copy size={16} />}
                <span className="ml-2">{copied ? "Copied!" : "Copy"}</span>
              </Button>
            </div>

            <div className="space-y-3">
              <Button
                variant="outline"
                className="w-full rounded-xl"
                onClick={handleShareLink}
              >
                <img
                  src="/images/share.avif"
                  alt="Share"
                  className="w-4 h-4 mr-2"
                />
                Share Link
              </Button>

              <div className="grid grid-cols-4 gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-lg"
                  onClick={() => handleSocialShare("whatsapp")}
                >
                  <MessageCircle className="text-green-600 w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-lg"
                  onClick={() => handleSocialShare("telegram")}
                >
                  <Send className="text-blue-600 w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-lg"
                  onClick={() => handleSocialShare("twitter")}
                >
                  <Twitter className="text-blue-400 w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-lg"
                  onClick={() => handleSocialShare("facebook")}
                >
                  <Facebook className="text-blue-700 w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="p-6 text-center border-border hover:border-newzia-primary/30 transition-all duration-200 shadow-moderate">
            <div className="space-y-2">
              <Users
                className={`h-8 w-8 mx-auto ${
                  getPremiumStatus(userProfile) === "PREMIUM"
                    ? "text-yellow-600"
                    : "text-newzia-primary"
                }`}
              />
              <div className="text-2xl font-bold text-foreground">
                {childrenSummary?.totalChildren ?? 0}
              </div>
              <div className="text-sm font-medium text-foreground">
                Total Referrals
              </div>
              <div className="text-xs text-muted-foreground">All time</div>
            </div>
          </Card>

          <Card className="p-6 text-center border-border hover:border-newzia-primary/30 transition-all duration-200 shadow-moderate">
            <div className="space-y-2">
              <Crown
                className={`h-8 w-8 mx-auto ${
                  getPremiumStatus(userProfile) === "PREMIUM"
                    ? "text-yellow-600"
                    : "text-newzia-primary"
                }`}
              />
              <div className="text-2xl font-bold text-foreground">
                {childrenSummary?.premiumUsers ?? 0}
              </div>
              <div className="text-sm font-medium text-foreground">
                Premium Referrals
              </div>
              <div className="text-xs text-muted-foreground">Extra rewards</div>
            </div>
          </Card>
        </div>

        {/* Withdrawal Progress */}
        {getPremiumStatus(userProfile) === "PREMIUM" && (
          <Card className="border-border shadow-moderate">
            <div className="p-6 border-b border-border">
              <h3 className="text-lg font-semibold text-foreground flex items-center space-x-2">
                <DollarSign className="h-5 w-5 text-green-600" />
                <span>Withdrawal Progress</span>
              </h3>
              <p className="text-sm text-muted-foreground">
                Track your withdrawal eligibility based on referrals
              </p>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between p-3 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <div>
                    <div className="font-medium text-foreground">
                      ₹100 Withdrawal
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {isWithdrawalClaimed(100)
                        ? `Claimed on ${getWithdrawalDate(100)}`
                        : isWithdrawalPending(100)
                        ? "Request pending approval"
                        : "Available for premium users"}
                    </div>
                  </div>
                </div>
                <span
                  className={`text-xs px-2 py-1 rounded-full font-medium ${
                    isWithdrawalClaimed(100)
                      ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
                      : isWithdrawalPending(100)
                      ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
                      : "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                  }`}
                >
                  {isWithdrawalClaimed(100)
                    ? "Claimed"
                    : isWithdrawalPending(100)
                    ? "Pending"
                    : "Available"}
                </span>
              </div>

              <div
                className={`flex items-center justify-between p-3 rounded-lg border ${
                  childrenSummary?.premiumUsers >= 1
                    ? "bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800"
                    : "bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700"
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Crown
                    className={`h-5 w-5 ${
                      childrenSummary?.premiumUsers >= 1
                        ? "text-yellow-600"
                        : "text-gray-400"
                    }`}
                  />
                  <div>
                    <div className="font-medium text-foreground">
                      ₹900 Withdrawal
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {isWithdrawalClaimed(900)
                        ? `Claimed on ${getWithdrawalDate(900)}`
                        : isWithdrawalPending(900)
                        ? "Request pending approval"
                        : childrenSummary?.premiumUsers >= 1
                        ? "Available after 1st premium referral"
                        : "Requires 1 premium referral"}
                    </div>
                  </div>
                </div>
                <span
                  className={`text-xs px-2 py-1 rounded-full font-medium ${
                    isWithdrawalClaimed(900)
                      ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
                      : isWithdrawalPending(900)
                      ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
                      : childrenSummary?.premiumUsers >= 1
                      ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
                      : "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400"
                  }`}
                >
                  {isWithdrawalClaimed(900)
                    ? "Claimed"
                    : isWithdrawalPending(900)
                    ? "Pending"
                    : childrenSummary?.premiumUsers >= 1
                    ? "Available"
                    : "Locked"}
                </span>
              </div>

              <div
                className={`flex items-center justify-between p-3 rounded-lg border ${
                  childrenSummary?.premiumUsers === 2
                    ? "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800"
                    : "bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700"
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Users
                    className={`h-5 w-5 ${
                      childrenSummary?.premiumUsers === 2
                        ? "text-blue-600"
                        : "text-gray-400"
                    }`}
                  />
                  <div>
                    <div className="font-medium text-foreground">
                      ₹3000 Withdrawal
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {isWithdrawalPending(3000)
                        ? "Request pending approval (unlimited)"
                        : childrenSummary?.premiumUsers === 2
                        ? "Available - unlimited withdrawals"
                        : `Requires exactly 2 premium referrals (current: ${
                            childrenSummary?.premiumUsers || 0
                          })`}
                    </div>
                  </div>
                </div>
                <span
                  className={`text-xs px-2 py-1 rounded-full font-medium ${
                    isWithdrawalPending(3000)
                      ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
                      : childrenSummary?.premiumUsers === 2
                      ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
                      : "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400"
                  }`}
                >
                  {isWithdrawalPending(3000)
                    ? "Pending"
                    : childrenSummary?.premiumUsers === 2
                    ? "Available"
                    : "Locked"}
                </span>
              </div>
            </div>
          </Card>
        )}

        {/* Children List */}
        {childrenSummary?.children?.length ? (
          <Card className="border-border shadow-moderate">
            <div className="p-6 border-b border-border">
              <h3 className="text-lg font-semibold text-foreground">
                Your Referrals
              </h3>
              <p className="text-sm text-muted-foreground">
                People who signed up with your link
              </p>
            </div>
            <div className="divide-y divide-border">
              {childrenSummary.children.map((child, idx) => (
                <div
                  key={idx}
                  className="p-4 flex items-center justify-between hover:bg-accent transition-colors"
                >
                  <div className="space-y-0.5">
                    <div className="font-medium text-foreground">
                      {child.name || "—"}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {child.email || "—"} · {child.mobile || "—"}
                    </div>
                  </div>
                  <div className="text-right">
                    <div
                      className={`text-xs font-semibold ${
                        child.userType === "PREMIUM"
                          ? getPremiumStatus(userProfile) === "PREMIUM"
                            ? "text-yellow-600"
                            : "text-newzia-primary"
                          : "text-muted-foreground"
                      }`}
                    >
                      {child.userType || "NORMAL"}
                    </div>
                    <a
                      href={child.referralLink}
                      target="_blank"
                      rel="noreferrer"
                      className={`text-xs hover:underline ${
                        getPremiumStatus(userProfile) === "PREMIUM"
                          ? "text-yellow-600"
                          : "text-newzia-primary"
                      }`}
                    >
                      Invite link
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        ) : null}

        {/* Before Premium Section */}
        <Card className="border-border shadow-moderate">
          <div className="p-6 border-b border-border">
            <h3 className="text-lg font-semibold text-foreground">
              Standard Rewards
            </h3>
            <p className="text-sm text-muted-foreground">
              Points earned for each referral milestone
            </p>
          </div>
          <div className="divide-y divide-border">
            {beforePremiumPoints.map((item, index) => (
              <div
                key={index}
                className="p-4 hover:bg-accent transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-foreground">
                      {item.refers}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {item.description}
                    </div>
                  </div>
                  <div className="text-right">
                    <div
                      className={`font-bold ${
                        getPremiumStatus(userProfile) === "PREMIUM"
                          ? "text-yellow-600"
                          : "text-newzia-primary"
                      }`}
                    >
                      {item.points}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* For Premium Members Section */}
        <Card
          className={`border-newzia-primary/30 shadow-moderate ${
            getPremiumStatus(userProfile) === "PREMIUM"
              ? "bg-gradient-to-br from-yellow-50 to-white dark:from-yellow-900/20 dark:to-card border-yellow-400/30"
              : "bg-gradient-to-br from-newzia-blue-50 to-white dark:from-newzia-gray-800 dark:to-card"
          }`}
        >
          <div className="p-6 border-b border-border">
            <div className="flex items-center space-x-2">
              <Crown
                className={`h-5 w-5 ${
                  getPremiumStatus(userProfile) === "PREMIUM"
                    ? "text-yellow-600"
                    : "text-newzia-primary"
                }`}
              />
              <h3 className="text-lg font-semibold text-foreground">
                Premium Member Rewards
              </h3>
            </div>
            <p className="text-sm text-muted-foreground">
              Enhanced rewards for premium subscribers
            </p>
          </div>
          <div className="divide-y divide-border">
            {premiumPoints.map((item, index) => (
              <div
                key={index}
                className="p-4 hover:bg-accent/50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-foreground">
                      {item.refers}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {item.description}
                    </div>
                  </div>
                  <div className="text-right">
                    <div
                      className={`font-bold text-lg ${
                        getPremiumStatus(userProfile) === "PREMIUM"
                          ? "text-yellow-600"
                          : "text-newzia-primary"
                      }`}
                    >
                      {item.points}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Note */}
        <Card
          className={`p-4 border-newzia-primary/30 shadow-moderate ${
            getPremiumStatus(userProfile) === "PREMIUM"
              ? "bg-yellow-100 dark:bg-yellow-900/20 border-yellow-400/30"
              : "bg-newzia-primary/10"
          }`}
        >
          <div className="flex items-start space-x-3">
            <div
              className={`p-1 rounded-full mt-0.5 ${
                getPremiumStatus(userProfile) === "PREMIUM"
                  ? "bg-yellow-400/20"
                  : "bg-newzia-primary/20"
              }`}
            >
              <div
                className={`w-2 h-2 rounded-full ${
                  getPremiumStatus(userProfile) === "PREMIUM"
                    ? "bg-yellow-600"
                    : "bg-newzia-primary"
                }`}
              ></div>
            </div>
            <div className="space-y-1">
              <p className="font-medium text-foreground">
                Premium Membership Terms
              </p>
              <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
                <li>
                  Premium users gain withdrawal access starting from a minimum
                  balance of 100.
                </li>
                <li>
                  Premium users earn 20 points per referral, while non-premium
                  users earn 5 points.
                </li>
                <li>
                  Referring a user who upgrades to Premium grants you 200 bonus
                  points.
                </li>
              </ul>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

export default ReferEarnPage;
