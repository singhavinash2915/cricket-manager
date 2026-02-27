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
