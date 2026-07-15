/**
 * Chat API Service for Lexa Backend
 * Handles HTTP requests to the Django backend for chat and voice
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
 * Send a chat message with optional file uploads
 * Uses session_id for authenticated users, falls back to chat_id for legacy
 * @param {string} sessionId - Unique chat session ID (UUID)
 * @param {string} message - User message
 * @param {File[]} files - Optional array of files to upload
 * @param {function} onToken - Callback for each streamed token
 * @returns {Promise<string>} - Complete response text
 */
export async function sendChatMessage(
  sessionId,
  message,
  files = [],
  onToken = null,
) {
  const formData = new FormData();
  // Use session_id for new API, but also send chat_id for backward compatibility
  formData.append("session_id", sessionId);
  formData.append("chat_id", sessionId); // Legacy support
  formData.append("message", message);

  // Append files if provided
  files.forEach((file) => {
    formData.append("files", file);
  });

  // Build request options with auth token if available
  const token = getAuthToken();
  const headers = {};
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  // Debug logging
  console.log("[API] Sending chat message:", {
    sessionId,
    message,
    filesCount: files.length,
    url: `${API_BASE_URL}/chat/`,
    authenticated: !!token,
  });

  try {
    const response = await fetch(`${API_BASE_URL}/chat/`, {
      method: "POST",
      headers,
      body: formData,
    });

    console.log("[API] Response status:", response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("[API] Error response:", errorText);
      throw new Error(
        `HTTP error! status: ${response.status}, message: ${errorText}`,
      );
    }

    // Handle streaming response
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let fullText = "";

    while (true) {
      const { done, value } = await reader.read();

      if (done) break;

      const chunk = decoder.decode(value, { stream: true });
      fullText += chunk;

      // Call token callback if provided
      if (onToken) {
        onToken(chunk);
      }
    }

    return fullText;
  } catch (error) {
    console.error("Error sending chat message:", error);
    throw error;
  }
}

/**
 * Check backend health
 * @returns {Promise<boolean>}
 */
export async function checkBackendHealth() {
  try {
    const response = await fetch(`${API_BASE_URL}/`);
    return response.ok;
  } catch (error) {
    console.error("Backend health check failed:", error);
    return false;
  }
}

/**
 * Silent warmup ping — pre-loads the ChatBot singleton (embedding model + Pinecone)
 * so the user's first message has zero cold-start delay.
 * Fire-and-forget: errors are swallowed intentionally.
 */
export async function warmupBackend() {
  try {
    const token = getAuthToken();
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    await fetch(`${API_BASE_URL}/chat/warmup/`, { method: "GET", headers });
    console.log("[Warmup] Backend warmed up successfully.");
  } catch {
    // Non-fatal — warmup is best-effort only
  }
}


/**
 * Send audio blob to backend for transcription only.
 * Returns plain text transcription string (not a streamed LLM response).
 * @param {string} sessionId
 * @param {Blob} audioBlob
 * @returns {Promise<string>}
 */
export async function transcribeAudio(sessionId, audioBlob) {
  const token = getAuthToken();
  const headers = token ? { Authorization: `Bearer ${token}` } : {};

  const formData = new FormData();
  formData.append("session_id", sessionId || "anonymous");
  formData.append("audio", audioBlob, "recording.webm");

  console.log("[API] Sending audio for transcription, size:", audioBlob.size);

  const response = await fetch(`${API_BASE_URL}/voice/transcribe/`, {
    method: "POST",
    headers,
    body: formData,
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Transcription failed: ${response.status} ${err}`);
  }

  const data = await response.json();
  console.log("[API] Transcription result:", data.transcription);
  return data.transcription || "";
}


/**
 * Validate file type and size
 * @param {File} file
 * @returns {object} - { valid: boolean, error: string }
 */
export function validateFile(file) {
  const allowedTypes = [
    "application/pdf",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/msword",
    "text/plain",
  ];

  const allowedExtensions = [".pdf", ".docx", ".doc", ".txt"];
  const maxSize = 10 * 1024 * 1024; // 10MB

  // Check file type
  const extension = "." + file.name.split(".").pop().toLowerCase();
  if (
    !allowedTypes.includes(file.type) &&
    !allowedExtensions.includes(extension)
  ) {
    return {
      valid: false,
      error: "Only PDF, DOCX, and TXT files are allowed",
    };
  }

  // Check file size
  if (file.size > maxSize) {
    return {
      valid: false,
      error: "File size must be less than 10MB",
    };
  }

  return { valid: true, error: null };
}

/**
 * Send a voice message (audio file) for transcription and response
 * @param {string} chatId - Unique chat session ID
 * @param {Blob} audioBlob - Audio blob from recording
 * @param {function} onToken - Callback for each streamed token
 * @returns {Promise<string>} - Complete response text
 */
export async function sendVoiceMessage(chatId, audioBlob, onToken = null) {
  const formData = new FormData();
  formData.append("chat_id", chatId);
  formData.append("audio", audioBlob, "recording.webm");

  console.log("[API] Sending voice message:", {
    chatId,
    audioBlobSize: audioBlob.size,
    url: `${API_BASE_URL}/voice/`,
  });

  try {
    const response = await fetch(`${API_BASE_URL}/voice/`, {
      method: "POST",
      body: formData,
    });

    console.log("[API] Voice response status:", response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("[API] Voice error response:", errorText);
      throw new Error(
        `HTTP error! status: ${response.status}, message: ${errorText}`,
      );
    }

    // Handle streaming response (same as chat)
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let fullText = "";

    while (true) {
      const { done, value } = await reader.read();

      if (done) break;

      const chunk = decoder.decode(value, { stream: true });
      fullText += chunk;

      // Call token callback if provided
      if (onToken) {
        onToken(chunk);
      }
    }

    return fullText;
  } catch (error) {
    console.error("Error sending voice message:", error);
    throw error;
  }
}
