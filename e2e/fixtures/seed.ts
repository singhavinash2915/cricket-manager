import { createClient } from '@supabase/supabase-js';
import {
  TEST_CLUB,
  TEST_MEMBERS,
  TEST_MATCH_EXTERNAL,
  TEST_MATCH_INTERNAL,
  TEST_TOURNAMENT,
} from './test-data';

const supabaseUrl = 'https://hbxpvongrzijfghpjafw.supabase.co';
const supabaseAnonKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhieHB2b25ncnppamZnaHBqYWZ3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIxODM2NTUsImV4cCI6MjA4Nzc1OTY1NX0.I3xjhqSggPvoaH7RKi9VFgoifIje_wtHO8ZYeOnwlwA';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface SeededData {
  clubId: string;
  memberIds: string[];
  matchIds: string[];
  tournamentId: string;
}

export async function seedTestClub(): Promise<SeededData> {
  // Clean up any existing test club first
  const { data: existing } = await supabase
    .from('clubs')
    .select('id')
    .eq('short_name', TEST_CLUB.short_name)
    .maybeSingle();

  if (existing) {
    await supabase.from('clubs').delete().eq('id', existing.id);
  }

  // Create test club with 30-day subscription
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 30);

  const { data: club, error: clubError } = await supabase
    .from('clubs')
    .insert({
      ...TEST_CLUB,
      subscription_expires_at: expiresAt.toISOString(),
    })
    .select('id')
    .single();

  if (clubError || !club) {
    throw new Error(`Failed to create test club: ${clubError?.message}`);
  }

  const clubId = club.id;

  // Seed members
  const memberInserts = TEST_MEMBERS.map((m) => ({
    ...m,
    club_id: clubId,
    join_date: '2024-01-15',
  }));

  const { data: members, error: memberError } = await supabase
    .from('members')
    .insert(memberInserts)
    .select('id');

  if (memberError || !members) {
    throw new Error(`Failed to seed members: ${memberError?.message}`);
  }

  const memberIds = members.map((m) => m.id);

  // Seed external match
  const matchDate = new Date();
  matchDate.setDate(matchDate.getDate() - 7);

  const { data: match1, error: match1Error } = await supabase
    .from('matches')
    .insert({
      ...TEST_MATCH_EXTERNAL,
      club_id: clubId,
      date: matchDate.toISOString().split('T')[0],
      man_of_match_id: memberIds[0],
    })
    .select('id')
    .single();

  if (match1Error || !match1) {
    throw new Error(`Failed to seed external match: ${match1Error?.message}`);
  }

  // Add players to external match
  const matchPlayers1 = memberIds.slice(0, 3).map((memberId) => ({
    match_id: match1.id,
    member_id: memberId,
    fee_paid: true,
  }));

  await supabase.from('match_players').insert(matchPlayers1);

  // Seed internal/upcoming match
  const upcomingDate = new Date();
  upcomingDate.setDate(upcomingDate.getDate() + 7);

  const { data: match2, error: match2Error } = await supabase
    .from('matches')
    .insert({
      ...TEST_MATCH_INTERNAL,
      club_id: clubId,
      date: upcomingDate.toISOString().split('T')[0],
    })
    .select('id')
    .single();

  if (match2Error || !match2) {
    throw new Error(`Failed to seed internal match: ${match2Error?.message}`);
  }

  // Add players to internal match with teams
  const matchPlayers2 = [
    { match_id: match2.id, member_id: memberIds[0], fee_paid: false, team: 'team_a' },
    { match_id: match2.id, member_id: memberIds[1], fee_paid: false, team: 'team_b' },
    { match_id: match2.id, member_id: memberIds[2], fee_paid: false, team: 'team_a' },
  ];

  await supabase.from('match_players').insert(matchPlayers2);

  // Seed transactions
  const transactions = [
    {
      club_id: clubId,
      date: '2025-01-10',
      type: 'deposit',
      amount: 5000,
      member_id: memberIds[0],
      description: 'Initial deposit',
    },
    {
      club_id: clubId,
      date: '2025-01-15',
      type: 'deposit',
      amount: 3000,
      member_id: memberIds[1],
      description: 'Monthly deposit',
    },
    {
      club_id: clubId,
      date: '2025-01-20',
      type: 'match_fee',
      amount: -200,
      member_id: memberIds[0],
      match_id: match1.id,
      description: 'Match fee deducted',
    },
    {
      club_id: clubId,
      date: '2025-02-01',
      type: 'expense',
      amount: -5000,
      description: 'Ground booking for Feb',
    },
  ];

  await supabase.from('transactions').insert(transactions);

  // Seed tournament
  const { data: tournament, error: tournamentError } = await supabase
    .from('tournaments')
    .insert({
      ...TEST_TOURNAMENT,
      club_id: clubId,
    })
    .select('id')
    .single();

  if (tournamentError || !tournament) {
    throw new Error(`Failed to seed tournament: ${tournamentError?.message}`);
  }

  // Link match to tournament
  await supabase.from('tournament_matches').insert({
    tournament_id: tournament.id,
    match_id: match1.id,
    stage: 'final',
  });

  // Seed feedback
  await supabase.from('feedback').insert({
    club_id: clubId,
    name: 'Test Batsman',
    message: 'Great app for managing our club!',
    rating: 5,
  });

  console.log(`[E2E Seed] Test club created: ${clubId}`);
  console.log(`[E2E Seed] Members: ${memberIds.length}`);
  console.log(`[E2E Seed] Matches: 2`);
  console.log(`[E2E Seed] Tournament: ${tournament.id}`);

  return {
    clubId,
    memberIds,
    matchIds: [match1.id, match2.id],
    tournamentId: tournament.id,
  };
}

export async function cleanupTestClub(): Promise<void> {
  const { data: existing } = await supabase
    .from('clubs')
    .select('id')
    .eq('short_name', TEST_CLUB.short_name)
    .maybeSingle();

  if (existing) {
    await supabase.from('clubs').delete().eq('id', existing.id);
    console.log(`[E2E Cleanup] Test club deleted: ${existing.id}`);
  } else {
    console.log('[E2E Cleanup] No test club found to clean up');
  }
}
