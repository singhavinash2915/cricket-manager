import { useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Calendar, MapPin, Trophy, Award, ArrowRight, MessageCircle, Target, ChevronLeft, ChevronRight, BarChart3, Flame, Shield, Star, Zap } from 'lucide-react';
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
  if (!team) return <div className={`${dim} rounded-xl bg-white/10 ${className}`} />;
  if (team.logo_url) {
    return <img src={team.logo_url} alt={team.name} className={`${dim} rounded-xl object-cover shrink-0 ring-1 ring-white/10 ${className}`} />;
  }
  return (
    <div className={`${dim} rounded-xl flex items-center justify-center text-white font-bold ${textMap[size]} shrink-0 ${className}`} style={{ backgroundColor: team.primary_color }}>
      {team.short_name || team.name.substring(0, 2).toUpperCase()}
    </div>
  );
}

/* ====== CSS-in-JS style tag for animations ====== */
const animStyles = `
@keyframes meshShift {
  0%, 100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
}
@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-20px); }
}
@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}
@keyframes glow-pulse {
  0%, 100% { box-shadow: 0 0 20px rgba(59,130,246,0.15), 0 0 60px rgba(59,130,246,0.05); }
  50% { box-shadow: 0 0 30px rgba(59,130,246,0.25), 0 0 80px rgba(59,130,246,0.1); }
}
.glass-card {
  background: rgba(255,255,255,0.04);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255,255,255,0.08);
  transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
}
.glass-card:hover {
  background: rgba(255,255,255,0.07);
  border-color: rgba(59,130,246,0.25);
  transform: translateY(-4px);
  box-shadow: 0 20px 40px rgba(0,0,0,0.3), 0 0 30px rgba(59,130,246,0.08);
}
.gradient-text {
  background: linear-gradient(135deg, #60a5fa, #a78bfa, #f59e0b);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
.mesh-bg {
  background:
    radial-gradient(ellipse at 20% 50%, rgba(59,130,246,0.12) 0%, transparent 50%),
    radial-gradient(ellipse at 80% 20%, rgba(245,158,11,0.08) 0%, transparent 50%),
    radial-gradient(ellipse at 50% 80%, rgba(139,92,246,0.08) 0%, transparent 50%),
    #0a0e1a;
  background-size: 200% 200%;
  animation: meshShift 20s ease-in-out infinite;
}
.hide-scrollbar::-webkit-scrollbar { display: none; }
.hide-scrollbar { scrollbar-width: none; }
`;

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

  const recentMatches = fixtures.filter(f => f.status === 'completed' || f.status === 'live').slice(-6).reverse();
  const heroSponsors = sponsors.filter(s => s.tier === 'title' || s.tier === 'powered_by');

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center mesh-bg">
        <style>{animStyles}</style>
        <div className="text-center">
          <div className="relative w-16 h-16 mx-auto mb-5">
            <div className="absolute inset-0 rounded-full border-2 border-blue-500/20" />
            <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-blue-500 animate-spin" />
            <Trophy className="w-6 h-6 text-blue-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
          </div>
          <p className="text-sm font-medium text-gray-400">Loading tournament...</p>
        </div>
      </div>
    );
  }

  if (error || !tournament) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 mesh-bg">
        <style>{animStyles}</style>
        <div className="text-center">
          <div className="w-20 h-20 rounded-2xl glass-card flex items-center justify-center mx-auto mb-6">
            <Trophy className="w-10 h-10 text-blue-400" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Tournament Not Found</h1>
          <p className="text-gray-400 mb-8">The tournament you're looking for doesn't exist.</p>
          <Link to="/pricing" className="inline-flex items-center gap-2 text-blue-400 font-semibold hover:text-blue-300 transition-colors">
            Go to CricMates <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen mesh-bg text-gray-100">
      <style>{animStyles}</style>

      {/* ====== STICKY NAV ====== */}
      <nav className="sticky top-0 z-50" style={{ background: 'rgba(10,14,26,0.75)', backdropFilter: 'blur(20px) saturate(180%)', WebkitBackdropFilter: 'blur(20px) saturate(180%)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link to="/pricing" className="hover:opacity-80 transition-opacity">
            <CricMatesLogo size={32} showText textClassName="text-base text-white" />
          </Link>
          <div className="flex items-center gap-2">
            <Link to="/pricing" className="text-xs font-medium text-gray-400 hover:text-white px-3 py-2 rounded-xl transition-colors">
              Pricing
            </Link>
            <Link to="/" className="text-xs font-bold text-white px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 transition-all shadow-lg shadow-blue-500/20 flex items-center gap-1">
              Enter App <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </nav>

      {/* ====== HERO ====== */}
      <section className="relative overflow-hidden">
        {/* Animated orbs */}
        <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[120px]" style={{ animation: 'float 8s ease-in-out infinite' }} />
        <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[100px]" style={{ animation: 'float 10s ease-in-out infinite 2s' }} />
        <div className="absolute top-[30%] left-[50%] w-[300px] h-[300px] bg-amber-500/8 rounded-full blur-[80px]" style={{ animation: 'float 12s ease-in-out infinite 4s' }} />

        {/* Star particles */}
        <div className="absolute inset-0 opacity-30" style={{ backgroundImage: 'radial-gradient(1.5px 1.5px at 20px 30px, rgba(255,255,255,0.4), transparent), radial-gradient(1px 1px at 60px 80px, rgba(255,255,255,0.2), transparent), radial-gradient(1.5px 1.5px at 110px 50px, rgba(255,255,255,0.3), transparent)', backgroundSize: '180px 180px' }} />

        <div className="relative max-w-5xl mx-auto px-4 py-16 md:py-24 text-center">
          {tournament.status === 'live' && (
            <div className="inline-flex items-center gap-2 text-xs font-bold px-4 py-2 rounded-full mb-6 border border-red-500/30 bg-red-500/10 text-red-400">
              <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" /> LIVE NOW
            </div>
          )}
          {tournament.status === 'upcoming' && (
            <div className="inline-flex items-center gap-2 text-xs font-bold px-4 py-2 rounded-full mb-6 border border-blue-500/30 bg-blue-500/10 text-blue-400">
              <Zap className="w-3.5 h-3.5" /> COMING SOON
            </div>
          )}
          {tournament.status === 'completed' && (
            <div className="inline-flex items-center gap-2 text-xs font-bold px-4 py-2 rounded-full mb-6 border border-amber-500/30 bg-amber-500/10 text-amber-400">
              <Trophy className="w-3.5 h-3.5" /> COMPLETED
            </div>
          )}

          {tournament.organizer_name && (
            <p className="text-gray-500 text-[11px] font-semibold uppercase tracking-[0.3em] mb-3">{tournament.organizer_name} Presents</p>
          )}

          {tournament.short_name && (
            <h1 className="text-6xl md:text-8xl lg:text-9xl font-black mb-2 tracking-tighter gradient-text leading-none pb-2">{tournament.short_name}</h1>
          )}
          <p className="text-base md:text-lg font-medium text-gray-400 mb-10">{tournament.name}</p>

          <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
            {[
              { icon: Calendar, text: formatDateRange(tournament.start_date, tournament.end_date) },
              { icon: MapPin, text: tournament.venue },
              { icon: Flame, text: `${tournament.format} | ${tournament.overs} Overs` },
              { icon: Shield, text: `${tournament.total_teams} Teams` },
            ].map((pill, idx) => (
              <span key={idx} className="flex items-center gap-1.5 text-[11px] font-medium text-gray-300 bg-white/5 border border-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
                <pill.icon className="w-3 h-3 text-blue-400" /> {pill.text}
              </span>
            ))}
          </div>

          {/* Stat Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-2xl mx-auto mb-10">
            {[
              { value: fixtures.length, label: 'Matches', color: 'text-blue-400' },
              { value: completedCount, label: 'Completed', color: 'text-emerald-400' },
              { value: teams.length, label: 'Teams', color: 'text-purple-400' },
              { value: remainingCount, label: 'Remaining', color: 'text-amber-400' },
            ].map(stat => (
              <div key={stat.label} className="glass-card rounded-2xl p-4" style={{ animation: 'glow-pulse 4s ease-in-out infinite' }}>
                <p className={`text-3xl md:text-4xl font-black ${stat.color}`}>{stat.value}</p>
                <p className="text-[10px] text-gray-500 font-semibold uppercase tracking-wider mt-1">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Progress */}
          {fixtures.length > 0 && (
            <div className="max-w-sm mx-auto">
              <div className="flex items-center justify-between text-[11px] text-gray-500 font-medium mb-2">
                <span>{completedCount} of {fixtures.length} matches</span>
                <span className="text-white font-bold">{progressPct}%</span>
              </div>
              <div className="h-2 bg-white/5 rounded-full overflow-hidden border border-white/5">
                <div className="h-full rounded-full bg-gradient-to-r from-blue-600 via-purple-500 to-amber-500 transition-all duration-1000" style={{ width: `${progressPct}%` }} />
              </div>
            </div>
          )}

          {heroSponsors.length > 0 && (
            <div className="mt-12 pt-6 border-t border-white/5">
              <p className="text-[10px] uppercase tracking-[0.25em] text-gray-600 mb-3 font-semibold">Powered by</p>
              <div className="flex flex-wrap items-center justify-center gap-6">
                {heroSponsors.map(sponsor => (
                  <a key={sponsor.id} href={sponsor.website_url || '#'} target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition-opacity">
                    {sponsor.logo_url ? (
                      <img src={sponsor.logo_url} alt={sponsor.name} className="h-7 md:h-9 object-contain brightness-0 invert opacity-40 hover:opacity-70 transition-opacity" />
                    ) : (
                      <span className="text-gray-500 hover:text-gray-300 font-bold text-sm transition-colors">{sponsor.name}</span>
                    )}
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ====== POINTS TABLE ====== */}
      <section className="max-w-5xl mx-auto px-4 py-14 md:py-20">
        <SectionHeader icon={Trophy} title="Points Table" accent="blue" />

        <div className="glass-card rounded-2xl overflow-hidden" style={{ animation: 'glow-pulse 6s ease-in-out infinite' }}>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px]">
              <thead>
                <tr style={{ background: 'rgba(59,130,246,0.08)' }}>
                  {['#', 'Team', 'P', 'W', 'L', 'D', 'Pts', 'NRR', 'Form'].map((h, i) => (
                    <th key={h} className={`px-3 py-3.5 text-[10px] uppercase tracking-wider font-bold text-blue-400/80 ${i <= 1 ? 'text-left' : 'text-center'} ${h === 'Form' ? 'hidden md:table-cell' : ''}`}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {standings.map((row, i) => {
                  const isQ = i < qualifyCount && row.played > 0;
                  return (
                    <tr key={row.team.id} className="transition-colors hover:bg-white/[0.03]" style={{ borderBottom: '1px solid rgba(255,255,255,0.04)', background: isQ ? 'rgba(16,185,129,0.04)' : undefined }}>
                      <td className="px-3 py-3.5">
                        <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-[11px] font-bold ${
                          i === 0 ? 'bg-gradient-to-br from-amber-400 to-orange-500 text-white shadow-lg shadow-amber-500/20' :
                          i === 1 ? 'bg-gradient-to-br from-gray-300 to-gray-400 text-gray-800' :
                          i === 2 ? 'bg-gradient-to-br from-amber-600 to-amber-700 text-amber-100' :
                          'bg-white/5 text-gray-500'
                        }`}>{i + 1}</div>
                      </td>
                      <td className="px-3 py-3.5">
                        <div className="flex items-center gap-2.5">
                          <div className="w-1 h-7 rounded-full shrink-0" style={{ backgroundColor: row.team.primary_color, boxShadow: `0 0 8px ${row.team.primary_color}40` }} />
                          <TeamLogo team={row.team} size="md" />
                          <div>
                            <span className="font-bold text-sm text-white block">{row.team.name}</span>
                            {isQ && <span className="text-[9px] text-emerald-400 font-bold uppercase tracking-wider">Qualified</span>}
                          </div>
                        </div>
                      </td>
                      <td className="px-3 py-3.5 text-center text-sm text-gray-400">{row.played}</td>
                      <td className="px-3 py-3.5 text-center text-sm font-bold text-emerald-400">{row.won}</td>
                      <td className="px-3 py-3.5 text-center text-sm font-bold text-red-400">{row.lost}</td>
                      <td className="px-3 py-3.5 text-center text-sm text-gray-400">{row.drawn}</td>
                      <td className="px-3 py-3.5 text-center">
                        <span className="text-lg font-black text-white">{row.points}</span>
                      </td>
                      <td className="px-3 py-3.5 text-center">
                        <span className={`font-mono text-sm font-semibold ${row.nrr > 0 ? 'text-emerald-400' : row.nrr < 0 ? 'text-red-400' : 'text-gray-600'}`}>
                          {row.nrr > 0 ? '+' : ''}{row.nrr.toFixed(3)}
                        </span>
                      </td>
                      <td className="px-3 py-3.5 text-center hidden md:table-cell">
                        <div className="flex gap-1 justify-center">
                          {row.lastFive.length === 0 && <span className="text-[10px] text-gray-600">—</span>}
                          {row.lastFive.map((r, j) => (
                            <span key={j} className={`w-5 h-5 rounded text-[9px] font-bold flex items-center justify-center ${
                              r === 'W' ? 'bg-emerald-500/20 text-emerald-400' : r === 'L' ? 'bg-red-500/20 text-red-400' : 'bg-white/5 text-gray-500'
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
            <div className="px-5 py-2.5 flex items-center gap-2" style={{ background: 'rgba(16,185,129,0.06)', borderTop: '1px solid rgba(16,185,129,0.1)' }}>
              <div className="w-2 h-2 rounded-full bg-emerald-400 shadow-lg shadow-emerald-400/30" />
              <span className="text-[11px] text-emerald-400 font-semibold">Top {qualifyCount} teams qualify</span>
            </div>
          )}
        </div>
      </section>

      {/* ====== RECENT MATCH CARDS ====== */}
      {recentMatches.length > 0 && (
        <section className="py-14 md:py-20">
          <div className="max-w-5xl mx-auto px-4">
            <SectionHeader icon={Flame} title="Latest Results" accent="rose" />

            <div className="relative">
              <button onClick={() => scrollRef.current?.scrollBy({ left: -340, behavior: 'smooth' })}
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 z-10 w-10 h-10 glass-card rounded-full flex items-center justify-center hover:bg-white/10 transition-colors hidden md:flex">
                <ChevronLeft className="w-5 h-5 text-gray-400" />
              </button>
              <button onClick={() => scrollRef.current?.scrollBy({ left: 340, behavior: 'smooth' })}
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 z-10 w-10 h-10 glass-card rounded-full flex items-center justify-center hover:bg-white/10 transition-colors hidden md:flex">
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </button>

              <div ref={scrollRef} className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory hide-scrollbar">
                {recentMatches.map(fixture => {
                  const isLive = fixture.status === 'live';
                  return (
                    <div key={fixture.id} className={`min-w-[310px] snap-start rounded-2xl p-5 shrink-0 transition-all ${
                      isLive ? 'border-2 border-red-500/30 bg-red-500/5 shadow-lg shadow-red-500/10' : 'glass-card'
                    }`}>
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-[11px] font-bold text-gray-500">Match {fixture.match_number}</span>
                        {isLive ? (
                          <span className="flex items-center gap-1.5 text-[11px] font-bold text-red-400 bg-red-500/15 px-2.5 py-1 rounded-full border border-red-500/20">
                            <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" /> LIVE
                          </span>
                        ) : (
                          <span className="text-[11px] text-gray-500">{formatDate(fixture.date)}</span>
                        )}
                      </div>

                      {[{ team: fixture.team_a, id: fixture.team_a_id, score: fixture.team_a_score }, { team: fixture.team_b, id: fixture.team_b_id, score: fixture.team_b_score }].map((side, idx) => (
                        <div key={idx} className={`flex items-center justify-between ${idx === 0 ? 'mb-2.5' : 'mb-4'}`}>
                          <div className="flex items-center gap-2.5">
                            <TeamLogo team={side.team as ShowcaseTeam | undefined} size="sm" />
                            <span className={`font-semibold text-sm ${fixture.winner_team_id === side.id ? 'text-white' : 'text-gray-500'}`}>
                              {(side.team as ShowcaseTeam | undefined)?.short_name || (side.team as ShowcaseTeam | undefined)?.name || 'TBD'}
                            </span>
                          </div>
                          <span className={`font-bold text-sm tabular-nums ${fixture.winner_team_id === side.id ? 'text-blue-400' : 'text-gray-600'}`}>
                            {side.score || '-'}
                          </span>
                        </div>
                      ))}

                      {fixture.result_summary && (
                        <div className="pt-3 border-t border-white/5">
                          <p className="text-[11px] text-gray-500 truncate">{fixture.result_summary}</p>
                          {fixture.man_of_match_name && (
                            <p className="text-[11px] text-amber-400 mt-1 flex items-center gap-1 font-medium">
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

      {/* ====== ALL FIXTURES ====== */}
      <section className="py-14 md:py-20">
        <div className="max-w-5xl mx-auto px-4">
          <SectionHeader icon={Calendar} title="Fixtures & Results" accent="blue" />

          <div className="flex gap-1 justify-center mb-10 glass-card rounded-2xl p-1.5 max-w-xs mx-auto">
            {(['all', 'completed', 'upcoming'] as const).map(f => (
              <button key={f} onClick={() => setFixtureFilter(f)} className={`flex-1 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                fixtureFilter === f ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'text-gray-500 hover:text-white hover:bg-white/5'
              }`}>
                {f === 'all' ? 'All' : f === 'completed' ? 'Results' : 'Upcoming'}
              </button>
            ))}
          </div>

          <div className="space-y-3">
            {filteredFixtures.length === 0 && <p className="text-center text-gray-600 py-12 text-sm">No matches to show</p>}
            {filteredFixtures.map(fixture => <FixtureCard key={fixture.id} fixture={fixture} />)}
          </div>
        </div>
      </section>

      {/* ====== AWARDS ====== */}
      {(topPerformers.mostRuns || topPerformers.mostWickets || topPerformers.mvp || awards.momLeaderboard.length > 0 || awards.mostWinsTeam || awards.highestTeamScore) && (
        <section className="py-14 md:py-20">
          <div className="max-w-5xl mx-auto px-4">
            <SectionHeader icon={Award} title="Tournament Awards" accent="amber" />

            {/* Player Awards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              {topPerformers.mostRuns && (
                <AwardCard gradient="from-orange-500 to-red-600" glow="rgba(249,115,22,0.15)" title="Orange Cap" name={topPerformers.mostRuns.name} team={topPerformers.mostRuns.teamName}
                  value={`${topPerformers.mostRuns.value}`} unit="runs" detail={topPerformers.mostRuns.detail} />
              )}
              {topPerformers.mostWickets && (
                <AwardCard gradient="from-purple-500 to-violet-600" glow="rgba(139,92,246,0.15)" title="Purple Cap" name={topPerformers.mostWickets.name} team={topPerformers.mostWickets.teamName}
                  value={`${topPerformers.mostWickets.value}`} unit="wickets" detail={topPerformers.mostWickets.detail} />
              )}
              {topPerformers.mvp && (
                <AwardCard gradient="from-amber-400 to-yellow-500" glow="rgba(245,158,11,0.15)" title="MVP" name={topPerformers.mvp.name} team={topPerformers.mvp.teamName}
                  value={`${topPerformers.mvp.value}`} unit="MoM" detail={topPerformers.mvp.detail} />
              )}
            </div>

            {/* Team Awards */}
            {(awards.mostWinsTeam || awards.highestTeamScore) && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                {awards.mostWinsTeam && (
                  <div className="glass-card rounded-2xl p-5">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-8 h-8 rounded-lg bg-emerald-500/15 flex items-center justify-center"><Trophy className="w-4 h-4 text-emerald-400" /></div>
                      <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">Most Wins</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <TeamLogo team={awards.mostWinsTeam.team} size="lg" />
                      <div>
                        <p className="font-bold text-white">{awards.mostWinsTeam.team.name}</p>
                        <p className="text-2xl font-black text-emerald-400">{awards.mostWinsTeam.wins} <span className="text-sm text-gray-500">wins</span></p>
                      </div>
                    </div>
                  </div>
                )}
                {awards.highestTeamScore && (
                  <div className="glass-card rounded-2xl p-5">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-8 h-8 rounded-lg bg-blue-500/15 flex items-center justify-center"><Target className="w-4 h-4 text-blue-400" /></div>
                      <span className="text-xs font-bold uppercase tracking-wider text-blue-400">Highest Score</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <TeamLogo team={awards.highestTeamScore.team} size="lg" />
                      <div>
                        <p className="font-bold text-white">{awards.highestTeamScore.team.name}</p>
                        <p className="text-2xl font-black text-blue-400">{awards.highestTeamScore.score}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* MoM Leaderboard */}
            {awards.momLeaderboard.length > 0 && (
              <div className="glass-card rounded-2xl overflow-hidden">
                <div className="px-5 py-3.5 flex items-center gap-2" style={{ background: 'rgba(245,158,11,0.06)', borderBottom: '1px solid rgba(245,158,11,0.1)' }}>
                  <Star className="w-4 h-4 text-amber-400" />
                  <h3 className="font-bold text-sm text-white">Man of the Match Leaderboard</h3>
                </div>
                <div>
                  {awards.momLeaderboard.slice(0, 8).map((entry, i) => (
                    <div key={entry.name} className="flex items-center justify-between px-5 py-3 hover:bg-white/[0.02] transition-colors" style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                      <div className="flex items-center gap-3">
                        <span className={`w-6 h-6 rounded-lg flex items-center justify-center text-[10px] font-bold ${
                          i === 0 ? 'bg-amber-500/20 text-amber-400' : 'bg-white/5 text-gray-500'
                        }`}>{i + 1}</span>
                        <div>
                          <p className="font-semibold text-sm text-white">{entry.name}</p>
                          <p className="text-[11px] text-gray-500">{entry.teamName}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: entry.teamColor, boxShadow: `0 0 6px ${entry.teamColor}60` }} />
                        <span className="font-black text-lg text-white">{entry.count}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* ====== CHARTS ====== */}
      {teamChartData.some(d => d.won > 0 || d.lost > 0) && (
        <section className="py-14 md:py-20">
          <div className="max-w-5xl mx-auto px-4">
            <SectionHeader icon={BarChart3} title="Team Performance" accent="purple" />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              {[
                { title: 'Wins / Losses / Draws', bars: [{ key: 'won', name: 'Won', fill: '#10b981' }, { key: 'lost', name: 'Lost', fill: '#ef4444' }, { key: 'drawn', name: 'Drawn', fill: '#f59e0b' }] },
                { title: 'Runs Scored vs Conceded', bars: [{ key: 'runsScored', name: 'Scored', fill: '#3b82f6' }, { key: 'runsConceded', name: 'Conceded', fill: '#f43f5e' }] },
              ].map(chart => (
                <div key={chart.title} className="glass-card rounded-2xl p-5">
                  <h3 className="font-bold text-sm text-white mb-4">{chart.title}</h3>
                  <div className="h-60">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={teamChartData} barCategoryGap="20%">
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                        <XAxis dataKey="shortName" tick={{ fontSize: 11, fill: '#6b7280' }} axisLine={{ stroke: 'rgba(255,255,255,0.06)' }} tickLine={false} />
                        <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: '#6b7280' }} axisLine={false} tickLine={false} />
                        <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', boxShadow: '0 20px 40px rgba(0,0,0,0.5)', fontSize: '12px', color: '#e2e8f0' }}
                          labelFormatter={label => teamChartData.find(d => d.shortName === label)?.teamName || label}
                          cursor={{ fill: 'rgba(255,255,255,0.02)' }} />
                        <Legend wrapperStyle={{ fontSize: '11px', color: '#9CA3AF' }} />
                        {chart.bars.map(b => <Bar key={b.key} dataKey={b.key} name={b.name} fill={b.fill} radius={[6, 6, 0, 0]} />)}
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ====== TEAMS ====== */}
      <section className="py-14 md:py-20">
        <div className="max-w-5xl mx-auto px-4">
          <SectionHeader icon={Shield} title="Teams" accent="blue" />

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {teams.map(team => (
              <div key={team.id} className="group glass-card rounded-2xl p-5 text-center">
                <div className="relative w-16 h-16 mx-auto mb-3">
                  {team.logo_url ? (
                    <img src={team.logo_url} alt={team.name} className="w-16 h-16 rounded-2xl object-cover ring-2 ring-white/10 group-hover:ring-blue-500/30 transition-all" />
                  ) : (
                    <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-white font-black text-xl" style={{ backgroundColor: team.primary_color, boxShadow: `0 0 30px ${team.primary_color}30` }}>
                      {team.short_name || team.name.substring(0, 2).toUpperCase()}
                    </div>
                  )}
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-[#0a0e1a]" style={{ backgroundColor: team.primary_color, boxShadow: `0 0 6px ${team.primary_color}60` }} />
                </div>
                <p className="font-bold text-sm text-white mb-0.5">{team.name}</p>
                {team.captain_name && <p className="text-[11px] text-gray-500">Capt: {team.captain_name}</p>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ====== CTA ====== */}
      <section className="relative overflow-hidden py-20">
        <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(59,130,246,0.08), rgba(139,92,246,0.08), rgba(245,158,11,0.05))' }} />
        <div className="absolute top-0 left-[20%] w-80 h-80 bg-blue-500/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 right-[20%] w-60 h-60 bg-purple-500/10 rounded-full blur-[80px]" />

        <div className="relative max-w-3xl mx-auto px-4 text-center">
          <CricMatesLogo size={44} className="justify-center mb-4" showText textClassName="text-lg text-white" />
          <h2 className="text-3xl md:text-4xl font-black text-white mb-4">Want This for Your Club?</h2>
          <p className="text-sm text-gray-400 mb-10 max-w-md mx-auto leading-relaxed">
            CricMates helps cricket clubs manage members, matches, tournaments, and finances. Start your free 15-day trial.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a href={`https://wa.me/${settings.contact.whatsapp}?text=${encodeURIComponent('Hi, I saw the tournament page and want to start a free trial for my cricket club on CricMates.')}`}
              target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-blue-500 text-white font-bold py-3.5 px-8 rounded-2xl hover:from-blue-500 hover:to-blue-400 transition-all text-sm shadow-xl shadow-blue-600/20 hover:scale-[1.02]">
              <MessageCircle className="w-4 h-4" /> Start Free Trial
            </a>
            <Link to="/pricing"
              className="inline-flex items-center justify-center gap-2 glass-card text-white font-bold py-3.5 px-8 rounded-2xl hover:bg-white/10 transition-all text-sm">
              View Pricing <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ====== FOOTER ====== */}
      <footer className="py-10 border-t border-white/5">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <CricMatesLogo size={28} className="justify-center mb-2" showText textClassName="text-sm text-gray-300" />
          <p className="text-xs text-gray-600 mb-3">The complete cricket club management platform</p>
          <div className="flex items-center justify-center gap-5 text-xs flex-wrap">
            <a href={`https://wa.me/${settings.contact.whatsapp}`} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-blue-400 transition-colors flex items-center gap-1.5">
              <MessageCircle className="w-3.5 h-3.5" /> WhatsApp
            </a>
            <Link to="/pricing" className="text-gray-500 hover:text-blue-400 transition-colors">Pricing</Link>
            <Link to="/how-it-works" className="text-gray-500 hover:text-blue-400 transition-colors">How It Works</Link>
          </div>
          {sponsors.length > 0 && (
            <div className="my-6 py-5 border-t border-b border-white/5">
              <p className="text-[10px] text-gray-600 uppercase tracking-[0.2em] mb-3 font-medium">Tournament Partners</p>
              <div className="flex flex-wrap justify-center gap-6 items-center">
                {sponsors.map(sponsor => (
                  <a key={sponsor.id} href={sponsor.website_url || '#'} target="_blank" rel="noopener noreferrer"
                    className="opacity-30 hover:opacity-60 transition-all">
                    {sponsor.logo_url ? (
                      <img src={sponsor.logo_url} alt={sponsor.name} className="h-6 object-contain brightness-0 invert" />
                    ) : (
                      <span className="text-xs font-semibold text-gray-400">{sponsor.name}</span>
                    )}
                  </a>
                ))}
              </div>
            </div>
          )}
          <div className="mt-6 pt-5 border-t border-white/5">
            <p className="text-[11px] text-gray-700">Powered by CricMates — Built for cricket lovers across India</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

/* ====== Section Header ====== */
function SectionHeader({ icon: Icon, title, accent }: { icon: React.ComponentType<{ className?: string }>; title: string; accent: 'blue' | 'rose' | 'amber' | 'purple' }) {
  const colors = {
    blue: { text: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20' },
    rose: { text: 'text-rose-400', bg: 'bg-rose-500/10', border: 'border-rose-500/20' },
    amber: { text: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20' },
    purple: { text: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/20' },
  };
  const c = colors[accent];
  return (
    <div className="text-center mb-10">
      <span className={`inline-flex items-center gap-2 text-xs font-bold px-4 py-2 rounded-full mb-4 uppercase tracking-wider ${c.text} ${c.bg} border ${c.border}`}>
        <Icon className="w-3.5 h-3.5" /> {title}
      </span>
      <h2 className="text-3xl md:text-4xl font-black text-white">{title}</h2>
    </div>
  );
}

/* ====== Award Card ====== */
function AwardCard({ gradient, glow, title, name, team, value, unit, detail }: {
  gradient: string; glow: string; title: string; name: string; team: string; value: string; unit: string; detail: string;
}) {
  return (
    <div className="glass-card rounded-2xl p-5 relative overflow-hidden" style={{ boxShadow: `0 0 40px ${glow}` }}>
      <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${gradient} opacity-[0.06] rounded-full blur-[40px] -translate-y-1/2 translate-x-1/2`} />
      <div className="relative">
        <div className="flex items-center gap-2 mb-3">
          <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow-lg`}>
            <Trophy className="w-4 h-4 text-white" />
          </div>
          <span className="text-xs font-bold uppercase tracking-wider text-gray-400">{title}</span>
        </div>
        <p className="text-base font-black text-white">{name}</p>
        <p className="text-[11px] text-gray-500 mb-2">{team}</p>
        <p className="text-2xl font-black text-blue-400">{value} <span className="text-sm font-semibold text-gray-500">{unit}</span></p>
        <p className="text-[11px] text-gray-500 mt-1">{detail}</p>
      </div>
    </div>
  );
}

/* ====== Fixture Card ====== */
function FixtureCard({ fixture }: { fixture: ShowcaseFixture }) {
  const isLive = fixture.status === 'live';
  const isCompleted = fixture.status === 'completed';

  return (
    <div className={`rounded-2xl overflow-hidden transition-all ${
      isLive ? 'border-2 border-red-500/30 bg-red-500/5 shadow-lg shadow-red-500/10' : 'glass-card'
    }`}>
      <div className="px-5 py-2.5 flex items-center justify-between" style={{ background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
        <span className="text-[11px] text-gray-500 font-bold">Match {fixture.match_number}</span>
        <div className="flex items-center gap-2">
          <span className="text-[11px] text-gray-500">{formatDate(fixture.date)} {fixture.time && `| ${fixture.time}`}</span>
          {isLive && (
            <span className="flex items-center gap-1 text-[10px] font-bold text-red-400 bg-red-500/15 px-2 py-0.5 rounded-full border border-red-500/20">
              <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" /> LIVE
            </span>
          )}
          {fixture.status === 'upcoming' && (
            <span className="text-[10px] font-semibold text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-full border border-blue-500/20">Upcoming</span>
          )}
        </div>
      </div>

      <div className="px-5 py-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex-1 text-center md:text-right">
            <div className="flex items-center gap-2 justify-center md:justify-end mb-1.5">
              <span className="font-bold text-white text-sm truncate">{fixture.team_a?.name || 'TBD'}</span>
              <TeamLogo team={fixture.team_a as ShowcaseTeam | undefined} size="md" />
            </div>
            {fixture.team_a_score ? (
              <p className={`text-xl md:text-2xl font-black tabular-nums ${fixture.winner_team_id === fixture.team_a_id ? 'text-blue-400' : 'text-gray-600'}`}>
                {fixture.team_a_score}
              </p>
            ) : (
              !isCompleted && fixture.status !== 'upcoming' && <p className="text-gray-600">—</p>
            )}
          </div>

          <div className="flex-shrink-0 px-2">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-[10px] font-black ${
              isCompleted ? 'bg-blue-500/15 text-blue-400' : 'bg-white/5 text-gray-600'
            }`}>
              {isCompleted ? <Target className="w-4 h-4" /> : 'VS'}
            </div>
          </div>

          <div className="flex-1 text-center md:text-left">
            <div className="flex items-center gap-2 justify-center md:justify-start mb-1.5">
              <TeamLogo team={fixture.team_b as ShowcaseTeam | undefined} size="md" />
              <span className="font-bold text-white text-sm truncate">{fixture.team_b?.name || 'TBD'}</span>
            </div>
            {fixture.team_b_score ? (
              <p className={`text-xl md:text-2xl font-black tabular-nums ${fixture.winner_team_id === fixture.team_b_id ? 'text-blue-400' : 'text-gray-600'}`}>
                {fixture.team_b_score}
              </p>
            ) : (
              !isCompleted && fixture.status !== 'upcoming' && <p className="text-gray-600">—</p>
            )}
          </div>
        </div>

        {fixture.result_summary && (
          <div className="text-center mt-3 pt-3 border-t border-white/5">
            <p className="text-xs text-gray-500">{fixture.result_summary}</p>
            {fixture.man_of_match_name && (
              <p className="mt-1 inline-flex items-center gap-1 text-[11px] text-amber-400 font-medium">
                <Star className="w-3 h-3" /> MoM: {fixture.man_of_match_name}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
