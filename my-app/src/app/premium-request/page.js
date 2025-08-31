// app/premium-request/page.js

"use client";

import React, { useState } from "react";
import { useSearchParams } from "next/navigation";

const PremiumRequestPage = () => {
  const searchParams = useSearchParams();
  const userEmail = searchParams.get("userEmail") || "N/A";
  const userMobile = searchParams.get("userMobile") || "N/A";
  const approveLink = searchParams.get("approveLink") || "#";
  const rejectLink = searchParams.get("rejectLink") || "#";

  const [isProcessing, setIsProcessing] = useState(false);
  const [status, setStatus] = useState(null); // 'approved', 'rejected', 'alreadyProcessed'

  const handleActionClick = async (type) => {
    if (isProcessing || status) return;

    setIsProcessing(true);
    const url = type === "approve" ? approveLink : rejectLink;

    try {
      const response = await fetch(url, { method: "POST" });

      if (response.status === 409) {
        setStatus("alreadyProcessed");
        return;
      }
      if (!response.ok) throw new Error(`Failed to ${type} request`);

      setStatus(type);
    } catch (error) {
      console.error(error);
      alert(`Error: Could not ${type} premium request.`);
    } finally {
      setIsProcessing(false);
    }
  };

  const getButtonClasses = (btnType) => {
    const baseClasses =
      "py-2 px-5 rounded-md text-base font-bold transition-all duration-200 ease-in-out";
    const colorClasses =
      btnType === "approve"
        ? "bg-green-500 hover:bg-green-600"
        : "bg-red-500 hover:bg-red-600";
    const disabledClasses =
      isProcessing || status ? "opacity-60 cursor-not-allowed" : "cursor-pointer";
    const marginClass = btnType === "approve" ? "mr-4" : "";
    return `${baseClasses} ${colorClasses} ${disabledClasses} ${marginClass}`;
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-xl p-8 text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          Premium Request Notification
        </h2>
        <p className="text-gray-600 text-lg mb-8">
          User <strong className="text-gray-800">{userEmail}</strong> with mobile{" "}
          <strong className="text-gray-800">{userMobile}</strong> requested premium.
        </p>

        {/* Buttons */}
        {!status && (
          <div className="flex justify-center space-x-4">
            <button
              onClick={() => handleActionClick("approve")}
              className={getButtonClasses("approve")}
              disabled={isProcessing}
            >
              {isProcessing && (
                <svg
                  className="animate-spin h-5 w-5 text-white inline-block mr-2"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 
                       5.291A7.962 7.962 0 014 12H0c0 3.042 
                       1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              )}
              Approve
            </button>

            <button
              onClick={() => handleActionClick("reject")}
              className={getButtonClasses("reject")}
              disabled={isProcessing}
            >
              {isProcessing && (
                <svg
                  className="animate-spin h-5 w-5 text-white inline-block mr-2"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 
                       5.373 0 12h4zm2 5.291A7.962 7.962 
                       0 014 12H0c0 3.042 1.135 5.824 3 
                       7.938l3-2.647z"
                  ></path>
                </svg>
              )}
              Reject
            </button>
          </div>
        )}

        {/* Confirmation messages */}
        {status === "approved" && (
          <p className="mt-6 text-green-600 text-xl font-semibold flex items-center justify-center">
            <span className="mr-2">✅</span> Request Approved Successfully!
          </p>
        )}
        {status === "rejected" && (
          <p className="mt-6 text-red-600 text-xl font-semibold flex items-center justify-center">
            <span className="mr-2">❌</span> Request Rejected Successfully!
          </p>
        )}
        {status === "alreadyProcessed" && (
          <p className="mt-6 text-gray-500 text-lg flex items-center justify-center">
            <span className="mr-2">⚠</span> This request has already been processed.
          </p>
        )}
      </div>
    </div>
  );
};

export default PremiumRequestPage;
