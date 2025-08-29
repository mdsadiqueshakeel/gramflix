"use client";

import React, { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card } from "./ui/card";
import { ArrowLeft, Mail, CheckCircle, AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";

function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) {
      setError("Email is required");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch(`http://localhost:8080/api/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to send reset email");
      }

      setSuccess(true);
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-newzia-blue-50 via-background to-newzia-blue-50 dark:from-newzia-gray-900 dark:via-background dark:to-newzia-gray-900 flex items-center justify-center p-4 mb-[5rem]">
        <Card className="w-full max-w-md p-8 shadow-strong border-0 bg-card/80 backdrop-blur-md">
          <div className="text-center space-y-6">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-newzia-primary to-newzia-primary-hover flex items-center justify-center">
                <span className="text-white font-bold text-lg">G</span>
              </div>
              <h1 className="text-3xl font-bold text-foreground">GramFlix</h1>
            </div>
            
            <div className="flex justify-center">
              <div className="h-16 w-16 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </div>
            
            <div className="space-y-3">
              <h2 className="text-2xl font-bold text-foreground">Check Your Email</h2>
              <p className="text-muted-foreground">
                We've sent a password reset link to <span className="font-medium text-foreground">{email}</span>
              </p>
              <p className="text-sm text-muted-foreground">
                Click the link in the email to reset your password. The link will expire in 1 hour.
              </p>
            </div>

            <div className="space-y-3 pt-4">
              <Button
                onClick={() => router.push("/login")}
                className="w-full h-12 bg-newzia-primary hover:bg-newzia-primary-hover text-white font-medium rounded-xl shadow-moderate transition-all duration-200"
              >
                Back to Login
              </Button>
              
              <Button
                variant="outline"
                onClick={() => {
                  setSuccess(false);
                  setEmail("");
                  setError("");
                }}
                className="w-full h-12 border-2 border-newzia-primary/20 text-newzia-primary hover:bg-newzia-primary hover:text-white font-medium rounded-xl transition-all duration-200"
              >
                Send Another Email
              </Button>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-newzia-blue-50 via-background to-newzia-blue-50 dark:from-newzia-gray-900 dark:via-background dark:to-newzia-gray-900 flex items-center justify-center p-4 mb-[5rem]">
      <Card className="w-full max-w-md p-8 shadow-strong border-0 bg-card/80 backdrop-blur-md">
        <div className="space-y-8">
          {/* Header */}
          <div className="text-center space-y-3">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-newzia-primary to-newzia-primary-hover flex items-center justify-center">
                <span className="text-white font-bold text-lg">G</span>
              </div>
              <h1 className="text-3xl font-bold text-foreground">GramFlix</h1>
            </div>
            <h2 className="text-2xl font-bold text-foreground">Forgot Password?</h2>
            <p className="text-muted-foreground">
              Enter your email address and we'll send you a link to reset your password
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium text-foreground">
                Email Address
              </Label>
              <div className="relative">
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`h-12 pl-12 bg-input-background border-border focus:border-newzia-primary focus:ring-2 focus:ring-newzia-primary/20 rounded-xl ${
                    error ? "border-destructive" : ""
                  }`}
                />
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              </div>
              {error && (
                <div className="flex items-center space-x-2 text-destructive text-sm mt-1">
                  <AlertCircle size={16} />
                  <span>{error}</span>
                </div>
              )}
            </div>

            {/* Submit */}
            <Button
              type="submit"
              disabled={loading}
              className="w-full h-12 bg-newzia-primary hover:bg-newzia-primary-hover text-white font-medium rounded-xl shadow-moderate transition-all duration-200 flex items-center justify-center space-x-2"
            >
              <Mail size={20} />
              <span>{loading ? "Sending..." : "Send Reset Link"}</span>
            </Button>
          </form>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-card text-muted-foreground">
                Remember your password?
              </span>
            </div>
          </div>

          {/* Back to Login */}
          <Button
            variant="outline"
            onClick={() => router.push("/login")}
            className="w-full h-12 border-2 border-newzia-primary/20 text-newzia-primary hover:bg-newzia-primary hover:text-white font-medium rounded-xl transition-all duration-200 flex items-center justify-center space-x-2"
          >
            <ArrowLeft size={20} />
            <span>Back to Login</span>
          </Button>
        </div>
      </Card>
    </div>
  );
}

export default ForgotPasswordPage;
