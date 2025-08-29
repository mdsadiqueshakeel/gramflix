
export async function fetchUserProfile() {
  try {
    const token = typeof window !== "undefined" ? localStorage.getItem("authToken") : null;
    if (!token) {
      return null;
    }

    const res = await fetch(`http://localhost:8080/api/auth/profile`, {
      headers: {
        "Authorization": `Bearer ${token}`,
      },
      cache: "no-store",
    });
    
    if (!res.ok) throw new Error("Failed to load profile");
    const json = await res.json();
    return json && (json.data || json);
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return null;
  }
}

export function isPremiumUser(userData) {
  return userData && (
    userData.userType === "PREMIUM" || 
    userData.premiumRequestStatus === "APPROVED"
  );
}

export function getPremiumStatus(userData) {
  if (!userData) return "NONE";
  
  if (userData.userType === "PREMIUM" || userData.premiumRequestStatus === "APPROVED") {
    return "PREMIUM";
  } else if (userData.premiumRequestStatus === "PENDING") {
    return "PENDING";
  } else {
    return "NONE";
  }
}

export async function fetchWalletSummary() {
  try {
    const token = typeof window !== "undefined" ? localStorage.getItem("authToken") : null;
    if (!token) {
      return null;
    }

    const res = await fetch(`http://localhost:8080/api/auth/wallet`, {
      headers: {
        "Authorization": `Bearer ${token}`,
      },
      cache: "no-store",
    });

    if (!res.ok) throw new Error("Failed to load wallet summary");
    const json = await res.json();
    return json && (json.data || json);
  } catch (error) {
    console.error("Error fetching wallet summary:", error);
    return null;
  }
}

export async function fetchChildrenSummary() {
  try {
    const token = typeof window !== "undefined" ? localStorage.getItem("authToken") : null;
    if (!token) {
      return null;
    }

    const res = await fetch(`http://localhost:8080/api/auth/children`, {
      headers: {
        "Authorization": `Bearer ${token}`,
      },
      cache: "no-store",
    });

    if (!res.ok) throw new Error("Failed to load children summary");
    const json = await res.json();
    return json && (json.data || json);
  } catch (error) {
    console.error("Error fetching children summary:", error);
    return null;
  }
}

export async function updateUserProfile(payload) {
  try {
    const token = typeof window !== "undefined" ? localStorage.getItem("authToken") : null;
    if (!token) {
      throw new Error("Not authenticated");
    }

    const res = await fetch(`http://localhost:8080/api/auth/profile`, {
      method: "PUT",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
      cache: "no-store",
    });

    if (!res.ok) throw new Error("Failed to update profile");
    const json = await res.json();
    return json && (json.data || json);
  } catch (error) {
    console.error("Error updating profile:", error);
    throw error;
  }
}

export async function requestPremium() {
  try {
    const token = typeof window !== "undefined" ? localStorage.getItem("authToken") : null;
    if (!token) {
      throw new Error("Authentication required");
    }

    // First fetch the user profile to get the mobile number
    const profile = await fetchUserProfile();
    if (!profile) {
      throw new Error("Failed to load user profile");
    }

    const mobile = profile.mobile || profile.mobileNumber || profile.phone || profile.phoneNumber;
    if (!mobile) {
      throw new Error("Mobile number not found in profile");
    }

    const url = `http://localhost:8080/api/premium-request?mobile=${encodeURIComponent(mobile)}`;

    const res = await fetch(url, {
      method: "PATCH",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    if (!res.ok) {
      if (res.status === 0) {
        throw new Error("CORS error: Backend not accessible. Please check if the backend is running and CORS is configured.");
      }
      throw new Error(`Failed to submit premium request: ${res.status} ${res.statusText}`);
    }
    
    const json = await res.json().catch(() => ({}));
    return json && (json.data || json) || { success: true };
  } catch (error) {
    console.error("Error requesting premium:", error);
    throw error;
  }
}

// Function to poll for premium status updates
export async function pollPremiumStatus(maxAttempts = 3, intervalMs = 2000) {
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      await new Promise(resolve => setTimeout(resolve, intervalMs));
      const profile = await fetchUserProfile();
      
      if (profile && profile.premiumRequestStatus === "PENDING") {
        // Still pending, continue polling
        continue;
      } else if (profile && profile.premiumRequestStatus === "APPROVED") {
        // Approved! Return the updated profile
        return profile;
      } else if (profile && profile.premiumRequestStatus === "REJECTED") {
        // Rejected, return the profile
        return profile;
      }
    } catch (error) {
      console.error(`Polling attempt ${attempt} failed:`, error);
      if (attempt === maxAttempts) {
        throw error;
      }
    }
  }
  
  // If we reach here, return the current profile after max attempts
  return await fetchUserProfile();
}

// Function to refresh user profile
export async function refreshUserProfile() {
  try {
    const profile = await fetchUserProfile();
    return profile;
  } catch (error) {
    console.error("Error refreshing user profile:", error);
    return null;
  }
}

// Function to submit withdrawal request
export async function requestWithdraw(amount) {
  try {
    const token = typeof window !== "undefined" ? localStorage.getItem("authToken") : null;
    if (!token) {
      throw new Error("Authentication required");
    }

    const url = `http://localhost:8080/api/withdraw/${amount}`;

    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      const errorMessage = errorData.message || `Failed to submit withdrawal request: ${res.status} ${res.statusText}`;
      throw new Error(errorMessage);
    }
    
    const json = await res.json().catch(() => ({}));
    return json && (json.data || json) || { success: true };
  } catch (error) {
    console.error("Error requesting withdrawal:", error);
    throw error;
  }
}

export const fetchWithdrawRequests = async () => {
  try {
    const response = await fetch(`http://localhost:8080/api/withdraw-requests`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${typeof window !== "undefined" ? localStorage.getItem("authToken") : null}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch withdrawal requests');
    }

    const result = await response.json();
    return result.data || [];
  } catch (error) {
    console.error('Error fetching withdrawal requests:', error);
    throw error;
  }
};

