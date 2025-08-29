"use client";

import React, { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card } from "./ui/card";
import { ArrowLeft, Eye, EyeOff, Lock, CheckCircle, AlertCircle, XCircle } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [token, setToken] = useState("");

  useEffect(() => {
    const tokenParam = searchParams.get("token");
    if (!tokenParam) {
      setError("Invalid reset link. Please request a new password reset.");
      return;
    }
    setToken(tokenParam);
  }, [searchParams]);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (error) setError("");
  };

  const validateForm = () => {
    if (!formData.password.trim()) {
      setError("Password is required");
      return false;
    }
    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters long");
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setError("");

    try {
      const res = await fetch(`http://localhost:8080/api/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token,
          password: formData.password,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to reset password");
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
              <h2 className="text-2xl font-bold text-foreground">Password Reset Successfully!</h2>
              <p className="text-muted-foreground">
                Your password has been updated. You can now sign in with your new password.
              </p>
            </div>

            <Button
              onClick={() => router.push("/login")}
              className="w-full h-12 bg-newzia-primary hover:bg-newzia-primary-hover text-white font-medium rounded-xl shadow-moderate transition-all duration-200"
            >
              Sign In Now
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  if (!token) {
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
              <div className="h-16 w-16 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
                <XCircle className="h-8 w-8 text-red-600" />
              </div>
            </div>
            
            <div className="space-y-3">
              <h2 className="text-2xl font-bold text-foreground">Invalid Reset Link</h2>
              <p className="text-muted-foreground">
                {error || "This password reset link is invalid or has expired."}
              </p>
            </div>

            <div className="space-y-3 pt-4">
              <Button
                onClick={() => router.push("/forgot-password")}
                className="w-full h-12 bg-newzia-primary hover:bg-newzia-primary-hover text-white font-medium rounded-xl shadow-moderate transition-all duration-200"
              >
                Request New Reset Link
              </Button>
              
              <Button
                variant="outline"
                onClick={() => router.push("/login")}
                className="w-full h-12 border-2 border-newzia-primary/20 text-newzia-primary hover:bg-newzia-primary hover:text-white font-medium rounded-xl transition-all duration-200"
              >
                Back to Login
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
            <h2 className="text-2xl font-bold text-foreground">Reset Your Password</h2>
            <p className="text-muted-foreground">
              Enter your new password below
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* New Password */}
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium text-foreground">
                New Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your new password"
                  value={formData.password}
                  onChange={(e) => handleInputChange("password", e.target.value)}
                  className={`h-12 pl-12 pr-12 bg-input-background border-border focus:border-newzia-primary focus:ring-2 focus:ring-newzia-primary/20 rounded-xl ${
                    error ? "border-destructive" : ""
                  }`}
                />
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              <p className="text-xs text-muted-foreground">
                Password must be at least 8 characters long
              </p>
            </div>

            {/* Confirm Password */}
            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-sm font-medium text-foreground">
                Confirm New Password
              </Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm your new password"
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                  className={`h-12 pl-12 pr-12 bg-input-background border-border focus:border-newzia-primary focus:ring-2 focus:ring-newzia-primary/20 rounded-xl ${
                    error ? "border-destructive" : ""
                  }`}
                />
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="flex items-center space-x-2 text-destructive text-sm p-3 bg-destructive/10 rounded-lg border border-destructive/20">
                <AlertCircle size={16} />
                <span>{error}</span>
              </div>
            )}

            {/* Submit */}
            <Button
              type="submit"
              disabled={loading}
              className="w-full h-12 bg-newzia-primary hover:bg-newzia-primary-hover text-white font-medium rounded-xl shadow-moderate transition-all duration-200 flex items-center justify-center space-x-2"
            >
              <Lock size={20} />
              <span>{loading ? "Updating..." : "Update Password"}</span>
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

export default ResetPasswordPage;
