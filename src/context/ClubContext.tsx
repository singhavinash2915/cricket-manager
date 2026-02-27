import type { ReactNode } from 'react';
import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import type { Club } from '../types';

interface ClubContextType {
  club: Club | null;
  loading: boolean;
  error: string | null;
  selectClub: (clubId: string) => void;
  clearClub: () => void;
  refreshClub: () => Promise<void>;
}

const ClubContext = createContext<ClubContextType | undefined>(undefined);

// Generate CSS variables for the club's primary color
function generateColorVariables(hex: string): Record<string, string> {
  // Convert hex to RGB
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);

  // Generate shades (simple approximation)
  const lighten = (r: number, g: number, b: number, amount: number) => ({
    r: Math.min(255, Math.round(r + (255 - r) * amount)),
    g: Math.min(255, Math.round(g + (255 - g) * amount)),
    b: Math.min(255, Math.round(b + (255 - b) * amount)),
  });

  const darken = (r: number, g: number, b: number, amount: number) => ({
    r: Math.max(0, Math.round(r * (1 - amount))),
    g: Math.max(0, Math.round(g * (1 - amount))),
    b: Math.max(0, Math.round(b * (1 - amount))),
  });

  const toHex = (c: { r: number; g: number; b: number }) =>
    `#${c.r.toString(16).padStart(2, '0')}${c.g.toString(16).padStart(2, '0')}${c.b.toString(16).padStart(2, '0')}`;

  return {
    '--color-primary-50': toHex(lighten(r, g, b, 0.95)),
    '--color-primary-100': toHex(lighten(r, g, b, 0.85)),
    '--color-primary-200': toHex(lighten(r, g, b, 0.7)),
    '--color-primary-300': toHex(lighten(r, g, b, 0.5)),
    '--color-primary-400': toHex(lighten(r, g, b, 0.25)),
    '--color-primary-500': hex,
    '--color-primary-600': toHex(darken(r, g, b, 0.15)),
    '--color-primary-700': toHex(darken(r, g, b, 0.3)),
    '--color-primary-800': toHex(darken(r, g, b, 0.45)),
    '--color-primary-900': toHex(darken(r, g, b, 0.6)),
  };
}

// Detect subdomain from the current hostname
// e.g., punewarriors.cricmates.in → "punewarriors"
function getSubdomain(): string | null {
  const hostname = window.location.hostname;
  // Skip for localhost, IP addresses, and GitHub Pages
  if (hostname === 'localhost' || /^\d+\.\d+\.\d+\.\d+$/.test(hostname) || hostname.endsWith('.github.io')) {
    return null;
  }
  const parts = hostname.split('.');
  // e.g., ["punewarriors", "cricmates", "in"] → subdomain = "punewarriors"
  // e.g., ["cricmates", "in"] → no subdomain (main domain)
  if (parts.length > 2) {
    const sub = parts[0];
    // Ignore common non-club subdomains
    if (['www', 'app', 'admin', 'api'].includes(sub)) return null;
    return sub;
  }
  return null;
}

export function ClubProvider({ children }: { children: ReactNode }) {
  const [club, setClub] = useState<Club | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadClub = useCallback(async (clubId: string) => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('clubs')
        .select('*')
        .eq('id', clubId)
        .single();

      if (fetchError) throw fetchError;
      if (!data) throw new Error('Club not found');

      // Auto-expire if subscription has passed its expiry date
      if (
        (data.subscription_status === 'active' || data.subscription_status === 'trial') &&
        data.subscription_expires_at
      ) {
        const expiresAt = new Date(data.subscription_expires_at);
        if (expiresAt < new Date()) {
          await supabase
            .from('clubs')
            .update({ subscription_status: 'expired' })
            .eq('id', clubId);
          data.subscription_status = 'expired';
        }
      }

      setClub(data);

      // Apply color variables to document root
      const colorVars = generateColorVariables(data.primary_color || '#10b981');
      const root = document.documentElement;
      Object.entries(colorVars).forEach(([key, value]) => {
        root.style.setProperty(key, value);
      });

      // Update page title
      document.title = data.name;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load club');
      setClub(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const selectClub = useCallback((clubId: string) => {
    localStorage.setItem('cm-club-id', clubId);
    loadClub(clubId);
  }, [loadClub]);

  const clearClub = useCallback(() => {
    localStorage.removeItem('cm-club-id');
    setClub(null);
    document.title = 'CricMates';
  }, []);

  const refreshClub = useCallback(async () => {
    if (club) {
      await loadClub(club.id);
    }
  }, [club, loadClub]);

  // On mount, check subdomain → URL query param → localStorage
  useEffect(() => {
    // 1. Check for subdomain (e.g., punewarriors.cricmates.in)
    const subdomain = getSubdomain();
    if (subdomain) {
      // Look up club by short_name matching the subdomain
      supabase
        .from('clubs')
        .select('id')
        .ilike('short_name', subdomain)
        .single()
        .then(({ data }) => {
          if (data) {
            localStorage.setItem('cm-club-id', data.id);
            loadClub(data.id);
          } else {
            setLoading(false);
          }
        });
      return;
    }

    // 2. Check URL query param (for SuperAdmin eye button)
    const params = new URLSearchParams(window.location.search);
    const urlClubId = params.get('club');
    if (urlClubId) {
      localStorage.setItem('cm-club-id', urlClubId);
      window.history.replaceState({}, '', window.location.pathname);
      loadClub(urlClubId);
      return;
    }

    // 3. Check localStorage
    const storedClubId = localStorage.getItem('cm-club-id');
    if (storedClubId) {
      loadClub(storedClubId);
    } else {
      setLoading(false);
    }
  }, [loadClub]);

  return (
    <ClubContext.Provider value={{ club, loading, error, selectClub, clearClub, refreshClub }}>
      {children}
    </ClubContext.Provider>
  );
}

export function useClub() {
  const context = useContext(ClubContext);
  if (context === undefined) {
    throw new Error('useClub must be used within a ClubProvider');
  }
  return context;
}
