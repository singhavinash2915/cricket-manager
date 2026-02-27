import type { ReactNode } from 'react';
import { createContext, useContext, useState, useCallback } from 'react';
import { useClub } from './ClubContext';
import * as bcrypt from 'bcryptjs';

interface AuthContextType {
  isAdmin: boolean;
  login: (password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { club } = useClub();

  const [isAdmin, setIsAdmin] = useState<boolean>(() => {
    if (!club) return false;
    return localStorage.getItem(`cm-admin-${club.id}`) === 'true';
  });

  const login = useCallback(async (password: string): Promise<boolean> => {
    if (!club) return false;

    // Check if password hash looks like bcrypt hash
    const isHashed = club.admin_password_hash.startsWith('$2');

    let isValid = false;
    if (isHashed) {
      isValid = await bcrypt.compare(password, club.admin_password_hash);
    } else {
      // Plain text comparison (for development/initial setup)
      isValid = password === club.admin_password_hash;
    }

    if (isValid) {
      setIsAdmin(true);
      localStorage.setItem(`cm-admin-${club.id}`, 'true');
      return true;
    }
    return false;
  }, [club]);

  const logout = useCallback(() => {
    if (club) {
      localStorage.removeItem(`cm-admin-${club.id}`);
    }
    setIsAdmin(false);
  }, [club]);

  return (
    <AuthContext.Provider value={{ isAdmin, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
