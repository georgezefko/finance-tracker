import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';

interface AuthContextType {
    token: string | null;
    userId: string | null;
    email: string | null;
    isLoggedIn: boolean;
    login: (token: string, userId: string) => void;
    logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
    children: ReactNode;
}

// Decode the `email` claim from a JWT payload without an extra dependency.
const getEmailFromToken = (token: string): string | null => {
    try {
        const payload = token.split('.')[1];
        const json = JSON.parse(
            atob(payload.replace(/-/g, '+').replace(/_/g, '/'))
        );
        return typeof json.email === 'string' ? json.email : null;
    } catch {
        return null;
    }
};

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [token, setToken] = useState<string | null>(null);
    const [userId, setUserId] = useState<string | null>(null);
    const [email, setEmail] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        const storedUserId = localStorage.getItem('userId');
        if (storedToken && storedUserId) {
            setToken(storedToken);
            setUserId(storedUserId);
            setEmail(getEmailFromToken(storedToken));
        }
    }, []);

    const login = (newToken: string, newUserId: string) => {
        setToken(newToken);
        setUserId(newUserId);
        setEmail(getEmailFromToken(newToken));
        localStorage.setItem('token', newToken);
        localStorage.setItem('userId', newUserId);
        navigate('/cashflow');
    };

    const logout = () => {
        setToken(null);
        setUserId(null);
        setEmail(null);
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        navigate('/');
    };

    const value = {
        token,
        userId,
        email,
        isLoggedIn: !!token,
        login,
        logout,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}; 