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

INSERT INTO showcase_tournaments (slug, name, short_name, format, overs, venue, venue_address, start_date, end_date, status, total_teams, organizer_name, rules)
VALUES ('sccl', 'Sangria Cricket Club Champions League', 'SCCL', 'Tennis Ball', 15, 'Four Star Ground', 'Hinjewadi Phase 2, Pune', '2026-04-01', '2026-04-30', 'upcoming', 5, 'Limitless Criset Academy', 'Qualifier: 28th April | Final: 30th April');

-- Insert 5 teams
INSERT INTO showcase_teams (tournament_id, name, short_name, primary_color, sort_order) VALUES
((SELECT id FROM showcase_tournaments WHERE slug = 'sccl'), 'All Whites', 'AW', '#f8fafc', 1),
((SELECT id FROM showcase_tournaments WHERE slug = 'sccl'), 'SCC', 'SCC', '#dc2626', 2),
((SELECT id FROM showcase_tournaments WHERE slug = 'sccl'), 'Bujurg XI', 'BXI', '#2563eb', 3),
((SELECT id FROM showcase_tournaments WHERE slug = 'sccl'), 'Yashwin Stars', 'YS', '#7c3aed', 4),
((SELECT id FROM showcase_tournaments WHERE slug = 'sccl'), 'Overtime Hitters', 'OH', '#ea580c', 5);

-- Insert 10 league fixtures + Qualifier + Final
INSERT INTO showcase_fixtures (tournament_id, match_number, team_a_id, team_b_id, date, time) VALUES
-- Match 1: 1 Apr (Wed)
((SELECT id FROM showcase_tournaments WHERE slug = 'sccl'), 1,
 (SELECT id FROM showcase_teams WHERE short_name = 'AW' AND tournament_id = (SELECT id FROM showcase_tournaments WHERE slug = 'sccl')),
 (SELECT id FROM showcase_teams WHERE short_name = 'BXI' AND tournament_id = (SELECT id FROM showcase_tournaments WHERE slug = 'sccl')),
 '2026-04-01', '6:45 AM'),
-- Match 2: 2 Apr (Thu)
((SELECT id FROM showcase_tournaments WHERE slug = 'sccl'), 2,
 (SELECT id FROM showcase_teams WHERE short_name = 'SCC' AND tournament_id = (SELECT id FROM showcase_tournaments WHERE slug = 'sccl')),
 (SELECT id FROM showcase_teams WHERE short_name = 'YS' AND tournament_id = (SELECT id FROM showcase_tournaments WHERE slug = 'sccl')),
 '2026-04-02', '6:45 AM'),
-- Match 3: 7 Apr (Tue)
((SELECT id FROM showcase_tournaments WHERE slug = 'sccl'), 3,
 (SELECT id FROM showcase_teams WHERE short_name = 'SCC' AND tournament_id = (SELECT id FROM showcase_tournaments WHERE slug = 'sccl')),
 (SELECT id FROM showcase_teams WHERE short_name = 'OH' AND tournament_id = (SELECT id FROM showcase_tournaments WHERE slug = 'sccl')),
 '2026-04-07', '6:45 AM'),
-- Match 4: 8 Apr (Wed)
((SELECT id FROM showcase_tournaments WHERE slug = 'sccl'), 4,
 (SELECT id FROM showcase_teams WHERE short_name = 'AW' AND tournament_id = (SELECT id FROM showcase_tournaments WHERE slug = 'sccl')),
 (SELECT id FROM showcase_teams WHERE short_name = 'YS' AND tournament_id = (SELECT id FROM showcase_tournaments WHERE slug = 'sccl')),
 '2026-04-08', '6:45 AM'),
-- Match 5: 9 Apr (Thu)
((SELECT id FROM showcase_tournaments WHERE slug = 'sccl'), 5,
 (SELECT id FROM showcase_teams WHERE short_name = 'OH' AND tournament_id = (SELECT id FROM showcase_tournaments WHERE slug = 'sccl')),
 (SELECT id FROM showcase_teams WHERE short_name = 'BXI' AND tournament_id = (SELECT id FROM showcase_tournaments WHERE slug = 'sccl')),
 '2026-04-09', '6:45 AM'),
-- Match 6: 15 Apr (Wed)
((SELECT id FROM showcase_tournaments WHERE slug = 'sccl'), 6,
 (SELECT id FROM showcase_teams WHERE short_name = 'AW' AND tournament_id = (SELECT id FROM showcase_tournaments WHERE slug = 'sccl')),
 (SELECT id FROM showcase_teams WHERE short_name = 'OH' AND tournament_id = (SELECT id FROM showcase_tournaments WHERE slug = 'sccl')),
 '2026-04-15', '6:45 AM'),
-- Match 7: 16 Apr (Thu)
((SELECT id FROM showcase_tournaments WHERE slug = 'sccl'), 7,
 (SELECT id FROM showcase_teams WHERE short_name = 'SCC' AND tournament_id = (SELECT id FROM showcase_tournaments WHERE slug = 'sccl')),
 (SELECT id FROM showcase_teams WHERE short_name = 'BXI' AND tournament_id = (SELECT id FROM showcase_tournaments WHERE slug = 'sccl')),
 '2026-04-16', '6:45 AM'),
-- Match 8: 21 Apr (Tue)
((SELECT id FROM showcase_tournaments WHERE slug = 'sccl'), 8,
 (SELECT id FROM showcase_teams WHERE short_name = 'YS' AND tournament_id = (SELECT id FROM showcase_tournaments WHERE slug = 'sccl')),
 (SELECT id FROM showcase_teams WHERE short_name = 'OH' AND tournament_id = (SELECT id FROM showcase_tournaments WHERE slug = 'sccl')),
 '2026-04-21', '6:45 AM'),
-- Match 9: 22 Apr (Wed)
((SELECT id FROM showcase_tournaments WHERE slug = 'sccl'), 9,
 (SELECT id FROM showcase_teams WHERE short_name = 'SCC' AND tournament_id = (SELECT id FROM showcase_tournaments WHERE slug = 'sccl')),
 (SELECT id FROM showcase_teams WHERE short_name = 'AW' AND tournament_id = (SELECT id FROM showcase_tournaments WHERE slug = 'sccl')),
 '2026-04-22', '6:45 AM'),
-- Match 10: 23 Apr (Thu)
((SELECT id FROM showcase_tournaments WHERE slug = 'sccl'), 10,
 (SELECT id FROM showcase_teams WHERE short_name = 'BXI' AND tournament_id = (SELECT id FROM showcase_tournaments WHERE slug = 'sccl')),
 (SELECT id FROM showcase_teams WHERE short_name = 'YS' AND tournament_id = (SELECT id FROM showcase_tournaments WHERE slug = 'sccl')),
 '2026-04-23', '6:45 AM');
-- Qualifier (28 Apr) and Final (30 Apr) will be added via SuperAdmin once league stage completes

-- Insert sponsors
INSERT INTO showcase_sponsors (tournament_id, name, tier, sort_order) VALUES
((SELECT id FROM showcase_tournaments WHERE slug = 'sccl'), 'CA India - Aprmay Kumar & Associates', 'powered_by', 1),
((SELECT id FROM showcase_tournaments WHERE slug = 'sccl'), 'Limitless Criset Academy', 'title', 2);

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
