/**
 * LocalStorage utility functions
 */

const STORAGE_KEYS = {
  USER: "lawbot_user",
  TOKEN: "lawbot_token",
  CHAT_ID: "lawbot_chat_id",
  CHAT_HISTORY: "lawbot_chat_history",
  PREFERENCES: "lawbot_preferences",
};

/**
 * Get item from localStorage with JSON parsing
 * @param {string} key
 * @param {*} defaultValue
 * @returns {*}
 */
export function getItem(key, defaultValue = null) {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error("Error reading from localStorage:", error);
    return defaultValue;
  }
}

/**
 * Set item in localStorage with JSON stringification
 * @param {string} key
 * @param {*} value
 */
export function setItem(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error("Error writing to localStorage:", error);
  }
}

/**
 * Remove item from localStorage
 * @param {string} key
 */
export function removeItem(key) {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error("Error removing from localStorage:", error);
  }
}

/**
 * Clear all localStorage
 */
export function clearAll() {
  try {
    localStorage.clear();
  } catch (error) {
    console.error("Error clearing localStorage:", error);
  }
}

// User management
export const user = {
  get: () => getItem(STORAGE_KEYS.USER),
  set: (userData) => setItem(STORAGE_KEYS.USER, userData),
  remove: () => removeItem(STORAGE_KEYS.USER),
};

// Auth token management
export const token = {
  get: () => getItem(STORAGE_KEYS.TOKEN),
  set: (tokenValue) => setItem(STORAGE_KEYS.TOKEN, tokenValue),
  remove: () => removeItem(STORAGE_KEYS.TOKEN),
};

// Chat ID management
export const chatId = {
  get: () => getItem(STORAGE_KEYS.CHAT_ID),
  set: (id) => setItem(STORAGE_KEYS.CHAT_ID, id),
  remove: () => removeItem(STORAGE_KEYS.CHAT_ID),
  generate: () => {
    const id = crypto.randomUUID();
    setItem(STORAGE_KEYS.CHAT_ID, id);
    return id;
  },
};

// Chat history management
export const chatHistory = {
  get: () => getItem(STORAGE_KEYS.CHAT_HISTORY, []),
  set: (history) => setItem(STORAGE_KEYS.CHAT_HISTORY, history),
  add: (session) => {
    const history = chatHistory.get();
    history.unshift(session); // Add to beginning
    setItem(STORAGE_KEYS.CHAT_HISTORY, history);
  },
  remove: (sessionId) => {
    const history = chatHistory.get();
    const filtered = history.filter((s) => s.id !== sessionId);
    setItem(STORAGE_KEYS.CHAT_HISTORY, filtered);
  },
  clear: () => setItem(STORAGE_KEYS.CHAT_HISTORY, []),
};

// Preferences management
export const preferences = {
  get: () =>
    getItem(STORAGE_KEYS.PREFERENCES, {
      theme: "light",
      voiceEnabled: true,
      autoScroll: true,
    }),
  set: (prefs) => setItem(STORAGE_KEYS.PREFERENCES, prefs),
  update: (key, value) => {
    const prefs = preferences.get();
    prefs[key] = value;
    setItem(STORAGE_KEYS.PREFERENCES, prefs);
  },
};
