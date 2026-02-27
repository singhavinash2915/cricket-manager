-- ============================================================================
-- Cricket Manager - Seed Data
-- ============================================================================
-- Two dummy clubs with members, matches, transactions, and tournaments.
-- Uses fixed UUIDs for easy reference.
-- Run this AFTER schema.sql in Supabase SQL Editor.
-- ============================================================================

-- ============================================================================
-- CLUBS
-- ============================================================================

INSERT INTO clubs (
  id, name, short_name, primary_color, location, team_a_name, team_b_name,
  admin_password_hash, subscription_status, subscription_expires_at, season,
  founded_year, phone, email, about_story, about_mission
) VALUES (
  '11111111-1111-1111-1111-111111111111',
  'Pune Warriors Cricket Club',
  'pune-warriors',
  '#3b82f6',
  'Pune, Maharashtra',
  'Spartans',
  'Gladiators',
  'pune@2026',
  'active',
  '2026-08-26T00:00:00Z',
  '2025-26',
  2020,
  '+91 98765 43210',
  'admin@punewarriors.com',
  'Founded in 2020, Pune Warriors Cricket Club brings together passionate cricketers from across Pune.',
  'To build a competitive and fun cricket community in Pune.'
);

INSERT INTO clubs (
  id, name, short_name, primary_color, location, team_a_name, team_b_name,
  admin_password_hash, subscription_status, subscription_expires_at, season,
  founded_year, phone, email, about_story, about_mission
) VALUES (
  '22222222-2222-2222-2222-222222222222',
  'Mumbai Strikers Cricket Club',
  'mumbai-strikers',
  '#ef4444',
  'Mumbai, Maharashtra',
  'Thunder',
  'Lightning',
  'mumbai@2026',
  'trial',
  '2026-03-13T00:00:00Z',
  '2025-26',
  2022,
  '+91 98765 12345',
  'admin@mumbaistrikers.com',
  'Mumbai Strikers was born from weekend cricket sessions at Oval Maidan in 2022.',
  'To foster sportsmanship and create memorable cricket experiences.'
);

-- ============================================================================
-- MEMBERS - Pune Warriors (club_id: 11111111...)
-- ============================================================================

INSERT INTO members (id, club_id, name, phone, balance, matches_played, status, join_date) VALUES
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaa001', '11111111-1111-1111-1111-111111111111', 'Rahul Sharma',  '9876543201', 2500.00, 2, 'active', '2025-06-01'),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaa002', '11111111-1111-1111-1111-111111111111', 'Priya Patel',   '9876543202', 1800.00, 2, 'active', '2025-06-15'),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaa003', '11111111-1111-1111-1111-111111111111', 'Amit Kumar',    '9876543203',  500.00, 2, 'active', '2025-07-01'),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaa004', '11111111-1111-1111-1111-111111111111', 'Sneha Desai',   '9876543204', 3000.00, 2, 'active', '2025-07-10'),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaa005', '11111111-1111-1111-1111-111111111111', 'Vikram Singh',  '9876543205',  200.00, 1, 'active', '2025-08-01'),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaa006', '11111111-1111-1111-1111-111111111111', 'Pooja Mehta',   '9876543206', 1500.00, 1, 'active', '2025-08-15'),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaa007', '11111111-1111-1111-1111-111111111111', 'Arjun Reddy',   '9876543207',  800.00, 0, 'active', '2025-09-01'),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaa008', '11111111-1111-1111-1111-111111111111', 'Neha Gupta',    '9876543208', 1200.00, 0, 'active', '2025-09-15');

-- ============================================================================
-- MEMBERS - Mumbai Strikers (club_id: 22222222...)
-- ============================================================================

