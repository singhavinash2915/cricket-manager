export interface Club {
  id: string;
  name: string;
  short_name: string;
  logo_url: string | null;
  primary_color: string;
  phone: string | null;
  email: string | null;
  instagram_url: string | null;
  location: string | null;
  founded_year: number | null;
  season: string | null;
  team_a_name: string;
  team_b_name: string;
  admin_password_hash: string;
  razorpay_key_id: string | null;
  razorpay_key_secret_encrypted: string | null;
  payment_link: string | null;
  subscription_status: 'active' | 'trial' | 'expired';
  subscription_expires_at: string | null;
  setup_fee_paid: boolean;
  about_story: string | null;
  about_mission: string | null;
  created_at: string;
}

export interface Member {
  id: string;
  club_id: string;
  name: string;
  phone: string | null;
  email: string | null;
  join_date: string;
  birthday: string | null;
  status: 'active' | 'inactive';
  balance: number;
  matches_played: number;
  avatar_url: string | null;
  created_at: string;
}

export type MatchType = 'external' | 'internal';
export type InternalTeam = 'team_a' | 'team_b';

export interface Match {
  id: string;
  club_id: string;
  date: string;
  venue: string;
  opponent: string | null;
  result: 'won' | 'lost' | 'draw' | 'upcoming' | 'cancelled';
  our_score: string | null;
  opponent_score: string | null;
  match_fee: number;
  ground_cost: number;
  other_expenses: number;
  deduct_from_balance: boolean;
  notes: string | null;
  man_of_match_id: string | null;
  match_type: MatchType;
  winning_team: InternalTeam | null;
  created_at: string;
  players?: MatchPlayer[];
  man_of_match?: Member;
}

export interface MatchPlayer {
  id: string;
  match_id: string;
  member_id: string;
  fee_paid: boolean;
  team: InternalTeam | null;
  member?: Member;
}

export interface Transaction {
  id: string;
  club_id: string;
  date: string;
  type: 'deposit' | 'match_fee' | 'expense' | 'refund';
  amount: number;
  member_id: string | null;
  match_id: string | null;
  description: string | null;
  created_at: string;
  member?: Member;
  match?: Match;
}

export interface MemberRequest {
  id: string;
  club_id: string;
  name: string;
  phone: string | null;
  email: string | null;
  experience: string | null;
  message: string | null;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
}

export interface AppSettings {
  key: string;
  value: Record<string, unknown>;
}

export interface DashboardStats {
  totalMembers: number;
  activeMembers: number;
  totalFunds: number;
  matchesPlayed: number;
  matchesWon: number;
  matchesLost: number;
  winRate: number;
  pendingRequests: number;
}

export interface Tournament {
  id: string;
  club_id: string;
  name: string;
  start_date: string;
  end_date: string | null;
  venue: string;
  format: 'T20' | 'ODI' | 'T10' | 'Tennis Ball' | 'Other';
  status: 'upcoming' | 'ongoing' | 'completed';
  total_teams: number | null;
  entry_fee: number;
  prize_money: number | null;
  our_position: string | null;
  result: 'winner' | 'runner_up' | 'semi_finalist' | 'quarter_finalist' | 'group_stage' | 'participated' | null;
  notes: string | null;
  created_at: string;
  matches?: TournamentMatch[];
}

export interface TournamentMatch {
  id: string;
  tournament_id: string;
  match_id: string;
  stage: 'group' | 'quarter_final' | 'semi_final' | 'final' | 'league';
  match?: Match;
}

export interface MatchPhoto {
  id: string;
  match_id: string;
  photo_url: string;
  caption: string | null;
  created_at: string;
  match?: Match;
}

export interface Feedback {
  id: string;
  club_id: string;
  name: string;
  message: string;
  rating: number | null;
  admin_reply: string | null;
  replied_at: string | null;
  created_at: string;
}

export interface PaymentOrder {
  id: string;
  club_id: string;
  member_id: string;
  amount: number;
  razorpay_order_id: string | null;
  razorpay_payment_id: string | null;
  razorpay_signature: string | null;
  status: 'created' | 'paid' | 'failed';
  created_at: string;
  paid_at: string | null;
  member?: Member;
}

