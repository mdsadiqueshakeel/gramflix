"use client"

import React, { useState } from 'react'
import { Button } from './ui/button'
import { Card } from './ui/card'
import { ArrowLeft, Copy, Gift, Users, Crown, Check, Share, ExternalLink } from 'lucide-react'
import { useRouter } from "next/navigation";
// interface ReferEarnPageProps {
//   onNavigate: (page: string) => void
// }

function ReferEarnPage({ onNavigate }) {
  const [copied, setCopied] = useState(false)
  const referralLink = "https://newzia.app/ref/JD123456";
  const router = useRouter();

  const handleCopyLink = () => {
    navigator.clipboard.writeText(referralLink)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const beforePremiumPoints = [
    { refers: '1 Referral', points: '5 Points', description: 'Basic reward' },
    { refers: '10 Referrals', points: '50 Points', description: 'Milestone bonus' },
    { refers: '25 Referrals', points: '125 Points', description: 'Achievement unlock' },
    { refers: '50 Referrals', points: '250 Points', description: 'Expert level' },
    { refers: '100 Referrals', points: '500 Points', description: 'Master achievement' },
  ]

  const premiumPoints = [
    { refers: '1 Referral', points: '10 Points', description: 'Premium boost' },
    { refers: '10 Referrals', points: '100 Points', description: 'Double rewards' },
    { refers: '25 Referrals', points: '250 Points', description: 'Premium milestone' },
    { refers: '50 Referrals', points: '500 Points', description: 'Elite status' },
    { refers: '100 Referrals', points: '1000 Points', description: 'Champion level' },
  ]

  return (
    <div className="min-h-screen bg-background pb-[1rem]">
      {/* Header */}
      {/* <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-md border-b border-border px-4 py-4 shadow-subtle">
        <div className="flex items-center space-x-4 max-w-2xl mx-auto">
          <button 
            onClick={() => router.push('/profile')}
            className="p-2 -ml-2 text-muted-foreground hover:text-newzia-primary transition-colors rounded-lg hover:bg-accent"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-lg font-semibold text-foreground">Refer & Earn</h1>
            <p className="text-sm text-muted-foreground">Share Newzia and earn rewards</p>
          </div>
        </div>
      </header> */}

      <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
        {/* Hero Card */}
        <Card className="p-6 bg-gradient-to-br from-newzia-primary to-newzia-primary-hover text-white border-0 shadow-strong">
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                <Gift className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold">Invite Friends</h2>
                <p className="text-white/80">Earn points for every successful referral</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Referral Link Section */}
        <Card className="p-6 border-border shadow-moderate">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground flex items-center space-x-2">
              <Share className="h-5 w-5 text-newzia-primary" />
              <span>Your Referral Link</span>
            </h3>
            
            <div className="flex space-x-3">
              <div className="flex-1 p-4 bg-accent rounded-xl text-sm text-foreground break-all font-mono">
                {referralLink}
              </div>
              <Button 
                onClick={handleCopyLink}
                className={`px-6 py-4 rounded-xl font-medium transition-all duration-200 ${
                  copied 
                    ? 'bg-green-600 hover:bg-green-700 text-white' 
                    : 'bg-newzia-primary hover:bg-newzia-primary-hover text-white'
                }`}
              >
                {copied ? <Check size={16} /> : <Copy size={16} />}
                <span className="ml-2">{copied ? 'Copied!' : 'Copy'}</span>
              </Button>
            </div>
            
            <div className="flex space-x-2">
              <Button variant="outline" className="flex-1 rounded-xl">
                <ExternalLink size={16} className="mr-2" />
                Share Link
              </Button>
            </div>
          </div>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="p-6 text-center border-border hover:border-newzia-primary/30 transition-all duration-200 shadow-moderate">
            <div className="space-y-2">
              <Users className="h-8 w-8 text-newzia-primary mx-auto" />
              <div className="text-2xl font-bold text-foreground">42</div>
              <div className="text-sm font-medium text-foreground">Total Referrals</div>
              <div className="text-xs text-muted-foreground">All time</div>
            </div>
          </Card>
          
          <Card className="p-6 text-center border-border hover:border-newzia-primary/30 transition-all duration-200 shadow-moderate">
            <div className="space-y-2">
              <Crown className="h-8 w-8 text-newzia-primary mx-auto" />
              <div className="text-2xl font-bold text-foreground">8</div>
              <div className="text-sm font-medium text-foreground">Premium Referrals</div>
              <div className="text-xs text-muted-foreground">Extra rewards</div>
            </div>
          </Card>
        </div>

        {/* Before Premium Section */}
        <Card className="border-border shadow-moderate">
          <div className="p-6 border-b border-border">
            <h3 className="text-lg font-semibold text-foreground">Standard Rewards</h3>
            <p className="text-sm text-muted-foreground">Points earned for each referral milestone</p>
          </div>
          <div className="divide-y divide-border">
            {beforePremiumPoints.map((item, index) => (
              <div key={index} className="p-4 hover:bg-accent transition-colors">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-foreground">{item.refers}</div>
                    <div className="text-sm text-muted-foreground">{item.description}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-newzia-primary">{item.points}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* For Premium Members Section */}
        <Card className="border-newzia-primary/30 shadow-moderate bg-gradient-to-br from-newzia-blue-50 to-white dark:from-newzia-gray-800 dark:to-card">
          <div className="p-6 border-b border-border">
            <div className="flex items-center space-x-2">
              <Crown className="h-5 w-5 text-newzia-primary" />
              <h3 className="text-lg font-semibold text-foreground">Premium Member Rewards</h3>
            </div>
            <p className="text-sm text-muted-foreground">Enhanced rewards for premium subscribers</p>
          </div>
          <div className="divide-y divide-border">
            {premiumPoints.map((item, index) => (
              <div key={index} className="p-4 hover:bg-accent/50 transition-colors">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-foreground">{item.refers}</div>
                    <div className="text-sm text-muted-foreground">{item.description}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-newzia-primary text-lg">{item.points}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Note */}
        <Card className="p-4 bg-newzia-primary/10 border-newzia-primary/30 shadow-moderate">
          <div className="flex items-start space-x-3">
            <div className="p-1 bg-newzia-primary/20 rounded-full mt-0.5">
              <div className="w-2 h-2 bg-newzia-primary rounded-full"></div>
            </div>
            <div className="space-y-1">
              <p className="font-medium text-foreground">Premium Referral Bonus</p>
              <p className="text-sm text-muted-foreground">
                Each premium referral earns an additional 100 points on top of the standard rewards (Total: 200 points per premium referral)
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}

export default ReferEarnPage;