INSERT INTO members (id, club_id, name, phone, balance, matches_played, status, join_date) VALUES
  ('cccccccc-cccc-cccc-cccc-ccccccccc001', '22222222-2222-2222-2222-222222222222', 'Rohit Malhotra', '9812345601', 3500.00, 1, 'active', '2025-05-01'),
  ('cccccccc-cccc-cccc-cccc-ccccccccc002', '22222222-2222-2222-2222-222222222222', 'Ananya Iyer',    '9812345602', 1000.00, 1, 'active', '2025-05-15'),
  ('cccccccc-cccc-cccc-cccc-ccccccccc003', '22222222-2222-2222-2222-222222222222', 'Karan Chopra',   '9812345603',  400.00, 1, 'active', '2025-06-01'),
  ('cccccccc-cccc-cccc-cccc-ccccccccc004', '22222222-2222-2222-2222-222222222222', 'Divya Nair',     '9812345604', 2200.00, 1, 'active', '2025-06-15'),
  ('cccccccc-cccc-cccc-cccc-ccccccccc005', '22222222-2222-2222-2222-222222222222', 'Suresh Raina',   '9812345605', 1800.00, 1, 'active', '2025-07-01'),
  ('cccccccc-cccc-cccc-cccc-ccccccccc006', '22222222-2222-2222-2222-222222222222', 'Meera Joshi',    '9812345606',  600.00, 0, 'active', '2025-07-15');

-- ============================================================================
-- MATCHES - Pune Warriors
-- ============================================================================

-- Match 1: Won vs Mumbai Lions
INSERT INTO matches (
  id, club_id, date, venue, opponent, result, our_score, opponent_score,
  match_fee, ground_cost, deduct_from_balance, match_type, man_of_match_id
) VALUES (
  'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbb001',
  '11111111-1111-1111-1111-111111111111',
  '2026-02-15',
  'Shivaji Park',
  'Mumbai Lions',
  'won',
  '185/4',
  '170/8',
  200.00,
  1000.00,
  TRUE,
  'external',
  'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaa001'
);

-- Match 2: Lost vs Delhi Stars
INSERT INTO matches (
  id, club_id, date, venue, opponent, result, our_score, opponent_score,
  match_fee, ground_cost, deduct_from_balance, match_type
) VALUES (
  'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbb002',
  '11111111-1111-1111-1111-111111111111',
  '2026-02-01',
  'MCA Stadium',
  'Delhi Stars',
  'lost',
  '140/10',
  '142/3',
  200.00,
  1500.00,
  TRUE,
  'external'
);

-- Match 3: Upcoming vs Chennai Hawks
INSERT INTO matches (
  id, club_id, date, venue, opponent, result,
  match_fee, deduct_from_balance, match_type
) VALUES (
  'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbb003',
  '11111111-1111-1111-1111-111111111111',
  '2026-03-15',
  'Deccan Gymkhana',
  'Chennai Hawks',
  'upcoming',
  200.00,
  TRUE,
  'external'
);

-- ============================================================================
-- MATCHES - Mumbai Strikers
-- ============================================================================

-- Match 1: Won vs Pune Titans
INSERT INTO matches (
  id, club_id, date, venue, opponent, result, our_score, opponent_score,
  match_fee, ground_cost, deduct_from_balance, match_type, man_of_match_id
) VALUES (
  'dddddddd-dddd-dddd-dddd-ddddddddd001',
  '22222222-2222-2222-2222-222222222222',
  '2026-02-20',
  'Wankhede Stadium',
  'Pune Titans',
  'won',
  '210/3',
  '180/9',
  300.00,
  2000.00,
  TRUE,
  'external',
  'cccccccc-cccc-cccc-cccc-ccccccccc001'
);

-- Match 2: Upcoming vs Thane Warriors
INSERT INTO matches (
  id, club_id, date, venue, opponent, result,
  match_fee, deduct_from_balance, match_type
) VALUES (
  'dddddddd-dddd-dddd-dddd-ddddddddd002',
  '22222222-2222-2222-2222-222222222222',
  '2026-03-10',
  'Oval Maidan',
  'Thane Warriors',
  'upcoming',
  300.00,
  TRUE,
  'external'
);

-- ============================================================================
-- MATCH PLAYERS - Pune Warriors Match 1 (Won vs Mumbai Lions)
-- 6 players: Rahul, Priya, Amit, Sneha, Vikram, Pooja
-- ============================================================================

INSERT INTO match_players (id, match_id, member_id, fee_paid) VALUES
  (gen_random_uuid(), 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbb001', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaa001', TRUE),
  (gen_random_uuid(), 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbb001', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaa002', TRUE),
  (gen_random_uuid(), 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbb001', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaa003', TRUE),
  (gen_random_uuid(), 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbb001', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaa004', TRUE),
  (gen_random_uuid(), 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbb001', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaa005', TRUE),
  (gen_random_uuid(), 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbb001', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaa006', TRUE);

