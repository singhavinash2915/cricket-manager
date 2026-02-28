// Test club and data constants used across all E2E tests

export const TEST_CLUB = {
  name: 'E2E Test Cricket Club',
  short_name: 'e2etestclub',
  primary_color: '#3b82f6',
  admin_password_hash: 'testadmin123',
  phone: '9199999999',
  email: 'e2etest@cricmates.in',
  location: 'Test City',
  founded_year: 2024,
  season: '2024-25',
  team_a_name: 'Team Alpha',
  team_b_name: 'Team Beta',
  subscription_status: 'active' as const,
  setup_fee_paid: true,
};

export const TEST_MEMBERS = [
  {
    name: 'Test Batsman',
    phone: '9100000001',
    email: 'batsman@test.com',
    status: 'active' as const,
    balance: 5000,
    matches_played: 10,
    birthday: '1995-06-15',
  },
  {
    name: 'Test Bowler',
    phone: '9100000002',
    email: 'bowler@test.com',
    status: 'active' as const,
    balance: 3000,
    matches_played: 8,
    birthday: '1997-03-22',
  },
  {
    name: 'Test Allrounder',
    phone: '9100000003',
    email: 'allrounder@test.com',
    status: 'active' as const,
    balance: 200,
    matches_played: 5,
  },
  {
    name: 'Test Inactive',
    phone: '9100000004',
    status: 'inactive' as const,
    balance: 0,
    matches_played: 2,
  },
];

export const TEST_MATCH_EXTERNAL = {
  venue: 'Test Ground A',
  opponent: 'Rival Cricket Club',
  result: 'won' as const,
  our_score: '185/4',
  opponent_score: '170/10',
  match_fee: 200,
  ground_cost: 5000,
  other_expenses: 500,
  deduct_from_balance: true,
  match_type: 'external' as const,
  notes: 'Great win by the team!',
};

export const TEST_MATCH_INTERNAL = {
  venue: 'Test Ground B',
  result: 'upcoming' as const,
  match_fee: 150,
  ground_cost: 3000,
  other_expenses: 0,
  deduct_from_balance: false,
  match_type: 'internal' as const,
};

export const TEST_TOURNAMENT = {
  name: 'E2E Test Tournament',
  start_date: '2025-03-01',
  end_date: '2025-03-15',
  venue: 'Tournament Ground',
  format: 'T20' as const,
  status: 'completed' as const,
  total_teams: 8,
  entry_fee: 5000,
  prize_money: 25000,
  our_position: '1st',
  result: 'winner' as const,
  notes: 'Won the final by 30 runs',
};

export const SUPER_ADMIN_PASSWORD = 'superadmin@2026';

export const ADMIN_PASSWORD = 'testadmin123';
