import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Calendar, MapPin, Trophy, Award, ArrowRight, MessageCircle, Users, Target, Clock } from 'lucide-react';
import { CricMatesLogo } from '../components/CricMatesLogo';
import { useShowcaseTournament } from '../hooks/useShowcaseTournament';
import { usePlatformSettings } from '../hooks/usePlatformSettings';
import type { ShowcaseFixture } from '../types';

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

export function TournamentShowcase() {
  const { slug } = useParams<{ slug: string }>();
  const { tournament, teams, fixtures, standings, topPerformers, loading, error } = useShowcaseTournament(slug || '');
  const { settings } = usePlatformSettings();
  const [fixtureFilter, setFixtureFilter] = useState<'all' | 'completed' | 'upcoming'>('all');

  const completedCount = fixtures.filter(f => f.status === 'completed').length;
  const remainingCount = fixtures.filter(f => f.status === 'upcoming' || f.status === 'live').length;

  const filteredFixtures = fixtures.filter(f => {
    if (fixtureFilter === 'completed') return f.status === 'completed';
    if (fixtureFilter === 'upcoming') return f.status === 'upcoming' || f.status === 'live';
    return true;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-emerald-500 border-t-transparent mx-auto mb-4" />
          <p className="text-gray-400">Loading tournament...</p>
        </div>
      </div>
    );
  }

  if (error || !tournament) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
        <div className="text-center">
          <Trophy className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-white mb-2">Tournament Not Found</h1>
          <p className="text-gray-400 mb-6">The tournament you're looking for doesn't exist.</p>
          <Link to="/pricing" className="text-emerald-400 hover:text-emerald-300 font-medium">
            Go to CricMates
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      {/* Nav */}
      <nav className="bg-white/80 dark:bg-gray-950/80 backdrop-blur-xl border-b border-gray-100 dark:border-gray-800 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link to="/pricing" className="hover:opacity-80 transition-opacity">
            <CricMatesLogo size={36} showText textClassName="text-lg text-gray-900 dark:text-gray-100" />
          </Link>
          <div className="flex items-center gap-3">
            <Link to="/pricing" className="text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors">
              Pricing
            </Link>
            <Link to="/" className="text-sm font-semibold text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 flex items-center gap-1 bg-emerald-50 dark:bg-emerald-900/20 px-4 py-2 rounded-full hover:bg-emerald-100 dark:hover:bg-emerald-900/40 transition-all">
              Enter App <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Banner */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-950 via-emerald-950 to-gray-950" />
        {/* Cricket field decorative circles */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border-2 border-emerald-500/10 rounded-full" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] border-2 border-emerald-500/10 rounded-full" />
        <div className="absolute top-20 left-10 w-72 h-72 bg-emerald-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl" />

        <div className="relative max-w-5xl mx-auto px-4 py-16 md:py-24 text-center">
          {/* Status Badge */}
          {tournament.status === 'ongoing' && (
            <div className="inline-flex items-center gap-2 bg-red-500/20 backdrop-blur-sm text-red-400 text-sm font-bold px-4 py-2 rounded-full mb-6 border border-red-500/30">
              <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
              LIVE TOURNAMENT
            </div>
          )}
          {tournament.status === 'upcoming' && (
            <div className="inline-flex items-center gap-2 bg-amber-500/20 backdrop-blur-sm text-amber-400 text-sm font-bold px-4 py-2 rounded-full mb-6 border border-amber-500/30">
              <Clock className="w-4 h-4" />
              COMING SOON
            </div>
          )}
          {tournament.status === 'completed' && (
            <div className="inline-flex items-center gap-2 bg-emerald-500/20 backdrop-blur-sm text-emerald-400 text-sm font-bold px-4 py-2 rounded-full mb-6 border border-emerald-500/30">
              <Trophy className="w-4 h-4" />
              COMPLETED
            </div>
          )}

          {/* Organizer */}
          {tournament.organizer_name && (
            <p className="text-emerald-400/70 text-sm font-medium mb-3 uppercase tracking-widest">
              {tournament.organizer_name} Presents
            </p>
          )}

          {/* Tournament Name */}
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-extrabold text-white mb-6 leading-[1.1]">
            {tournament.short_name && (
              <span className="block text-lg md:text-xl font-bold text-amber-400/80 mb-2">{tournament.short_name}</span>
            )}
            {tournament.name}
          </h1>

          {/* Meta Info Strip */}
          <div className="flex flex-wrap items-center justify-center gap-3 md:gap-4 text-emerald-300/80 text-sm md:text-base mb-10">
            <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4" /> {formatDateRange(tournament.start_date, tournament.end_date)}</span>
            <span className="w-1 h-1 bg-emerald-500/50 rounded-full hidden md:block" />
            <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4" /> {tournament.venue_address || tournament.venue}</span>
            <span className="w-1 h-1 bg-emerald-500/50 rounded-full hidden md:block" />
            <span>{tournament.format} | {tournament.overs} Overs</span>
            <span className="w-1 h-1 bg-emerald-500/50 rounded-full hidden md:block" />
            <span className="flex items-center gap-1.5"><Users className="w-4 h-4" /> {tournament.total_teams} Teams</span>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-2xl mx-auto">
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
              <p className="text-2xl md:text-3xl font-extrabold text-white">{fixtures.length}</p>
              <p className="text-xs text-emerald-300/60">Total Matches</p>
            </div>
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
              <p className="text-2xl md:text-3xl font-extrabold text-emerald-400">{completedCount}</p>
              <p className="text-xs text-emerald-300/60">Completed</p>
            </div>
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
              <p className="text-2xl md:text-3xl font-extrabold text-amber-400">{teams.length}</p>
              <p className="text-xs text-emerald-300/60">Teams</p>
            </div>
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
              <p className="text-2xl md:text-3xl font-extrabold text-white">{remainingCount}</p>
              <p className="text-xs text-emerald-300/60">Remaining</p>
            </div>
          </div>
        </div>
      </section>

      {/* Points Table */}
      <section className="max-w-5xl mx-auto px-4 py-12 md:py-16">
        <div className="text-center mb-8">
          <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 px-4 py-1.5 rounded-full mb-4">
            <Trophy className="w-4 h-4" /> Points Table
          </span>
          <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 dark:text-gray-100">Standings</h2>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px]">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-800/80 text-xs uppercase tracking-wider">
                  <th className="px-4 py-3 text-left text-gray-500 font-semibold w-10">#</th>
                  <th className="px-4 py-3 text-left text-gray-500 font-semibold">Team</th>
                  <th className="px-4 py-3 text-center text-gray-500 font-semibold">P</th>
                  <th className="px-4 py-3 text-center text-gray-500 font-semibold">W</th>
                  <th className="px-4 py-3 text-center text-gray-500 font-semibold">L</th>
                  <th className="px-4 py-3 text-center text-gray-500 font-semibold">D</th>
                  <th className="px-4 py-3 text-center text-gray-500 font-semibold">Pts</th>
                  <th className="px-4 py-3 text-center text-gray-500 font-semibold">NRR</th>
                  <th className="px-4 py-3 text-center text-gray-500 font-semibold hidden md:table-cell">Form</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {standings.map((row, i) => (
                  <tr key={row.team.id} className={`hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors ${i === 0 && row.played > 0 ? 'bg-emerald-50/50 dark:bg-emerald-900/10' : ''}`}>
                    <td className="px-4 py-3.5">
                      <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                        i === 0 ? 'bg-amber-400 text-amber-900' :
                        i === 1 ? 'bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-200' :
                        'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
                      }`}>{i + 1}</span>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-xs shrink-0" style={{ backgroundColor: row.team.primary_color }}>
                          {row.team.short_name || row.team.name.substring(0, 2).toUpperCase()}
                        </div>
                        <span className="font-semibold text-gray-900 dark:text-white text-sm">{row.team.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 text-center text-gray-600 dark:text-gray-400">{row.played}</td>
                    <td className="px-4 py-3.5 text-center font-semibold text-green-600">{row.won}</td>
                    <td className="px-4 py-3.5 text-center font-semibold text-red-500">{row.lost}</td>
                    <td className="px-4 py-3.5 text-center text-gray-600 dark:text-gray-400">{row.drawn}</td>
                    <td className="px-4 py-3.5 text-center">
                      <span className="font-extrabold text-gray-900 dark:text-white text-lg">{row.points}</span>
                    </td>
                    <td className="px-4 py-3.5 text-center">
                      <span className={`font-mono text-sm ${row.nrr > 0 ? 'text-green-600' : row.nrr < 0 ? 'text-red-500' : 'text-gray-400'}`}>
                        {row.nrr > 0 ? '+' : ''}{row.nrr.toFixed(3)}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-center hidden md:table-cell">
                      <div className="flex gap-1 justify-center">
                        {row.lastFive.length === 0 && <span className="text-xs text-gray-400">—</span>}
                        {row.lastFive.map((r, j) => (
                          <span key={j} className={`w-5 h-5 rounded-full text-[10px] font-bold flex items-center justify-center ${
                            r === 'W' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                            r === 'L' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                            'bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400'
                          }`}>{r}</span>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Fixtures & Results */}
      <section className="bg-gray-50 dark:bg-gray-900 py-12 md:py-16">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-8">
            <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 px-4 py-1.5 rounded-full mb-4">
              <Calendar className="w-4 h-4" /> Schedule
            </span>
            <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 dark:text-gray-100">Fixtures & Results</h2>
          </div>

          {/* Filter Pills */}
          <div className="flex gap-2 justify-center mb-8">
            {(['all', 'completed', 'upcoming'] as const).map(f => (
              <button key={f} onClick={() => setFixtureFilter(f)} className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                fixtureFilter === f
                  ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20'
                  : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700'
              }`}>
                {f === 'all' ? 'All Matches' : f === 'completed' ? 'Results' : 'Upcoming'}
              </button>
            ))}
          </div>

          {/* Match Cards */}
          <div className="space-y-4">
            {filteredFixtures.length === 0 && (
              <p className="text-center text-gray-400 py-8">No matches to show</p>
            )}
            {filteredFixtures.map(fixture => (
              <FixtureCard key={fixture.id} fixture={fixture} />
            ))}
          </div>
        </div>
      </section>

      {/* Top Performers */}
      {(topPerformers.mostRuns || topPerformers.mostWickets || topPerformers.mvp) && (
        <section className="max-w-5xl mx-auto px-4 py-12 md:py-16">
          <div className="text-center mb-8">
            <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-violet-600 dark:text-violet-400 bg-violet-50 dark:bg-violet-900/20 px-4 py-1.5 rounded-full mb-4">
              <Award className="w-4 h-4" /> Top Performers
            </span>
            <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 dark:text-gray-100">Tournament Stars</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {topPerformers.mostRuns && (
              <div className="bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-900/10 dark:to-amber-900/10 rounded-2xl border border-orange-200 dark:border-orange-800 p-6">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-2xl">🧢</span>
                  <h3 className="font-bold text-orange-700 dark:text-orange-400">Orange Cap</h3>
                </div>
                <p className="text-xl font-extrabold text-gray-900 dark:text-white">{topPerformers.mostRuns.name}</p>
                <p className="text-sm text-gray-500">{topPerformers.mostRuns.teamName}</p>
                <p className="text-3xl font-extrabold text-orange-600 mt-2">{topPerformers.mostRuns.value} runs</p>
                <p className="text-xs text-gray-400 mt-1">{topPerformers.mostRuns.detail}</p>
              </div>
            )}

            {topPerformers.mostWickets && (
              <div className="bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-900/10 dark:to-violet-900/10 rounded-2xl border border-purple-200 dark:border-purple-800 p-6">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-2xl">🧢</span>
                  <h3 className="font-bold text-purple-700 dark:text-purple-400">Purple Cap</h3>
                </div>
                <p className="text-xl font-extrabold text-gray-900 dark:text-white">{topPerformers.mostWickets.name}</p>
                <p className="text-sm text-gray-500">{topPerformers.mostWickets.teamName}</p>
                <p className="text-3xl font-extrabold text-purple-600 mt-2">{topPerformers.mostWickets.value} wickets</p>
                <p className="text-xs text-gray-400 mt-1">{topPerformers.mostWickets.detail}</p>
              </div>
            )}

            {topPerformers.mvp && (
              <div className="bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-amber-900/10 dark:to-yellow-900/10 rounded-2xl border border-amber-200 dark:border-amber-800 p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Trophy className="w-6 h-6 text-amber-500" />
                  <h3 className="font-bold text-amber-700 dark:text-amber-400">Most Valuable Player</h3>
                </div>
                <p className="text-xl font-extrabold text-gray-900 dark:text-white">{topPerformers.mvp.name}</p>
                <p className="text-sm text-gray-500">{topPerformers.mvp.teamName}</p>
                <p className="text-3xl font-extrabold text-amber-600 mt-2">{topPerformers.mvp.value} MoM</p>
                <p className="text-xs text-gray-400 mt-1">{topPerformers.mvp.detail}</p>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Teams Section */}
      <section className="bg-gray-50 dark:bg-gray-900 py-12 md:py-16">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-8">
            <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 px-4 py-1.5 rounded-full mb-4">
              <Users className="w-4 h-4" /> Participants
            </span>
            <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 dark:text-gray-100">Teams</h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {teams.map(team => (
              <div key={team.id} className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-5 text-center hover:shadow-lg hover:-translate-y-1 transition-all">
                <div className="w-14 h-14 rounded-xl flex items-center justify-center text-white font-extrabold text-lg mx-auto mb-3 shadow-lg" style={{ backgroundColor: team.primary_color }}>
                  {team.short_name || team.name.substring(0, 2).toUpperCase()}
                </div>
                <p className="font-bold text-gray-900 dark:text-white text-sm">{team.name}</p>
                {team.captain_name && (
                  <p className="text-xs text-gray-400 mt-1">Capt: {team.captain_name}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-600 via-teal-500 to-cyan-500" />
        <div className="absolute top-10 left-10 w-72 h-72 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-emerald-400/20 rounded-full blur-3xl" />

        <div className="relative max-w-4xl mx-auto px-4 py-16 text-center">
          <CricMatesLogo size={48} className="justify-center mb-4" showText textClassName="text-2xl text-white" />
          <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-3">
            Want This for Your Cricket Club?
          </h2>
          <p className="text-lg text-emerald-100/90 mb-8 max-w-xl mx-auto">
            CricMates helps cricket clubs manage members, matches, tournaments, and finances. Start your free 15-day trial today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href={`https://wa.me/${settings.contact.whatsapp}?text=${encodeURIComponent('Hi, I saw the tournament page and want to start a free trial for my cricket club on CricMates.')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-white text-emerald-700 font-bold py-4 px-8 rounded-2xl hover:bg-emerald-50 transition-all text-lg shadow-xl hover:shadow-2xl hover:scale-105"
            >
              <MessageCircle className="w-5 h-5" /> Start Free Trial
            </a>
            <Link
              to="/pricing"
              className="inline-flex items-center justify-center gap-2 bg-white/10 text-white font-bold py-4 px-8 rounded-2xl hover:bg-white/20 transition-all text-lg border border-white/20"
            >
              View Pricing <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-950 text-gray-400 py-12">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <CricMatesLogo size={36} className="justify-center mb-3" showText textClassName="text-lg text-white" />
          <p className="text-sm text-gray-500 mb-4">The complete cricket club management platform</p>
          <div className="flex items-center justify-center gap-6 text-sm flex-wrap">
            <a href={`https://wa.me/${settings.contact.whatsapp}`} target="_blank" rel="noopener noreferrer" className="hover:text-emerald-400 transition-colors flex items-center gap-1.5">
              <MessageCircle className="w-4 h-4" /> WhatsApp
            </a>
            <Link to="/pricing" className="hover:text-emerald-400 transition-colors">Pricing</Link>
            <Link to="/how-it-works" className="hover:text-emerald-400 transition-colors">How It Works</Link>
          </div>
          <div className="mt-8 pt-6 border-t border-gray-800">
            <p className="text-xs text-gray-600">Powered by CricMates — Built for cricket lovers across India</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

// --- Fixture Card Component ---
function FixtureCard({ fixture }: { fixture: ShowcaseFixture }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-lg transition-all">
      {/* Match Header */}
      <div className="px-4 py-2.5 bg-gray-50 dark:bg-gray-750 flex items-center justify-between text-xs text-gray-500">
        <span className="font-semibold">Match {fixture.match_number}</span>
        <div className="flex items-center gap-2">
          <span>{formatDate(fixture.date)} {fixture.time && `| ${fixture.time}`}</span>
          {fixture.status === 'live' && (
            <span className="flex items-center gap-1 text-red-500 font-bold">
              <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" /> LIVE
            </span>
          )}
          {fixture.status === 'upcoming' && (
            <span className="text-amber-500 font-medium">Upcoming</span>
          )}
        </div>
      </div>

      {/* Score Layout */}
      <div className="p-4 md:p-6">
        <div className="flex items-center justify-between gap-2 md:gap-4">
          {/* Team A */}
          <div className="flex-1 text-center md:text-right">
            <div className="flex items-center gap-2 justify-center md:justify-end mb-2">
              <span className="font-bold text-gray-900 dark:text-white text-sm md:text-base truncate">
                {fixture.team_a?.name || 'TBD'}
              </span>
              <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-[10px] shrink-0" style={{ backgroundColor: fixture.team_a?.primary_color || '#666' }}>
                {fixture.team_a?.short_name || '??'}
              </div>
            </div>
            {fixture.team_a_score ? (
              <p className={`text-xl md:text-2xl font-extrabold ${fixture.winner_team_id === fixture.team_a_id ? 'text-emerald-600' : 'text-gray-400 dark:text-gray-500'}`}>
                {fixture.team_a_score}
              </p>
            ) : (
              fixture.status !== 'upcoming' && <p className="text-lg text-gray-300">—</p>
            )}
          </div>

          {/* VS Divider */}
          <div className="flex flex-col items-center px-2 md:px-4">
            <span className="text-xs font-bold text-gray-400 dark:text-gray-500 bg-gray-100 dark:bg-gray-700 w-9 h-9 rounded-full flex items-center justify-center">
              {fixture.status === 'completed' ? <Target className="w-4 h-4" /> : 'VS'}
            </span>
          </div>

          {/* Team B */}
          <div className="flex-1 text-center md:text-left">
            <div className="flex items-center gap-2 justify-center md:justify-start mb-2">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-[10px] shrink-0" style={{ backgroundColor: fixture.team_b?.primary_color || '#666' }}>
                {fixture.team_b?.short_name || '??'}
              </div>
              <span className="font-bold text-gray-900 dark:text-white text-sm md:text-base truncate">
                {fixture.team_b?.name || 'TBD'}
              </span>
            </div>
            {fixture.team_b_score ? (
              <p className={`text-xl md:text-2xl font-extrabold ${fixture.winner_team_id === fixture.team_b_id ? 'text-emerald-600' : 'text-gray-400 dark:text-gray-500'}`}>
                {fixture.team_b_score}
              </p>
            ) : (
              fixture.status !== 'upcoming' && <p className="text-lg text-gray-300">—</p>
            )}
          </div>
        </div>

        {/* Result Summary */}
        {fixture.result_summary && (
          <div className="text-center text-sm text-gray-500 dark:text-gray-400 mt-4 pt-3 border-t border-gray-100 dark:border-gray-700">
            <p>{fixture.result_summary}</p>
            {fixture.man_of_match_name && (
              <p className="mt-1 inline-flex items-center gap-1 text-amber-600 dark:text-amber-400 font-medium">
                <Award className="w-3.5 h-3.5" /> MoM: {fixture.man_of_match_name}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
