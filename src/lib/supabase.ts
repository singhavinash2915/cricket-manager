import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://zrrmpaatydhlkntfpcmw.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpycm1wYWF0eWRobGtudGZwY213Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjcyMTIzNDcsImV4cCI6MjA4Mjc4ODM0N30.kHot4i6MNPjt2neNzJ_tMAplJi_9CiYNgFzAzmEgdeg';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Super admin password for managing all clubs
export const SUPER_ADMIN_PASSWORD = 'superadmin@2026';
