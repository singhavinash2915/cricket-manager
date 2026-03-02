import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://hbxpvongrzijfghpjafw.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhieHB2b25ncnppamZnaHBqYWZ3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIxODM2NTUsImV4cCI6MjA4Nzc1OTY1NX0.I3xjhqSggPvoaH7RKi9VFgoifIje_wtHO8ZYeOnwlwA';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const host = req.headers.host || '';

  // Extract subdomain: "punewarriors.cricmates.in" → "punewarriors"
  let subdomain: string | null = null;
  const parts = host.split('.');
  if (parts.length > 2) {
    const sub = parts[0];
    if (!['www', 'app', 'admin', 'api'].includes(sub)) {
      subdomain = sub;
    }
  }

  // Default CricMates branding
  let name = 'CricMates';
  let shortName = 'CricMates';
  let themeColor = '#10b981';
  const backgroundColor = '#f9fafb';
  let icons: Array<{ src: string; sizes: string; type: string; purpose?: string }> = [
    { src: '/icons/icon-192x192.png', sizes: '192x192', type: 'image/png' },
    { src: '/icons/icon-512x512.png', sizes: '512x512', type: 'image/png' },
    { src: '/icons/maskable-icon-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
  ];

  // If subdomain exists, look up club data for per-club branding
  if (subdomain) {
    const { data: club } = await supabase
      .from('clubs')
      .select('name, short_name, logo_url, primary_color')
      .ilike('short_name', subdomain)
      .single();

    if (club) {
      name = club.name;
      shortName = club.short_name;
      themeColor = club.primary_color || '#10b981';

      // If club has a custom logo, use it as primary icon
      if (club.logo_url) {
        icons = [
          { src: club.logo_url, sizes: '192x192', type: 'image/png' },
          { src: club.logo_url, sizes: '512x512', type: 'image/png' },
          ...icons,
        ];
      }
    }
  }

  const manifest = {
    name,
    short_name: shortName,
    description: `${name} - Cricket Club Management`,
    start_url: '/',
    display: 'standalone',
    orientation: 'portrait',
    theme_color: themeColor,
    background_color: backgroundColor,
    icons,
    categories: ['sports'],
  };

  res.setHeader('Content-Type', 'application/manifest+json');
  res.setHeader('Cache-Control', 'public, max-age=3600');
  res.status(200).json(manifest);
}
