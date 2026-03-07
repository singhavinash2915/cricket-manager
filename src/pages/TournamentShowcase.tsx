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
  if (!team) return <div className={`${dim} rounded-xl bg-gray-200 ${className}`} />;
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
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-rose-50 flex items-center justify-center">
        <div className="text-center">
          <div className="relative w-16 h-16 mx-auto mb-6">
            <div className="absolute inset-0 rounded-full border-4 border-indigo-200" />
            <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-indigo-500 animate-spin" />
            <Trophy className="w-6 h-6 text-indigo-500 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
          </div>
          <p className="text-gray-500 text-sm font-medium">Loading tournament...</p>
        </div>
      </div>
    );
  }

  if (error || !tournament) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-rose-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="w-20 h-20 rounded-2xl bg-indigo-100 flex items-center justify-center mx-auto mb-6">
            <Trophy className="w-10 h-10 text-indigo-400" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Tournament Not Found</h1>
          <p className="text-gray-500 mb-8">The tournament you're looking for doesn't exist.</p>
          <Link to="/pricing" className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-700 font-semibold transition-colors">
            Go to CricMates <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* === Nav === */}
      <nav className="bg-white/80 backdrop-blur-xl border-b border-gray-100 sticky top-0 z-50 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link to="/pricing" className="hover:opacity-80 transition-opacity">
            <CricMatesLogo size={32} showText textClassName="text-base text-gray-800" />
          </Link>
          <div className="flex items-center gap-2">
            <Link to="/pricing" className="text-xs font-medium text-gray-500 hover:text-gray-800 transition-colors px-3 py-2 rounded-lg hover:bg-gray-100">
              Pricing
            </Link>
            <Link to="/" className="text-xs font-bold text-white bg-gradient-to-r from-indigo-500 to-violet-500 px-4 py-2 rounded-xl hover:shadow-lg hover:shadow-indigo-200 transition-all flex items-center gap-1">
              Enter App <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </nav>

      {/* ========== HERO ========== */}
      <section className="relative overflow-hidden">
        {/* Colorful gradient bg */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-700" />
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-pink-400/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-400/20 rounded-full blur-[100px]" />
        <div className="absolute top-1/2 right-0 w-[300px] h-[300px] bg-amber-400/10 rounded-full blur-[80px]" />
        {/* Dot pattern */}
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '24px 24px' }} />

        <div className="relative max-w-5xl mx-auto px-4 py-16 md:py-24 text-center text-white">
          {/* Status */}
          {tournament.status === 'live' && (
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm text-white text-xs font-bold px-5 py-2.5 rounded-full mb-8 border border-white/20">
              <span className="w-2 h-2 bg-red-400 rounded-full animate-pulse" /> LIVE NOW
            </div>
          )}
          {tournament.status === 'upcoming' && (
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm text-white text-xs font-bold px-5 py-2.5 rounded-full mb-8 border border-white/20">
              <Zap className="w-3.5 h-3.5" /> COMING SOON
            </div>
          )}
          {tournament.status === 'completed' && (
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm text-white text-xs font-bold px-5 py-2.5 rounded-full mb-8 border border-white/20">
              <Trophy className="w-3.5 h-3.5" /> COMPLETED
            </div>
          )}

          {tournament.organizer_name && (
            <p className="text-white/50 text-[11px] font-semibold uppercase tracking-[0.3em] mb-4">
              {tournament.organizer_name} Presents
            </p>
          )}

          {/* Title */}
          <div className="mb-8">
            {tournament.short_name && (
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-black mb-2 tracking-tight text-white drop-shadow-lg">
                {tournament.short_name}
              </h1>
            )}
            <p className="text-lg md:text-xl font-medium text-white/70">{tournament.name}</p>
          </div>

          {/* Meta Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
            {[
              { icon: Calendar, text: formatDateRange(tournament.start_date, tournament.end_date) },
              { icon: MapPin, text: tournament.venue },
              { icon: Flame, text: `${tournament.format} | ${tournament.overs} Overs` },
              { icon: Shield, text: `${tournament.total_teams} Teams` },
            ].map((pill, idx) => (
              <span key={idx} className="flex items-center gap-1.5 text-xs font-medium text-white/90 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/10">
                <pill.icon className="w-3.5 h-3.5 text-amber-300" /> {pill.text}
              </span>
            ))}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-2xl mx-auto mb-10">
            {[
              { value: fixtures.length, label: 'Matches', color: 'from-white/20 to-white/5' },
              { value: completedCount, label: 'Completed', color: 'from-emerald-400/20 to-emerald-400/5' },
              { value: teams.length, label: 'Teams', color: 'from-amber-400/20 to-amber-400/5' },
              { value: remainingCount, label: 'Remaining', color: 'from-pink-400/20 to-pink-400/5' },
            ].map(stat => (
              <div key={stat.label} className={`bg-gradient-to-br ${stat.color} backdrop-blur-sm rounded-2xl p-4 border border-white/10`}>
                <p className="text-3xl md:text-4xl font-black text-white">{stat.value}</p>
                <p className="text-[11px] text-white/50 font-semibold uppercase tracking-wider mt-1">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Progress */}
          {fixtures.length > 0 && (
            <div className="max-w-sm mx-auto">
              <div className="flex items-center justify-between text-[11px] text-white/50 font-medium mb-2">
                <span>{completedCount} of {fixtures.length} matches</span>
                <span className="text-amber-300 font-bold">{progressPct}%</span>
              </div>
              <div className="h-2.5 bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-amber-300 to-emerald-300 rounded-full transition-all duration-1000" style={{ width: `${progressPct}%` }} />
              </div>
            </div>
          )}

          {/* Powered By */}
          {heroSponsors.length > 0 && (
            <div className="mt-12 pt-8 border-t border-white/10">
              <p className="text-[10px] uppercase tracking-[0.25em] text-white/30 mb-4 font-semibold">Powered by</p>
              <div className="flex flex-wrap items-center justify-center gap-8">
                {heroSponsors.map(sponsor => (
                  <a key={sponsor.id} href={sponsor.website_url || '#'} target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition-opacity">
                    {sponsor.logo_url ? (
                      <img src={sponsor.logo_url} alt={sponsor.name} className="h-8 md:h-10 object-contain brightness-0 invert opacity-60 hover:opacity-90 transition-opacity" />
                    ) : (
                      <span className="text-white/60 font-bold text-sm hover:text-white/90 transition-colors">{sponsor.name}</span>
                    )}
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ========== POINTS TABLE ========== */}
      <section className="max-w-5xl mx-auto px-4 py-14 md:py-20">
        <div className="text-center mb-10">
          <span className="inline-flex items-center gap-2 text-xs font-bold text-indigo-600 bg-indigo-50 px-4 py-2 rounded-full mb-3 uppercase tracking-wider">
            <Trophy className="w-3.5 h-3.5" /> Points Table
          </span>
          <h2 className="text-3xl md:text-4xl font-black text-gray-900">Standings</h2>
        </div>

        <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-xl shadow-gray-200/50">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px]">
              <thead>
                <tr className="bg-gradient-to-r from-indigo-50 to-violet-50 border-b border-indigo-100/50">
                  <th className="px-4 py-4 text-left text-[10px] uppercase tracking-wider text-indigo-400 font-bold w-10">#</th>
                  <th className="px-4 py-4 text-left text-[10px] uppercase tracking-wider text-indigo-400 font-bold">Team</th>
                  <th className="px-3 py-4 text-center text-[10px] uppercase tracking-wider text-indigo-400 font-bold">P</th>
                  <th className="px-3 py-4 text-center text-[10px] uppercase tracking-wider text-indigo-400 font-bold">W</th>
                  <th className="px-3 py-4 text-center text-[10px] uppercase tracking-wider text-indigo-400 font-bold">L</th>
                  <th className="px-3 py-4 text-center text-[10px] uppercase tracking-wider text-indigo-400 font-bold">D</th>
                  <th className="px-3 py-4 text-center text-[10px] uppercase tracking-wider text-indigo-400 font-bold">Pts</th>
                  <th className="px-3 py-4 text-center text-[10px] uppercase tracking-wider text-indigo-400 font-bold">NRR</th>
                  <th className="px-3 py-4 text-center text-[10px] uppercase tracking-wider text-indigo-400 font-bold hidden md:table-cell">Form</th>
                </tr>
              </thead>
              <tbody>
                {standings.map((row, i) => {
                  const isQualified = i < qualifyCount && row.played > 0;
                  return (
                    <tr key={row.team.id} className={`border-b border-gray-50 transition-colors hover:bg-indigo-50/30 ${isQualified ? 'bg-emerald-50/40' : ''}`}>
                      <td className="px-4 py-4">
                        <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold shadow-sm ${
                          i === 0 ? 'bg-gradient-to-br from-amber-400 to-orange-500 text-white' :
                          i === 1 ? 'bg-gradient-to-br from-gray-300 to-gray-400 text-white' :
                          i === 2 ? 'bg-gradient-to-br from-amber-600 to-amber-700 text-amber-100' :
                          'bg-gray-100 text-gray-500'
                        }`}>{i + 1}</div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-1 h-8 rounded-full shrink-0" style={{ backgroundColor: row.team.primary_color }} />
                          <TeamLogo team={row.team} size="md" />
                          <div>
                            <span className="font-bold text-gray-800 text-sm block">{row.team.name}</span>
                            {isQualified && <span className="text-[10px] text-emerald-600 font-bold uppercase tracking-wider">Qualified</span>}
                          </div>
                        </div>
                      </td>
                      <td className="px-3 py-4 text-center text-sm text-gray-500 font-medium">{row.played}</td>
                      <td className="px-3 py-4 text-center text-sm font-bold text-emerald-600">{row.won}</td>
                      <td className="px-3 py-4 text-center text-sm font-bold text-red-500">{row.lost}</td>
                      <td className="px-3 py-4 text-center text-sm text-gray-500">{row.drawn}</td>
                      <td className="px-3 py-4 text-center">
                        <span className="text-xl font-black text-gray-900">{row.points}</span>
                      </td>
                      <td className="px-3 py-4 text-center">
                        <span className={`font-mono text-sm font-semibold ${row.nrr > 0 ? 'text-emerald-600' : row.nrr < 0 ? 'text-red-500' : 'text-gray-400'}`}>
                          {row.nrr > 0 ? '+' : ''}{row.nrr.toFixed(3)}
                        </span>
                      </td>
                      <td className="px-3 py-4 text-center hidden md:table-cell">
                        <div className="flex gap-1 justify-center">
                          {row.lastFive.length === 0 && <span className="text-[10px] text-gray-300">—</span>}
                          {row.lastFive.map((r, j) => (
                            <span key={j} className={`w-5 h-5 rounded text-[9px] font-bold flex items-center justify-center ${
                              r === 'W' ? 'bg-emerald-100 text-emerald-700' :
                              r === 'L' ? 'bg-red-100 text-red-600' :
                              'bg-gray-100 text-gray-500'
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
            <div className="px-5 py-3 bg-emerald-50 border-t border-emerald-100 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500" />
              <span className="text-[11px] text-emerald-700 font-semibold">Top {qualifyCount} teams qualify for playoffs</span>
            </div>
          )}
        </div>
      </section>

      {/* ========== MATCH CARDS ========== */}
      {recentMatches.length > 0 && (
        <section className="py-14 md:py-20 bg-gradient-to-br from-violet-50 via-indigo-50 to-blue-50">
          <div className="max-w-5xl mx-auto px-4">
            <div className="text-center mb-10">
              <span className="inline-flex items-center gap-2 text-xs font-bold text-rose-600 bg-rose-50 px-4 py-2 rounded-full mb-3 uppercase tracking-wider">
                <Flame className="w-3.5 h-3.5" /> Recent Matches
              </span>
              <h2 className="text-3xl md:text-4xl font-black text-gray-900">Latest Results</h2>
            </div>

            <div className="relative">
              <button onClick={() => scrollRef.current?.scrollBy({ left: -340, behavior: 'smooth' })}
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 z-10 w-10 h-10 bg-white shadow-xl rounded-xl flex items-center justify-center border border-gray-100 hover:scale-110 transition-transform hidden md:flex">
                <ChevronLeft className="w-5 h-5 text-gray-600" />
              </button>
              <button onClick={() => scrollRef.current?.scrollBy({ left: 340, behavior: 'smooth' })}
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 z-10 w-10 h-10 bg-white shadow-xl rounded-xl flex items-center justify-center border border-gray-100 hover:scale-110 transition-transform hidden md:flex">
                <ChevronRight className="w-5 h-5 text-gray-600" />
              </button>

              <div ref={scrollRef} className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory" style={{ scrollbarWidth: 'none' }}>
                {recentMatches.map(fixture => {
                  const isLive = fixture.status === 'live';
                  return (
                    <div key={fixture.id} className={`min-w-[310px] snap-start rounded-2xl p-5 shrink-0 transition-all shadow-lg hover:shadow-xl ${
                      isLive ? 'bg-gradient-to-br from-red-50 to-rose-50 border-2 border-red-200' : 'bg-white border border-gray-100 hover:-translate-y-1'
                    }`}>
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-[11px] text-gray-400 font-bold">Match {fixture.match_number}</span>
                        {isLive ? (
                          <span className="flex items-center gap-1.5 text-[11px] font-bold text-red-600 bg-red-100 px-2.5 py-1 rounded-full">
                            <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" /> LIVE
                          </span>
                        ) : (
                          <span className="text-[11px] text-gray-400">{formatDate(fixture.date)}</span>
                        )}
                      </div>

                      <div className="flex items-center justify-between mb-2.5">
                        <div className="flex items-center gap-2.5">
                          <TeamLogo team={fixture.team_a as ShowcaseTeam | undefined} size="sm" />
                          <span className={`font-semibold text-sm ${fixture.winner_team_id === fixture.team_a_id ? 'text-gray-800' : 'text-gray-400'}`}>
                            {fixture.team_a?.short_name || fixture.team_a?.name || 'TBD'}
                          </span>
                        </div>
                        <span className={`font-bold text-sm tabular-nums ${fixture.winner_team_id === fixture.team_a_id ? 'text-indigo-600' : 'text-gray-400'}`}>
                          {fixture.team_a_score || '-'}
                        </span>
                      </div>

                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2.5">
                          <TeamLogo team={fixture.team_b as ShowcaseTeam | undefined} size="sm" />
                          <span className={`font-semibold text-sm ${fixture.winner_team_id === fixture.team_b_id ? 'text-gray-800' : 'text-gray-400'}`}>
                            {fixture.team_b?.short_name || fixture.team_b?.name || 'TBD'}
                          </span>
                        </div>
                        <span className={`font-bold text-sm tabular-nums ${fixture.winner_team_id === fixture.team_b_id ? 'text-indigo-600' : 'text-gray-400'}`}>
                          {fixture.team_b_score || '-'}
                        </span>
                      </div>

                      {fixture.result_summary && (
                        <div className="pt-3 border-t border-gray-100">
                          <p className="text-[11px] text-gray-400 truncate">{fixture.result_summary}</p>
                          {fixture.man_of_match_name && (
                            <p className="text-[11px] text-amber-600 mt-1 flex items-center gap-1 font-medium">
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

      {/* ========== ALL FIXTURES ========== */}
      <section className="py-14 md:py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-10">
            <span className="inline-flex items-center gap-2 text-xs font-bold text-blue-600 bg-blue-50 px-4 py-2 rounded-full mb-3 uppercase tracking-wider">
              <Calendar className="w-3.5 h-3.5" /> Schedule
            </span>
            <h2 className="text-3xl md:text-4xl font-black text-gray-900">Fixtures & Results</h2>
          </div>

          {/* Filter */}
          <div className="flex gap-1 justify-center mb-10 bg-gray-100 rounded-2xl p-1.5 max-w-xs mx-auto">
            {(['all', 'completed', 'upcoming'] as const).map(f => (
              <button key={f} onClick={() => setFixtureFilter(f)} className={`flex-1 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                fixtureFilter === f
                  ? 'bg-white text-indigo-600 shadow-md'
                  : 'text-gray-500 hover:text-gray-700'
              }`}>
                {f === 'all' ? 'All' : f === 'completed' ? 'Results' : 'Upcoming'}
              </button>
            ))}
          </div>

          <div className="space-y-3">
            {filteredFixtures.length === 0 && <p className="text-center text-gray-400 py-12 text-sm">No matches to show</p>}
            {filteredFixtures.map(fixture => <FixtureCard key={fixture.id} fixture={fixture} />)}
          </div>
        </div>
      </section>

      {/* ========== AWARDS ========== */}
      {(topPerformers.mostRuns || topPerformers.mostWickets || topPerformers.mvp || awards.momLeaderboard.length > 0 || awards.mostWinsTeam || awards.highestTeamScore) && (
        <section className="py-14 md:py-20 bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50">
          <div className="max-w-5xl mx-auto px-4">
            <div className="text-center mb-10">
              <span className="inline-flex items-center gap-2 text-xs font-bold text-amber-700 bg-amber-100 px-4 py-2 rounded-full mb-3 uppercase tracking-wider">
                <Award className="w-3.5 h-3.5" /> Awards
              </span>
              <h2 className="text-3xl md:text-4xl font-black text-gray-900">Tournament Awards</h2>
            </div>

            {/* Player Awards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              {topPerformers.mostRuns && (
                <div className="bg-white rounded-2xl border border-orange-100 p-6 shadow-lg shadow-orange-100/50 hover:shadow-xl hover:-translate-y-0.5 transition-all">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center shadow-lg shadow-orange-200">
                      <span className="text-lg">🧢</span>
                    </div>
                    <span className="text-xs font-bold text-orange-600 uppercase tracking-wider">Orange Cap</span>
                  </div>
                  <p className="text-lg font-black text-gray-800">{topPerformers.mostRuns.name}</p>
                  <p className="text-xs text-gray-400 mb-3">{topPerformers.mostRuns.teamName}</p>
                  <p className="text-3xl font-black text-orange-500">{topPerformers.mostRuns.value} <span className="text-sm font-semibold text-gray-400">runs</span></p>
                  <p className="text-[11px] text-gray-400 mt-1">{topPerformers.mostRuns.detail}</p>
                </div>
              )}
              {topPerformers.mostWickets && (
                <div className="bg-white rounded-2xl border border-purple-100 p-6 shadow-lg shadow-purple-100/50 hover:shadow-xl hover:-translate-y-0.5 transition-all">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-violet-600 flex items-center justify-center shadow-lg shadow-purple-200">
                      <span className="text-lg">🧢</span>
                    </div>
                    <span className="text-xs font-bold text-purple-600 uppercase tracking-wider">Purple Cap</span>
                  </div>
                  <p className="text-lg font-black text-gray-800">{topPerformers.mostWickets.name}</p>
                  <p className="text-xs text-gray-400 mb-3">{topPerformers.mostWickets.teamName}</p>
                  <p className="text-3xl font-black text-purple-500">{topPerformers.mostWickets.value} <span className="text-sm font-semibold text-gray-400">wickets</span></p>
                  <p className="text-[11px] text-gray-400 mt-1">{topPerformers.mostWickets.detail}</p>
                </div>
              )}
              {topPerformers.mvp && (
                <div className="bg-white rounded-2xl border border-amber-100 p-6 shadow-lg shadow-amber-100/50 hover:shadow-xl hover:-translate-y-0.5 transition-all">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-yellow-500 flex items-center justify-center shadow-lg shadow-amber-200">
                      <Trophy className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-xs font-bold text-amber-700 uppercase tracking-wider">MVP</span>
                  </div>
                  <p className="text-lg font-black text-gray-800">{topPerformers.mvp.name}</p>
                  <p className="text-xs text-gray-400 mb-3">{topPerformers.mvp.teamName}</p>
                  <p className="text-3xl font-black text-amber-500">{topPerformers.mvp.value} <span className="text-sm font-semibold text-gray-400">MoM</span></p>
                  <p className="text-[11px] text-gray-400 mt-1">{topPerformers.mvp.detail}</p>
                </div>
              )}
            </div>

            {/* Team Awards */}
            {(awards.mostWinsTeam || awards.highestTeamScore) && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                {awards.mostWinsTeam && (
                  <div className="bg-white rounded-2xl border border-emerald-100 p-6 shadow-lg shadow-emerald-100/50">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center">
                        <Trophy className="w-4 h-4 text-emerald-600" />
                      </div>
                      <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">Most Wins</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <TeamLogo team={awards.mostWinsTeam.team} size="lg" />
                      <div>
                        <p className="text-lg font-black text-gray-800">{awards.mostWinsTeam.team.name}</p>
                        <p className="text-2xl font-black text-emerald-600">{awards.mostWinsTeam.wins} wins</p>
                      </div>
                    </div>
                  </div>
                )}
                {awards.highestTeamScore && (
                  <div className="bg-white rounded-2xl border border-blue-100 p-6 shadow-lg shadow-blue-100/50">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                        <Target className="w-4 h-4 text-blue-600" />
                      </div>
                      <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">Highest Score</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <TeamLogo team={awards.highestTeamScore.team} size="lg" />
                      <div>
                        <p className="text-lg font-black text-gray-800">{awards.highestTeamScore.team.name}</p>
                        <p className="text-2xl font-black text-blue-600">{awards.highestTeamScore.score}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* MoM Leaderboard */}
            {awards.momLeaderboard.length > 0 && (
              <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-lg">
                <div className="px-6 py-4 bg-gradient-to-r from-amber-50 to-orange-50 border-b border-amber-100 flex items-center gap-2">
                  <Star className="w-4 h-4 text-amber-500" />
                  <h3 className="font-bold text-gray-800 text-sm">Man of the Match Leaderboard</h3>
                </div>
                <div>
                  {awards.momLeaderboard.slice(0, 8).map((entry, i) => (
                    <div key={entry.name} className="flex items-center justify-between px-6 py-3.5 border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors">
                      <div className="flex items-center gap-3">
                        <span className={`w-6 h-6 rounded-lg flex items-center justify-center text-[10px] font-bold ${
                          i === 0 ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-500'
                        }`}>{i + 1}</span>
                        <div>
                          <p className="font-semibold text-sm text-gray-800">{entry.name}</p>
                          <p className="text-[11px] text-gray-400">{entry.teamName}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full shadow-sm" style={{ backgroundColor: entry.teamColor }} />
                        <span className="font-black text-gray-800 text-lg">{entry.count}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* ========== CHARTS ========== */}
      {teamChartData.some(d => d.won > 0 || d.lost > 0) && (
        <section className="py-14 md:py-20 bg-white">
          <div className="max-w-5xl mx-auto px-4">
            <div className="text-center mb-10">
              <span className="inline-flex items-center gap-2 text-xs font-bold text-violet-600 bg-violet-50 px-4 py-2 rounded-full mb-3 uppercase tracking-wider">
                <BarChart3 className="w-3.5 h-3.5" /> Analytics
              </span>
              <h2 className="text-3xl md:text-4xl font-black text-gray-900">Team Performance</h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-gradient-to-br from-indigo-50 to-violet-50 rounded-2xl border border-indigo-100 p-6 shadow-lg shadow-indigo-100/30">
                <h3 className="font-bold text-gray-800 text-sm mb-5">Wins / Losses / Draws</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={teamChartData} barCategoryGap="20%">
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis dataKey="shortName" tick={{ fontSize: 11, fill: '#6B7280' }} axisLine={{ stroke: '#e5e7eb' }} tickLine={false} />
                      <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: '#6B7280' }} axisLine={false} tickLine={false} />
                      <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '12px', boxShadow: '0 10px 25px -5px rgb(0 0 0 / 0.1)', fontSize: '12px' }}
                        labelFormatter={label => teamChartData.find(d => d.shortName === label)?.teamName || label} />
                      <Legend wrapperStyle={{ fontSize: '11px' }} />
                      <Bar dataKey="won" name="Won" fill="#10b981" radius={[6, 6, 0, 0]} />
                      <Bar dataKey="lost" name="Lost" fill="#ef4444" radius={[6, 6, 0, 0]} />
                      <Bar dataKey="drawn" name="Drawn" fill="#f59e0b" radius={[6, 6, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-gradient-to-br from-rose-50 to-pink-50 rounded-2xl border border-rose-100 p-6 shadow-lg shadow-rose-100/30">
                <h3 className="font-bold text-gray-800 text-sm mb-5">Runs Scored vs Conceded</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={teamChartData} barCategoryGap="20%">
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis dataKey="shortName" tick={{ fontSize: 11, fill: '#6B7280' }} axisLine={{ stroke: '#e5e7eb' }} tickLine={false} />
                      <YAxis tick={{ fontSize: 11, fill: '#6B7280' }} axisLine={false} tickLine={false} />
                      <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '12px', boxShadow: '0 10px 25px -5px rgb(0 0 0 / 0.1)', fontSize: '12px' }}
                        labelFormatter={label => teamChartData.find(d => d.shortName === label)?.teamName || label} />
                      <Legend wrapperStyle={{ fontSize: '11px' }} />
                      <Bar dataKey="runsScored" name="Scored" fill="#6366f1" radius={[6, 6, 0, 0]} />
                      <Bar dataKey="runsConceded" name="Conceded" fill="#f43f5e" radius={[6, 6, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ========== TEAMS ========== */}
      <section className="py-14 md:py-20 bg-gradient-to-br from-indigo-50 via-violet-50 to-purple-50">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-10">
            <span className="inline-flex items-center gap-2 text-xs font-bold text-indigo-600 bg-indigo-100 px-4 py-2 rounded-full mb-3 uppercase tracking-wider">
              <Shield className="w-3.5 h-3.5" /> Participants
            </span>
            <h2 className="text-3xl md:text-4xl font-black text-gray-900">Teams</h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {teams.map(team => (
              <div key={team.id} className="group bg-white rounded-2xl border border-gray-100 p-6 text-center hover:shadow-xl hover:-translate-y-1 transition-all shadow-lg shadow-gray-100/50">
                <div className="relative w-16 h-16 mx-auto mb-4">
                  {team.logo_url ? (
                    <img src={team.logo_url} alt={team.name} className="w-16 h-16 rounded-2xl object-cover shadow-lg" />
                  ) : (
                    <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-white font-black text-xl shadow-lg" style={{ backgroundColor: team.primary_color }}>
                      {team.short_name || team.name.substring(0, 2).toUpperCase()}
                    </div>
                  )}
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-white shadow-sm" style={{ backgroundColor: team.primary_color }} />
                </div>
                <p className="font-bold text-gray-800 text-sm mb-1">{team.name}</p>
                {team.captain_name && <p className="text-[11px] text-gray-400">Capt: {team.captain_name}</p>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== CTA ========== */}
      <section className="relative overflow-hidden py-20">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-700" />
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
        <div className="absolute top-0 left-0 w-96 h-96 bg-pink-400/20 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 right-0 w-72 h-72 bg-blue-400/20 rounded-full blur-[80px]" />

        <div className="relative max-w-3xl mx-auto px-4 text-center">
          <CricMatesLogo size={44} className="justify-center mb-5" showText textClassName="text-xl text-white" />
          <h2 className="text-3xl md:text-4xl font-black text-white mb-4">Want This for Your Club?</h2>
          <p className="text-base text-white/70 mb-10 max-w-lg mx-auto leading-relaxed">
            CricMates helps cricket clubs manage members, matches, tournaments, and finances. Start your free 15-day trial.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href={`https://wa.me/${settings.contact.whatsapp}?text=${encodeURIComponent('Hi, I saw the tournament page and want to start a free trial for my cricket club on CricMates.')}`}
              target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-white text-indigo-700 font-bold py-4 px-8 rounded-2xl hover:bg-indigo-50 transition-all text-base shadow-2xl hover:scale-[1.02]"
            >
              <MessageCircle className="w-5 h-5" /> Start Free Trial
            </a>
            <Link to="/pricing"
              className="inline-flex items-center justify-center gap-2 bg-white/10 text-white font-bold py-4 px-8 rounded-2xl hover:bg-white/20 transition-all text-base border border-white/20 backdrop-blur-sm"
            >
              View Pricing <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* ========== FOOTER ========== */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <CricMatesLogo size={32} className="justify-center mb-3" showText textClassName="text-base text-gray-300" />
          <p className="text-xs text-gray-500 mb-4">The complete cricket club management platform</p>
          <div className="flex items-center justify-center gap-6 text-xs flex-wrap">
            <a href={`https://wa.me/${settings.contact.whatsapp}`} target="_blank" rel="noopener noreferrer" className="hover:text-indigo-400 transition-colors flex items-center gap-1.5">
              <MessageCircle className="w-3.5 h-3.5" /> WhatsApp
            </a>
            <Link to="/pricing" className="hover:text-indigo-400 transition-colors">Pricing</Link>
            <Link to="/how-it-works" className="hover:text-indigo-400 transition-colors">How It Works</Link>
          </div>
          {sponsors.length > 0 && (
            <div className="my-8 py-6 border-t border-b border-gray-800">
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
          <div className="mt-8 pt-6 border-t border-gray-800">
            <p className="text-[11px] text-gray-600">Powered by CricMates — Built for cricket lovers across India</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

// --- Fixture Card ---
function FixtureCard({ fixture }: { fixture: ShowcaseFixture }) {
  const isLive = fixture.status === 'live';
  const isCompleted = fixture.status === 'completed';

  return (
    <div className={`bg-white rounded-2xl border overflow-hidden transition-all hover:shadow-lg ${
      isLive ? 'border-red-200 shadow-lg shadow-red-100/50 ring-1 ring-red-100' : 'border-gray-100 shadow-md shadow-gray-100/50'
    }`}>
      <div className="px-5 py-2.5 bg-gray-50 flex items-center justify-between border-b border-gray-100">
        <span className="text-[11px] text-gray-400 font-bold">Match {fixture.match_number}</span>
        <div className="flex items-center gap-2">
          <span className="text-[11px] text-gray-400">{formatDate(fixture.date)} {fixture.time && `| ${fixture.time}`}</span>
          {isLive && (
            <span className="flex items-center gap-1 text-[10px] font-bold text-red-600 bg-red-100 px-2 py-0.5 rounded-full">
              <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" /> LIVE
            </span>
          )}
          {fixture.status === 'upcoming' && (
            <span className="text-[10px] font-semibold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">Upcoming</span>
          )}
        </div>
      </div>

      <div className="px-5 py-5">
        <div className="flex items-center justify-between gap-4">
          <div className="flex-1 text-center md:text-right">
            <div className="flex items-center gap-2.5 justify-center md:justify-end mb-2">
              <span className="font-bold text-gray-800 text-sm truncate">{fixture.team_a?.name || 'TBD'}</span>
              <TeamLogo team={fixture.team_a as ShowcaseTeam | undefined} size="md" />
            </div>
            {fixture.team_a_score ? (
              <p className={`text-xl md:text-2xl font-black tabular-nums ${fixture.winner_team_id === fixture.team_a_id ? 'text-indigo-600' : 'text-gray-300'}`}>
                {fixture.team_a_score}
              </p>
            ) : (
              !isCompleted && fixture.status !== 'upcoming' && <p className="text-gray-300">—</p>
            )}
          </div>

          <div className="flex-shrink-0 px-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-[10px] font-black ${
              isCompleted ? 'bg-indigo-100 text-indigo-600' : 'bg-gray-100 text-gray-400'
            }`}>
              {isCompleted ? <Target className="w-4 h-4" /> : 'VS'}
            </div>
          </div>

          <div className="flex-1 text-center md:text-left">
            <div className="flex items-center gap-2.5 justify-center md:justify-start mb-2">
              <TeamLogo team={fixture.team_b as ShowcaseTeam | undefined} size="md" />
              <span className="font-bold text-gray-800 text-sm truncate">{fixture.team_b?.name || 'TBD'}</span>
            </div>
            {fixture.team_b_score ? (
              <p className={`text-xl md:text-2xl font-black tabular-nums ${fixture.winner_team_id === fixture.team_b_id ? 'text-indigo-600' : 'text-gray-300'}`}>
                {fixture.team_b_score}
              </p>
            ) : (
              !isCompleted && fixture.status !== 'upcoming' && <p className="text-gray-300">—</p>
            )}
          </div>
        </div>

        {fixture.result_summary && (
          <div className="text-center mt-4 pt-3 border-t border-gray-100">
            <p className="text-xs text-gray-500">{fixture.result_summary}</p>
            {fixture.man_of_match_name && (
              <p className="mt-1.5 inline-flex items-center gap-1 text-[11px] text-amber-600 font-medium">
                <Star className="w-3 h-3" /> MoM: {fixture.man_of_match_name}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
