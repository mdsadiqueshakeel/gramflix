"use client"

import React, { useState, useEffect } from 'react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Textarea } from './ui/textarea'
import { Card } from './ui/card'
import { ArrowLeft, Wallet, TrendingUp, Calendar, DollarSign, AlertCircle, CheckCircle } from 'lucide-react'
import { useRouter } from "next/navigation";
import { fetchUserProfile, isPremiumUser, fetchWalletSummary, getPremiumStatus } from "@/lib/api";

// interface WithdrawPageProps {
//   onNavigate: (page: string) => void
// }

function WithdrawPage({ onNavigate }) {
  const router = useRouter();
  const [withdrawalAmount, setWithdrawalAmount] = useState('')
  const [withdrawalRequest, setWithdrawalRequest] = useState('')
  const [errors, setErrors] = useState ({})
  const [userProfile, setUserProfile] = useState(null);
  const [walletSummary, setWalletSummary] = useState(null);
  const [isLoadingWallet, setIsLoadingWallet] = useState(true);

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
        // API shape: { data: { walletBalance, todaysEarning, thisWeekEarning, totalEarning } }
        // fetchWalletSummary already unwraps to json.data
        setWalletSummary(summary);
      } catch (error) {
        console.error("Error loading wallet summary:", error);
      } finally {
        setIsLoadingWallet(false);
      }
    };
    loadWallet();
  }, []);

  const handleWithdrawal = (e) => {
    e.preventDefault()
    const newErrors = {}
    
    const amount = parseInt(withdrawalAmount)
    if (!withdrawalAmount) {
      newErrors.amount = 'Withdrawal amount is required'
    } else if (amount % 100 !== 0) {
      newErrors.amount = 'Amount must be a multiple of 100'
    } else if (amount > walletBalance) {
      newErrors.amount = 'Insufficient balance'
    } else if (amount < 100) {
      newErrors.amount = 'Minimum withdrawal amount is ₹100'
    }
    
    if (!withdrawalRequest.trim()) {
      newErrors.request = 'Withdrawal request details are required'
    }
    
    setErrors(newErrors)
    
    if (Object.keys(newErrors).length === 0) {
      alert('Withdrawal request submitted successfully!')
      setWithdrawalAmount('')
      setWithdrawalRequest('')
    }
  }

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

        {/* Withdrawal Form */}
        <Card className="p-6 border-border shadow-moderate">
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-semibold text-foreground mb-1">Request Withdrawal</h2>
              <p className="text-sm text-muted-foreground">Submit a withdrawal request for your earnings</p>
            </div>
            
            <form onSubmit={handleWithdrawal} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="amount" className="text-sm font-medium text-foreground">Withdrawal Amount</Label>
                <Input
                  id="amount"
                  type="number"
                  placeholder="Enter amount (minimum ₹100)"
                  step="100"
                  value={withdrawalAmount}
                  onChange={(e) => setWithdrawalAmount(e.target.value)}
                  className={`h-12 bg-input-background border-border focus:border-newzia-primary focus:ring-2 focus:ring-newzia-primary/20 rounded-xl ${errors.amount ? 'border-destructive' : ''}`}
                />
                {errors.amount && (
                  <div className="flex items-center space-x-2 text-destructive text-sm">
                    <AlertCircle size={14} />
                    <span>{errors.amount}</span>
                  </div>
                )}
                <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                  <CheckCircle size={14} />
                  <span>Amount must be a multiple of ₹100</span>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="request" className="text-sm font-medium text-foreground">Request Details</Label>
                <Textarea
                  id="request"
                  placeholder="Enter withdrawal request details (bank account, UPI ID, etc.)"
                  value={withdrawalRequest}
                  onChange={(e) => setWithdrawalRequest(e.target.value)}
                  className={`min-h-24 bg-input-background border-border focus:border-newzia-primary focus:ring-2 focus:ring-newzia-primary/20 rounded-xl ${errors.request ? 'border-destructive' : ''}`}
                  rows={4}
                />
                {errors.request && (
                  <div className="flex items-center space-x-2 text-destructive text-sm">
                    <AlertCircle size={14} />
                    <span>{errors.request}</span>
                  </div>
                )}
              </div>

              <Button 
                type="submit" 
                className={`w-full h-12 text-white font-medium rounded-xl shadow-moderate transition-all duration-200 ${
                  getPremiumStatus(userProfile) === "PREMIUM"
                    ? "bg-yellow-600 hover:bg-yellow-700"
                    : "bg-newzia-primary hover:bg-newzia-primary-hover"
                }`}
              >
                Submit Withdrawal Request
              </Button>
            </form>
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
              <p className="font-medium text-foreground">Withdrawal Information</p>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Processing time: 1-24 business hours</li>
                <li>• Minimum withdrawal: ₹100</li>
                <li>• TDS Charges: 5% of withdrawal amount</li>
                <li>• Admin Charges: 5% of withdrawal amount</li>
              </ul>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}

export default WithdrawPage