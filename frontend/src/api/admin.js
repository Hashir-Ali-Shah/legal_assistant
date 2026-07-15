/**
 * Admin API Service
 * Handles all admin-level analytics and health check requests
 */

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api";

// Admin credentials from environment variables
const ADMIN_USERNAME = import.meta.env.VITE_ADMIN_USERNAME || "Hazard";
const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || "Hazard";
const ADMIN_AUTH = "Basic " + btoa(`${ADMIN_USERNAME}:${ADMIN_PASSWORD}`);

/**
 * Get system health metrics
 * @returns {Promise<Object>}
 */
export async function getSystemHealth() {
  const response = await fetch(`${API_BASE_URL}/health/system/`, {
    method: "GET",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch system health");
  }

  return response.json();
}

/**
 * Get all request metrics (admin only)
 * @param {Object} params - Query parameters
 * @param {number} params.limit - Number of requests to fetch
 * @param {number} params.hours - Hours to look back
 * @param {string} params.endpoint - Filter by endpoint
 * @param {string} params.status - Filter by status code
 * @returns {Promise<Object>}
 */
export async function getRequestMetrics(params = {}) {
  const queryParams = new URLSearchParams({
    limit: params.limit || 100,
    hours: params.hours || 24,
    ...(params.endpoint && { endpoint: params.endpoint }),
    ...(params.status && { status: params.status }),
  }).toString();

  const response = await fetch(
    `${API_BASE_URL}/analytics/admin/metrics/requests?${queryParams}`,
    {
      method: "GET",
      headers: {
        Authorization: ADMIN_AUTH,
      },
    },
  );

  if (!response.ok) {
    throw new Error("Failed to fetch request metrics");
  }

  return response.json();
}

/**
 * Get error logs (admin only)
 * @param {Object} params - Query parameters
 * @param {number} params.limit - Number of errors to fetch
 * @param {number} params.hours - Hours to look back
 * @returns {Promise<Object>}
 */
export async function getErrorLogs(params = {}) {
  const queryParams = new URLSearchParams({
    limit: params.limit || 50,
    hours: params.hours || 24,
  }).toString();

  const response = await fetch(
    `${API_BASE_URL}/analytics/admin/metrics/errors?${queryParams}`,
    {
      method: "GET",
      headers: {
        Authorization: ADMIN_AUTH,
      },
    },
  );

  if (!response.ok) {
    throw new Error("Failed to fetch error logs");
  }

  return response.json();
}

/**
 * Get application-wide token usage (admin only)
 * @param {number} days - Number of days to look back
 * @returns {Promise<Object>}
 */
export async function getAdminTokenUsage(days = 7) {
  const response = await fetch(
    `${API_BASE_URL}/analytics/admin/usage?days=${days}`,
    {
      method: "GET",
      headers: {
        Authorization: ADMIN_AUTH,
      },
    },
  );

  if (!response.ok) {
    throw new Error("Failed to fetch token usage");
  }

  return response.json();
}

/**
 * Verify admin credentials
 * @param {string} username
 * @param {string} password
 * @returns {boolean}
 */
export function verifyAdminCredentials(username, password) {
  const adminUsername = import.meta.env.VITE_ADMIN_USERNAME || "Hazard";
  const adminPassword = import.meta.env.VITE_ADMIN_PASSWORD || "Hazard";
  return username === adminUsername && password === adminPassword;
}

export const adminAPI = {
  getSystemHealth,
  getRequestMetrics,
  getErrorLogs,
  getAdminTokenUsage,
  verifyAdminCredentials,
};

export default adminAPI;
