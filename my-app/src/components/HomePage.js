"use client"; // add this if you're using Next.js app router

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { Card } from "./ui/card";
import { Home, Search, Bookmark, User, Clock, ExternalLink } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { DarkModeToggle } from "./DarkModeToggle";

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

  const filteredArticles =
    selectedCategory === "All"
      ? mockArticles
      : mockArticles.filter((article) => article.category === selectedCategory);

      const router = useRouter();
  return (

    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto px-4 py-4 space-y-4">
        {/* Title Section */}
        <div className="mb-4">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">Discover News</h2>
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
                    ? "bg-newzia-primary text-white hover:bg-newzia-primary-hover shadow-moderate"
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
                        className="text-xs font-semibold text-newzia-primary bg-newzia-blue-50 dark:bg-newzia-blue-900/30 px-2 py-1 rounded-full"
                      >
                        {article.category}
                      </Badge>
                      <div className="flex items-center text-xs text-muted-foreground space-x-2">
                        <Clock className="h-3 w-3" />
                        <span>{article.readTime}</span>
                      </div>
                    </div>

                    <h3 className="text-lg md:text-xl font-bold text-foreground leading-tight group-hover:text-newzia-primary transition-colors duration-200 line-clamp-2">
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
    </div>
  );
}

export default HomePage;