/**
 * Auth API Service
 * Handles authentication requests to the Django backend
 */

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api";

/**
 * Sign up a new user
 * @param {string} name - User's full name
 * @param {string} email - User's email
 * @param {string} password - User's password
 * @returns {Promise<{user: object, token: string}>}
 */
export async function signup(name, email, password) {
  const response = await fetch(`${API_BASE_URL}/auth/signup/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name, email, password }),
  });

  const data = await response.json();
  console.log("[Auth API] Signup response:", response.status, data);

  if (!response.ok) {
    // Extract the most relevant error message
    console.log("[Auth API] Signup errors:", data.errors);
    const errorMessage =
      data.error ||
      data.errors?.name ||
      data.errors?.email ||
      data.errors?.password ||
      "Signup failed";
    console.log("[Auth API] Extracted error:", errorMessage);
    throw new Error(errorMessage);
  }

  return data;
}

/**
 * Log in an existing user
 * @param {string} email - User's email
 * @param {string} password - User's password
 * @returns {Promise<{user: object, token: string}>}
 */
export async function login(email, password) {
  const response = await fetch(`${API_BASE_URL}/auth/login/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });
  console.log(response);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Login failed");
  }

  return data;
}

/**
 * Log out the current user
 * @param {string} token - Auth token
 * @returns {Promise<void>}
 */
export async function logout(token) {
  await fetch(`${API_BASE_URL}/auth/logout/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
}

/**
 * Get current user profile
 * @param {string} token - Auth token
 * @returns {Promise<{user: object}>}
 */
export async function getMe(token) {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/me/`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      // Throw an object with status and message
      throw {
        status: response.status,
        message: data.error || "Failed to get user",
      };
    }

    return data;
  } catch (error) {
    // If it's already our custom error, rethrow it
    if (error.status) throw error;

    // If it's a network error (fetch failed), throw with status 0 or 503
    console.error("[Auth API] Network error in getMe:", error);
    throw {
      status: 0,
      message: "Network error checking session",
    };
  }
}

/**
 * Auth API object for convenience
 */
export const authAPI = {
  signup,
  login,
  logout,
  getMe,
};

export default authAPI;
