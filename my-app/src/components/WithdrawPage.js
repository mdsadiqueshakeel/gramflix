"use client"

import { fetchChildrenSummary, fetchUserProfile, fetchWalletSummary, fetchWithdrawRequests, getPremiumStatus, requestWithdraw } from "@/lib/api"
import { Calendar, CheckCircle, Crown, DollarSign, Lock, TrendingUp, Users, Wallet } from 'lucide-react'
import { useRouter } from "next/navigation"
import { useEffect, useState } from 'react'
import { Button } from './ui/button'
import { Card } from './ui/card'

function WithdrawPage({ onNavigate }) {
  const router = useRouter();
  const [userProfile, setUserProfile] = useState(null);
  const [childrenSummary, setChildrenSummary] = useState(null);
  const [walletSummary, setWalletSummary] = useState(null);
  const [withdrawRequests, setWithdrawRequests] = useState([]);
  const [isLoadingWallet, setIsLoadingWallet] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState(null);

  const walletBalance = walletSummary?.walletBalance ?? 0
  const earnings = {
    today: walletSummary?.todaysEarning ?? 0,
    thisWeek: walletSummary?.thisWeekEarning ?? 0,
    total: walletSummary?.totalEarning ?? 0,
    totalWithdrawal: walletSummary?.totalWithdrawal ?? 0,
  }

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

  // Fetch children summary
  useEffect(() => {
    const loadChildren = async () => {
      try {
        const children = await fetchChildrenSummary();
        setChildrenSummary(children);
      } catch (error) {
        console.error("Error loading children summary:", error);
      }
    };
    loadChildren();
  }, []);

  // Fetch wallet summary
  useEffect(() => {
    const loadWallet = async () => {
      try {
        setIsLoadingWallet(true);
        const summary = await fetchWalletSummary();
        setWalletSummary(summary);
      } catch (error) {
        console.error("Error loading wallet summary:", error);
      } finally {
        setIsLoadingWallet(false);
      }
    };
    loadWallet();
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

  // Check withdrawal eligibility based on backend logic
  const getWithdrawalEligibility = () => {
    if (!userProfile || getPremiumStatus(userProfile) !== "PREMIUM") {
      return {
        canWithdraw100: false,
        canWithdraw900: false,
        canWithdraw3000: false,
        reason: "Premium membership required"
      };
    }

    const hasWithdrawn100 = userProfile.hasWithdrawn100 || false;
    const hasWithdrawn900 = userProfile.hasWithdrawn900 || false;
    const referredChildBoughtPremium = userProfile.referredChildBoughtPremium || false;
    
    // FIXED: Get premium referrals count from fetchChildrenSummary()
    const referredChildrenWithPremium = childrenSummary?.premiumUsers || 0;

    // DEBUG: Log the values to console
    console.log("DEBUG - Eligibility Check:", {
      userProfile: userProfile,
      childrenSummary: childrenSummary,
      walletBalance: walletBalance,
      referredChildrenWithPremium: referredChildrenWithPremium,
      premiumUsers: childrenSummary?.premiumUsers,
      totalChildren: childrenSummary?.totalChildren,
      hasWithdrawn100,
      hasWithdrawn900,
      referredChildBoughtPremium
    });

    return {
      canWithdraw100: !hasWithdrawn100 && walletBalance >= 100,
      canWithdraw900: !hasWithdrawn900 && referredChildrenWithPremium >= 1 && walletBalance >= 900,
      // FIXED: Check if user has at least 2 premium referrals (2nd referral gets premium)
      canWithdraw3000: referredChildrenWithPremium >= 2 && walletBalance >= 3000,
      reason: null
    };
  };

  const eligibility = getWithdrawalEligibility();

  // Get withdrawal status for specific amounts
  const getWithdrawalStatus = (amount) => {
    const request = withdrawRequests.find(req => req.amount === amount);
    return request ? request.status : null;
  };

  // Get withdrawal date for specific amounts
  const getWithdrawalDate = (amount) => {
    const request = withdrawRequests.find(req => req.amount === amount);
    return request ? new Date(request.updatedAt || request.createdAt).toLocaleDateString() : null;
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

  // Check if withdrawal is rejected
  const isWithdrawalRejected = (amount) => {
    return getWithdrawalStatus(amount) === "REJECTED";
  };

 const handleWithdraw = async (amount) => {
  if (isSubmitting) return;

  setWithdrawAmount(amount);
  setIsSubmitting(true);

  try {
    // 1️⃣ Open WhatsApp immediately (so popup isn't blocked)
    const adminPhoneNumber = "917859086070";
    const message = `Hi Admin 👋,

I want to request a withdrawal of ₹${amount}.
Please review my request and approve it. 🙏

My current wallet balance: ₹${walletBalance}.
User ID: ${userProfile?.id || "N/A"}

Thanks!
— Your App User`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${adminPhoneNumber}?text=${encodedMessage}`;
    window.open(whatsappUrl, "_blank");

    // 2️⃣ Still send withdrawal request to server
    await requestWithdraw(amount);

    // Optimistic UI update
    if (walletSummary) {
      setWalletSummary({
        ...walletSummary,
        walletBalance: walletSummary.walletBalance - amount,
      });
    }

    // 3️⃣ Refresh everything
    const refreshedProfile = await fetchUserProfile();
    setUserProfile(refreshedProfile);

    const refreshedChildren = await fetchChildrenSummary();
    setChildrenSummary(refreshedChildren);

    const refreshedWallet = await fetchWalletSummary();
    setWalletSummary(refreshedWallet);

    const refreshedRequests = await fetchWithdrawRequests();
    setWithdrawRequests(refreshedRequests);

    alert(`Withdrawal request of ₹${amount} submitted successfully!`);
  } catch (error) {
    // Revert optimistic update if needed
    if (walletSummary) {
      setWalletSummary({
        ...walletSummary,
        walletBalance: walletSummary.walletBalance,
      });
    }
    alert(`Withdrawal failed: ${error.message}`);
  } finally {
    setIsSubmitting(false);
    setWithdrawAmount(null);
  }
};


  const withdrawalOptions = [
    {
      amount: 100,
      label: "₹100",
      description: "First withdrawal (one-time only)",
      icon: CheckCircle,
      color: "text-green-600",
      bg: "bg-green-50 dark:bg-green-900/20",
      border: "border-green-200 dark:border-green-800",
      canWithdraw: eligibility.canWithdraw100 && !isWithdrawalClaimed(100) && !isWithdrawalPending(100),
      requirement: "Premium membership is required, along with maintaining the required wallet balance.",
      status: getWithdrawalStatus(100),
      claimedDate: getWithdrawalDate(100),
      isRejected: isWithdrawalRejected(100),
      isUnlimited: false
    },
    {
      amount: 900,
      label: "₹900",
      description: "After 1st referral gets premium (one-time only)",
      icon: Crown,
      color: "text-yellow-600",
      bg: "bg-yellow-50 dark:bg-yellow-900/20",
      border: "border-yellow-200 dark:border-yellow-800",
      canWithdraw: eligibility.canWithdraw900 && !isWithdrawalClaimed(900) && !isWithdrawalPending(900),
      requirement: "The first referral must be a premium member, along with maintaining the required wallet balance.",
      status: getWithdrawalStatus(900),
      claimedDate: getWithdrawalDate(900),
      isRejected: isWithdrawalRejected(900),
      isUnlimited: false
    },
    {
      amount: 3000,
      label: "₹3000",
      description: "After 2nd referral gets premium (unlimited)",
      icon: Users,
      color: "text-blue-600",
      bg: "bg-blue-50 dark:bg-blue-900/20",
      border: "border-blue-200 dark:border-blue-800",
      // FIXED: Remove isWithdrawalClaimed check for unlimited withdrawals
      canWithdraw: eligibility.canWithdraw3000 && !isWithdrawalPending(3000),
      requirement: "A user must have exactly 2 premium referrals, along with maintain the required wallet balance",
      status: getWithdrawalStatus(3000),
      claimedDate: getWithdrawalDate(3000),
      isRejected: isWithdrawalRejected(3000),
      isUnlimited: true
    }
  ];

  const earningsData = [
    { label: 'Today Earning', value: earnings.today, icon: Calendar, color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-900/20' },
    { label: 'This Week', value: earnings.thisWeek, icon: TrendingUp, color: 'text-green-600', bg: 'bg-green-50 dark:bg-green-900/20' },
    { label: 'Total Earning', value: earnings.total, icon: DollarSign, color: 'text-purple-600', bg: 'bg-purple-50 dark:bg-purple-900/20' },
    { label: 'Total Withdraw', value: earnings.totalWithdrawal, icon: Wallet, color: 'text-orange-600', bg: 'bg-orange-50 dark:bg-orange-900/20' },
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
        {/* Wallet Balance Card */}
        <Card className={`p-6 text-white border-0 shadow-strong ${
          getPremiumStatus(userProfile) === "PREMIUM"
            ? "bg-gradient-to-br from-yellow-400 to-yellow-600"
            : "bg-gradient-to-br from-newzia-primary to-newzia-primary-hover"
        }`}>
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Wallet className="h-5 w-5 text-white/80" />
                <p className="text-white/80 font-medium">Available Balance</p>
              </div>
              <p className="text-3xl font-bold">{isLoadingWallet ? '—' : `₹${Number(walletBalance || 0).toLocaleString()}`}</p>
              <p className="text-white/80 text-sm">Ready for withdrawal</p>
            </div>
            <div className="p-4 bg-white/20 rounded-2xl backdrop-blur-sm">
              <DollarSign className="h-8 w-8" />
            </div>
          </div>
        </Card>

        {/* Premium Status Warning */}
        {getPremiumStatus(userProfile) !== "PREMIUM" && (
          <Card className="p-4 border-orange-300 bg-orange-50 dark:bg-orange-900/20 dark:border-orange-700 shadow-moderate">
            <div className="flex items-center space-x-3">
              <Lock className="h-5 w-5 text-orange-600" />
              <div>
                <p className="font-medium text-orange-800 dark:text-orange-200">Premium Membership Required</p>
                <p className="text-sm text-orange-700 dark:text-orange-300">
                  You need to upgrade to premium to access withdrawal features.
                </p>
              </div>
            </div>
          </Card>
        )}

        {/* Withdrawal Options */}
        <Card className="p-6 border-border shadow-moderate">
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-semibold text-foreground mb-1">Withdrawal Options</h2>
              <p className="text-sm text-muted-foreground">Choose your withdrawal amount based on eligibility</p>
            </div>
            
            <div className="space-y-4">
              {withdrawalOptions.map((option, index) => {
                const Icon = option.icon;
                const isDisabled = !option.canWithdraw || isSubmitting;
                const isProcessing = isSubmitting && withdrawAmount === option.amount;
                const isClaimed = option.status === "APPROVED" && !option.isUnlimited; // FIXED: Don't mark unlimited as claimed
                const isPending = option.status === "PENDING";
                const isRejected = option.status === "REJECTED";
                
                return (
                  <div key={index} className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                    option.canWithdraw 
                      ? `${option.border} ${option.bg} hover:border-opacity-60` 
                      : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50'
                  }`}>
                    {/* Mobile-first responsive layout */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
                      <div className="flex items-center space-x-3 flex-1 min-w-0">
                        <div className={`p-2 rounded-lg ${option.bg} flex-shrink-0`}>
                          <Icon className={`h-5 w-5 ${option.color}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2 flex-wrap">
                            <span className="text-lg sm:text-xl font-bold text-foreground">{option.label}</span>
                            {option.canWithdraw && (
                              <span className="text-xs bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 px-2 py-1 rounded-full whitespace-nowrap">
                                Available
                              </span>
                            )}
                            {/* FIXED: Only show "Claimed" for one-time withdrawals */}
                            {isClaimed && !option.isUnlimited && (
                              <span className="text-xs bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 px-2 py-1 rounded-full whitespace-nowrap">
                                Claimed
                              </span>
                            )}
                            {isPending && (
                              <span className="text-xs bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 px-2 py-1 rounded-full whitespace-nowrap">
                                Pending
                              </span>
                            )}
                            {isRejected && (
                              <span className="text-xs bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 px-2 py-1 rounded-full whitespace-nowrap">
                                Rejected
                              </span>
                            )}
                            {option.isUnlimited && (
                              <span className="text-xs bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400 px-2 py-1 rounded-full whitespace-nowrap">
                                Unlimited
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">{option.description}</p>
                          {!option.canWithdraw && !isClaimed && !isPending && (
                            <p className="text-xs text-red-600 dark:text-red-400 mt-1">
                              {option.requirement}
                            </p>
                          )}
                          {isClaimed && option.claimedDate && !option.isUnlimited && (
                            <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                              Claimed on {option.claimedDate}
                            </p>
                          )}
                          {isRejected && (
                            <p className="text-xs text-red-600 dark:text-red-400 mt-1">
                              Your request was rejected. You can try again.
                            </p>
                          )}
                        </div>
                      </div>
                      
                      {/* Button with responsive sizing */}
                      <div className="flex-shrink-0 w-full sm:w-auto">
                        <Button 
                          onClick={() => handleWithdraw(option.amount)}
                          disabled={isDisabled || (isClaimed && !option.isUnlimited) || isPending} // FIXED: Allow unlimited withdrawals even after approval
                          className={`w-full sm:w-auto px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg font-medium transition-all duration-200 text-sm sm:text-base ${
                            isProcessing
                              ? 'bg-blue-600 hover:bg-blue-700 text-white'
                              : isClaimed && !option.isUnlimited
                                ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                                : isPending
                                  ? 'bg-yellow-400 text-yellow-800 cursor-not-allowed'
                                  : option.canWithdraw
                                    ? 'bg-green-600 hover:bg-green-700 text-white'
                                    : 'bg-gray-400 text-gray-600 cursor-not-allowed'
                          }`}
                        >
                          {isProcessing ? (
                            <div className="flex items-center justify-center space-x-2">
                              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                              <span className="hidden sm:inline">Processing...</span>
                              <span className="sm:hidden">...</span>
                            </div>
                          ) : isClaimed && !option.isUnlimited ? (
                            <>
                              <span className="block sm:hidden">Claimed</span>
                              <span className="hidden sm:block">Already Claimed</span>
                            </>
                          ) : isPending ? (
                            'Pending'
                          ) : option.canWithdraw ? (
                            'Withdraw'
                          ) : (
                            <div className="flex items-center justify-center space-x-2">
                              <Lock className="w-4 h-4" />
                              <span>Locked</span>
                            </div>
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </Card>

        {/* Earnings Summary */}
        <Card className="border-border shadow-moderate">
          <div className="p-6 border-b border-border">
            <h2 className="text-lg font-semibold text-foreground mb-1">Earnings Overview</h2>
            <p className="text-sm text-muted-foreground">Track your earnings and withdrawal history</p>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-2 gap-4">
              {earningsData.map((item, index) => {
                const Icon = item.icon
                return (
                  <div key={index} className={`p-4 rounded-xl border border-border hover:border-newzia-primary/30 transition-all duration-200 ${item.bg}`}>
                    <div className="flex items-center justify-between mb-3">
                      <Icon className={`h-5 w-5 ${
                        getPremiumStatus(userProfile) === "PREMIUM" 
                          ? "text-yellow-600" 
                          : item.color
                      }`} />
                      <span className="text-xs text-muted-foreground">Last 24h</span>
                    </div>
                    <div className="space-y-1">
                      <p className="text-lg font-bold text-foreground">₹{item.value.toLocaleString()}</p>
                      <p className="text-sm text-muted-foreground">{item.label}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </Card>

        {/* Info Card */}
        <Card className={`p-4 border-newzia-primary/30 shadow-moderate ${
          getPremiumStatus(userProfile) === "PREMIUM"
            ? "bg-yellow-50 dark:bg-yellow-900/20 border-yellow-400/30"
            : "bg-newzia-blue-50 dark:bg-newzia-gray-800"
        }`}>
          <div className="flex items-start space-x-3">
            <div className={`p-1 rounded-full mt-0.5 ${
              getPremiumStatus(userProfile) === "PREMIUM"
                ? "bg-yellow-400/20"
                : "bg-newzia-primary/20"
            }`}>
              <div className={`w-2 h-2 rounded-full ${
                getPremiumStatus(userProfile) === "PREMIUM"
                  ? "bg-yellow-600"
                  : "bg-newzia-primary"
              }`}></div>
            </div>
            <div className="space-y-2">
              <p className="font-medium text-foreground">Withdrawal Rules</p>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• ₹100: One-time only, requires premium membership</li>
                <li>• ₹900: One-time only, after 1st referral gets premium</li>
                <li>• ₹3000: Unlimited, after exactly 2 referrals get premium</li>
                <li>• Processing time: 1-24 business hours</li>
                <li>• TDS & Admin charges: 10% total</li>
              </ul>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}

export default WithdrawPage