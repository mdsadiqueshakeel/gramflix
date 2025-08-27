"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

function ProtectedRoute({ children }) {
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("authToken") : null;
      const authed = Boolean(token && token.trim());
      setIsAuthenticated(authed);
      if (!authed) {
        router.replace("/login");
      }
    } finally {
      setIsChecking(false);
    }
  }, [router]);

  if (isChecking) {
    return null;
  }

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}

export default ProtectedRoute;

