import { useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Calendar, MapPin, Trophy, Award, ArrowRight, MessageCircle, Users, Target, ChevronLeft, ChevronRight, BarChart3, Flame, Shield, Star, Zap } from 'lucide-react';
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
  if (!team) return <div className={`${dim} rounded-2xl bg-violet-100 ${className}`} />;
  if (team.logo_url) {
    return <img src={team.logo_url} alt={team.name} className={`${dim} rounded-2xl object-cover shrink-0 ${className}`} />;
  }
  return (
    <div className={`${dim} rounded-2xl flex items-center justify-center text-white font-bold ${textMap[size]} shrink-0 ${className}`} style={{ backgroundColor: team.primary_color }}>
      {team.short_name || team.name.substring(0, 2).toUpperCase()}
    </div>
  );
}

// Soft pastel palette inspired by the Outstaff dashboard
const P = {
  bg: '#f4f0fa',        // soft lavender background
  card: '#ffffff',
  hero: 'linear-gradient(135deg, #7c5ce0 0%, #a78bfa 40%, #c4b5fd 100%)',
  accent: '#7c5ce0',    // primary violet
  accentLight: '#ede9fe',
  accentSoft: '#ddd6fe',
  green: '#22c55e',
  greenBg: '#dcfce7',
  red: '#ef4444',
  redBg: '#fee2e2',
  amber: '#f59e0b',
  amberBg: '#fef3c7',
  blue: '#3b82f6',
  blueBg: '#dbeafe',
  text: '#1e1b4b',
  textSecondary: '#6b7280',
  border: '#e9e5f5',
};

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
      <div className="min-h-screen flex items-center justify-center" style={{ background: P.bg }}>
        <div className="text-center">
          <div className="relative w-14 h-14 mx-auto mb-5">
            <div className="absolute inset-0 rounded-full border-[3px]" style={{ borderColor: P.accentSoft }} />
            <div className="absolute inset-0 rounded-full border-[3px] border-transparent animate-spin" style={{ borderTopColor: P.accent }} />
            <Trophy className="w-5 h-5 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" style={{ color: P.accent }} />
          </div>
          <p className="text-sm font-medium" style={{ color: P.textSecondary }}>Loading tournament...</p>
        </div>
      </div>
    );
  }

  if (error || !tournament) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4" style={{ background: P.bg }}>
        <div className="text-center">
          <div className="w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-6" style={{ background: P.accentLight }}>
            <Trophy className="w-10 h-10" style={{ color: P.accent }} />
          </div>
          <h1 className="text-2xl font-bold mb-2" style={{ color: P.text }}>Tournament Not Found</h1>
          <p className="mb-8" style={{ color: P.textSecondary }}>The tournament you're looking for doesn't exist.</p>
          <Link to="/pricing" className="inline-flex items-center gap-2 font-semibold transition-colors" style={{ color: P.accent }}>
            Go to CricMates <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: P.bg }}>
      {/* === Nav === */}
      <nav className="bg-white/90 backdrop-blur-xl sticky top-0 z-50 shadow-sm" style={{ borderBottom: `1px solid ${P.border}` }}>
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link to="/pricing" className="hover:opacity-80 transition-opacity">
            <CricMatesLogo size={32} showText textClassName="text-base" />
          </Link>
          <div className="flex items-center gap-2">
            <Link to="/pricing" className="text-xs font-medium px-3 py-2 rounded-xl transition-colors" style={{ color: P.textSecondary }}>
              Pricing
            </Link>
            <Link to="/" className="text-xs font-bold text-white px-4 py-2 rounded-xl transition-all shadow-lg flex items-center gap-1 hover:shadow-xl" style={{ background: P.accent, boxShadow: '0 4px 14px rgba(124,92,224,0.3)' }}>
              Enter App <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </nav>

      {/* ========== HERO ========== */}
      <section className="relative overflow-hidden" style={{ background: P.hero }}>
        <div className="absolute inset-0 opacity-[0.08]" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-white/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/4" />
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-violet-800/20 rounded-full blur-[80px] translate-y-1/2 -translate-x-1/4" />

        <div className="relative max-w-5xl mx-auto px-4 py-14 md:py-20 text-center text-white">
          {tournament.status === 'live' && (
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm text-white text-xs font-bold px-4 py-2 rounded-full mb-6 border border-white/20">
              <span className="w-2 h-2 bg-red-400 rounded-full animate-pulse" /> LIVE NOW
            </div>
          )}
          {tournament.status === 'upcoming' && (
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm text-white text-xs font-bold px-4 py-2 rounded-full mb-6 border border-white/20">
              <Zap className="w-3.5 h-3.5" /> COMING SOON
            </div>
          )}
          {tournament.status === 'completed' && (
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm text-white text-xs font-bold px-4 py-2 rounded-full mb-6 border border-white/20">
              <Trophy className="w-3.5 h-3.5" /> COMPLETED
            </div>
          )}

          {tournament.organizer_name && (
            <p className="text-white/50 text-[11px] font-semibold uppercase tracking-[0.3em] mb-3">{tournament.organizer_name} Presents</p>
          )}

          {tournament.short_name && (
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black mb-2 tracking-tight text-white drop-shadow-md">{tournament.short_name}</h1>
          )}
          <p className="text-base md:text-lg font-medium text-white/60 mb-8">{tournament.name}</p>

          <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
            {[
              { icon: Calendar, text: formatDateRange(tournament.start_date, tournament.end_date) },
              { icon: MapPin, text: tournament.venue },
              { icon: Flame, text: `${tournament.format} | ${tournament.overs} Overs` },
              { icon: Shield, text: `${tournament.total_teams} Teams` },
            ].map((pill, idx) => (
              <span key={idx} className="flex items-center gap-1.5 text-[11px] font-medium text-white/80 bg-white/15 backdrop-blur-sm px-3.5 py-1.5 rounded-full">
                <pill.icon className="w-3 h-3" /> {pill.text}
              </span>
            ))}
          </div>

          {/* Stat Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-xl mx-auto mb-8">
            {[
              { value: fixtures.length, label: 'Matches' },
              { value: completedCount, label: 'Completed' },
              { value: teams.length, label: 'Teams' },
              { value: remainingCount, label: 'Remaining' },
            ].map(stat => (
              <div key={stat.label} className="bg-white/15 backdrop-blur-sm rounded-2xl p-3.5 border border-white/10">
                <p className="text-2xl md:text-3xl font-black text-white">{stat.value}</p>
                <p className="text-[10px] text-white/45 font-semibold uppercase tracking-wider mt-0.5">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Progress */}
          {fixtures.length > 0 && (
            <div className="max-w-xs mx-auto">
              <div className="flex items-center justify-between text-[11px] text-white/45 font-medium mb-1.5">
                <span>{completedCount} of {fixtures.length} matches</span>
                <span className="text-white/70 font-bold">{progressPct}%</span>
              </div>
              <div className="h-2 bg-white/15 rounded-full overflow-hidden">
                <div className="h-full bg-white rounded-full transition-all duration-1000" style={{ width: `${progressPct}%` }} />
              </div>
            </div>
          )}

          {heroSponsors.length > 0 && (
            <div className="mt-10 pt-6 border-t border-white/10">
              <p className="text-[10px] uppercase tracking-[0.25em] text-white/30 mb-3 font-semibold">Powered by</p>
              <div className="flex flex-wrap items-center justify-center gap-6">
                {heroSponsors.map(sponsor => (
                  <a key={sponsor.id} href={sponsor.website_url || '#'} target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition-opacity">
                    {sponsor.logo_url ? (
                      <img src={sponsor.logo_url} alt={sponsor.name} className="h-7 md:h-9 object-contain brightness-0 invert opacity-60 hover:opacity-90 transition-opacity" />
                    ) : (
                      <span className="text-white/60 font-bold text-sm">{sponsor.name}</span>
                    )}
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ========== POINTS TABLE ========== */}
      <section className="max-w-5xl mx-auto px-4 py-12 md:py-16">
        <SectionHeader icon={Trophy} label="Points Table" title="Standings" color={P.accent} bgColor={P.accentLight} />

        <div className="bg-white rounded-3xl overflow-hidden shadow-xl" style={{ border: `1px solid ${P.border}` }}>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px]">
              <thead>
                <tr style={{ background: P.accentLight }}>
                  {['#', 'Team', 'P', 'W', 'L', 'D', 'Pts', 'NRR', 'Form'].map((h, i) => (
                    <th key={h} className={`px-3 py-3.5 text-[10px] uppercase tracking-wider font-bold ${i <= 1 ? 'text-left' : 'text-center'} ${h === 'Form' ? 'hidden md:table-cell' : ''}`} style={{ color: P.accent }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {standings.map((row, i) => {
                  const isQ = i < qualifyCount && row.played > 0;
                  return (
                    <tr key={row.team.id} className="transition-colors hover:bg-violet-50/50" style={{ borderBottom: `1px solid ${P.border}`, background: isQ ? '#f0fdf4' : undefined }}>
                      <td className="px-3 py-3.5">
                        <div className={`w-7 h-7 rounded-xl flex items-center justify-center text-[11px] font-bold ${
                          i === 0 ? 'bg-gradient-to-br from-amber-400 to-orange-500 text-white shadow-md' :
                          i === 1 ? 'bg-gradient-to-br from-gray-300 to-gray-400 text-white' :
                          i === 2 ? 'bg-gradient-to-br from-amber-600 to-amber-700 text-amber-100' :
                          'bg-gray-100 text-gray-500'
                        }`}>{i + 1}</div>
                      </td>
                      <td className="px-3 py-3.5">
                        <div className="flex items-center gap-2.5">
                          <div className="w-1 h-7 rounded-full shrink-0" style={{ backgroundColor: row.team.primary_color }} />
                          <TeamLogo team={row.team} size="md" />
                          <div>
                            <span className="font-bold text-sm block" style={{ color: P.text }}>{row.team.name}</span>
                            {isQ && <span className="text-[9px] text-emerald-600 font-bold uppercase tracking-wider">Qualified</span>}
                          </div>
                        </div>
                      </td>
                      <td className="px-3 py-3.5 text-center text-sm" style={{ color: P.textSecondary }}>{row.played}</td>
                      <td className="px-3 py-3.5 text-center text-sm font-bold" style={{ color: P.green }}>{row.won}</td>
                      <td className="px-3 py-3.5 text-center text-sm font-bold" style={{ color: P.red }}>{row.lost}</td>
                      <td className="px-3 py-3.5 text-center text-sm" style={{ color: P.textSecondary }}>{row.drawn}</td>
                      <td className="px-3 py-3.5 text-center">
                        <span className="text-lg font-black" style={{ color: P.text }}>{row.points}</span>
                      </td>
                      <td className="px-3 py-3.5 text-center">
                        <span className={`font-mono text-sm font-semibold ${row.nrr > 0 ? 'text-emerald-600' : row.nrr < 0 ? 'text-red-500' : 'text-gray-400'}`}>
                          {row.nrr > 0 ? '+' : ''}{row.nrr.toFixed(3)}
                        </span>
                      </td>
                      <td className="px-3 py-3.5 text-center hidden md:table-cell">
                        <div className="flex gap-1 justify-center">
                          {row.lastFive.length === 0 && <span className="text-[10px] text-gray-300">—</span>}
                          {row.lastFive.map((r, j) => (
                            <span key={j} className={`w-5 h-5 rounded-lg text-[9px] font-bold flex items-center justify-center ${
                              r === 'W' ? 'bg-emerald-100 text-emerald-700' : r === 'L' ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-500'
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
            <div className="px-5 py-2.5 flex items-center gap-2" style={{ background: P.greenBg, borderTop: '1px solid #bbf7d0' }}>
              <div className="w-2 h-2 rounded-full" style={{ background: P.green }} />
              <span className="text-[11px] text-emerald-700 font-semibold">Top {qualifyCount} teams qualify</span>
            </div>
          )}
        </div>
      </section>

      {/* ========== MATCH CARDS ========== */}
      {recentMatches.length > 0 && (
        <section className="py-12 md:py-16">
          <div className="max-w-5xl mx-auto px-4">
            <SectionHeader icon={Flame} label="Recent Matches" title="Latest Results" color="#e11d48" bgColor="#fff1f2" />

            <div className="relative">
              <button onClick={() => scrollRef.current?.scrollBy({ left: -340, behavior: 'smooth' })}
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 z-10 w-10 h-10 bg-white shadow-xl rounded-2xl flex items-center justify-center border hover:scale-110 transition-transform hidden md:flex" style={{ borderColor: P.border }}>
                <ChevronLeft className="w-5 h-5" style={{ color: P.textSecondary }} />
              </button>
              <button onClick={() => scrollRef.current?.scrollBy({ left: 340, behavior: 'smooth' })}
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 z-10 w-10 h-10 bg-white shadow-xl rounded-2xl flex items-center justify-center border hover:scale-110 transition-transform hidden md:flex" style={{ borderColor: P.border }}>
                <ChevronRight className="w-5 h-5" style={{ color: P.textSecondary }} />
              </button>

              <div ref={scrollRef} className="flex gap-3 overflow-x-auto pb-4 snap-x snap-mandatory" style={{ scrollbarWidth: 'none' }}>
                {recentMatches.map(fixture => {
                  const isLive = fixture.status === 'live';
                  return (
                    <div key={fixture.id} className={`min-w-[300px] snap-start rounded-2xl p-4 shrink-0 transition-all ${
                      isLive ? 'bg-red-50 border-2 border-red-200 shadow-lg shadow-red-100/50' : 'bg-white border shadow-md hover:-translate-y-0.5 hover:shadow-lg'
                    }`} style={isLive ? {} : { borderColor: P.border }}>
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-[11px] font-bold" style={{ color: P.textSecondary }}>Match {fixture.match_number}</span>
                        {isLive ? (
                          <span className="flex items-center gap-1.5 text-[11px] font-bold text-red-600 bg-red-100 px-2.5 py-1 rounded-full">
                            <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" /> LIVE
                          </span>
                        ) : (
                          <span className="text-[11px]" style={{ color: P.textSecondary }}>{formatDate(fixture.date)}</span>
                        )}
                      </div>

                      {[{ team: fixture.team_a, id: fixture.team_a_id, score: fixture.team_a_score }, { team: fixture.team_b, id: fixture.team_b_id, score: fixture.team_b_score }].map((side, idx) => (
                        <div key={idx} className={`flex items-center justify-between ${idx === 0 ? 'mb-2' : 'mb-3'}`}>
                          <div className="flex items-center gap-2">
                            <TeamLogo team={side.team as ShowcaseTeam | undefined} size="sm" />
                            <span className={`font-semibold text-sm ${fixture.winner_team_id === side.id ? 'text-gray-800' : 'text-gray-400'}`}>
                              {(side.team as ShowcaseTeam | undefined)?.short_name || (side.team as ShowcaseTeam | undefined)?.name || 'TBD'}
                            </span>
                          </div>
                          <span className={`font-bold text-sm tabular-nums ${fixture.winner_team_id === side.id ? 'text-violet-600' : 'text-gray-400'}`}>
                            {side.score || '-'}
                          </span>
                        </div>
                      ))}

                      {fixture.result_summary && (
                        <div className="pt-2.5 border-t" style={{ borderColor: P.border }}>
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
      <section className="py-12 md:py-16">
        <div className="max-w-5xl mx-auto px-4">
          <SectionHeader icon={Calendar} label="Schedule" title="Fixtures & Results" color={P.blue} bgColor={P.blueBg} />

          <div className="flex gap-1 justify-center mb-8 bg-white rounded-2xl p-1.5 max-w-xs mx-auto shadow-sm" style={{ border: `1px solid ${P.border}` }}>
            {(['all', 'completed', 'upcoming'] as const).map(f => (
              <button key={f} onClick={() => setFixtureFilter(f)} className={`flex-1 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                fixtureFilter === f ? 'text-white shadow-md' : 'text-gray-500 hover:text-gray-700'
              }`} style={fixtureFilter === f ? { background: P.accent, boxShadow: '0 4px 12px rgba(124,92,224,0.25)' } : {}}>
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
        <section className="py-12 md:py-16">
          <div className="max-w-5xl mx-auto px-4">
            <SectionHeader icon={Award} label="Awards" title="Tournament Awards" color="#d97706" bgColor={P.amberBg} />

            {/* Player Awards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-5">
              {topPerformers.mostRuns && (
                <AwardCard gradient="from-orange-400 to-red-500" emoji="🧢" title="Orange Cap" name={topPerformers.mostRuns.name} team={topPerformers.mostRuns.teamName}
                  value={`${topPerformers.mostRuns.value}`} unit="runs" detail={topPerformers.mostRuns.detail} />
              )}
              {topPerformers.mostWickets && (
                <AwardCard gradient="from-purple-500 to-violet-600" emoji="🧢" title="Purple Cap" name={topPerformers.mostWickets.name} team={topPerformers.mostWickets.teamName}
                  value={`${topPerformers.mostWickets.value}`} unit="wickets" detail={topPerformers.mostWickets.detail} />
              )}
              {topPerformers.mvp && (
                <AwardCard gradient="from-amber-400 to-yellow-500" icon={<Trophy className="w-5 h-5 text-white" />} title="MVP" name={topPerformers.mvp.name} team={topPerformers.mvp.teamName}
                  value={`${topPerformers.mvp.value}`} unit="MoM" detail={topPerformers.mvp.detail} />
              )}
            </div>

            {/* Team Awards */}
            {(awards.mostWinsTeam || awards.highestTeamScore) && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
                {awards.mostWinsTeam && (
                  <div className="bg-white rounded-2xl p-5 shadow-md" style={{ border: `1px solid ${P.border}` }}>
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: P.greenBg }}><Trophy className="w-4 h-4" style={{ color: P.green }} /></div>
                      <span className="text-xs font-bold uppercase tracking-wider" style={{ color: P.green }}>Most Wins</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <TeamLogo team={awards.mostWinsTeam.team} size="lg" />
                      <div>
                        <p className="font-bold" style={{ color: P.text }}>{awards.mostWinsTeam.team.name}</p>
                        <p className="text-2xl font-black" style={{ color: P.green }}>{awards.mostWinsTeam.wins} wins</p>
                      </div>
                    </div>
                  </div>
                )}
                {awards.highestTeamScore && (
                  <div className="bg-white rounded-2xl p-5 shadow-md" style={{ border: `1px solid ${P.border}` }}>
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: P.blueBg }}><Target className="w-4 h-4" style={{ color: P.blue }} /></div>
                      <span className="text-xs font-bold uppercase tracking-wider" style={{ color: P.blue }}>Highest Score</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <TeamLogo team={awards.highestTeamScore.team} size="lg" />
                      <div>
                        <p className="font-bold" style={{ color: P.text }}>{awards.highestTeamScore.team.name}</p>
                        <p className="text-2xl font-black" style={{ color: P.blue }}>{awards.highestTeamScore.score}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* MoM Leaderboard */}
            {awards.momLeaderboard.length > 0 && (
              <div className="bg-white rounded-2xl overflow-hidden shadow-md" style={{ border: `1px solid ${P.border}` }}>
                <div className="px-5 py-3.5 flex items-center gap-2" style={{ background: P.amberBg, borderBottom: '1px solid #fde68a' }}>
                  <Star className="w-4 h-4 text-amber-500" />
                  <h3 className="font-bold text-sm" style={{ color: P.text }}>Man of the Match Leaderboard</h3>
                </div>
                <div>
                  {awards.momLeaderboard.slice(0, 8).map((entry, i) => (
                    <div key={entry.name} className="flex items-center justify-between px-5 py-3 hover:bg-violet-50/30 transition-colors" style={{ borderBottom: `1px solid ${P.border}` }}>
                      <div className="flex items-center gap-3">
                        <span className={`w-6 h-6 rounded-lg flex items-center justify-center text-[10px] font-bold ${
                          i === 0 ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-500'
                        }`}>{i + 1}</span>
                        <div>
                          <p className="font-semibold text-sm" style={{ color: P.text }}>{entry.name}</p>
                          <p className="text-[11px]" style={{ color: P.textSecondary }}>{entry.teamName}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full shadow-sm" style={{ backgroundColor: entry.teamColor }} />
                        <span className="font-black text-lg" style={{ color: P.text }}>{entry.count}</span>
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
        <section className="py-12 md:py-16">
          <div className="max-w-5xl mx-auto px-4">
            <SectionHeader icon={BarChart3} label="Analytics" title="Team Performance" color="#7c3aed" bgColor="#ede9fe" />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              {[
                { title: 'Wins / Losses / Draws', bars: [{ key: 'won', name: 'Won', fill: '#22c55e' }, { key: 'lost', name: 'Lost', fill: '#ef4444' }, { key: 'drawn', name: 'Drawn', fill: '#f59e0b' }] },
                { title: 'Runs Scored vs Conceded', bars: [{ key: 'runsScored', name: 'Scored', fill: '#7c5ce0' }, { key: 'runsConceded', name: 'Conceded', fill: '#f43f5e' }] },
              ].map(chart => (
                <div key={chart.title} className="bg-white rounded-2xl p-5 shadow-md" style={{ border: `1px solid ${P.border}` }}>
                  <h3 className="font-bold text-sm mb-4" style={{ color: P.text }}>{chart.title}</h3>
                  <div className="h-60">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={teamChartData} barCategoryGap="20%">
                        <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                        <XAxis dataKey="shortName" tick={{ fontSize: 11, fill: '#9CA3AF' }} axisLine={{ stroke: '#f3f4f6' }} tickLine={false} />
                        <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
                        <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '14px', boxShadow: '0 10px 25px -5px rgb(0 0 0 / 0.08)', fontSize: '12px' }}
                          labelFormatter={label => teamChartData.find(d => d.shortName === label)?.teamName || label} />
                        <Legend wrapperStyle={{ fontSize: '11px' }} />
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

      {/* ========== TEAMS ========== */}
      <section className="py-12 md:py-16">
        <div className="max-w-5xl mx-auto px-4">
          <SectionHeader icon={Shield} label="Participants" title="Teams" color={P.accent} bgColor={P.accentLight} />

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {teams.map(team => (
              <div key={team.id} className="group bg-white rounded-2xl p-5 text-center hover:-translate-y-1 transition-all shadow-md hover:shadow-xl" style={{ border: `1px solid ${P.border}` }}>
                <div className="relative w-14 h-14 mx-auto mb-3">
                  {team.logo_url ? (
                    <img src={team.logo_url} alt={team.name} className="w-14 h-14 rounded-2xl object-cover shadow-md" />
                  ) : (
                    <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-white font-black text-lg shadow-md" style={{ backgroundColor: team.primary_color }}>
                      {team.short_name || team.name.substring(0, 2).toUpperCase()}
                    </div>
                  )}
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white shadow-sm" style={{ backgroundColor: team.primary_color }} />
                </div>
                <p className="font-bold text-sm mb-0.5" style={{ color: P.text }}>{team.name}</p>
                {team.captain_name && <p className="text-[11px]" style={{ color: P.textSecondary }}>Capt: {team.captain_name}</p>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== CTA ========== */}
      <section className="relative overflow-hidden py-16" style={{ background: P.hero }}>
        <div className="absolute inset-0 opacity-[0.08]" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '28px 28px' }} />
        <div className="absolute top-0 left-0 w-80 h-80 bg-white/10 rounded-full blur-[100px]" />

        <div className="relative max-w-3xl mx-auto px-4 text-center">
          <CricMatesLogo size={40} className="justify-center mb-4" showText textClassName="text-lg text-white" />
          <h2 className="text-2xl md:text-3xl font-black text-white mb-3">Want This for Your Club?</h2>
          <p className="text-sm text-white/60 mb-8 max-w-md mx-auto leading-relaxed">
            CricMates helps cricket clubs manage members, matches, tournaments, and finances. Start your free 15-day trial.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a href={`https://wa.me/${settings.contact.whatsapp}?text=${encodeURIComponent('Hi, I saw the tournament page and want to start a free trial for my cricket club on CricMates.')}`}
              target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-white font-bold py-3.5 px-7 rounded-2xl hover:bg-violet-50 transition-all text-sm shadow-xl hover:scale-[1.02]" style={{ color: P.accent }}>
              <MessageCircle className="w-4 h-4" /> Start Free Trial
            </a>
            <Link to="/pricing"
              className="inline-flex items-center justify-center gap-2 bg-white/10 text-white font-bold py-3.5 px-7 rounded-2xl hover:bg-white/20 transition-all text-sm border border-white/20 backdrop-blur-sm">
              View Pricing <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ========== FOOTER ========== */}
      <footer className="py-10" style={{ background: '#1e1b4b' }}>
        <div className="max-w-4xl mx-auto px-4 text-center">
          <CricMatesLogo size={28} className="justify-center mb-2" showText textClassName="text-sm text-violet-200" />
          <p className="text-xs text-violet-300/40 mb-3">The complete cricket club management platform</p>
          <div className="flex items-center justify-center gap-5 text-xs flex-wrap">
            <a href={`https://wa.me/${settings.contact.whatsapp}`} target="_blank" rel="noopener noreferrer" className="text-violet-300/50 hover:text-violet-200 transition-colors flex items-center gap-1.5">
              <MessageCircle className="w-3.5 h-3.5" /> WhatsApp
            </a>
            <Link to="/pricing" className="text-violet-300/50 hover:text-violet-200 transition-colors">Pricing</Link>
            <Link to="/how-it-works" className="text-violet-300/50 hover:text-violet-200 transition-colors">How It Works</Link>
          </div>
          {sponsors.length > 0 && (
            <div className="my-6 py-5 border-t border-b border-violet-800/30">
              <p className="text-[10px] text-violet-400/30 uppercase tracking-[0.2em] mb-3 font-medium">Tournament Partners</p>
              <div className="flex flex-wrap justify-center gap-6 items-center">
                {sponsors.map(sponsor => (
                  <a key={sponsor.id} href={sponsor.website_url || '#'} target="_blank" rel="noopener noreferrer"
                    className="opacity-30 hover:opacity-70 transition-all">
                    {sponsor.logo_url ? (
                      <img src={sponsor.logo_url} alt={sponsor.name} className="h-6 object-contain brightness-0 invert" />
                    ) : (
                      <span className="text-xs font-semibold text-violet-300">{sponsor.name}</span>
                    )}
                  </a>
                ))}
              </div>
            </div>
          )}
          <div className="mt-6 pt-5 border-t border-violet-800/20">
            <p className="text-[11px] text-violet-400/25">Powered by CricMates — Built for cricket lovers across India</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

// --- Section Header ---
function SectionHeader({ icon: Icon, label, title, color, bgColor }: { icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>; label: string; title: string; color: string; bgColor: string }) {
  return (
    <div className="text-center mb-8">
      <span className="inline-flex items-center gap-2 text-xs font-bold px-4 py-2 rounded-full mb-3 uppercase tracking-wider" style={{ color, background: bgColor }}>
        <Icon className="w-3.5 h-3.5" style={{ color }} /> {label}
      </span>
      <h2 className="text-3xl md:text-4xl font-black" style={{ color: '#1e1b4b' }}>{title}</h2>
    </div>
  );
}

// --- Award Card ---
function AwardCard({ gradient, emoji, icon, title, name, team, value, unit, detail }: {
  gradient: string; emoji?: string; icon?: React.ReactNode; title: string; name: string; team: string; value: string; unit: string; detail: string;
}) {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-md hover:shadow-xl hover:-translate-y-0.5 transition-all" style={{ border: '1px solid #e9e5f5' }}>
      <div className="flex items-center gap-2 mb-3">
        <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow-md`}>
          {emoji ? <span className="text-base">{emoji}</span> : icon}
        </div>
        <span className="text-xs font-bold uppercase tracking-wider text-gray-500">{title}</span>
      </div>
      <p className="text-base font-black text-gray-800">{name}</p>
      <p className="text-[11px] text-gray-400 mb-2">{team}</p>
      <p className="text-2xl font-black" style={{ color: '#7c5ce0' }}>{value} <span className="text-sm font-semibold text-gray-400">{unit}</span></p>
      <p className="text-[11px] text-gray-400 mt-1">{detail}</p>
    </div>
  );
}

// --- Fixture Card ---
function FixtureCard({ fixture }: { fixture: ShowcaseFixture }) {
  const isLive = fixture.status === 'live';
  const isCompleted = fixture.status === 'completed';

  return (
    <div className={`bg-white rounded-2xl overflow-hidden transition-all hover:shadow-lg ${
      isLive ? 'border-2 border-red-200 shadow-lg shadow-red-100/50' : 'border shadow-md'
    }`} style={isLive ? {} : { borderColor: '#e9e5f5' }}>
      <div className="px-5 py-2.5 flex items-center justify-between" style={{ background: '#faf8ff', borderBottom: '1px solid #e9e5f5' }}>
        <span className="text-[11px] text-gray-400 font-bold">Match {fixture.match_number}</span>
        <div className="flex items-center gap-2">
          <span className="text-[11px] text-gray-400">{formatDate(fixture.date)} {fixture.time && `| ${fixture.time}`}</span>
          {isLive && (
            <span className="flex items-center gap-1 text-[10px] font-bold text-red-600 bg-red-100 px-2 py-0.5 rounded-full">
              <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" /> LIVE
            </span>
          )}
          {fixture.status === 'upcoming' && (
            <span className="text-[10px] font-semibold text-violet-600 bg-violet-100 px-2 py-0.5 rounded-full">Upcoming</span>
          )}
        </div>
      </div>

      <div className="px-5 py-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex-1 text-center md:text-right">
            <div className="flex items-center gap-2 justify-center md:justify-end mb-1.5">
              <span className="font-bold text-gray-800 text-sm truncate">{fixture.team_a?.name || 'TBD'}</span>
              <TeamLogo team={fixture.team_a as ShowcaseTeam | undefined} size="md" />
            </div>
            {fixture.team_a_score ? (
              <p className={`text-xl md:text-2xl font-black tabular-nums ${fixture.winner_team_id === fixture.team_a_id ? 'text-violet-600' : 'text-gray-300'}`}>
                {fixture.team_a_score}
              </p>
            ) : (
              !isCompleted && fixture.status !== 'upcoming' && <p className="text-gray-300">—</p>
            )}
          </div>

          <div className="flex-shrink-0 px-2">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-[10px] font-black ${
              isCompleted ? 'text-violet-600' : 'text-gray-400'
            }`} style={{ background: isCompleted ? '#ede9fe' : '#f3f4f6' }}>
              {isCompleted ? <Target className="w-4 h-4" /> : 'VS'}
            </div>
          </div>

          <div className="flex-1 text-center md:text-left">
            <div className="flex items-center gap-2 justify-center md:justify-start mb-1.5">
              <TeamLogo team={fixture.team_b as ShowcaseTeam | undefined} size="md" />
              <span className="font-bold text-gray-800 text-sm truncate">{fixture.team_b?.name || 'TBD'}</span>
            </div>
            {fixture.team_b_score ? (
              <p className={`text-xl md:text-2xl font-black tabular-nums ${fixture.winner_team_id === fixture.team_b_id ? 'text-violet-600' : 'text-gray-300'}`}>
                {fixture.team_b_score}
              </p>
            ) : (
              !isCompleted && fixture.status !== 'upcoming' && <p className="text-gray-300">—</p>
            )}
          </div>
        </div>

        {fixture.result_summary && (
          <div className="text-center mt-3 pt-3" style={{ borderTop: '1px solid #e9e5f5' }}>
            <p className="text-xs text-gray-500">{fixture.result_summary}</p>
            {fixture.man_of_match_name && (
              <p className="mt-1 inline-flex items-center gap-1 text-[11px] text-amber-600 font-medium">
                <Star className="w-3 h-3" /> MoM: {fixture.man_of_match_name}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
