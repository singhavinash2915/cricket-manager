import { useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Calendar, MapPin, Trophy, Award, ArrowRight, MessageCircle, Users, Target, Clock, ChevronLeft, ChevronRight, BarChart3, Flame, Shield, Star, Zap } from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';
import { CricMatesLogo } from '../components/CricMatesLogo';
import { useShowcaseTournament } from '../hooks/useShowcaseTournament';
import { usePlatformSettings } from '../hooks/usePlatformSettings';
import type { ShowcaseFixture, ShowcaseTeam } from '../types';

function formatDate(dateStr: string | null): string {
  if (!dateStr) return 'TBD';
  return new Date(dateStr).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
}

function formatDateRange(start: string, end: string | null): string {
  const s = new Date(start).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  if (!end) return `From ${s}`;
  const e = new Date(end).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  return `${s} – ${e}`;
}

function TeamLogo({ team, size = 'md', className = '' }: { team: ShowcaseTeam | undefined; size?: 'sm' | 'md' | 'lg' | 'xl'; className?: string }) {
  const sizeMap = { sm: 'w-6 h-6', md: 'w-8 h-8', lg: 'w-12 h-12', xl: 'w-16 h-16' };
  const textMap = { sm: 'text-[8px]', md: 'text-[10px]', lg: 'text-sm', xl: 'text-lg' };
  const dim = sizeMap[size];
  if (!team) return <div className={`${dim} rounded-xl bg-gray-700 ${className}`} />;
  if (team.logo_url) {
    return <img src={team.logo_url} alt={team.name} className={`${dim} rounded-xl object-cover shrink-0 ${className}`} />;
  }
  return (
    <div className={`${dim} rounded-xl flex items-center justify-center text-white font-bold ${textMap[size]} shrink-0 ${className}`} style={{ backgroundColor: team.primary_color }}>
      {team.short_name || team.name.substring(0, 2).toUpperCase()}
    </div>
  );
}

