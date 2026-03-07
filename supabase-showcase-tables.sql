-- =============================================
-- Showcase Tournament Tables for CricMates
-- Run this in Supabase SQL Editor
-- =============================================

-- Table 1: showcase_tournaments
CREATE TABLE showcase_tournaments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  short_name TEXT,
  format TEXT NOT NULL DEFAULT 'Tennis Ball',
  overs INTEGER NOT NULL DEFAULT 15,
  venue TEXT NOT NULL,
  venue_address TEXT,
  start_date DATE NOT NULL,
  end_date DATE,
  status TEXT NOT NULL DEFAULT 'upcoming' CHECK (status IN ('upcoming', 'live', 'completed')),
  total_teams INTEGER NOT NULL DEFAULT 5,
  stage_type TEXT NOT NULL DEFAULT 'round_robin' CHECK (stage_type IN ('round_robin', 'knockout', 'group_stage')),
  points_win INTEGER NOT NULL DEFAULT 2,
  points_loss INTEGER NOT NULL DEFAULT 0,
  points_draw INTEGER NOT NULL DEFAULT 1,
  points_nr INTEGER NOT NULL DEFAULT 1,
  banner_image_url TEXT,
  organizer_name TEXT,
  organizer_logo_url TEXT,
  prize_info JSONB,
  rules TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_showcase_tournaments_slug ON showcase_tournaments(slug);

