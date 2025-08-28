
export async function fetchUserProfile() {
  try {
    const token = typeof window !== "undefined" ? localStorage.getItem("authToken") : null;
    if (!token) {
      return null;
    }

    const res = await fetch("http://localhost:8080/api/auth/profile", {
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