export interface SubscriptionOrder {
  id: string;
  club_id: string;
  type: 'setup' | 'monthly' | 'yearly';
  amount: number;
  payment_method: 'razorpay' | 'manual';
  razorpay_order_id: string | null;
  razorpay_payment_id: string | null;
  razorpay_signature: string | null;
  status: 'created' | 'paid' | 'failed';
  period_start: string | null;
  period_end: string | null;
  notes: string | null;
  created_at: string;
  paid_at: string | null;
  club?: Club;
}

export interface PlatformPricing {
  setup_fee: number;
  monthly_fee: number;
  yearly_fee: number;
  trial_days: number;
}

export interface PlatformContact {
  whatsapp: string;
  email: string;
}

export interface PlatformSettings {
  pricing: PlatformPricing;
  contact: PlatformContact;
}

// === Showcase Tournament Types ===

export interface ShowcaseTournament {
  id: string;
  slug: string;
  name: string;
  short_name: string | null;
  format: string;
  overs: number;
  venue: string;
  venue_address: string | null;
  start_date: string;
  end_date: string | null;
  status: 'upcoming' | 'live' | 'completed';
  total_teams: number;
  stage_type: 'round_robin' | 'knockout' | 'group_stage';
  points_win: number;
  points_loss: number;
  points_draw: number;
  points_nr: number;
  banner_image_url: string | null;
  organizer_name: string | null;
  organizer_logo_url: string | null;
  prize_info: { first?: string; second?: string; third?: string } | null;
  rules: string | null;
  created_at: string;
}

export interface ShowcaseTeam {
  id: string;
  tournament_id: string;
  name: string;
  short_name: string | null;
  logo_url: string | null;
  primary_color: string;
  captain_name: string | null;
  sort_order: number;
  created_at: string;
}

export interface ShowcaseFixture {
  id: string;
  tournament_id: string;
  match_number: number;
  team_a_id: string;
  team_b_id: string;
  date: string | null;
  time: string | null;
  venue: string | null;
  status: 'upcoming' | 'live' | 'completed' | 'no_result' | 'cancelled';
  team_a_score: string | null;
  team_a_runs: number | null;
  team_a_wickets: number | null;
  team_a_overs_faced: number | null;
  team_b_score: string | null;
  team_b_runs: number | null;
  team_b_wickets: number | null;
  team_b_overs_faced: number | null;
  winner_team_id: string | null;
  result_summary: string | null;
  toss_winner_team_id: string | null;
  toss_decision: 'bat' | 'bowl' | null;
  man_of_match_name: string | null;
  man_of_match_team_id: string | null;
  highlights: string | null;
  created_at: string;
  team_a?: ShowcaseTeam;
  team_b?: ShowcaseTeam;
  winner_team?: ShowcaseTeam;
}

export interface ShowcasePlayerStat {
  id: string;
  tournament_id: string;
  fixture_id: string;
  team_id: string;
  player_name: string;
  runs_scored: number;
  balls_faced: number;
  fours: number;
  sixes: number;
  not_out: boolean;
  overs_bowled: number;
  runs_conceded: number;
  wickets_taken: number;
  maidens: number;
  catches: number;
  run_outs: number;
  stumpings: number;
  is_man_of_match: boolean;
  created_at: string;
}

export interface ShowcaseSponsor {
  id: string;
  tournament_id: string;
  name: string;
  logo_url: string | null;
  website_url: string | null;
  tier: 'title' | 'powered_by' | 'gold' | 'silver' | 'partner';
  sort_order: number;
  created_at: string;
}

export interface TeamStanding {
  team: ShowcaseTeam;
  played: number;
  won: number;
  lost: number;
  drawn: number;
  noResult: number;
  points: number;
  nrr: number;
  runsScored: number;
  oversFaced: number;
  runsConceded: number;
  oversBowled: number;
  lastFive: ('W' | 'L' | 'D' | 'NR')[];
}
