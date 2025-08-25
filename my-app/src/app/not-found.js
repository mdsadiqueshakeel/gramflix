"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Home, Search, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <Card className="p-8 max-w-md w-full text-center shadow-moderate border-border">
        <div className="space-y-6">
          {/* 404 Icon */}
          <div className="mx-auto w-24 h-24 bg-gradient-to-br from-newzia-primary to-newzia-primary-hover rounded-full flex items-center justify-center">
            <span className="text-white text-3xl font-bold">404</span>
          </div>

          {/* Content */}
          <div className="space-y-3">
            <h1 className="text-2xl font-bold text-foreground">Page Not Found</h1>
            <p className="text-muted-foreground leading-relaxed">
              Oops! The page you're looking for doesn't exist. It might have been moved, deleted, or you entered the wrong URL.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              onClick={() => router.push("/")}
              className="flex-1 bg-newzia-primary hover:bg-newzia-primary-hover text-white font-medium rounded-xl transition-all duration-200"
            >
              <Home size={16} className="mr-2" />
              Go Home
            </Button>
            <Button
              variant="outline"
              onClick={() => router.back()}
              className="flex-1 border-border text-foreground hover:bg-accent font-medium rounded-xl transition-all duration-200"
            >
              <ArrowLeft size={16} className="mr-2" />
              Go Back
            </Button>
          </div>

          {/* Search Suggestion */}
          <div className="pt-4 border-t border-border">
            <p className="text-sm text-muted-foreground mb-3">
              Can't find what you're looking for?
            </p>
            <Button
              variant="ghost"
              onClick={() => router.push("/coming-soon")}
              className="text-newzia-primary hover:text-newzia-primary-hover hover:bg-accent font-medium"
            >
              <Search size={16} className="mr-2" />
              Search Articles
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
