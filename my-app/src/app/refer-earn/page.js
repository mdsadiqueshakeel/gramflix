import React from "react";
import ReferEarnPage from "@/components/ReferEarnPage";
import ProtectedRoute from "@/components/ProtectedRoute";

function ReferEarn() {
  return (
    <>
      <ProtectedRoute>
        <ReferEarnPage />
      </ProtectedRoute>
    </>
  );
}

export default ReferEarn;
