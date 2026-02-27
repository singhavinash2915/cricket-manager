import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://hbxpvongrzijfghpjafw.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhieHB2b25ncnppamZnaHBqYWZ3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIxODM2NTUsImV4cCI6MjA4Nzc1OTY1NX0.I3xjhqSggPvoaH7RKi9VFgoifIje_wtHO8ZYeOnwlwA';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Super admin password for managing all clubs
export const SUPER_ADMIN_PASSWORD = 'superadmin@2026';
