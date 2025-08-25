"use client";

import React from "react";
import { ArrowLeft, Hourglass, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

function ComingSoon() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-background">
      {/* Back Button */}
      <div className="absolute top-4 left-4">
        <button
          onClick={() => router.push("/profile")}
          className="p-2 text-muted-foreground hover:text-newzia-primary transition-colors rounded-lg hover:bg-accent"
        >
          <ArrowLeft size={22} />
        </button>
      </div>

      {/* Content Card */}
      <Card className="w-full max-w-lg text-center p-10 shadow-strong border-border bg-card/60 backdrop-blur-md rounded-2xl">
        <div className="flex justify-center mb-6">
          <div className="h-20 w-20 rounded-full bg-gradient-to-br from-newzia-primary to-newzia-primary-hover flex items-center justify-center text-white shadow-moderate">
            <Hourglass className="h-10 w-10 animate-pulse" />
          </div>
        </div>

        <h1 className="text-3xl font-bold text-foreground mb-3 flex items-center justify-center gap-2">
          Coming Soon <Sparkles className="text-newzia-primary h-6 w-6" />
        </h1>

        <p className="text-muted-foreground text-lg leading-relaxed mb-6">
          We’re crafting something exciting ✨ <br />
          Stay tuned for updates — this feature is almost ready!
        </p>

        <Button
          onClick={() => router.push("/")}
          className="bg-newzia-primary hover:bg-newzia-primary-hover text-white px-6 py-3 rounded-xl font-medium shadow-subtle hover:shadow-moderate transition-all duration-200"
        >
          Back to Home
        </Button>
      </Card>
    </div>
  );
}

export default ComingSoon;
