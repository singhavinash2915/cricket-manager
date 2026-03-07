import { useState, useEffect, useCallback, useMemo } from 'react';
import { supabase } from '../lib/supabase';
import type { ShowcaseTournament, ShowcaseTeam, ShowcaseFixture, ShowcasePlayerStat, TeamStanding } from '../types';

function convertOversToDecimal(overs: number): number {
  const fullOvers = Math.floor(overs);
  const balls = Math.round((overs - fullOvers) * 10);
  return fullOvers + balls / 6;
}

function computeStandings(
  teams: ShowcaseTeam[],
  fixtures: ShowcaseFixture[],
  tournament: ShowcaseTournament | null
): TeamStanding[] {
  if (!tournament) return [];

  const map = new Map<string, TeamStanding>();
  teams.forEach(team => {
    map.set(team.id, {
      team,
      played: 0, won: 0, lost: 0, drawn: 0, noResult: 0, points: 0, nrr: 0,
      runsScored: 0, oversFaced: 0, runsConceded: 0, oversBowled: 0,
      lastFive: [],
    });
  });

  const completedFixtures = fixtures
    .filter(f => f.status === 'completed' || f.status === 'no_result')
    .sort((a, b) => a.match_number - b.match_number);

  for (const f of completedFixtures) {
    const teamA = map.get(f.team_a_id);
    const teamB = map.get(f.team_b_id);
    if (!teamA || !teamB) continue;

    if (f.status === 'no_result') {
      teamA.played++; teamB.played++;
      teamA.noResult++; teamB.noResult++;
      teamA.points += tournament.points_nr;
      teamB.points += tournament.points_nr;
      teamA.lastFive.push('NR');
      teamB.lastFive.push('NR');
      continue;
    }

    teamA.played++; teamB.played++;

    // Accumulate runs/overs for NRR
    if (f.team_a_runs != null && f.team_a_overs_faced != null) {
      teamA.runsScored += f.team_a_runs;
      teamA.oversFaced += convertOversToDecimal(f.team_a_overs_faced);
      teamB.runsConceded += f.team_a_runs;
      teamB.oversBowled += convertOversToDecimal(f.team_a_overs_faced);
    }
    if (f.team_b_runs != null && f.team_b_overs_faced != null) {
      teamB.runsScored += f.team_b_runs;
      teamB.oversFaced += convertOversToDecimal(f.team_b_overs_faced);
      teamA.runsConceded += f.team_b_runs;
      teamA.oversBowled += convertOversToDecimal(f.team_b_overs_faced);
    }

    if (f.winner_team_id === f.team_a_id) {
      teamA.won++; teamB.lost++;
      teamA.points += tournament.points_win;
      teamB.points += tournament.points_loss;
      teamA.lastFive.push('W'); teamB.lastFive.push('L');
    } else if (f.winner_team_id === f.team_b_id) {
      teamB.won++; teamA.lost++;
      teamB.points += tournament.points_win;
      teamA.points += tournament.points_loss;
      teamB.lastFive.push('W'); teamA.lastFive.push('L');
    } else {
      // Draw/tie
      teamA.drawn++; teamB.drawn++;
      teamA.points += tournament.points_draw;
      teamB.points += tournament.points_draw;
      teamA.lastFive.push('D'); teamB.lastFive.push('D');
    }
  }

  // Compute NRR and trim lastFive
  const standings = Array.from(map.values());
  for (const s of standings) {
    if (s.oversFaced > 0 && s.oversBowled > 0) {
      s.nrr = (s.runsScored / s.oversFaced) - (s.runsConceded / s.oversBowled);
    }
    s.lastFive = s.lastFive.slice(-5);
  }

  // Sort: points desc, then NRR desc
  standings.sort((a, b) => b.points - a.points || b.nrr - a.nrr);
  return standings;
}

interface TopPerformer {
  name: string;
  teamName: string;
  teamColor: string;
  value: number;
  detail: string;
}

interface TopPerformers {
  mostRuns: TopPerformer | null;
  mostWickets: TopPerformer | null;
  mvp: TopPerformer | null;
}

