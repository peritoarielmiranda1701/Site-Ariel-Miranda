import React, { createContext, useContext, useState, useEffect } from 'react';
import { directus } from '../lib/directus';
import { authentication, rest, readMe } from '@directus/sdk';

interface AuthContextType {
    isAuthenticated: boolean;
    login: (email: string, pass: string) => Promise<boolean>;
    logout: () => void;
    user: any | null;
    loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
    isAuthenticated: false,
    login: async () => false,
    logout: () => { },
    user: null,
    loading: true,
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Initial check (if token exists in localStorage, Directus SDK might handle it or we check validity)
    useEffect(() => {
        const checkAuth = async () => {
            // Basic check: try to fetch self
            try {
                // Try to get token from storage
                const token = localStorage.getItem('directus_token');

                if (token) {
                    // Set token for the SDK
                    await directus.setToken(token);

                    // Verify if it's still valid by fetching user info
                    const me = await directus.request(readMe());
                    setUser(me);
                    setIsAuthenticated(true);
                }
            } catch (e) {
                // If invalid (e.g. expired), clear storage
                console.log("Session expired or invalid");
                localStorage.removeItem('directus_token');
                // Ensure client clears the bad token so public requests can succeed
                await directus.setToken(null);
                setIsAuthenticated(false);
            } finally {
                setLoading(false);
            }
        };
        checkAuth();
    }, []);

    const login = async (email: string, pass: string) => {
        try {
            const response = await directus.login({ email, password: pass });

            // Save access token to persist session
            if (response && response.access_token) {
                localStorage.setItem('directus_token', response.access_token);

                // Fetch user data immediately
                const me = await directus.request(readMe());
                setUser(me);
                setIsAuthenticated(true);
                return true;
            }
            return false;

        } catch (e) {
            console.error(e);
            return false;
        }
    };

    const logout = async () => {
        try {
            await directus.logout();
        } catch (e) { console.error(e) }

        localStorage.removeItem('directus_token');
        setUser(null);
        setIsAuthenticated(false);
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, login, logout, user, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
