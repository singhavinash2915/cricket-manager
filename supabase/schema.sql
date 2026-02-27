-- ============================================================================
-- Cricket Manager - Multi-Tenant Database Schema
-- ============================================================================
-- Complete schema for a multi-tenant cricket club management application.
-- Run this in Supabase SQL Editor to set up the database from scratch.
-- ============================================================================

-- ============================================================================
-- 1. CLUBS
-- ============================================================================
CREATE TABLE IF NOT EXISTS clubs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  short_name TEXT UNIQUE NOT NULL,
  logo_url TEXT,
  primary_color TEXT DEFAULT '#10b981',
  phone TEXT,
  email TEXT,
  instagram_url TEXT,
  location TEXT,
  founded_year INT,
  season TEXT,
  team_a_name TEXT DEFAULT 'Team A',
  team_b_name TEXT DEFAULT 'Team B',
  admin_password_hash TEXT NOT NULL,
  razorpay_key_id TEXT,
  razorpay_key_secret_encrypted TEXT,
  payment_link TEXT,
  subscription_status TEXT DEFAULT 'trial' CHECK (subscription_status IN ('active', 'trial', 'expired')),
  subscription_expires_at TIMESTAMPTZ,
  setup_fee_paid BOOLEAN DEFAULT FALSE,
  about_story TEXT,
  about_mission TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- 2. MEMBERS
