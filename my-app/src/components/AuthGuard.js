"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

function AuthGuard({ children }) {
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("authToken") : null;
      const isAuthenticated = Boolean(token && token.trim());
      
      if (isAuthenticated) {
        // Show alert before redirecting
        alert("You are already logged in! Logout to continue.");
        // If user is already logged in, redirect to home page
        router.replace("/profile");
      }
    } finally {
      setIsChecking(false);
    }
  }, [router]);

  if (isChecking) {
    return null;
  }

  return <>{children}</>;
}

export default AuthGuard;