function computeTopPerformers(stats: ShowcasePlayerStat[], teams: ShowcaseTeam[]): TopPerformers {
  if (stats.length === 0) return { mostRuns: null, mostWickets: null, mvp: null };

  const teamMap = new Map(teams.map(t => [t.id, t]));

  // Aggregate per player
  const playerMap = new Map<string, { name: string; teamId: string; runs: number; wickets: number; balls: number; overs: number; runsConceded: number; momCount: number; innings: number }>();

  for (const s of stats) {
    const key = `${s.player_name}__${s.team_id}`;
    const existing = playerMap.get(key) || { name: s.player_name, teamId: s.team_id, runs: 0, wickets: 0, balls: 0, overs: 0, runsConceded: 0, momCount: 0, innings: 0 };
    existing.runs += s.runs_scored;
    existing.wickets += s.wickets_taken;
    existing.balls += s.balls_faced;
    existing.overs += s.overs_bowled;
    existing.runsConceded += s.runs_conceded;
    if (s.is_man_of_match) existing.momCount++;
    if (s.runs_scored > 0 || s.balls_faced > 0) existing.innings++;
    playerMap.set(key, existing);
  }

  const players = Array.from(playerMap.values());

  // Most Runs
  const topBatsman = players.sort((a, b) => b.runs - a.runs)[0];
  const mostRuns = topBatsman ? {
    name: topBatsman.name,
    teamName: teamMap.get(topBatsman.teamId)?.name || '',
    teamColor: teamMap.get(topBatsman.teamId)?.primary_color || '#10b981',
    value: topBatsman.runs,
    detail: `${topBatsman.innings} inn | SR: ${topBatsman.balls > 0 ? ((topBatsman.runs / topBatsman.balls) * 100).toFixed(1) : '0.0'}`,
  } : null;

  // Most Wickets
  const topBowler = [...players].sort((a, b) => b.wickets - a.wickets)[0];
  const mostWickets = topBowler && topBowler.wickets > 0 ? {
    name: topBowler.name,
    teamName: teamMap.get(topBowler.teamId)?.name || '',
    teamColor: teamMap.get(topBowler.teamId)?.primary_color || '#10b981',
    value: topBowler.wickets,
    detail: `${topBowler.overs} ov | Econ: ${topBowler.overs > 0 ? (topBowler.runsConceded / convertOversToDecimal(topBowler.overs)).toFixed(2) : '0.00'}`,
  } : null;

  // MVP (most MoM)
  const topMVP = [...players].sort((a, b) => b.momCount - a.momCount)[0];
  const mvp = topMVP && topMVP.momCount > 0 ? {
    name: topMVP.name,
    teamName: teamMap.get(topMVP.teamId)?.name || '',
    teamColor: teamMap.get(topMVP.teamId)?.primary_color || '#10b981',
    value: topMVP.momCount,
    detail: `${topMVP.runs} runs | ${topMVP.wickets} wkts`,
  } : null;

  return { mostRuns, mostWickets, mvp };
}

interface MomLeaderboardEntry {
  name: string;
  teamName: string;
  teamColor: string;
  count: number;
}

interface AwardData {
  momLeaderboard: MomLeaderboardEntry[];
  mostWinsTeam: { team: ShowcaseTeam; wins: number } | null;
  highestTeamScore: { team: ShowcaseTeam; score: string; runs: number } | null;
}