-- ============================================================================
CREATE TABLE IF NOT EXISTS members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  club_id UUID NOT NULL REFERENCES clubs(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  phone TEXT,
  email TEXT,
  join_date DATE DEFAULT CURRENT_DATE,
  birthday DATE,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  balance DECIMAL(10,2) DEFAULT 0,
  matches_played INT DEFAULT 0,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_members_club_id ON members(club_id);
CREATE INDEX IF NOT EXISTS idx_members_status ON members(status);

-- ============================================================================
-- 3. MATCHES
-- ============================================================================
-- For internal matches, winning_team uses 'team_a'/'team_b' (not hardcoded
-- team names) since team names are dynamic per club.
CREATE TABLE IF NOT EXISTS matches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  club_id UUID NOT NULL REFERENCES clubs(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  venue TEXT NOT NULL,
  opponent TEXT,
  result TEXT DEFAULT 'upcoming' CHECK (result IN ('won', 'lost', 'draw', 'upcoming', 'cancelled')),
  our_score TEXT,
  opponent_score TEXT,
  match_fee DECIMAL(10,2) DEFAULT 0,
  ground_cost DECIMAL(10,2) DEFAULT 0,
  other_expenses DECIMAL(10,2) DEFAULT 0,
  deduct_from_balance BOOLEAN DEFAULT TRUE,
  notes TEXT,
  man_of_match_id UUID REFERENCES members(id) ON DELETE SET NULL,
  match_type TEXT DEFAULT 'external' CHECK (match_type IN ('external', 'internal')),
  winning_team TEXT CHECK (winning_team IN ('team_a', 'team_b')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_matches_club_id ON matches(club_id);
CREATE INDEX IF NOT EXISTS idx_matches_date ON matches(date);
CREATE INDEX IF NOT EXISTS idx_matches_result ON matches(result);

-- ============================================================================
-- 4. MATCH PLAYERS
-- ============================================================================
CREATE TABLE IF NOT EXISTS match_players (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  match_id UUID NOT NULL REFERENCES matches(id) ON DELETE CASCADE,
  member_id UUID NOT NULL REFERENCES members(id) ON DELETE CASCADE,
  fee_paid BOOLEAN DEFAULT FALSE,
  team TEXT CHECK (team IN ('team_a', 'team_b')),
  UNIQUE(match_id, member_id)
);

-- ============================================================================
-- 5. TRANSACTIONS
-- ============================================================================
CREATE TABLE IF NOT EXISTS transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  club_id UUID NOT NULL REFERENCES clubs(id) ON DELETE CASCADE,
  date TIMESTAMPTZ DEFAULT NOW(),
  type TEXT NOT NULL CHECK (type IN ('deposit', 'match_fee', 'expense', 'refund')),
  amount DECIMAL(10,2) NOT NULL,
  member_id UUID REFERENCES members(id) ON DELETE SET NULL,
  match_id UUID REFERENCES matches(id) ON DELETE SET NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_transactions_club_id ON transactions(club_id);
CREATE INDEX IF NOT EXISTS idx_transactions_date ON transactions(date);
CREATE INDEX IF NOT EXISTS idx_transactions_type ON transactions(type);

-- ============================================================================
-- 6. MEMBER REQUESTS
-- ============================================================================
CREATE TABLE IF NOT EXISTS member_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  club_id UUID NOT NULL REFERENCES clubs(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  phone TEXT,
  email TEXT,
  experience TEXT,
  message TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_member_requests_club_id ON member_requests(club_id);
CREATE INDEX IF NOT EXISTS idx_member_requests_status ON member_requests(status);

-- ============================================================================
-- 7. TOURNAMENTS
-- ============================================================================
CREATE TABLE IF NOT EXISTS tournaments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  club_id UUID NOT NULL REFERENCES clubs(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE,
  venue TEXT NOT NULL,
  format TEXT DEFAULT 'T20' CHECK (format IN ('T20', 'ODI', 'T10', 'Tennis Ball', 'Other')),
  status TEXT DEFAULT 'upcoming' CHECK (status IN ('upcoming', 'ongoing', 'completed')),
  total_teams INT,
  entry_fee DECIMAL(10,2) DEFAULT 0,
  prize_money DECIMAL(10,2),
  our_position TEXT,
  result TEXT CHECK (result IN ('winner', 'runner_up', 'semi_finalist', 'quarter_finalist', 'group_stage', 'participated')),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_tournaments_club_id ON tournaments(club_id);

-- ============================================================================
-- 8. TOURNAMENT MATCHES
-- ============================================================================
CREATE TABLE IF NOT EXISTS tournament_matches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tournament_id UUID NOT NULL REFERENCES tournaments(id) ON DELETE CASCADE,
  match_id UUID NOT NULL REFERENCES matches(id) ON DELETE CASCADE,
  stage TEXT DEFAULT 'group' CHECK (stage IN ('group', 'quarter_final', 'semi_final', 'final', 'league')),
  UNIQUE(tournament_id, match_id)
);

-- ============================================================================
-- 9. MATCH PHOTOS
-- ============================================================================
CREATE TABLE IF NOT EXISTS match_photos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  match_id UUID NOT NULL REFERENCES matches(id) ON DELETE CASCADE,
  photo_url TEXT NOT NULL,
  caption TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_match_photos_match_id ON match_photos(match_id);

-- ============================================================================
-- 10. FEEDBACK
-- ============================================================================
CREATE TABLE IF NOT EXISTS feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  club_id UUID NOT NULL REFERENCES clubs(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  message TEXT NOT NULL,
  rating INT CHECK (rating >= 1 AND rating <= 5),
  admin_reply TEXT,
  replied_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_feedback_club_id ON feedback(club_id);

-- ============================================================================
-- 11. PAYMENT ORDERS
-- ============================================================================
CREATE TABLE IF NOT EXISTS payment_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  club_id UUID NOT NULL REFERENCES clubs(id) ON DELETE CASCADE,
  member_id UUID NOT NULL REFERENCES members(id) ON DELETE CASCADE,
  amount DECIMAL(10,2) NOT NULL CHECK (amount > 0),
  razorpay_order_id TEXT UNIQUE,
  razorpay_payment_id TEXT,
  razorpay_signature TEXT,
  status TEXT DEFAULT 'created' CHECK (status IN ('created', 'paid', 'failed')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  paid_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_payment_orders_club_id ON payment_orders(club_id);

-- ============================================================================
-- 12. SUBSCRIPTION ORDERS
-- ============================================================================
CREATE TABLE IF NOT EXISTS subscription_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  club_id UUID NOT NULL REFERENCES clubs(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('setup', 'monthly')),
  amount DECIMAL(10,2) NOT NULL CHECK (amount > 0),
  payment_method TEXT NOT NULL CHECK (payment_method IN ('razorpay', 'manual')),
  razorpay_order_id TEXT UNIQUE,
  razorpay_payment_id TEXT,
  razorpay_signature TEXT,
  status TEXT DEFAULT 'created' CHECK (status IN ('created', 'paid', 'failed')),
  period_start DATE,
  period_end DATE,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  paid_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_subscription_orders_club_id ON subscription_orders(club_id);
CREATE INDEX IF NOT EXISTS idx_subscription_orders_status ON subscription_orders(status);

-- ============================================================================
-- 13. PLATFORM SETTINGS
-- ============================================================================
CREATE TABLE IF NOT EXISTS platform_settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- ROW LEVEL SECURITY
-- ============================================================================
-- RLS is enabled on all tables with public access policies.
-- Authentication is handled client-side via admin password per club.

ALTER TABLE clubs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public_access" ON clubs FOR ALL USING (true);

ALTER TABLE members ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public_access" ON members FOR ALL USING (true);

ALTER TABLE matches ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public_access" ON matches FOR ALL USING (true);

ALTER TABLE match_players ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public_access" ON match_players FOR ALL USING (true);

ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public_access" ON transactions FOR ALL USING (true);

ALTER TABLE member_requests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public_access" ON member_requests FOR ALL USING (true);

ALTER TABLE tournaments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public_access" ON tournaments FOR ALL USING (true);

ALTER TABLE tournament_matches ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public_access" ON tournament_matches FOR ALL USING (true);

ALTER TABLE match_photos ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public_access" ON match_photos FOR ALL USING (true);

ALTER TABLE feedback ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public_access" ON feedback FOR ALL USING (true);

ALTER TABLE payment_orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public_access" ON payment_orders FOR ALL USING (true);

ALTER TABLE subscription_orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public_access" ON subscription_orders FOR ALL USING (true);

ALTER TABLE platform_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public_access" ON platform_settings FOR ALL USING (true);

-- ============================================================================
-- STORAGE BUCKETS
-- ============================================================================

INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true)
ON CONFLICT DO NOTHING;

INSERT INTO storage.buckets (id, name, public)
VALUES ('match-photos', 'match-photos', true)
ON CONFLICT DO NOTHING;

INSERT INTO storage.buckets (id, name, public)
VALUES ('club-logos', 'club-logos', true)
ON CONFLICT DO NOTHING;

-- Storage policies: public read and write for all buckets

-- Avatars bucket policies
CREATE POLICY "avatars_public_read" ON storage.objects
  FOR SELECT USING (bucket_id = 'avatars');

CREATE POLICY "avatars_public_insert" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'avatars');

CREATE POLICY "avatars_public_update" ON storage.objects
  FOR UPDATE USING (bucket_id = 'avatars');

CREATE POLICY "avatars_public_delete" ON storage.objects
  FOR DELETE USING (bucket_id = 'avatars');

-- Match photos bucket policies
CREATE POLICY "match_photos_public_read" ON storage.objects
  FOR SELECT USING (bucket_id = 'match-photos');

CREATE POLICY "match_photos_public_insert" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'match-photos');

CREATE POLICY "match_photos_public_update" ON storage.objects
  FOR UPDATE USING (bucket_id = 'match-photos');

CREATE POLICY "match_photos_public_delete" ON storage.objects
  FOR DELETE USING (bucket_id = 'match-photos');

-- Club logos bucket policies
CREATE POLICY "club_logos_public_read" ON storage.objects
  FOR SELECT USING (bucket_id = 'club-logos');

CREATE POLICY "club_logos_public_insert" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'club-logos');

CREATE POLICY "club_logos_public_update" ON storage.objects
  FOR UPDATE USING (bucket_id = 'club-logos');

CREATE POLICY "club_logos_public_delete" ON storage.objects
  FOR DELETE USING (bucket_id = 'club-logos');
