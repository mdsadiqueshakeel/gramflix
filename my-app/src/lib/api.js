
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

