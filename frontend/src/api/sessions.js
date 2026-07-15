/**
 * Sessions API Service for Lexa Backend
 * Handles chat session management (CRUD operations)
 */

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api";

/**
 * Get auth token from localStorage
 * @returns {string|null}
 */
function getAuthToken() {
  try {
    const token = localStorage.getItem("lawbot_token");
    return token ? JSON.parse(token) : null;
  } catch {
    return null;
  }
}

/**
 * Get auth headers for API requests
 * @returns {object}
 */
function getAuthHeaders() {
  const token = getAuthToken();
  const headers = {
    "Content-Type": "application/json",
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  return headers;
}

/**
 * Get chat sessions for the authenticated user
 * @param {number} limit - Maximum number of sessions to return (default 10, set to null for all)
 * @returns {Promise<{sessions: Array, total_count: number, max_sessions: number}>}
 */
export async function getSessions(limit = 10) {
  const url = limit ? `${API_BASE_URL}/chat/sessions/?limit=${limit}` : `${API_BASE_URL}/chat/sessions/`;
  const response = await fetch(url, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Failed to get sessions");
  }

  return data;
}

/**
 * Create a new chat session
 * @param {string} title - Optional title for the session
 * @returns {Promise<{id: string, title: string, created_at: string, message_count: number}>}
 */
export async function createSession(title = "New Chat") {
  const response = await fetch(`${API_BASE_URL}/chat/sessions/`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify({ title }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Failed to create session");
  }

  return data;
}

/**
 * Get a session with all its messages
 * @param {string} sessionId - Session UUID
 * @returns {Promise<{id: string, title: string, messages: Array, ...}>}
 */
export async function getSession(sessionId) {
  const response = await fetch(`${API_BASE_URL}/chat/sessions/${sessionId}/`, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Failed to get session");
  }

  return data;
}

/**
 * Delete a chat session
 * @param {string} sessionId - Session UUID
 * @returns {Promise<void>}
 */
export async function deleteSession(sessionId) {
  const response = await fetch(`${API_BASE_URL}/chat/sessions/${sessionId}/`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });

  if (!response.ok && response.status !== 204) {
    const data = await response.json();
    throw new Error(data.error || "Failed to delete session");
  }
}

/**
 * Update session title
 * @param {string} sessionId - Session UUID
 * @param {string} title - New title
 * @returns {Promise<{title: string}>}
 */
export async function updateSessionTitle(sessionId, title) {
  const response = await fetch(`${API_BASE_URL}/chat/sessions/${sessionId}/`, {
    method: "PATCH",
    headers: getAuthHeaders(),
    body: JSON.stringify({ title }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Failed to update title");
  }

  return data;
}

/**
 * Sessions API object for convenience
 */
export const sessionsAPI = {
  getSessions,
  createSession,
  getSession,
  deleteSession,
  updateSessionTitle,
};

export default sessionsAPI;
