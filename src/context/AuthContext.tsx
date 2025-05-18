import React, { createContext, useContext, useState, ReactNode } from 'react';
import { User } from '../types';
import { dogService } from '../api/dogService';

interface AuthContextType {
    user: User | null;
    login: (name: string, email: string) => Promise<void>;
    logout: () => Promise<void>;
    isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);

    const login = async (name: string, email: string) => {
        await dogService.login(name, email);
        setUser({ name, email });
    };

    const logout = async () => {
        await dogService.logout();
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}; 