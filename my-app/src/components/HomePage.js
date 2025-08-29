"use client"; // add this if you're using Next.js app router

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { Card } from "./ui/card";
import { Home, Search, Bookmark, User, Clock, ExternalLink, Crown } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { DarkModeToggle } from "./DarkModeToggle";
import ProtectedRoute from "./ProtectedRoute";
import PremiumUpgradePopup from "./PremiumUpgradePopup";
import PremiumContent from "./PremiumContent";
import { fetchUserProfile, isPremiumUser, getPremiumStatus } from "@/lib/api";

const categories = [
  "All",
  "Technology",
  "Sports",
  "Politics",
  "Business",
  "Entertainment",
  "Science",
  "Health",
];

const mockArticles = [
  {
    id: 1,
    title: "Next-Generation Gaming Console Features Advanced Graphics",
    category: "Technology",
    author: "Alex Rivera",
    source: "Gaming Weekly",
    image:
      "https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?w=400&h=250&fit=crop",
    publishedAt: "6 hours ago",
    readTime: "4 min read",
  },
  {
    id: 2,
    title: "Championship Finals Set New Viewership Records Worldwide",
    category: "Sports",
    author: "Mike Chen",
    source: "Sports Network",
    image:
      "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=400&h=250&fit=crop",
    publishedAt: "4 hours ago",
    readTime: "3 min read",
  },
  {
    id: 3,
    title: "Revolutionary AI Technology Transforms Healthcare Industry",
    category: "Technology",
    author: "Sarah Johnson",
    source: "Tech Today",
    image:
      "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=250&fit=crop",
    publishedAt: "2 hours ago",
    readTime: "5 min read",
  },
  {
    id: 4,
    title: "Global Summit Addresses Climate Change Policy Framework",
    category: "Politics",
    author: "Emma Watson",
    source: "News Central",
    image:
      "https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?w=400&h=250&fit=crop",
    publishedAt: "8 hours ago",
    readTime: "6 min read",
  },
  {
    id: 5,
    title: "Market Analysis: Tech Stocks Show Strong Growth Potential",
    category: "Business",
    author: "David Kim",
    source: "Business Today",
    image:
      "https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=400&h=250&fit=crop",
    publishedAt: "12 hours ago",
    readTime: "7 min read",
  },
];