-- Table 2: showcase_teams
CREATE TABLE showcase_teams (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  tournament_id UUID NOT NULL REFERENCES showcase_tournaments(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  short_name TEXT,
  logo_url TEXT,
  primary_color TEXT DEFAULT '#10b981',
  captain_name TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(tournament_id, name)
);

-- Table 3: showcase_fixtures
CREATE TABLE showcase_fixtures (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  tournament_id UUID NOT NULL REFERENCES showcase_tournaments(id) ON DELETE CASCADE,
  match_number INTEGER NOT NULL,
  team_a_id UUID NOT NULL REFERENCES showcase_teams(id) ON DELETE CASCADE,
  team_b_id UUID NOT NULL REFERENCES showcase_teams(id) ON DELETE CASCADE,
  date DATE,
  time TEXT,
  venue TEXT,
  status TEXT NOT NULL DEFAULT 'upcoming' CHECK (status IN ('upcoming', 'live', 'completed', 'no_result', 'cancelled')),
  team_a_score TEXT,
  team_a_runs INTEGER,
  team_a_wickets INTEGER,
  team_a_overs_faced NUMERIC(4,1),
  team_b_score TEXT,
  team_b_runs INTEGER,
  team_b_wickets INTEGER,
  team_b_overs_faced NUMERIC(4,1),
  winner_team_id UUID REFERENCES showcase_teams(id),
  result_summary TEXT,
  toss_winner_team_id UUID REFERENCES showcase_teams(id),
  toss_decision TEXT CHECK (toss_decision IN ('bat', 'bowl')),
  man_of_match_name TEXT,
  man_of_match_team_id UUID REFERENCES showcase_teams(id),
  highlights TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(tournament_id, match_number)
);

-- Table 4: showcase_player_stats (optional, for Top Performers)
CREATE TABLE showcase_player_stats (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  tournament_id UUID NOT NULL REFERENCES showcase_tournaments(id) ON DELETE CASCADE,
  fixture_id UUID NOT NULL REFERENCES showcase_fixtures(id) ON DELETE CASCADE,
  team_id UUID NOT NULL REFERENCES showcase_teams(id) ON DELETE CASCADE,
  player_name TEXT NOT NULL,
  runs_scored INTEGER DEFAULT 0,
  balls_faced INTEGER DEFAULT 0,
  fours INTEGER DEFAULT 0,
  sixes INTEGER DEFAULT 0,
  not_out BOOLEAN DEFAULT FALSE,
  overs_bowled NUMERIC(4,1) DEFAULT 0,
  runs_conceded INTEGER DEFAULT 0,
  wickets_taken INTEGER DEFAULT 0,
  maidens INTEGER DEFAULT 0,
  catches INTEGER DEFAULT 0,
  run_outs INTEGER DEFAULT 0,
  stumpings INTEGER DEFAULT 0,
  is_man_of_match BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- RLS Policies: Public read, anon full access
-- =============================================

ALTER TABLE showcase_tournaments ENABLE ROW LEVEL SECURITY;
ALTER TABLE showcase_teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE showcase_fixtures ENABLE ROW LEVEL SECURITY;
ALTER TABLE showcase_player_stats ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read showcase_tournaments" ON showcase_tournaments FOR SELECT USING (true);
CREATE POLICY "Public read showcase_teams" ON showcase_teams FOR SELECT USING (true);
CREATE POLICY "Public read showcase_fixtures" ON showcase_fixtures FOR SELECT USING (true);
CREATE POLICY "Public read showcase_player_stats" ON showcase_player_stats FOR SELECT USING (true);

CREATE POLICY "Anon manage showcase_tournaments" ON showcase_tournaments FOR ALL USING (true);
CREATE POLICY "Anon manage showcase_teams" ON showcase_teams FOR ALL USING (true);
CREATE POLICY "Anon manage showcase_fixtures" ON showcase_fixtures FOR ALL USING (true);
CREATE POLICY "Anon manage showcase_player_stats" ON showcase_player_stats FOR ALL USING (true);

-- =============================================
-- Seed Data: SCCL Tournament
-- =============================================

INSERT INTO showcase_tournaments (slug, name, short_name, format, overs, venue, venue_address, start_date, status, total_teams, organizer_name)
VALUES ('sccl', 'Sangria Cricket Club Champions League', 'SCCL', 'Tennis Ball', 15, 'Four Star Ground', 'Hinjewadi Phase 2, Pune', '2026-03-15', 'upcoming', 5, 'Sangria Cricket Club');

-- Insert 5 teams (placeholder names — update with real names later)
INSERT INTO showcase_teams (tournament_id, name, short_name, primary_color, sort_order) VALUES
((SELECT id FROM showcase_tournaments WHERE slug = 'sccl'), 'Sangria Strikers', 'SS', '#dc2626', 1),
((SELECT id FROM showcase_tournaments WHERE slug = 'sccl'), 'Hinjewadi Hawks', 'HH', '#2563eb', 2),
((SELECT id FROM showcase_tournaments WHERE slug = 'sccl'), 'Phase 2 Panthers', 'P2P', '#7c3aed', 3),
((SELECT id FROM showcase_tournaments WHERE slug = 'sccl'), 'Wakad Warriors', 'WW', '#ea580c', 4),
((SELECT id FROM showcase_tournaments WHERE slug = 'sccl'), 'Baner Bulls', 'BB', '#059669', 5);

-- Insert 10 round-robin fixtures (5C2 = 10 matches)
-- Round 1
INSERT INTO showcase_fixtures (tournament_id, match_number, team_a_id, team_b_id, date, time) VALUES
((SELECT id FROM showcase_tournaments WHERE slug = 'sccl'), 1,
 (SELECT id FROM showcase_teams WHERE short_name = 'SS' AND tournament_id = (SELECT id FROM showcase_tournaments WHERE slug = 'sccl')),
 (SELECT id FROM showcase_teams WHERE short_name = 'HH' AND tournament_id = (SELECT id FROM showcase_tournaments WHERE slug = 'sccl')),
 '2026-03-15', '4:00 PM'),
((SELECT id FROM showcase_tournaments WHERE slug = 'sccl'), 2,
 (SELECT id FROM showcase_teams WHERE short_name = 'P2P' AND tournament_id = (SELECT id FROM showcase_tournaments WHERE slug = 'sccl')),
 (SELECT id FROM showcase_teams WHERE short_name = 'WW' AND tournament_id = (SELECT id FROM showcase_tournaments WHERE slug = 'sccl')),
 '2026-03-15', '6:00 PM'),
-- Round 2
((SELECT id FROM showcase_tournaments WHERE slug = 'sccl'), 3,
 (SELECT id FROM showcase_teams WHERE short_name = 'BB' AND tournament_id = (SELECT id FROM showcase_tournaments WHERE slug = 'sccl')),
 (SELECT id FROM showcase_teams WHERE short_name = 'SS' AND tournament_id = (SELECT id FROM showcase_tournaments WHERE slug = 'sccl')),
 '2026-03-16', '4:00 PM'),
((SELECT id FROM showcase_tournaments WHERE slug = 'sccl'), 4,
 (SELECT id FROM showcase_teams WHERE short_name = 'HH' AND tournament_id = (SELECT id FROM showcase_tournaments WHERE slug = 'sccl')),
 (SELECT id FROM showcase_teams WHERE short_name = 'P2P' AND tournament_id = (SELECT id FROM showcase_tournaments WHERE slug = 'sccl')),
 '2026-03-16', '6:00 PM'),
-- Round 3
((SELECT id FROM showcase_tournaments WHERE slug = 'sccl'), 5,
 (SELECT id FROM showcase_teams WHERE short_name = 'WW' AND tournament_id = (SELECT id FROM showcase_tournaments WHERE slug = 'sccl')),
 (SELECT id FROM showcase_teams WHERE short_name = 'BB' AND tournament_id = (SELECT id FROM showcase_tournaments WHERE slug = 'sccl')),
 '2026-03-22', '4:00 PM'),
((SELECT id FROM showcase_tournaments WHERE slug = 'sccl'), 6,
 (SELECT id FROM showcase_teams WHERE short_name = 'SS' AND tournament_id = (SELECT id FROM showcase_tournaments WHERE slug = 'sccl')),
 (SELECT id FROM showcase_teams WHERE short_name = 'P2P' AND tournament_id = (SELECT id FROM showcase_tournaments WHERE slug = 'sccl')),
 '2026-03-22', '6:00 PM'),
-- Round 4
((SELECT id FROM showcase_tournaments WHERE slug = 'sccl'), 7,
 (SELECT id FROM showcase_teams WHERE short_name = 'HH' AND tournament_id = (SELECT id FROM showcase_tournaments WHERE slug = 'sccl')),
 (SELECT id FROM showcase_teams WHERE short_name = 'WW' AND tournament_id = (SELECT id FROM showcase_tournaments WHERE slug = 'sccl')),
 '2026-03-23', '4:00 PM'),
((SELECT id FROM showcase_tournaments WHERE slug = 'sccl'), 8,
 (SELECT id FROM showcase_teams WHERE short_name = 'BB' AND tournament_id = (SELECT id FROM showcase_tournaments WHERE slug = 'sccl')),
 (SELECT id FROM showcase_teams WHERE short_name = 'P2P' AND tournament_id = (SELECT id FROM showcase_tournaments WHERE slug = 'sccl')),
 '2026-03-23', '6:00 PM'),
-- Round 5
((SELECT id FROM showcase_tournaments WHERE slug = 'sccl'), 9,
 (SELECT id FROM showcase_teams WHERE short_name = 'SS' AND tournament_id = (SELECT id FROM showcase_tournaments WHERE slug = 'sccl')),
 (SELECT id FROM showcase_teams WHERE short_name = 'WW' AND tournament_id = (SELECT id FROM showcase_tournaments WHERE slug = 'sccl')),
 '2026-03-29', '4:00 PM'),
((SELECT id FROM showcase_tournaments WHERE slug = 'sccl'), 10,
 (SELECT id FROM showcase_teams WHERE short_name = 'HH' AND tournament_id = (SELECT id FROM showcase_tournaments WHERE slug = 'sccl')),
 (SELECT id FROM showcase_teams WHERE short_name = 'BB' AND tournament_id = (SELECT id FROM showcase_tournaments WHERE slug = 'sccl')),
 '2026-03-29', '6:00 PM');

-- Table 5: showcase_sponsors
CREATE TABLE showcase_sponsors (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  tournament_id UUID NOT NULL REFERENCES showcase_tournaments(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  logo_url TEXT,
  website_url TEXT,
  tier TEXT NOT NULL DEFAULT 'partner' CHECK (tier IN ('title', 'powered_by', 'gold', 'silver', 'partner')),
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE showcase_sponsors ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read showcase_sponsors" ON showcase_sponsors FOR SELECT USING (true);
CREATE POLICY "Anon manage showcase_sponsors" ON showcase_sponsors FOR ALL USING (true);