-- ============================================================================
-- MATCH PLAYERS - Pune Warriors Match 2 (Lost vs Delhi Stars)
-- 6 players: Rahul, Priya, Amit, Sneha, Vikram, Pooja
-- ============================================================================

INSERT INTO match_players (id, match_id, member_id, fee_paid) VALUES
  (gen_random_uuid(), 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbb002', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaa001', TRUE),
  (gen_random_uuid(), 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbb002', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaa002', TRUE),
  (gen_random_uuid(), 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbb002', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaa003', TRUE),
  (gen_random_uuid(), 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbb002', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaa004', TRUE),
  (gen_random_uuid(), 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbb002', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaa005', FALSE),
  (gen_random_uuid(), 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbb002', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaa006', FALSE);

-- ============================================================================
-- MATCH PLAYERS - Mumbai Strikers Match 1 (Won vs Pune Titans)
-- 5 players: Rohit, Ananya, Karan, Divya, Suresh
-- ============================================================================

INSERT INTO match_players (id, match_id, member_id, fee_paid) VALUES
  (gen_random_uuid(), 'dddddddd-dddd-dddd-dddd-ddddddddd001', 'cccccccc-cccc-cccc-cccc-ccccccccc001', TRUE),
  (gen_random_uuid(), 'dddddddd-dddd-dddd-dddd-ddddddddd001', 'cccccccc-cccc-cccc-cccc-ccccccccc002', TRUE),
  (gen_random_uuid(), 'dddddddd-dddd-dddd-dddd-ddddddddd001', 'cccccccc-cccc-cccc-cccc-ccccccccc003', TRUE),
  (gen_random_uuid(), 'dddddddd-dddd-dddd-dddd-ddddddddd001', 'cccccccc-cccc-cccc-cccc-ccccccccc004', TRUE),
  (gen_random_uuid(), 'dddddddd-dddd-dddd-dddd-ddddddddd001', 'cccccccc-cccc-cccc-cccc-ccccccccc005', TRUE);

-- ============================================================================
-- TRANSACTIONS - Pune Warriors
-- ============================================================================

-- Deposits for each member (matching their current balance + match fees deducted)
-- Rahul: balance 2500 + 400 (2 matches x 200) = deposited 2900
-- Priya: balance 1800 + 400 = deposited 2200
-- Amit: balance 500 + 400 = deposited 900
-- Sneha: balance 3000 + 400 = deposited 3400
-- Vikram: balance 200 + 200 (1 match paid) = deposited 400
-- Pooja: balance 1500 + 200 (1 match paid) = deposited 1700 (match 2 not paid)
-- Arjun: balance 800, 0 matches = deposited 800
-- Neha: balance 1200, 0 matches = deposited 1200