function computeAwards(
  standings: TeamStanding[],
  fixtures: ShowcaseFixture[],
  teams: ShowcaseTeam[]
): AwardData {
  const teamMap = new Map(teams.map(t => [t.id, t]));

  // MoM Leaderboard from fixture man_of_match_name
  const momMap = new Map<string, MomLeaderboardEntry>();
  for (const f of fixtures) {
    if (f.status === 'completed' && f.man_of_match_name) {
      const key = f.man_of_match_name;
      const team = f.man_of_match_team_id ? teamMap.get(f.man_of_match_team_id) : null;
      const existing = momMap.get(key) || {
        name: f.man_of_match_name,
        teamName: team?.name || '',
        teamColor: team?.primary_color || '#10b981',
        count: 0,
      };
      existing.count++;
      momMap.set(key, existing);
    }
  }
  const momLeaderboard = Array.from(momMap.values()).sort((a, b) => b.count - a.count);

  // Most Wins Team
  const mostWinsStanding = standings.length > 0
    ? standings.reduce((best, s) => s.won > best.won ? s : best, standings[0])
    : null;
  const mostWinsTeam = mostWinsStanding && mostWinsStanding.won > 0
    ? { team: mostWinsStanding.team, wins: mostWinsStanding.won }
    : null;

  // Highest Team Score in a single innings
  let highestTeamScore: AwardData['highestTeamScore'] = null;
  for (const f of fixtures) {
    if (f.status !== 'completed') continue;
    if (f.team_a_runs != null && (highestTeamScore === null || f.team_a_runs > highestTeamScore.runs)) {
      const team = teamMap.get(f.team_a_id);
      if (team) highestTeamScore = { team, score: f.team_a_score || `${f.team_a_runs}`, runs: f.team_a_runs };
    }
    if (f.team_b_runs != null && (highestTeamScore === null || f.team_b_runs > highestTeamScore.runs)) {
      const team = teamMap.get(f.team_b_id);
      if (team) highestTeamScore = { team, score: f.team_b_score || `${f.team_b_runs}`, runs: f.team_b_runs };
    }
  }

  return { momLeaderboard, mostWinsTeam, highestTeamScore };
}

interface TeamChartData {
  teamName: string;
  shortName: string;
  color: string;
  won: number;
  lost: number;
  drawn: number;
  runsScored: number;
  runsConceded: number;
}

function computeTeamChartData(standings: TeamStanding[]): TeamChartData[] {
  return standings.map(s => ({
    teamName: s.team.name,
    shortName: s.team.short_name || s.team.name.substring(0, 3).toUpperCase(),
    color: s.team.primary_color,
    won: s.won,
    lost: s.lost,
    drawn: s.drawn,
    runsScored: s.runsScored,
    runsConceded: Math.round(s.runsConceded),
  }));
}

export function useShowcaseTournament(slug: string) {
  const [tournament, setTournament] = useState<ShowcaseTournament | null>(null);
  const [teams, setTeams] = useState<ShowcaseTeam[]>([]);
  const [fixtures, setFixtures] = useState<ShowcaseFixture[]>([]);
  const [playerStats, setPlayerStats] = useState<ShowcasePlayerStat[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTournament = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const { data: tourney, error: tErr } = await supabase
        .from('showcase_tournaments')
        .select('*')
        .eq('slug', slug)
        .single();
      if (tErr) throw tErr;

      const { data: teamsData } = await supabase
        .from('showcase_teams')
        .select('*')
        .eq('tournament_id', tourney.id)
        .order('sort_order');

      const { data: fixturesData } = await supabase
        .from('showcase_fixtures')
        .select('*, team_a:team_a_id(*), team_b:team_b_id(*), winner_team:winner_team_id(*)')
        .eq('tournament_id', tourney.id)
        .order('match_number');

      const { data: statsData } = await supabase
        .from('showcase_player_stats')
        .select('*')
        .eq('tournament_id', tourney.id);

      setTournament(tourney);
      setTeams(teamsData || []);
      setFixtures(fixturesData || []);
      setPlayerStats(statsData || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Tournament not found');
    } finally {
      setLoading(false);
    }
  }, [slug]);

  useEffect(() => { fetchTournament(); }, [fetchTournament]);

  const standings = useMemo(() => computeStandings(teams, fixtures, tournament), [teams, fixtures, tournament]);
  const topPerformers = useMemo(() => computeTopPerformers(playerStats, teams), [playerStats, teams]);
  const awards = useMemo(() => computeAwards(standings, fixtures, teams), [standings, fixtures, teams]);
  const teamChartData = useMemo(() => computeTeamChartData(standings), [standings]);

  return { tournament, teams, fixtures, playerStats, standings, topPerformers, awards, teamChartData, loading, error, refetch: fetchTournament };
}
