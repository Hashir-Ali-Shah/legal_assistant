/**
 * Analytics API client
 * Handles requests to /api/analytics/ endpoints
 */

const API_BASE = "http://localhost:8000/api/analytics";

/**
 * Get auth token from localStorage
 */
const getAuthToken = () => {
  try {
    const token = localStorage.getItem("lawbot_token");
    return token ? JSON.parse(token) : null;
  } catch {
    return null;
  }
};

/**
 * Get auth headers for requests
 */
const getAuthHeaders = () => {
  const token = getAuthToken();
  const headers = {
    "Content-Type": "application/json",
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  return headers;
};

/**
 * Get user's usage summary
 * @param {number} days - Number of days to look back
 */
export const getUsageSummary = async (days = 30) => {
  const response = await fetch(`${API_BASE}/usage/?days=${days}`, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error("Failed to fetch usage summary");
  }

  return response.json();
};

/**
 * Get daily usage breakdown
 * @param {number} days - Number of days to look back
 */
export const getDailyUsage = async (days = 30) => {
  const response = await fetch(`${API_BASE}/usage/daily/?days=${days}`, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error("Failed to fetch daily usage");
  }

  return response.json();
};

/**
 * Get per-session usage breakdown
 * @param {number} limit - Max sessions to return
 */
export const getSessionUsage = async (limit = 20) => {
  const response = await fetch(`${API_BASE}/usage/sessions/?limit=${limit}`, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error("Failed to fetch session usage");
  }

  return response.json();
};
