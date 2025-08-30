"use client"

import React, { useState, useEffect } from 'react'
import { Button } from './ui/button'
import { Card } from './ui/card'
import { ArrowLeft, Wallet, TrendingUp, Calendar, DollarSign, AlertCircle, CheckCircle, Crown, Users, Lock } from 'lucide-react'
import { useRouter } from "next/navigation";
import { fetchUserProfile, isPremiumUser, fetchWalletSummary, getPremiumStatus, requestWithdraw, fetchWithdrawRequests } from "@/lib/api";

function WithdrawPage({ onNavigate }) {
  const router = useRouter();
  const [userProfile, setUserProfile] = useState(null);
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
    const totalChildren = userProfile.totalChildren || 0;

    return {
      canWithdraw100: !hasWithdrawn100 && walletBalance >= 100,
      canWithdraw900: !hasWithdrawn900 && referredChildBoughtPremium && walletBalance >= 900,
      canWithdraw3000: totalChildren >= 2 && walletBalance >= 3000,
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
    return request ? new Date(request.updatedAt).toLocaleDateString() : null;
  };

  // Check if withdrawal is already claimed (approved)
  const isWithdrawalClaimed = (amount) => {
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
      await requestWithdraw(amount);
      
      // Refresh profile to get updated withdrawal flags
      const refreshedProfile = await fetchUserProfile();
      setUserProfile(refreshedProfile);
      
      // Refresh wallet to get updated balance
      const refreshedWallet = await fetchWalletSummary();
      setWalletSummary(refreshedWallet);
      
      // Refresh withdrawal requests to get updated status
      const refreshedRequests = await fetchWithdrawRequests();
      setWithdrawRequests(refreshedRequests);
      
      alert(`Withdrawal request of ₹${amount} submitted successfully!`);
    } catch (error) {
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
      requirement: "Premium membership required",
      status: getWithdrawalStatus(100),
      claimedDate: getWithdrawalDate(100),
      isRejected: isWithdrawalRejected(100)
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
      requirement: "1st referral must be premium",
      status: getWithdrawalStatus(900),
      claimedDate: getWithdrawalDate(900),
      isRejected: isWithdrawalRejected(900)
    },
    {
      amount: 3000,
      label: "₹3000",
      description: "After 2nd referral gets premium (unlimited)",
      icon: Users,
      color: "text-blue-600",
      bg: "bg-blue-50 dark:bg-blue-900/20",
      border: "border-blue-200 dark:border-blue-800",
      canWithdraw: eligibility.canWithdraw3000 && !isWithdrawalPending(3000),
      requirement: "2+ premium referrals required",
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
                const isClaimed = option.status === "APPROVED";
                const isPending = option.status === "PENDING";
                const isRejected = option.status === "REJECTED";
                
                return (
                  <div key={index} className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                    option.canWithdraw 
                      ? `${option.border} ${option.bg} hover:border-opacity-60` 
                      : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50'
                  }`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-lg ${option.bg}`}>
                          <Icon className={`h-5 w-5 ${option.color}`} />
                        </div>
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="text-xl font-bold text-foreground">{option.label}</span>
                            {option.canWithdraw && (
                              <span className="text-xs bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 px-2 py-1 rounded-full">
                                Available
                              </span>
                            )}
                            {isClaimed && (
                              <span className="text-xs bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 px-2 py-1 rounded-full">
                                Claimed
                              </span>
                            )}
                            {isPending && (
                              <span className="text-xs bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 px-2 py-1 rounded-full">
                                Pending
                              </span>
                            )}
                            {isRejected && (
                              <span className="text-xs bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 px-2 py-1 rounded-full">
                                Rejected
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">{option.description}</p>
                          {!option.canWithdraw && !isClaimed && !isPending && (
                            <p className="text-xs text-red-600 dark:text-red-400 mt-1">
                              {option.requirement}
                            </p>
                          )}
                          {isClaimed && option.claimedDate && (
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
                      
                      <Button 
                        onClick={() => handleWithdraw(option.amount)}
                        disabled={isDisabled || isClaimed || isPending}
                        className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                          isProcessing
                            ? 'bg-blue-600 hover:bg-blue-700 text-white'
                            : isClaimed
                              ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                              : isPending
                                ? 'bg-yellow-400 text-yellow-800 cursor-not-allowed'
                                : option.canWithdraw
                                  ? 'bg-green-600 hover:bg-green-700 text-white'
                                  : 'bg-gray-400 text-gray-600 cursor-not-allowed'
                        }`}
                      >
                        {isProcessing ? (
                          <div className="flex items-center space-x-2">
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            <span>Processing...</span>
                          </div>
                        ) : isClaimed ? (
                          'Already Claimed'
                        ) : isPending ? (
                          'Pending'
                        ) : (
                          option.canWithdraw ? 'Withdraw' : 'Locked'
                        )}
                      </Button>
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
                <li>• ₹3000: Unlimited, after 2nd referral gets premium</li>
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