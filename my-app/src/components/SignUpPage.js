"use client";

import React, { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card } from "./ui/card";
import { Eye, EyeOff, CheckCircle } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL;


// interface SignUpPageProps {
//   onNavigate: (page: string) => void
// }

function SignUpPage({ onNavigate }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    referCode: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showOTP, setShowOTP] = useState(false);
  const [otp, setOtp] = useState("");
  const [errors, setErrors] = useState({});
  const [initLoading, setInitLoading] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);
  const [serverError, setServerError] = useState("");

  // Prefill referral code from URL param `referralId`
  React.useEffect(() => {
    const referral = searchParams?.get("referralId");
    if (referral) {
      setFormData((prev) => ({ ...prev, referCode: referral }));
      if (errors.referCode) {
        setErrors((prev) => ({ ...prev, referCode: "" }));
      }
    }
  }, [searchParams]);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    if (!formData.mobile.trim()) newErrors.mobile = "Mobile number is required";
    if (!formData.referCode.trim())
      newErrors.referCode = "Referral code is required";
    if (!formData.password) newErrors.password = "Password is required";
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setServerError("");
    if (!validateForm()) return;
    try {
      setInitLoading(true);
      const body = {
        name: formData.name,
        email: formData.email,
        mobile: Number(formData.mobile),
        password: formData.password,
        referral: formData.referCode,
      };
      const res = await fetch(`${API_URL}/api/auth/init-register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const json = await res.json().catch(() => null);
      console.log("init-register response:", json);
      if (!res.ok) {
        const errMsg =
          (json && (json.message || json.error)) ||
          "Failed to start registration";
        throw new Error(errMsg);
      }
      setShowOTP(true);
    } catch (err) {
      setServerError(err.message || "Something went wrong");
    } finally {
      setInitLoading(false);
    }
  };

  const handleOTPVerification = async (e) => {
    e.preventDefault();
    setServerError("");
    if (otp.length !== 6) return;
    try {
      setOtpLoading(true);
      // Step 2: verify OTP
      const verifyRes = await fetch(`${API_URL}/api/otp/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ to: Number(formData.mobile), code: otp }),
      });
      if (!verifyRes.ok) {
        const err = await verifyRes.json().catch(() => ({}));
        throw new Error(err.message || "Invalid or expired OTP");
      }

      // Step 3: complete registration
      const completeBody = {
        name: formData.name,
        email: formData.email,
        mobile: Number(formData.mobile),
        password: formData.password,
        referral: formData.referCode,
      };
      const completeRes = await fetch(
        `${API_URL}/api/auth/complete-register`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(completeBody),
        }
      );
      if (!completeRes.ok) {
        const err = await completeRes.json().catch(() => ({}));
        throw new Error(err.message || "Failed to complete registration");
      }

      if (onNavigate) onNavigate("/login");
      else router.push("/login");
    } catch (err) {
      setServerError(err.message || "Something went wrong");
    } finally {
      setOtpLoading(false);
    }
  };

  if (showOTP) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-newzia-blue-50 via-background to-newzia-blue-50 dark:from-newzia-gray-900 dark:via-background dark:to-newzia-gray-900 flex items-center justify-center p-4">
        <Card className="w-full max-w-md p-8 shadow-strong border-0 bg-card/80 backdrop-blur-md">
          <div className="space-y-8">
            <div className="text-center space-y-3">
              <div className="mx-auto w-16 h-16 bg-newzia-primary rounded-full flex items-center justify-center mb-4">
                <CheckCircle className="h-8 w-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-foreground">
                Verify Your Phone
              </h2>
              <p className="text-muted-foreground">
                We've sent a 6-digit verification code to your mobile number
              </p>
            </div>

            <form onSubmit={handleOTPVerification} className="space-y-6">
              {serverError && (
                <p className="text-destructive text-sm text-center">
                  {serverError}
                </p>
              )}
              <div className="space-y-2">
                <Label
                  htmlFor="otp"
                  className="text-sm font-medium text-foreground"
                >
                  Verification Code
                </Label>
                <Input
                  id="otp"
                  type="text"
                  placeholder="Enter 6-digit code"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  maxLength={6}
                  className="h-12 text-center text-lg font-mono tracking-widest bg-input-background border-border focus:border-newzia-primary focus:ring-2 focus:ring-newzia-primary/20 rounded-xl"
                />
              </div>

              <Button
                type="submit"
                className="w-full h-12 bg-newzia-primary hover:bg-newzia-primary-hover text-white font-medium rounded-xl shadow-moderate transition-all duration-200"
                disabled={otp.length !== 6 || otpLoading}
              >
                {otpLoading ? "Verifying..." : "Verify & Continue"}
              </Button>
            </form>

            <p className="text-center text-sm text-muted-foreground">
              Didn't receive the code?{" "}
              <button
                type="button"
                onClick={() => handleSignUp(new Event("submit"))}
                className="text-newzia-primary hover:text-newzia-primary-hover font-medium hover:underline transition-colors"
              >
                Resend Code
              </button>
            </p>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-newzia-blue-50 via-background to-newzia-blue-50 dark:from-newzia-gray-900 dark:via-background dark:to-newzia-gray-900 flex items-center justify-center p-4 mb-[5rem]">
      <Card className="w-full max-w-md p-8 shadow-strong border-0 bg-card/80 backdrop-blur-md">
        <div className="space-y-8">
          <div className="text-center space-y-3">
            <div className="flex items-center justify-center space-x-2 mb-4">
              {/* <button
            onClick={() => router.push("/")}
            className="p-2 -ml-2 text-muted-foreground hover:text-newzia-primary transition-colors rounded-lg hover:bg-accent"
          >
            <ArrowLeft size={20} />
          </button> */}
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-newzia-primary to-newzia-primary-hover flex items-center justify-center">
                <span className="text-white font-bold text-lg">G</span>
              </div>
              <h1 className="text-3xl font-bold text-foreground">GramFlix</h1>
            </div>
            <h2 className="text-xl font-semibold text-foreground">
              Create Your Account
            </h2>
            <p className="text-muted-foreground">
              Join thousands of readers worldwide
            </p>
          </div>

          <form onSubmit={handleSignUp} className="space-y-5">
            {serverError && (
              <p className="text-destructive text-sm">{serverError}</p>
            )}
            <div className="space-y-2">
              <Label
                htmlFor="name"
                className="text-sm font-medium text-foreground"
              >
                Full Name
              </Label>
              <Input
                id="name"
                type="text"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                className={`h-12 bg-input-background border-border focus:border-newzia-primary focus:ring-2 focus:ring-newzia-primary/20 rounded-xl ${
                  errors.name ? "border-destructive" : ""
                }`}
              />
              {errors.name && (
                <p className="text-destructive text-sm mt-1">{errors.name}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="email"
                className="text-sm font-medium text-foreground"
              >
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={
                  (e) =>
                    handleInputChange("email", e.target.value.toLowerCase()) // 🔥 force lowercase
                }
                className={`h-12 bg-input-background border-border focus:border-newzia-primary focus:ring-2 focus:ring-newzia-primary/20 rounded-xl ${
                  errors.email ? "border-destructive" : ""
                }`}
              />
              {errors.email && (
                <p className="text-destructive text-sm mt-1">{errors.email}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="mobile"
                className="text-sm font-medium text-foreground"
              >
                Mobile Number
              </Label>
              <Input
                id="mobile"
                type="tel"
                placeholder="Enter your mobile number"
                value={formData.mobile}
                onChange={(e) => handleInputChange("mobile", e.target.value)}
                className={`h-12 bg-input-background border-border focus:border-newzia-primary focus:ring-2 focus:ring-newzia-primary/20 rounded-xl ${
                  errors.mobile ? "border-destructive" : ""
                }`}
              />
              {errors.mobile && (
                <p className="text-destructive text-sm mt-1">{errors.mobile}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="referCode"
                className="text-sm font-medium text-foreground"
              >
                Referral Code
              </Label>
              <Input
                id="referCode"
                type="text"
                placeholder="Enter referral code"
                value={formData.referCode}
                onChange={(e) => handleInputChange("referCode", e.target.value)}
                required
                className={`h-12 bg-input-background border-border focus:border-newzia-primary focus:ring-2 focus:ring-newzia-primary/20 rounded-xl ${
                  errors.referCode ? "border-destructive" : ""
                }`}
              />
              {errors.referCode && (
                <p className="text-destructive text-sm mt-1">
                  {errors.referCode}
                </p>
              )}
            </div>

          <div className="space-y-2">
  <Label htmlFor="password" className="text-sm font-medium text-foreground">
    Password
  </Label>
  <div className="relative">
    <Input
      id="password"
      type={showPassword ? "text" : "password"}
      placeholder="Create a strong password"
      value={formData.password}
      onChange={(e) => {
        const value = e.target.value;
        handleInputChange("password", value);

        // 🔥 Simple password validation (>= 8 chars)
        if (value.length < 8) {
          setErrors((prev) => ({
            ...prev,
            password: "Password must be at least 8 characters long",
          }));
        } else {
          setErrors((prev) => ({ ...prev, password: "" }));
        }
      }}
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

            <div className="space-y-2">
              <Label
                htmlFor="confirmPassword"
                className="text-sm font-medium text-foreground"
              >
                Confirm Password
              </Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={(e) =>
                    handleInputChange("confirmPassword", e.target.value)
                  }
                  className={`h-12 pr-12 bg-input-background border-border focus:border-newzia-primary focus:ring-2 focus:ring-newzia-primary/20 rounded-xl ${
                    errors.confirmPassword ? "border-destructive" : ""
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showConfirmPassword ? (
                    <EyeOff size={20} />
                  ) : (
                    <Eye size={20} />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-destructive text-sm mt-1">
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full h-12 bg-newzia-primary hover:bg-newzia-primary-hover text-white font-medium rounded-xl shadow-moderate transition-all duration-200"
              disabled={initLoading}
            >
              {initLoading ? "Starting..." : "Create Account"}
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <button
              onClick={() => router.push("/login")}
              className="text-newzia-primary hover:text-newzia-primary-hover font-medium hover:underline transition-colors"
            >
              Sign In
            </button>
          </p>
        </div>
      </Card>
    </div>
  );
}

export default SignUpPage;
