"use client";

import React, { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card } from "./ui/card";
import { Eye, EyeOff, LogIn } from "lucide-react";
import { useRouter } from "next/navigation";

function LoginPage({ onNavigate, onLogin }) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    emailOrMobile: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.emailOrMobile.trim())
      newErrors.emailOrMobile = "Email or Mobile is required";
    if (!formData.password.trim())
      newErrors.password = "Password is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      const res = await fetch("http://localhost:8080/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Invalid credentials");

      const data = await res.json();
      if (data.token) {
        localStorage.setItem("authToken", data.token);
        // Dispatch custom event for navbar refresh
        window.dispatchEvent(new Event("loginSuccess"));
      }

      if (onLogin) onLogin();
      if (onNavigate) onNavigate("/profile");
      else router.push("/");
    } catch (err) {
      setErrors({ password: err.message || "Login failed" });
    } finally {
      setLoading(false);
    }
  };

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
            <h2 className="text-2xl font-bold text-foreground">Welcome Back!</h2>
            <p className="text-muted-foreground">
              Sign in to continue to your account
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-6">
            {/* Email/Mobile */}
            <div className="space-y-2">
              <Label htmlFor="emailOrMobile" className="text-sm font-medium text-foreground">
                Email or Mobile
              </Label>
              <Input
                id="emailOrMobile"
                type="text"
                placeholder="Enter your email or mobile"
                value={formData.emailOrMobile}
                onChange={(e) => handleInputChange("emailOrMobile", e.target.value)}
                className={`h-12 bg-input-background border-border focus:border-newzia-primary focus:ring-2 focus:ring-newzia-primary/20 rounded-xl ${
                  errors.emailOrMobile ? "border-destructive" : ""
                }`}
              />
              {errors.emailOrMobile && (
                <p className="text-destructive text-sm mt-1">{errors.emailOrMobile}</p>
              )}
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium text-foreground">
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={(e) => handleInputChange("password", e.target.value)}
                  className={`h-12 pr-12 bg-input-background border-border focus:border-newzia-primary focus:ring-2 focus:ring-newzia-primary/20 rounded-xl ${
                    errors.password ? "border-destructive" : ""
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.password && (
                <p className="text-destructive text-sm mt-1">{errors.password}</p>
              )}
            </div>

            {/* Remember + Forgot Password */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="remember"
                  className="rounded border-border text-newzia-primary focus:ring-newzia-primary/20"
                />
                <Label
                  htmlFor="remember"
                  className="text-sm text-muted-foreground cursor-pointer"
                >
                  Remember me
                </Label>
              </div>
              <button
                type="button"
                className="text-sm text-newzia-primary hover:text-newzia-primary-hover font-medium hover:underline transition-colors"
              >
                Forgot Password?
              </button>
            </div>

            {/* Submit */}
            <Button
              type="submit"
              disabled={loading}
              className="w-full h-12 bg-newzia-primary hover:bg-newzia-primary-hover text-white font-medium rounded-xl shadow-moderate transition-all duration-200 flex items-center justify-center space-x-2"
            >
              <LogIn size={20} />
              <span>{loading ? "Signing In..." : "Sign In"}</span>
            </Button>
          </form>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-card text-muted-foreground">
                New to Newzia?
              </span>
            </div>
          </div>

          {/* Create Account */}
          <Button
            variant="outline"
            onClick={() => router.push("/signup")}
            className="w-full h-12 border-2 border-newzia-primary/20 text-newzia-primary hover:bg-newzia-primary hover:text-white font-medium rounded-xl transition-all duration-200"
          >
            Create Account
          </Button>
        </div>
      </Card>
    </div>
  );
}

export default LoginPage;