export function TournamentShowcase() {
  const { slug } = useParams<{ slug: string }>();
  const { tournament, teams, fixtures, sponsors, standings, topPerformers, awards, teamChartData, loading, error } = useShowcaseTournament(slug || '');
  const { settings } = usePlatformSettings();
  const [fixtureFilter, setFixtureFilter] = useState<'all' | 'completed' | 'upcoming'>('all');
  const scrollRef = useRef<HTMLDivElement>(null);

  const completedCount = fixtures.filter(f => f.status === 'completed').length;
  const remainingCount = fixtures.filter(f => f.status === 'upcoming' || f.status === 'live').length;
  const qualifyCount = Math.min(Math.ceil(teams.length * 0.4), 3);
  const progressPct = fixtures.length > 0 ? Math.round((completedCount / fixtures.length) * 100) : 0;

  const filteredFixtures = fixtures.filter(f => {
    if (fixtureFilter === 'completed') return f.status === 'completed';
    if (fixtureFilter === 'upcoming') return f.status === 'upcoming' || f.status === 'live';
    return true;
  });

  const recentMatches = fixtures
    .filter(f => f.status === 'completed' || f.status === 'live')
    .slice(-6)
    .reverse();

  const heroSponsors = sponsors.filter(s => s.tier === 'title' || s.tier === 'powered_by');

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0e1a] flex items-center justify-center">
        <div className="text-center">
          <div className="relative w-16 h-16 mx-auto mb-6">
            <div className="absolute inset-0 rounded-full border-4 border-amber-500/20" />
            <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-amber-400 animate-spin" />
            <Trophy className="w-6 h-6 text-amber-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
          </div>
          <p className="text-gray-400 text-sm font-medium tracking-wide">Loading tournament...</p>
        </div>
      </div>
    );
  }

  if (error || !tournament) {
    return (
      <div className="min-h-screen bg-[#0a0e1a] flex items-center justify-center p-4">
        <div className="text-center">
          <div className="w-20 h-20 rounded-full bg-gray-800/50 flex items-center justify-center mx-auto mb-6">
            <Trophy className="w-10 h-10 text-gray-600" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Tournament Not Found</h1>
          <p className="text-gray-500 mb-8">The tournament you're looking for doesn't exist.</p>
          <Link to="/pricing" className="inline-flex items-center gap-2 text-amber-400 hover:text-amber-300 font-semibold transition-colors">
            Go to CricMates <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0e1a] text-white">
      {/* === Floating Nav === */}
      <nav className="fixed top-0 inset-x-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-3">
          <div className="bg-white/[0.06] backdrop-blur-2xl rounded-2xl border border-white/[0.08] px-5 py-2.5 flex items-center justify-between">
            <Link to="/pricing" className="hover:opacity-80 transition-opacity">
              <CricMatesLogo size={32} showText textClassName="text-base text-white" />
            </Link>
            <div className="flex items-center gap-2">
              <Link to="/pricing" className="text-xs font-medium text-gray-400 hover:text-white transition-colors px-3 py-1.5 rounded-lg hover:bg-white/5">
                Pricing
              </Link>
              <Link to="/" className="text-xs font-bold text-black bg-gradient-to-r from-amber-400 to-amber-500 px-4 py-2 rounded-xl hover:from-amber-300 hover:to-amber-400 transition-all shadow-lg shadow-amber-500/20">
                Enter App
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* ========== SECTION 1: HERO ========== */}
      <section className="relative min-h-[85vh] flex items-center overflow-hidden pt-20">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,#1a1040_0%,#0a0e1a_70%)]" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-amber-500/[0.03] rounded-full blur-[120px]" />
          <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-purple-500/[0.02] rounded-full blur-[100px]" />
          <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-emerald-500/[0.02] rounded-full blur-[80px]" />
          {/* Grid pattern */}
          <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
        </div>

        <div className="relative w-full max-w-5xl mx-auto px-4 py-12 text-center">
          {/* Status Badge */}
          {tournament.status === 'live' && (
            <div className="inline-flex items-center gap-2 bg-red-500/10 backdrop-blur-xl text-red-400 text-xs font-bold px-5 py-2.5 rounded-full mb-8 border border-red-500/20 animate-pulse">
              <span className="w-2 h-2 bg-red-500 rounded-full" />
              LIVE NOW
            </div>
          )}
          {tournament.status === 'upcoming' && (
            <div className="inline-flex items-center gap-2 bg-amber-500/10 backdrop-blur-xl text-amber-400 text-xs font-bold px-5 py-2.5 rounded-full mb-8 border border-amber-500/20">
              <Zap className="w-3.5 h-3.5" /> COMING SOON
            </div>
          )}
          {tournament.status === 'completed' && (
            <div className="inline-flex items-center gap-2 bg-emerald-500/10 backdrop-blur-xl text-emerald-400 text-xs font-bold px-5 py-2.5 rounded-full mb-8 border border-emerald-500/20">
              <Trophy className="w-3.5 h-3.5" /> COMPLETED
            </div>
          )}

          {/* Organizer */}
          {tournament.organizer_name && (
            <p className="text-amber-400/50 text-[11px] font-semibold uppercase tracking-[0.3em] mb-4">
              {tournament.organizer_name} Presents
            </p>
          )}

          {/* Tournament Title */}
          <div className="mb-8">
            {tournament.short_name && (
              <div className="inline-block mb-3">
                <span className="text-4xl md:text-6xl lg:text-7xl font-black bg-gradient-to-r from-amber-200 via-yellow-300 to-amber-400 bg-clip-text text-transparent drop-shadow-[0_0_40px_rgba(251,191,36,0.15)]">
                  {tournament.short_name}
                </span>
              </div>
            )}
            <h1 className="text-lg md:text-xl font-medium text-gray-400 tracking-wide">
              {tournament.name}
            </h1>
          </div>

          {/* Meta Info Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 md:gap-3 mb-12">
            <span className="flex items-center gap-1.5 text-xs font-medium text-gray-300 bg-white/[0.05] backdrop-blur-sm px-4 py-2 rounded-full border border-white/[0.06]">
              <Calendar className="w-3.5 h-3.5 text-amber-400" /> {formatDateRange(tournament.start_date, tournament.end_date)}
            </span>
            <span className="flex items-center gap-1.5 text-xs font-medium text-gray-300 bg-white/[0.05] backdrop-blur-sm px-4 py-2 rounded-full border border-white/[0.06]">
              <MapPin className="w-3.5 h-3.5 text-emerald-400" /> {tournament.venue}
            </span>
            <span className="flex items-center gap-1.5 text-xs font-medium text-gray-300 bg-white/[0.05] backdrop-blur-sm px-4 py-2 rounded-full border border-white/[0.06]">
              <Flame className="w-3.5 h-3.5 text-orange-400" /> {tournament.format} | {tournament.overs} Overs
            </span>
            <span className="flex items-center gap-1.5 text-xs font-medium text-gray-300 bg-white/[0.05] backdrop-blur-sm px-4 py-2 rounded-full border border-white/[0.06]">
              <Shield className="w-3.5 h-3.5 text-violet-400" /> {tournament.total_teams} Teams
            </span>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-2xl mx-auto mb-10">
            {[
              { value: fixtures.length, label: 'Total Matches', color: 'from-blue-500/20 to-blue-600/10', accent: 'text-blue-400' },
              { value: completedCount, label: 'Completed', color: 'from-emerald-500/20 to-emerald-600/10', accent: 'text-emerald-400' },
              { value: teams.length, label: 'Teams', color: 'from-amber-500/20 to-amber-600/10', accent: 'text-amber-400' },
              { value: remainingCount, label: 'Remaining', color: 'from-violet-500/20 to-violet-600/10', accent: 'text-violet-400' },
            ].map(stat => (
              <div key={stat.label} className={`bg-gradient-to-br ${stat.color} backdrop-blur-sm rounded-2xl p-4 border border-white/[0.06]`}>
                <p className={`text-3xl md:text-4xl font-black ${stat.accent}`}>{stat.value}</p>
                <p className="text-[11px] text-gray-500 font-medium uppercase tracking-wider mt-1">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Progress Bar */}
          {fixtures.length > 0 && (
            <div className="max-w-sm mx-auto">
              <div className="flex items-center justify-between text-[11px] text-gray-500 font-medium mb-2">
                <span>{completedCount} of {fixtures.length} matches</span>
                <span className="text-amber-400">{progressPct}%</span>
              </div>
              <div className="h-2 bg-white/[0.06] rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-amber-400 via-amber-500 to-emerald-400 rounded-full transition-all duration-1000 ease-out"
                  style={{ width: `${progressPct}%` }}
                />
              </div>
            </div>
          )}

          {/* Powered By Sponsors */}
          {heroSponsors.length > 0 && (
            <div className="mt-12 pt-8 border-t border-white/[0.05]">
              <p className="text-[10px] uppercase tracking-[0.25em] text-gray-600 mb-4 font-medium">Powered by</p>
              <div className="flex flex-wrap items-center justify-center gap-8">
                {heroSponsors.map(sponsor => (
                  <a key={sponsor.id} href={sponsor.website_url || '#'} target="_blank" rel="noopener noreferrer"
                    className="hover:opacity-80 transition-opacity">
                    {sponsor.logo_url ? (
                      <img src={sponsor.logo_url} alt={sponsor.name} className="h-8 md:h-10 object-contain brightness-0 invert opacity-50 hover:opacity-80 transition-opacity" />
                    ) : (
                      <span className="text-gray-500 font-bold text-sm hover:text-gray-300 transition-colors">{sponsor.name}</span>
                    )}
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-5 h-8 rounded-full border-2 border-white/20 flex justify-center pt-1.5">
            <div className="w-1 h-2 bg-white/40 rounded-full" />
          </div>
        </div>
      </section>

      {/* ========== SECTION 2: POINTS TABLE ========== */}
      <section className="relative py-16 md:py-20">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0e1a] via-[#0d1220] to-[#0a0e1a]" />
        <div className="relative max-w-5xl mx-auto px-4">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-[0.2em] mb-3">
              <div className="w-8 h-px bg-amber-400/30" />
              <Trophy className="w-4 h-4" /> Points Table
              <div className="w-8 h-px bg-amber-400/30" />
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-white">Standings</h2>
          </div>

          <div className="bg-white/[0.03] backdrop-blur-sm rounded-3xl border border-white/[0.06] overflow-hidden shadow-2xl shadow-black/20">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[640px]">
                <thead>
                  <tr className="border-b border-white/[0.06]">
                    <th className="px-4 py-4 text-left text-[10px] uppercase tracking-wider text-gray-500 font-semibold w-10">#</th>
                    <th className="px-4 py-4 text-left text-[10px] uppercase tracking-wider text-gray-500 font-semibold">Team</th>
                    <th className="px-3 py-4 text-center text-[10px] uppercase tracking-wider text-gray-500 font-semibold">P</th>
                    <th className="px-3 py-4 text-center text-[10px] uppercase tracking-wider text-gray-500 font-semibold">W</th>
                    <th className="px-3 py-4 text-center text-[10px] uppercase tracking-wider text-gray-500 font-semibold">L</th>
                    <th className="px-3 py-4 text-center text-[10px] uppercase tracking-wider text-gray-500 font-semibold">D</th>
                    <th className="px-3 py-4 text-center text-[10px] uppercase tracking-wider text-gray-500 font-semibold">Pts</th>
                    <th className="px-3 py-4 text-center text-[10px] uppercase tracking-wider text-gray-500 font-semibold">NRR</th>
                    <th className="px-3 py-4 text-center text-[10px] uppercase tracking-wider text-gray-500 font-semibold hidden md:table-cell">Form</th>
                  </tr>
                </thead>
                <tbody>
                  {standings.map((row, i) => {
                    const isQualified = i < qualifyCount && row.played > 0;
                    return (
                      <tr key={row.team.id} className={`border-b border-white/[0.03] transition-colors hover:bg-white/[0.03] ${isQualified ? 'bg-emerald-500/[0.04]' : ''}`}>
                        <td className="px-4 py-4">
                          <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold ${
                            i === 0 ? 'bg-gradient-to-br from-amber-400 to-amber-600 text-black shadow-lg shadow-amber-500/20' :
                            i === 1 ? 'bg-gradient-to-br from-gray-300 to-gray-400 text-gray-800' :
                            i === 2 ? 'bg-gradient-to-br from-amber-700 to-amber-800 text-amber-200' :
                            'bg-white/[0.06] text-gray-500'
                          }`}>{i + 1}</div>
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-1 h-8 rounded-full shrink-0" style={{ backgroundColor: row.team.primary_color }} />
                            <TeamLogo team={row.team} size="md" />
                            <div>
                              <span className="font-bold text-white text-sm block">{row.team.name}</span>
                              {isQualified && <span className="text-[10px] text-emerald-400 font-semibold">Qualified</span>}
                            </div>
                          </div>
                        </td>
                        <td className="px-3 py-4 text-center text-sm text-gray-400">{row.played}</td>
                        <td className="px-3 py-4 text-center text-sm font-bold text-emerald-400">{row.won}</td>
                        <td className="px-3 py-4 text-center text-sm font-bold text-red-400">{row.lost}</td>
                        <td className="px-3 py-4 text-center text-sm text-gray-400">{row.drawn}</td>
                        <td className="px-3 py-4 text-center">
                          <span className="text-xl font-black text-white">{row.points}</span>
                        </td>
                        <td className="px-3 py-4 text-center">
                          <span className={`font-mono text-sm font-semibold ${row.nrr > 0 ? 'text-emerald-400' : row.nrr < 0 ? 'text-red-400' : 'text-gray-600'}`}>
                            {row.nrr > 0 ? '+' : ''}{row.nrr.toFixed(3)}
                          </span>
                        </td>
                        <td className="px-3 py-4 text-center hidden md:table-cell">
                          <div className="flex gap-1 justify-center">
                            {row.lastFive.length === 0 && <span className="text-[10px] text-gray-600">—</span>}
                            {row.lastFive.map((r, j) => (
                              <span key={j} className={`w-5 h-5 rounded text-[9px] font-bold flex items-center justify-center ${
                                r === 'W' ? 'bg-emerald-500/20 text-emerald-400' :
                                r === 'L' ? 'bg-red-500/20 text-red-400' :
                                'bg-gray-500/20 text-gray-400'
                              }`}>{r}</span>
                            ))}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            {standings.some(s => s.played > 0) && (
              <div className="px-5 py-3 border-t border-white/[0.04] flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-400" />
                <span className="text-[11px] text-gray-500 font-medium">Top {qualifyCount} teams qualify for playoffs</span>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ========== SECTION 3: MATCH CARDS CAROUSEL ========== */}
      {recentMatches.length > 0 && (
        <section className="relative py-16 md:py-20">
          <div className="absolute inset-0 bg-gradient-to-b from-[#0a0e1a] via-[#0f1628] to-[#0a0e1a]" />
          <div className="relative max-w-5xl mx-auto px-4">
            <div className="text-center mb-10">
              <div className="inline-flex items-center gap-2 text-red-400 text-xs font-bold uppercase tracking-[0.2em] mb-3">
                <div className="w-8 h-px bg-red-400/30" />
                <Flame className="w-4 h-4" /> Recent Matches
                <div className="w-8 h-px bg-red-400/30" />
              </div>
              <h2 className="text-3xl md:text-4xl font-black text-white">Latest Results</h2>
            </div>

            <div className="relative">
              <button
                onClick={() => scrollRef.current?.scrollBy({ left: -340, behavior: 'smooth' })}
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 z-10 w-10 h-10 bg-white/[0.08] backdrop-blur-xl rounded-xl flex items-center justify-center border border-white/[0.1] hover:bg-white/[0.15] transition-all hidden md:flex"
              >
                <ChevronLeft className="w-5 h-5 text-gray-300" />
              </button>
              <button
                onClick={() => scrollRef.current?.scrollBy({ left: 340, behavior: 'smooth' })}
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 z-10 w-10 h-10 bg-white/[0.08] backdrop-blur-xl rounded-xl flex items-center justify-center border border-white/[0.1] hover:bg-white/[0.15] transition-all hidden md:flex"
              >
                <ChevronRight className="w-5 h-5 text-gray-300" />
              </button>

              <div ref={scrollRef} className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory" style={{ scrollbarWidth: 'none' }}>
                {recentMatches.map(fixture => {
                  const isLive = fixture.status === 'live';
                  return (
                    <div key={fixture.id} className={`min-w-[320px] snap-start rounded-2xl border p-5 shrink-0 transition-all ${
                      isLive ? 'bg-red-500/[0.06] border-red-500/20 shadow-lg shadow-red-500/5' : 'bg-white/[0.03] border-white/[0.06] hover:bg-white/[0.05]'
                    }`}>
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-[11px] text-gray-500 font-semibold">Match {fixture.match_number}</span>
                        {isLive ? (
                          <span className="flex items-center gap-1.5 text-[11px] font-bold text-red-400 bg-red-500/10 px-2.5 py-1 rounded-full">
                            <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" /> LIVE
                          </span>
                        ) : (
                          <span className="text-[11px] text-gray-600">{formatDate(fixture.date)}</span>
                        )}
                      </div>

                      {/* Team A */}
                      <div className="flex items-center justify-between mb-2.5">
                        <div className="flex items-center gap-2.5">
                          <TeamLogo team={fixture.team_a as ShowcaseTeam | undefined} size="sm" />
                          <span className={`font-semibold text-sm ${fixture.winner_team_id === fixture.team_a_id ? 'text-white' : 'text-gray-500'}`}>
                            {fixture.team_a?.short_name || fixture.team_a?.name || 'TBD'}
                          </span>
                        </div>
                        <span className={`font-bold text-sm tabular-nums ${fixture.winner_team_id === fixture.team_a_id ? 'text-emerald-400' : 'text-gray-500'}`}>
                          {fixture.team_a_score || '-'}
                        </span>
                      </div>

                      {/* Team B */}
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2.5">
                          <TeamLogo team={fixture.team_b as ShowcaseTeam | undefined} size="sm" />
                          <span className={`font-semibold text-sm ${fixture.winner_team_id === fixture.team_b_id ? 'text-white' : 'text-gray-500'}`}>
                            {fixture.team_b?.short_name || fixture.team_b?.name || 'TBD'}
                          </span>
                        </div>
                        <span className={`font-bold text-sm tabular-nums ${fixture.winner_team_id === fixture.team_b_id ? 'text-emerald-400' : 'text-gray-500'}`}>
                          {fixture.team_b_score || '-'}
                        </span>
                      </div>

                      {fixture.result_summary && (
                        <div className="pt-3 border-t border-white/[0.05]">
                          <p className="text-[11px] text-gray-500 truncate">{fixture.result_summary}</p>
                          {fixture.man_of_match_name && (
                            <p className="text-[11px] text-amber-400/70 mt-1 flex items-center gap-1">
                              <Star className="w-3 h-3" /> {fixture.man_of_match_name}
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ========== SECTION 4: ALL FIXTURES ========== */}
      <section className="relative py-16 md:py-20">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0e1a] via-[#0d1220] to-[#0a0e1a]" />
        <div className="relative max-w-5xl mx-auto px-4">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 text-blue-400 text-xs font-bold uppercase tracking-[0.2em] mb-3">
              <div className="w-8 h-px bg-blue-400/30" />
              <Calendar className="w-4 h-4" /> Schedule
              <div className="w-8 h-px bg-blue-400/30" />
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-white">Fixtures & Results</h2>
          </div>

          {/* Filter Tabs */}
          <div className="flex gap-1.5 justify-center mb-8 bg-white/[0.03] backdrop-blur-sm rounded-2xl p-1.5 border border-white/[0.06] max-w-sm mx-auto">
            {(['all', 'completed', 'upcoming'] as const).map(f => (
              <button key={f} onClick={() => setFixtureFilter(f)} className={`flex-1 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                fixtureFilter === f
                  ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-black shadow-lg shadow-amber-500/20'
                  : 'text-gray-400 hover:text-white hover:bg-white/[0.05]'
              }`}>
                {f === 'all' ? 'All' : f === 'completed' ? 'Results' : 'Upcoming'}
              </button>
            ))}
          </div>

          <div className="space-y-3">
            {filteredFixtures.length === 0 && (
              <p className="text-center text-gray-600 py-12 text-sm">No matches to show</p>
            )}
            {filteredFixtures.map(fixture => (
              <FixtureCard key={fixture.id} fixture={fixture} />
            ))}
          </div>
        </div>
      </section>

      {/* ========== SECTION 5: AWARDS ========== */}
      {(topPerformers.mostRuns || topPerformers.mostWickets || topPerformers.mvp || awards.momLeaderboard.length > 0 || awards.mostWinsTeam || awards.highestTeamScore) && (
        <section className="relative py-16 md:py-20">
          <div className="absolute inset-0 bg-gradient-to-b from-[#0a0e1a] via-[#12162a] to-[#0a0e1a]" />
          <div className="relative max-w-5xl mx-auto px-4">
            <div className="text-center mb-10">
              <div className="inline-flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-[0.2em] mb-3">
                <div className="w-8 h-px bg-amber-400/30" />
                <Award className="w-4 h-4" /> Awards
                <div className="w-8 h-px bg-amber-400/30" />
              </div>
              <h2 className="text-3xl md:text-4xl font-black text-white">Tournament Awards</h2>
            </div>

            {/* Player Awards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              {topPerformers.mostRuns && (
                <div className="group relative overflow-hidden rounded-2xl border border-orange-500/20 bg-gradient-to-br from-orange-500/[0.08] to-transparent p-6 hover:border-orange-500/30 transition-all">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/[0.05] rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
                  <div className="relative">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-8 h-8 rounded-lg bg-orange-500/20 flex items-center justify-center">
                        <span className="text-sm">🧢</span>
                      </div>
                      <span className="text-xs font-bold text-orange-400 uppercase tracking-wider">Orange Cap</span>
                    </div>
                    <p className="text-lg font-black text-white">{topPerformers.mostRuns.name}</p>
                    <p className="text-xs text-gray-500 mb-3">{topPerformers.mostRuns.teamName}</p>
                    <p className="text-3xl font-black text-orange-400">{topPerformers.mostRuns.value} <span className="text-sm font-semibold text-gray-500">runs</span></p>
                    <p className="text-[11px] text-gray-600 mt-1">{topPerformers.mostRuns.detail}</p>
                  </div>
                </div>
              )}
              {topPerformers.mostWickets && (
                <div className="group relative overflow-hidden rounded-2xl border border-purple-500/20 bg-gradient-to-br from-purple-500/[0.08] to-transparent p-6 hover:border-purple-500/30 transition-all">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/[0.05] rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
                  <div className="relative">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center">
                        <span className="text-sm">🧢</span>
                      </div>
                      <span className="text-xs font-bold text-purple-400 uppercase tracking-wider">Purple Cap</span>
                    </div>
                    <p className="text-lg font-black text-white">{topPerformers.mostWickets.name}</p>
                    <p className="text-xs text-gray-500 mb-3">{topPerformers.mostWickets.teamName}</p>
                    <p className="text-3xl font-black text-purple-400">{topPerformers.mostWickets.value} <span className="text-sm font-semibold text-gray-500">wickets</span></p>
                    <p className="text-[11px] text-gray-600 mt-1">{topPerformers.mostWickets.detail}</p>
                  </div>
                </div>
              )}
              {topPerformers.mvp && (
                <div className="group relative overflow-hidden rounded-2xl border border-amber-500/20 bg-gradient-to-br from-amber-500/[0.08] to-transparent p-6 hover:border-amber-500/30 transition-all">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/[0.05] rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
                  <div className="relative">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-8 h-8 rounded-lg bg-amber-500/20 flex items-center justify-center">
                        <Trophy className="w-4 h-4 text-amber-400" />
                      </div>
                      <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">MVP</span>
                    </div>
                    <p className="text-lg font-black text-white">{topPerformers.mvp.name}</p>
                    <p className="text-xs text-gray-500 mb-3">{topPerformers.mvp.teamName}</p>
                    <p className="text-3xl font-black text-amber-400">{topPerformers.mvp.value} <span className="text-sm font-semibold text-gray-500">MoM</span></p>
                    <p className="text-[11px] text-gray-600 mt-1">{topPerformers.mvp.detail}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Team Awards */}
            {(awards.mostWinsTeam || awards.highestTeamScore) && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                {awards.mostWinsTeam && (
                  <div className="rounded-2xl border border-emerald-500/20 bg-gradient-to-br from-emerald-500/[0.06] to-transparent p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <Trophy className="w-4 h-4 text-emerald-400" />
                      <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Most Wins</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <TeamLogo team={awards.mostWinsTeam.team} size="lg" />
                      <div>
                        <p className="text-lg font-black text-white">{awards.mostWinsTeam.team.name}</p>
                        <p className="text-2xl font-black text-emerald-400">{awards.mostWinsTeam.wins} wins</p>
                      </div>
                    </div>
                  </div>
                )}
                {awards.highestTeamScore && (
                  <div className="rounded-2xl border border-blue-500/20 bg-gradient-to-br from-blue-500/[0.06] to-transparent p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <Target className="w-4 h-4 text-blue-400" />
                      <span className="text-xs font-bold text-blue-400 uppercase tracking-wider">Highest Score</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <TeamLogo team={awards.highestTeamScore.team} size="lg" />
                      <div>
                        <p className="text-lg font-black text-white">{awards.highestTeamScore.team.name}</p>
                        <p className="text-2xl font-black text-blue-400">{awards.highestTeamScore.score}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* MoM Leaderboard */}
            {awards.momLeaderboard.length > 0 && (
              <div className="bg-white/[0.03] backdrop-blur-sm rounded-2xl border border-white/[0.06] overflow-hidden">
                <div className="px-6 py-4 border-b border-white/[0.04] flex items-center gap-2">
                  <Star className="w-4 h-4 text-amber-400" />
                  <h3 className="font-bold text-white text-sm">Man of the Match Leaderboard</h3>
                </div>
                <div>
                  {awards.momLeaderboard.slice(0, 8).map((entry, i) => (
                    <div key={entry.name} className="flex items-center justify-between px-6 py-3 border-b border-white/[0.02] last:border-0 hover:bg-white/[0.02] transition-colors">
                      <div className="flex items-center gap-3">
                        <span className={`w-6 h-6 rounded-lg flex items-center justify-center text-[10px] font-bold ${
                          i === 0 ? 'bg-amber-400/20 text-amber-400' : 'bg-white/[0.05] text-gray-500'
                        }`}>{i + 1}</span>
                        <div>
                          <p className="font-semibold text-sm text-white">{entry.name}</p>
                          <p className="text-[11px] text-gray-600">{entry.teamName}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.teamColor }} />
                        <span className="font-black text-white">{entry.count}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* ========== SECTION 6: TEAM PERFORMANCE CHARTS ========== */}
      {teamChartData.some(d => d.won > 0 || d.lost > 0) && (
        <section className="relative py-16 md:py-20">
          <div className="absolute inset-0 bg-gradient-to-b from-[#0a0e1a] via-[#0d1220] to-[#0a0e1a]" />
          <div className="relative max-w-5xl mx-auto px-4">
            <div className="text-center mb-10">
              <div className="inline-flex items-center gap-2 text-violet-400 text-xs font-bold uppercase tracking-[0.2em] mb-3">
                <div className="w-8 h-px bg-violet-400/30" />
                <BarChart3 className="w-4 h-4" /> Analytics
                <div className="w-8 h-px bg-violet-400/30" />
              </div>
              <h2 className="text-3xl md:text-4xl font-black text-white">Team Performance</h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="bg-white/[0.03] backdrop-blur-sm rounded-2xl border border-white/[0.06] p-6">
                <h3 className="font-bold text-white text-sm mb-5">Wins / Losses / Draws</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={teamChartData} barCategoryGap="20%">
                      <CartesianGrid strokeDasharray="3 3" stroke="#ffffff08" />
                      <XAxis dataKey="shortName" tick={{ fontSize: 11, fill: '#6B7280' }} axisLine={{ stroke: '#ffffff08' }} tickLine={false} />
                      <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: '#6B7280' }} axisLine={false} tickLine={false} />
                      <Tooltip contentStyle={{ backgroundColor: '#1a1e2e', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', color: '#fff', fontSize: '12px' }}
                        labelFormatter={label => teamChartData.find(d => d.shortName === label)?.teamName || label} />
                      <Legend wrapperStyle={{ fontSize: '11px' }} />
                      <Bar dataKey="won" name="Won" fill="#10b981" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="lost" name="Lost" fill="#ef4444" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="drawn" name="Drawn" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-white/[0.03] backdrop-blur-sm rounded-2xl border border-white/[0.06] p-6">
                <h3 className="font-bold text-white text-sm mb-5">Runs Scored vs Conceded</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={teamChartData} barCategoryGap="20%">
                      <CartesianGrid strokeDasharray="3 3" stroke="#ffffff08" />
                      <XAxis dataKey="shortName" tick={{ fontSize: 11, fill: '#6B7280' }} axisLine={{ stroke: '#ffffff08' }} tickLine={false} />
                      <YAxis tick={{ fontSize: 11, fill: '#6B7280' }} axisLine={false} tickLine={false} />
                      <Tooltip contentStyle={{ backgroundColor: '#1a1e2e', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', color: '#fff', fontSize: '12px' }}
                        labelFormatter={label => teamChartData.find(d => d.shortName === label)?.teamName || label} />
                      <Legend wrapperStyle={{ fontSize: '11px' }} />
                      <Bar dataKey="runsScored" name="Scored" fill="#10b981" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="runsConceded" name="Conceded" fill="#f43f5e" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ========== SECTION 7: TEAMS ========== */}
      <section className="relative py-16 md:py-20">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0e1a] via-[#0f1628] to-[#0a0e1a]" />
        <div className="relative max-w-5xl mx-auto px-4">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-[0.2em] mb-3">
              <div className="w-8 h-px bg-emerald-400/30" />
              <Shield className="w-4 h-4" /> Participants
              <div className="w-8 h-px bg-emerald-400/30" />
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-white">Teams</h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {teams.map(team => (
              <div key={team.id} className="group bg-white/[0.03] backdrop-blur-sm rounded-2xl border border-white/[0.06] p-6 text-center hover:bg-white/[0.06] hover:border-white/[0.1] hover:-translate-y-1 transition-all">
                <div className="relative w-16 h-16 mx-auto mb-4">
                  {team.logo_url ? (
                    <img src={team.logo_url} alt={team.name} className="w-16 h-16 rounded-2xl object-cover shadow-lg" />
                  ) : (
                    <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-white font-black text-xl shadow-lg" style={{ backgroundColor: team.primary_color }}>
                      {team.short_name || team.name.substring(0, 2).toUpperCase()}
                    </div>
                  )}
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-[#0a0e1a]" style={{ backgroundColor: team.primary_color }} />
                </div>
                <p className="font-bold text-white text-sm mb-1">{team.name}</p>
                {team.captain_name && (
                  <p className="text-[11px] text-gray-500">Capt: {team.captain_name}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== CTA ========== */}
      <section className="relative overflow-hidden py-20">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-600 via-teal-500 to-cyan-500" />
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '32px 32px' }} />
        <div className="absolute top-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 right-0 w-72 h-72 bg-emerald-400/20 rounded-full blur-[80px]" />

        <div className="relative max-w-3xl mx-auto px-4 text-center">
          <CricMatesLogo size={44} className="justify-center mb-5" showText textClassName="text-xl text-white" />
          <h2 className="text-3xl md:text-4xl font-black text-white mb-4">
            Want This for Your Club?
          </h2>
          <p className="text-base text-emerald-100/80 mb-10 max-w-lg mx-auto leading-relaxed">
            CricMates helps cricket clubs manage members, matches, tournaments, and finances. Start your free 15-day trial.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href={`https://wa.me/${settings.contact.whatsapp}?text=${encodeURIComponent('Hi, I saw the tournament page and want to start a free trial for my cricket club on CricMates.')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-white text-emerald-700 font-bold py-4 px-8 rounded-2xl hover:bg-emerald-50 transition-all text-base shadow-2xl shadow-black/20 hover:scale-[1.02]"
            >
              <MessageCircle className="w-5 h-5" /> Start Free Trial
            </a>
            <Link
              to="/pricing"
              className="inline-flex items-center justify-center gap-2 bg-white/10 text-white font-bold py-4 px-8 rounded-2xl hover:bg-white/20 transition-all text-base border border-white/20 backdrop-blur-sm"
            >
              View Pricing <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* ========== FOOTER ========== */}
      <footer className="bg-[#060810] text-gray-400 py-12">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <CricMatesLogo size={32} className="justify-center mb-3" showText textClassName="text-base text-gray-300" />
          <p className="text-xs text-gray-600 mb-4">The complete cricket club management platform</p>
          <div className="flex items-center justify-center gap-6 text-xs flex-wrap">
            <a href={`https://wa.me/${settings.contact.whatsapp}`} target="_blank" rel="noopener noreferrer" className="hover:text-emerald-400 transition-colors flex items-center gap-1.5">
              <MessageCircle className="w-3.5 h-3.5" /> WhatsApp
            </a>
            <Link to="/pricing" className="hover:text-emerald-400 transition-colors">Pricing</Link>
            <Link to="/how-it-works" className="hover:text-emerald-400 transition-colors">How It Works</Link>
          </div>
          {sponsors.length > 0 && (
            <div className="my-8 py-6 border-t border-b border-white/[0.04]">
              <p className="text-[10px] text-gray-600 uppercase tracking-[0.2em] mb-4 font-medium">Tournament Partners</p>
              <div className="flex flex-wrap justify-center gap-8 items-center">
                {sponsors.map(sponsor => (
                  <a key={sponsor.id} href={sponsor.website_url || '#'} target="_blank" rel="noopener noreferrer"
                    className="opacity-40 hover:opacity-80 transition-all">
                    {sponsor.logo_url ? (
                      <img src={sponsor.logo_url} alt={sponsor.name} className="h-7 object-contain brightness-0 invert" />
                    ) : (
                      <span className="text-xs font-semibold text-gray-500">{sponsor.name}</span>
                    )}
                  </a>
                ))}
              </div>
            </div>
          )}
          <div className="mt-8 pt-6 border-t border-white/[0.03]">
            <p className="text-[11px] text-gray-700">Powered by CricMates — Built for cricket lovers across India</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

// --- Fixture Card Component ---
function FixtureCard({ fixture }: { fixture: ShowcaseFixture }) {
  const isLive = fixture.status === 'live';
  const isCompleted = fixture.status === 'completed';

  return (
    <div className={`rounded-2xl border overflow-hidden transition-all hover:border-white/[0.1] ${
      isLive ? 'bg-red-500/[0.04] border-red-500/20' : 'bg-white/[0.02] border-white/[0.05]'
    }`}>
      {/* Header */}
      <div className="px-5 py-2.5 flex items-center justify-between border-b border-white/[0.03]">
        <span className="text-[11px] text-gray-600 font-semibold">Match {fixture.match_number}</span>
        <div className="flex items-center gap-2">
          <span className="text-[11px] text-gray-600">{formatDate(fixture.date)} {fixture.time && `| ${fixture.time}`}</span>
          {isLive && (
            <span className="flex items-center gap-1 text-[10px] font-bold text-red-400 bg-red-500/10 px-2 py-0.5 rounded-full">
              <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" /> LIVE
            </span>
          )}
          {fixture.status === 'upcoming' && (
            <span className="text-[10px] font-semibold text-amber-500/70 bg-amber-500/10 px-2 py-0.5 rounded-full">Upcoming</span>
          )}
        </div>
      </div>

      {/* Match Content */}
      <div className="px-5 py-5">
        <div className="flex items-center justify-between gap-4">
          {/* Team A */}
          <div className="flex-1 text-center md:text-right">
            <div className="flex items-center gap-2.5 justify-center md:justify-end mb-2">
              <span className="font-bold text-white text-sm truncate">{fixture.team_a?.name || 'TBD'}</span>
              <TeamLogo team={fixture.team_a as ShowcaseTeam | undefined} size="md" />
            </div>
            {fixture.team_a_score ? (
              <p className={`text-xl md:text-2xl font-black tabular-nums ${fixture.winner_team_id === fixture.team_a_id ? 'text-emerald-400' : 'text-gray-600'}`}>
                {fixture.team_a_score}
              </p>
            ) : (
              !isCompleted && fixture.status !== 'upcoming' && <p className="text-gray-700">—</p>
            )}
          </div>

          {/* VS Badge */}
          <div className="flex-shrink-0 px-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-[10px] font-black ${
              isCompleted ? 'bg-emerald-500/10 text-emerald-400' : 'bg-white/[0.04] text-gray-600'
            }`}>
              {isCompleted ? <Target className="w-4 h-4" /> : 'VS'}
            </div>
          </div>

          {/* Team B */}
          <div className="flex-1 text-center md:text-left">
            <div className="flex items-center gap-2.5 justify-center md:justify-start mb-2">
              <TeamLogo team={fixture.team_b as ShowcaseTeam | undefined} size="md" />
              <span className="font-bold text-white text-sm truncate">{fixture.team_b?.name || 'TBD'}</span>
            </div>
            {fixture.team_b_score ? (
              <p className={`text-xl md:text-2xl font-black tabular-nums ${fixture.winner_team_id === fixture.team_b_id ? 'text-emerald-400' : 'text-gray-600'}`}>
                {fixture.team_b_score}
              </p>
            ) : (
              !isCompleted && fixture.status !== 'upcoming' && <p className="text-gray-700">—</p>
            )}
          </div>
        </div>

        {fixture.result_summary && (
          <div className="text-center mt-4 pt-3 border-t border-white/[0.04]">
            <p className="text-xs text-gray-500">{fixture.result_summary}</p>
            {fixture.man_of_match_name && (
              <p className="mt-1.5 inline-flex items-center gap-1 text-[11px] text-amber-400/70 font-medium">
                <Star className="w-3 h-3" /> MoM: {fixture.man_of_match_name}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
