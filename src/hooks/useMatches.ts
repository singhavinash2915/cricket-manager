import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useClub } from '../context/ClubContext';
import type { Match, MatchPlayer, InternalTeam } from '../types';

export function useMatches() {
  const { club } = useClub();
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMatches = useCallback(async () => {
    if (!club) return;
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('matches')
        .select(`
          *,
          players:match_players(
            id, match_id, member_id, fee_paid, team,
            member:members(id, name, balance, avatar_url)
          ),
          man_of_match:members!matches_man_of_match_id_fkey(id, name, avatar_url)
        `)
        .eq('club_id', club.id)
        .order('date', { ascending: false });

      if (error) throw error;
      setMatches(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch matches');
    } finally {
      setLoading(false);
    }
  }, [club]);

  useEffect(() => {
    fetchMatches();
  }, [fetchMatches]);

  const addMatch = async (
    match: Omit<Match, 'id' | 'created_at' | 'players' | 'club_id'>,
    playerIds: string[],
    playerTeams?: Record<string, InternalTeam>
  ) => {
    if (!club) throw new Error('No club selected');
    try {
      const { data: matchData, error: matchError } = await supabase
        .from('matches')
        .insert([{ ...match, club_id: club.id }])
        .select()
        .single();

      if (matchError) throw matchError;

      if (playerIds.length > 0) {
        const matchPlayers = playerIds.map(memberId => ({
          match_id: matchData.id,
          member_id: memberId,
          fee_paid: match.deduct_from_balance,
          team: match.match_type === 'internal' && playerTeams ? playerTeams[memberId] || null : null,
        }));

        const { error: playersError } = await supabase
          .from('match_players')
          .insert(matchPlayers);

        if (playersError) throw playersError;

        for (const memberId of playerIds) {
          const { data: memberData } = await supabase
            .from('members')
            .select('balance, matches_played')
            .eq('id', memberId)
            .single();

          if (memberData) {
            const updateData: { matches_played: number; balance?: number } = {
              matches_played: (memberData.matches_played || 0) + 1,
            };

            if (match.deduct_from_balance) {
              updateData.balance = memberData.balance - match.match_fee;

              const matchTypeLabel = match.match_type === 'internal' ? 'Internal Match' : 'Match';
              await supabase.from('transactions').insert([{
                club_id: club.id,
                type: 'match_fee',
                amount: -match.match_fee,
                member_id: memberId,
                match_id: matchData.id,
                description: `${matchTypeLabel} fee - ${match.venue}`,
              }]);
            }

            await supabase
              .from('members')
              .update(updateData)
              .eq('id', memberId);
          }
        }
      }

      await fetchMatches();
      return matchData;
    } catch (err) {
      throw err instanceof Error ? err : new Error('Failed to add match');
    }
  };

  const updateMatch = async (id: string, updates: Partial<Match>, playerIds?: string[]) => {
    try {
      const { data, error } = await supabase
        .from('matches')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      if (playerIds !== undefined) {
        await supabase.from('match_players').delete().eq('match_id', id);

        if (playerIds.length > 0) {
          const matchPlayers = playerIds.map(memberId => ({
            match_id: id,
            member_id: memberId,
            fee_paid: false,
          }));
          await supabase.from('match_players').insert(matchPlayers);
        }
      }

      await fetchMatches();
      return data;
    } catch (err) {
      throw err instanceof Error ? err : new Error('Failed to update match');
    }
  };

  const deleteMatch = async (id: string) => {
    try {
      const { error } = await supabase.from('matches').delete().eq('id', id);
      if (error) throw error;
      setMatches(prev => prev.filter(m => m.id !== id));
    } catch (err) {
      throw err instanceof Error ? err : new Error('Failed to delete match');
    }
  };

  const updateMatchResult = async (
    id: string,
    result: Match['result'],
    ourScore?: string,
    opponentScore?: string
  ) => {
    return updateMatch(id, { result, our_score: ourScore, opponent_score: opponentScore });
  };

  const getMatchPlayers = async (matchId: string): Promise<MatchPlayer[]> => {
    const { data, error } = await supabase
      .from('match_players')
      .select(`*, member:members(*)`)
      .eq('match_id', matchId);

    if (error) throw error;
    return data || [];
  };

  return {
    matches, loading, error, fetchMatches,
    addMatch, updateMatch, deleteMatch, updateMatchResult, getMatchPlayers,
  };
}
