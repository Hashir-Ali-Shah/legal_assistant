import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { chatHistory as chatHistoryStorage } from '../utils/storage';
import { sessionsAPI } from '../api/sessions';

const ChatContext = createContext(null);

/**
 * Check if user is authenticated
 */
function isAuthenticated() {
    try {
        const token = localStorage.getItem("lawbot_token");
        return !!(token && JSON.parse(token));
    } catch {
        return false;
    }
}

export function ChatProvider({ children }) {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [currentSessionId, setCurrentSessionId] = useState(null);
    const [uploadedFiles, setUploadedFiles] = useState([]);
    // State-based chat history for real-time sidebar updates
    const [chatHistoryState, setChatHistoryState] = useState([]);
    const [sessionsLoaded, setSessionsLoaded] = useState(false);
    // Track auth state to reload sessions when user logs in
    const [authState, setAuthState] = useState(isAuthenticated());

    // Listen for storage changes (login/logout from other tabs or auth context)
    useEffect(() => {
        const checkAuth = () => {
            const newAuthState = isAuthenticated();
            if (newAuthState !== authState) {
                console.log('[ChatContext] Auth state changed:', newAuthState);
                setAuthState(newAuthState);
            }
        };
        
        // Check periodically and on storage events
        window.addEventListener('storage', checkAuth);
        const interval = setInterval(checkAuth, 1000);  // Check every second
        
        return () => {
            window.removeEventListener('storage', checkAuth);
            clearInterval(interval);
        };
    }, [authState]);

    // Load sessions from backend or localStorage when auth changes
    useEffect(() => {
        async function loadSessions() {
            console.log('[ChatContext] loadSessions called, authenticated:', authState);
            if (authState) {
                try {
                    console.log('[ChatContext] Loading sessions from backend...');
                    const data = await sessionsAPI.getSessions();
                    setChatHistoryState(data.sessions || []);
                    console.log('[ChatContext] Loaded sessions:', data.sessions?.length || 0, data.sessions);
                    
                    // Clear localStorage chat history for authenticated users
                    chatHistoryStorage.clear();
                } catch (err) {
                    console.error('[ChatContext] Failed to load sessions from backend:', err);
                    setChatHistoryState([]);
                }
            } else {
                // Unauthenticated: use localStorage
                setChatHistoryState(chatHistoryStorage.get());
            }
            setSessionsLoaded(true);
        }
        loadSessions();
    }, [authState]);

    // Save current chat to history whenever messages change (for unauthenticated users)
    const saveCurrentChatLocally = useCallback(() => {
        if (!isAuthenticated() && messages.length > 0 && currentSessionId) {
            const history = chatHistoryStorage.get();
            const existingIndex = history.findIndex(s => s.id === currentSessionId);

            const session = {
                id: currentSessionId,
                title: messages[0]?.content?.substring(0, 50) || 'New Chat',
                messages: messages,
                updatedAt: new Date().toISOString(),
                createdAt: existingIndex >= 0 ? history[existingIndex].createdAt : new Date().toISOString(),
                messageCount: messages.length,
            };

            if (existingIndex >= 0) {
                history[existingIndex] = session;
            } else {
                history.unshift(session);
            }

            chatHistoryStorage.set(history);
            setChatHistoryState([...history]);
        }
    }, [messages, currentSessionId]);

    // Auto-save when messages change (unauthenticated only)
    useEffect(() => {
        if (messages.length > 0 && !isAuthenticated()) {
            saveCurrentChatLocally();
        }
    }, [messages, saveCurrentChatLocally]);

    const addMessage = (message) => {
        setMessages(prev => [...prev, {
            ...message,
            id: message.id || crypto.randomUUID(),
            timestamp: message.timestamp || new Date().toISOString(),
        }]);
    };

    const updateLastMessage = (updates) => {
        setMessages(prev => {
            const updated = [...prev];
            const lastIndex = updated.length - 1;
            if (lastIndex >= 0) {
                updated[lastIndex] = { ...updated[lastIndex], ...updates };
            }
            return updated;
        });
    };

    const clearMessages = () => {
        setMessages([]);
        setError(null);
        setUploadedFiles([]);
    };

    /**
     * Create a new session in backend (without clearing messages)
     * Used when sending first message to ensure session exists
     */
    const createSession = async (title = 'New Chat') => {
        console.log('[ChatContext] createSession called, authState:', authState);
        if (authState) {
            try {
                console.log('[ChatContext] Creating new session in backend with title:', title);
                const session = await sessionsAPI.createSession(title);
                console.log('[ChatContext] Session created:', session);
                setCurrentSessionId(session.id);
                // Add to local state immediately for sidebar display
                setChatHistoryState(prev => {
                    console.log('[ChatContext] Adding session to history, prev length:', prev.length);
                    return [{
                        id: session.id,
                        title: session.title,
                        created_at: session.created_at,
                        updated_at: session.created_at,
                        message_count: 0,
                    }, ...prev];
                });
                console.log('[ChatContext] Created and added session to sidebar:', session.id);
                return session.id;
            } catch (err) {
                console.error('[ChatContext] Failed to create session:', err);
                setError(err.message);
                // Fallback to local ID
                const localId = crypto.randomUUID();
                setCurrentSessionId(localId);
                return localId;
            }
        } else {
            const newSessionId = crypto.randomUUID();
            setCurrentSessionId(newSessionId);
            return newSessionId;
        }
    };

    /**
     * Start a new chat session (clears current messages)
     * For authenticated users: creates session in backend
     * For unauthenticated: generates local UUID
     */
    const startNewChat = async () => {
        clearMessages();
        setCurrentSessionId(null);  // Clear current session, will create new on first message
        return null;
    };

    /**
     * Load a chat session
     * For authenticated users: loads from backend
     * For unauthenticated: loads from localStorage
     */
    const loadChatSession = async (sessionId) => {
        if (isAuthenticated()) {
            try {
                console.log('[ChatContext] Loading session from backend:', sessionId);
                const session = await sessionsAPI.getSession(sessionId);
                setCurrentSessionId(session.id);
                // Convert backend messages to frontend format
                const formattedMessages = (session.messages || []).map(msg => ({
                    id: msg.id,
                    role: msg.role,
                    content: msg.content,
                    timestamp: msg.timestamp,
                }));
                setMessages(formattedMessages);
                console.log('[ChatContext] Loaded messages:', formattedMessages.length);
            } catch (err) {
                console.error('[ChatContext] Failed to load session:', err);
                setError(err.message);
            }
        } else {
            // Unauthenticated: load from localStorage
            const history = chatHistoryStorage.get();
            const session = history.find(s => s.id === sessionId);
            if (session) {
                setCurrentSessionId(session.id);
                setMessages(session.messages || []);
            }
        }
    };

    /**
     * Delete a chat session
     */
    const deleteChatSession = async (sessionId) => {
        if (isAuthenticated()) {
            try {
                console.log('[ChatContext] Deleting session:', sessionId);
                await sessionsAPI.deleteSession(sessionId);
                setChatHistoryState(prev => prev.filter(s => s.id !== sessionId));
            } catch (err) {
                console.error('[ChatContext] Failed to delete session:', err);
                setError(err.message);
            }
        } else {
            chatHistoryStorage.remove(sessionId);
            setChatHistoryState(prev => prev.filter(s => s.id !== sessionId));
        }

        // If deleting current session, start new chat
        if (sessionId === currentSessionId) {
            await startNewChat();
        }
    };

    /**
     * Refresh sessions from backend (for authenticated users)
     */
    const refreshSessions = async () => {
        if (isAuthenticated()) {
            try {
                const data = await sessionsAPI.getSessions();
                setChatHistoryState(data.sessions || []);
            } catch (err) {
                console.error('[ChatContext] Failed to refresh sessions:', err);
            }
        }
    };

    const getChatHistory = () => {
        return chatHistoryState;
    };

    const addFile = (file) => {
        setUploadedFiles(prev => [...prev, {
            id: crypto.randomUUID(),
            file,
            name: file.name,
            size: file.size,
            type: file.type,
        }]);
    };

    const removeFile = (fileId) => {
        setUploadedFiles(prev => prev.filter(f => f.id !== fileId));
    };

    const clearFiles = () => {
        setUploadedFiles([]);
    };

    const value = {
        messages,
        loading,
        error,
        currentSessionId,
        uploadedFiles,
        sessionsLoaded,
        addMessage,
        updateLastMessage,
        clearMessages,
        startNewChat,
        createSession,
        loadChatSession,
        deleteChatSession,
        getChatHistory,
        refreshSessions,
        addFile,
        removeFile,
        clearFiles,
        setLoading,
        setError,
        setCurrentSessionId,
    };

    return (
        <ChatContext.Provider value={value}>
            {children}
        </ChatContext.Provider>
    );
}

export function useChat() {
    const context = useContext(ChatContext);
    if (!context) {
        throw new Error('useChat must be used within ChatProvider');
    }
    return context;
}