INSERT INTO transactions (id, club_id, date, type, amount, member_id, description) VALUES
  (gen_random_uuid(), '11111111-1111-1111-1111-111111111111', '2025-06-05', 'deposit', 2900.00, 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaa001', 'Initial deposit - Rahul Sharma'),
  (gen_random_uuid(), '11111111-1111-1111-1111-111111111111', '2025-06-20', 'deposit', 2200.00, 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaa002', 'Initial deposit - Priya Patel'),
  (gen_random_uuid(), '11111111-1111-1111-1111-111111111111', '2025-07-05', 'deposit',  900.00, 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaa003', 'Initial deposit - Amit Kumar'),
  (gen_random_uuid(), '11111111-1111-1111-1111-111111111111', '2025-07-15', 'deposit', 3400.00, 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaa004', 'Initial deposit - Sneha Desai'),
  (gen_random_uuid(), '11111111-1111-1111-1111-111111111111', '2025-08-05', 'deposit',  400.00, 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaa005', 'Initial deposit - Vikram Singh'),
  (gen_random_uuid(), '11111111-1111-1111-1111-111111111111', '2025-08-20', 'deposit', 1700.00, 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaa006', 'Initial deposit - Pooja Mehta'),
  (gen_random_uuid(), '11111111-1111-1111-1111-111111111111', '2025-09-05', 'deposit',  800.00, 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaa007', 'Initial deposit - Arjun Reddy'),
  (gen_random_uuid(), '11111111-1111-1111-1111-111111111111', '2025-09-20', 'deposit', 1200.00, 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaa008', 'Initial deposit - Neha Gupta');

-- Match fees for Pune Match 1 (vs Mumbai Lions) - 6 players x 200
INSERT INTO transactions (id, club_id, date, type, amount, member_id, match_id, description) VALUES
  (gen_random_uuid(), '11111111-1111-1111-1111-111111111111', '2026-02-15', 'match_fee', 200.00, 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaa001', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbb001', 'Match fee - vs Mumbai Lions'),
  (gen_random_uuid(), '11111111-1111-1111-1111-111111111111', '2026-02-15', 'match_fee', 200.00, 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaa002', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbb001', 'Match fee - vs Mumbai Lions'),
  (gen_random_uuid(), '11111111-1111-1111-1111-111111111111', '2026-02-15', 'match_fee', 200.00, 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaa003', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbb001', 'Match fee - vs Mumbai Lions'),
  (gen_random_uuid(), '11111111-1111-1111-1111-111111111111', '2026-02-15', 'match_fee', 200.00, 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaa004', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbb001', 'Match fee - vs Mumbai Lions'),
  (gen_random_uuid(), '11111111-1111-1111-1111-111111111111', '2026-02-15', 'match_fee', 200.00, 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaa005', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbb001', 'Match fee - vs Mumbai Lions'),
  (gen_random_uuid(), '11111111-1111-1111-1111-111111111111', '2026-02-15', 'match_fee', 200.00, 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaa006', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbb001', 'Match fee - vs Mumbai Lions');

-- Match fees for Pune Match 2 (vs Delhi Stars) - 6 players x 200
INSERT INTO transactions (id, club_id, date, type, amount, member_id, match_id, description) VALUES
  (gen_random_uuid(), '11111111-1111-1111-1111-111111111111', '2026-02-01', 'match_fee', 200.00, 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaa001', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbb002', 'Match fee - vs Delhi Stars'),
  (gen_random_uuid(), '11111111-1111-1111-1111-111111111111', '2026-02-01', 'match_fee', 200.00, 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaa002', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbb002', 'Match fee - vs Delhi Stars'),
  (gen_random_uuid(), '11111111-1111-1111-1111-111111111111', '2026-02-01', 'match_fee', 200.00, 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaa003', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbb002', 'Match fee - vs Delhi Stars'),
  (gen_random_uuid(), '11111111-1111-1111-1111-111111111111', '2026-02-01', 'match_fee', 200.00, 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaa004', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbb002', 'Match fee - vs Delhi Stars'),
  (gen_random_uuid(), '11111111-1111-1111-1111-111111111111', '2026-02-01', 'match_fee', 200.00, 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaa005', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbb002', 'Match fee - vs Delhi Stars'),
  (gen_random_uuid(), '11111111-1111-1111-1111-111111111111', '2026-02-01', 'match_fee', 200.00, 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaa006', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbb002', 'Match fee - vs Delhi Stars');

-- Expense for Pune: Ground booking
INSERT INTO transactions (id, club_id, date, type, amount, match_id, description) VALUES
  (gen_random_uuid(), '11111111-1111-1111-1111-111111111111', '2026-02-15', 'expense', 1000.00, 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbb001', 'Ground booking - Shivaji Park');

-- ============================================================================
-- TRANSACTIONS - Mumbai Strikers
-- ============================================================================

-- Deposits for each member (matching their current balance + match fees deducted)
-- Rohit: balance 3500 + 300 (1 match) = deposited 3800
-- Ananya: balance 1000 + 300 = deposited 1300
-- Karan: balance 400 + 300 = deposited 700
-- Divya: balance 2200 + 300 = deposited 2500
-- Suresh: balance 1800 + 300 = deposited 2100
-- Meera: balance 600, 0 matches = deposited 600

INSERT INTO transactions (id, club_id, date, type, amount, member_id, description) VALUES
  (gen_random_uuid(), '22222222-2222-2222-2222-222222222222', '2025-05-05', 'deposit', 3800.00, 'cccccccc-cccc-cccc-cccc-ccccccccc001', 'Initial deposit - Rohit Malhotra'),
  (gen_random_uuid(), '22222222-2222-2222-2222-222222222222', '2025-05-20', 'deposit', 1300.00, 'cccccccc-cccc-cccc-cccc-ccccccccc002', 'Initial deposit - Ananya Iyer'),
  (gen_random_uuid(), '22222222-2222-2222-2222-222222222222', '2025-06-05', 'deposit',  700.00, 'cccccccc-cccc-cccc-cccc-ccccccccc003', 'Initial deposit - Karan Chopra'),
  (gen_random_uuid(), '22222222-2222-2222-2222-222222222222', '2025-06-20', 'deposit', 2500.00, 'cccccccc-cccc-cccc-cccc-ccccccccc004', 'Initial deposit - Divya Nair'),
  (gen_random_uuid(), '22222222-2222-2222-2222-222222222222', '2025-07-05', 'deposit', 2100.00, 'cccccccc-cccc-cccc-cccc-ccccccccc005', 'Initial deposit - Suresh Raina'),
  (gen_random_uuid(), '22222222-2222-2222-2222-222222222222', '2025-07-20', 'deposit',  600.00, 'cccccccc-cccc-cccc-cccc-ccccccccc006', 'Initial deposit - Meera Joshi');

-- Match fees for Mumbai Match 1 (vs Pune Titans) - 5 players x 300
INSERT INTO transactions (id, club_id, date, type, amount, member_id, match_id, description) VALUES
  (gen_random_uuid(), '22222222-2222-2222-2222-222222222222', '2026-02-20', 'match_fee', 300.00, 'cccccccc-cccc-cccc-cccc-ccccccccc001', 'dddddddd-dddd-dddd-dddd-ddddddddd001', 'Match fee - vs Pune Titans'),
  (gen_random_uuid(), '22222222-2222-2222-2222-222222222222', '2026-02-20', 'match_fee', 300.00, 'cccccccc-cccc-cccc-cccc-ccccccccc002', 'dddddddd-dddd-dddd-dddd-ddddddddd001', 'Match fee - vs Pune Titans'),
  (gen_random_uuid(), '22222222-2222-2222-2222-222222222222', '2026-02-20', 'match_fee', 300.00, 'cccccccc-cccc-cccc-cccc-ccccccccc003', 'dddddddd-dddd-dddd-dddd-ddddddddd001', 'Match fee - vs Pune Titans'),
  (gen_random_uuid(), '22222222-2222-2222-2222-222222222222', '2026-02-20', 'match_fee', 300.00, 'cccccccc-cccc-cccc-cccc-ccccccccc004', 'dddddddd-dddd-dddd-dddd-ddddddddd001', 'Match fee - vs Pune Titans'),
  (gen_random_uuid(), '22222222-2222-2222-2222-222222222222', '2026-02-20', 'match_fee', 300.00, 'cccccccc-cccc-cccc-cccc-ccccccccc005', 'dddddddd-dddd-dddd-dddd-ddddddddd001', 'Match fee - vs Pune Titans');

-- Expense for Mumbai: Ground booking
INSERT INTO transactions (id, club_id, date, type, amount, match_id, description) VALUES
  (gen_random_uuid(), '22222222-2222-2222-2222-222222222222', '2026-02-20', 'expense', 2000.00, 'dddddddd-dddd-dddd-dddd-ddddddddd001', 'Ground booking - Wankhede');

-- ============================================================================
-- TOURNAMENTS - Pune Warriors
-- ============================================================================

INSERT INTO tournaments (
  id, club_id, name, start_date, end_date, venue, format, status,
  total_teams, entry_fee, notes
) VALUES (
  'eeeeeeee-eeee-eeee-eeee-eeeeeeeee001',
  '11111111-1111-1111-1111-111111111111',
  'Pune Premier League 2026',
  '2026-01-15',
  NULL,
  'MCA Stadium',
  'T20',
  'ongoing',
  8,
  5000.00,
  'Annual T20 tournament featuring top clubs from Pune region'
);
