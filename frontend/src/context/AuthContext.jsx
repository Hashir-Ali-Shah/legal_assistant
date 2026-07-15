import { createContext, useContext, useState, useEffect } from 'react';
import { user as userStorage, token as tokenStorage, chatId as chatIdStorage } from '../utils/storage';
import { login as apiLogin, signup as apiSignup, logout as apiLogout, getMe } from '../api/auth';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [chatId, setChatId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [authToken, setAuthToken] = useState(null);

    useEffect(() => {
        console.log('[Auth] AuthProvider mounted, initializing...');
        // Load user, token, and chat ID from localStorage on mount
        const initAuth = async () => {
            const storedUser = userStorage.get();
            const storedToken = tokenStorage.get();
            const storedChatId = chatIdStorage.get();

            console.log('[Auth] Storage check:', { 
                hasToken: !!storedToken, 
                hasUser: !!storedUser, 
                hasChatId: !!storedChatId 
            });

            if (storedToken && storedUser) {
                // Skip API verification for admin bypass token
                if (storedToken === 'admin-token') {
                    console.log('[Auth] Admin token detected, skipping API verification');
                    setUser(storedUser);
                    setAuthToken(storedToken);
                } else {
                    console.log('[Auth] Verifying stored token...');
                    // Verify token is still valid
                    try {
                        console.log('[Auth] Calling getMe API...');
                        const { user: verifiedUser } = await getMe(storedToken);
                        console.log('[Auth] Token verified for user:', verifiedUser.email);
                        setUser(verifiedUser);
                        setAuthToken(storedToken);
                        userStorage.set(verifiedUser);
                    } catch (error) {
                        console.error('[Auth] Token verification failed:', error);
                        
                        // Only clear auth if token is explicitly invalid (401)
                        // If it's a network error (status 0) or server error (500), keep the token
                        if (error.status === 401) {
                            console.log('[Auth] 401 Unauthorized - Clearing invalid session');
                            userStorage.remove();
                            tokenStorage.remove();
                            setUser(null);
                            setAuthToken(null);
                        } else {
                            console.log(`[Auth] Server error (${error.status}) - Keeping session for retry`);
                        }
                    }
                }
            } else {
                console.log('[Auth] No valid session found in storage');
            }

            setChatId(storedChatId || chatIdStorage.generate());
            setLoading(false);
            console.log('[Auth] Initialization complete, loading set to false');
        };

        initAuth();
    }, []);

    const login = async (email, password) => {
        // Call backend API for login
        const { user: userData, token } = await apiLogin(email, password);

        // Store in localStorage
        userStorage.set(userData);
        tokenStorage.set(token);
        
        // Update state
        setUser(userData);
        setAuthToken(token);

        // Generate new chat ID for this session
        const newChatId = chatIdStorage.generate();
        setChatId(newChatId);

        console.log('[Auth] Login successful:', userData.email);
        return userData;
    };

    const adminLogin = () => {
        const adminUser = {
            id: 'admin',
            username: 'Admin',
            email: 'admin',
        };
        const fakeToken = 'admin-token';

        userStorage.set(adminUser);
        tokenStorage.set(fakeToken);

        setUser(adminUser);
        setAuthToken(fakeToken);

        const newChatId = chatIdStorage.generate();
        setChatId(newChatId);

        console.log('[Auth] Admin login successful');
        return adminUser;
    };

    const signup = async (name, email, password) => {
        // Call backend API for signup
        const { user: userData, token } = await apiSignup(name, email, password);

        // Store in localStorage
        userStorage.set(userData);
        tokenStorage.set(token);
        
        // Update state
        setUser(userData);
        setAuthToken(token);

        // Generate chat ID
        const newChatId = chatIdStorage.generate();
        setChatId(newChatId);

        console.log('[Auth] Signup successful:', userData.email);
        return userData;
    };

    const logout = async () => {
        // Call backend logout (optional, for logging)
        if (authToken) {
            try {
                await apiLogout(authToken);
            } catch (error) {
                // Ignore errors, still clear local state
            }
        }

        // Clear localStorage
        userStorage.remove();
        tokenStorage.remove();
        chatIdStorage.remove();
        
        // Update state
        setUser(null);
        setAuthToken(null);
        setChatId(null);

        console.log('[Auth] Logout successful');
    };

    const isAuthenticated = !!user && !!authToken;

    const value = {
        user,
        chatId,
        loading,
        authToken,
        login,
        adminLogin,
        signup,
        logout,
        isAuthenticated,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
}