function HomePage({ onNavigate, isLoggedIn, isDarkMode, onToggleDarkMode }) {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [isAuthed, setIsAuthed] = useState(false);
  const [showPremiumPopup, setShowPremiumPopup] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const [profileLoading, setProfileLoading] = useState(false);

  // Use the same authentication logic as Navbar
  useEffect(() => {
    const checkToken = () => {
      const token = typeof window !== "undefined" ? localStorage.getItem("authToken") : null;
      setIsAuthed(Boolean(token && token.trim()));
    };
    checkToken();
    const onStorage = (e) => {
      if (e.key === "authToken") {
        checkToken();
      }
    };
    window.addEventListener("storage", onStorage);
    window.addEventListener("focus", checkToken);
    window.addEventListener("authchange", checkToken);
    const intervalId = window.setInterval(checkToken, 1000);
    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("focus", checkToken);
      window.removeEventListener("authchange", checkToken);
      window.clearInterval(intervalId);
    };
  }, []);

  // Fetch user profile when authenticated
  useEffect(() => {
    const loadProfile = async () => {
      if (isAuthed) {
        setProfileLoading(true);
        try {
          const profile = await fetchUserProfile();
          setUserProfile(profile);
        } catch (error) {
          console.error("Error loading profile:", error);
        } finally {
          setProfileLoading(false);
        }
      } else {
        setUserProfile(null);
      }
    };
    loadProfile();
  }, [isAuthed]);

  const filteredArticles =
    selectedCategory === "All"
      ? mockArticles
      : mockArticles.filter((article) => article.category === selectedCategory);

      const router = useRouter();
  return (

    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto px-4 py-4 space-y-4">

        {isAuthed && getPremiumStatus(userProfile) === "NONE" && (
          <div className="bg-gradient-to-br from-yellow-400 via-yellow-500 to-yellow-700 p-4 rounded-xl text-white shadow-inner flex-shrink-0 w-full lg:w-auto">
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

        {isAuthed && getPremiumStatus(userProfile) === "PENDING" && (
          <div className="bg-gradient-to-br from-blue-400 via-blue-500 to-blue-700 p-4 rounded-xl text-white shadow-inner flex-shrink-0 w-full lg:w-auto">
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

        {isAuthed && getPremiumStatus(userProfile) === "PREMIUM" && (
          <div className="bg-gradient-to-br from-yellow-400 via-yellow-500 to-yellow-700 p-4 rounded-xl text-white shadow-inner flex-shrink-0 w-full lg:w-auto">
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

        {/* Title Section */}
        <div className="mb-4">
          <h2 className={`text-2xl md:text-3xl font-bold mb-2 ${
            getPremiumStatus(userProfile) === "PREMIUM" 
              ? "text-yellow-600" 
              : "text-foreground"
          }`}>Discover News</h2>
          <p className="text-muted-foreground text-sm md:text-base">
            Stay updated with the latest stories from around the world
          </p>
        </div>

        {/* Category Filter */}
        <div className="mb-4">
          <div className="flex overflow-x-auto gap-3 pb-2 scrollbar-hide">
            {categories.map((category) => (
              <Badge
                key={category}
                variant={selectedCategory === category ? "default" : "secondary"}
                className={`cursor-pointer whitespace-nowrap px-4 py-2 text-sm font-medium rounded-full transition-all duration-200 flex-shrink-0 ${
                  selectedCategory === category
                    ? getPremiumStatus(userProfile) === "PREMIUM"
                      ? "bg-yellow-600 text-white hover:bg-yellow-700 shadow-moderate"
                      : "bg-newzia-primary text-white hover:bg-newzia-primary-hover shadow-moderate"
                    : "bg-muted text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                }`}
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </Badge>
            ))}
          </div>
        </div>

        {/* Article Cards */}
        <div className="space-y-4">
          {filteredArticles.map((article, index) => (
            <Card
              key={article.id}
              className={`
              overflow-hidden border-border hover:border-newzia-primary/30 transition-all duration-300 
              hover:shadow-strong group cursor-pointer bg-card/50 backdrop-blur-sm
              ${index === 0 ? "md:col-span-2" : ""}
            `}
            >
              <div className="flex flex-col md:flex-row">
                {/* Image */}
                <div className="w-full md:w-1/3 h-48 md:h-auto relative overflow-hidden">
                  <ImageWithFallback
                    src={article.image}
                    alt={article.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>

                {/* Content */}
                <div className="flex-1 p-4 md:p-6">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Badge
                        variant="secondary"
                        className={`text-xs font-semibold px-2 py-1 rounded-full ${
                          getPremiumStatus(userProfile) === "PREMIUM"
                            ? "text-yellow-600 bg-yellow-50 dark:bg-yellow-900/30"
                            : "text-newzia-primary bg-newzia-blue-50 dark:bg-newzia-blue-900/30"
                        }`}
                      >
                        {article.category}
                      </Badge>
                      <div className="flex items-center text-xs text-muted-foreground space-x-2">
                        <Clock className="h-3 w-3" />
                        <span>{article.readTime}</span>
                      </div>
                    </div>

                    <h3 className={`text-lg md:text-xl font-bold leading-tight transition-colors duration-200 line-clamp-2 ${
                      getPremiumStatus(userProfile) === "PREMIUM"
                        ? "text-foreground group-hover:text-yellow-600"
                        : "text-foreground group-hover:text-newzia-primary"
                    }`}>
                      {article.title}
                    </h3>

                    <div className="flex items-center justify-between pt-3 border-t border-border">
                      <div className="flex items-center text-xs md:text-sm text-muted-foreground space-x-2 md:space-x-3">
                        <span className="font-medium">{article.author}</span>
                        <span>•</span>
                        <span>{article.source}</span>
                        <span>•</span>
                        <span>{article.publishedAt}</span>
                      </div>
                      <ExternalLink className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
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
    </div>
  );
}

export default HomePage;