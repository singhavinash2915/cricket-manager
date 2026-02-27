import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { ClubProvider, useClub } from './context/ClubContext';
import { AuthProvider } from './context/AuthContext';
import { SubscriptionBanner } from './components/SubscriptionBanner';
import { ClubSelect } from './pages/ClubSelect';
import { SuperAdmin } from './pages/SuperAdmin';
import { Pricing } from './pages/Pricing';
import { Layout } from './components/layout/Layout';
import { Dashboard } from './pages/Dashboard';
import { Members } from './pages/Members';
import { Matches } from './pages/Matches';
import { Calendar } from './pages/Calendar';
import { Tournaments } from './pages/Tournaments';
import { Finance } from './pages/Finance';
import { Analytics } from './pages/Analytics';
import { Requests } from './pages/Requests';
import { Settings } from './pages/Settings';
import { About } from './pages/About';
import { Feedback } from './pages/Feedback';
import { Payment } from './pages/Payment';

function AppContent() {
  const { club, loading } = useClub();

  // Show loading spinner while checking for saved club
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-500 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  // If subscription is expired, show expired banner
  if (club && club.subscription_status === 'expired') {
    return <SubscriptionBanner />;
  }

  // No club selected → show club selection page
  if (!club) {
    return <ClubSelect />;
  }

  // Club selected → show the full app
  return (
    <AuthProvider>
      {club.subscription_status === 'trial' && <SubscriptionBanner />}
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/members" element={<Members />} />
          <Route path="/matches" element={<Matches />} />
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/tournaments" element={<Tournaments />} />
          <Route path="/finance" element={<Finance />} />
          <Route path="/payment" element={<Payment />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/requests" element={<Requests />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/feedback" element={<Feedback />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </Layout>
    </AuthProvider>
  );
}

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter basename="/cricket-manager">
        <Routes>
          {/* Public routes - outside club context */}
          <Route path="/super-admin" element={<SuperAdmin />} />
          <Route path="/pricing" element={<Pricing />} />

          {/* All other routes - inside club context */}
          <Route path="/*" element={
            <ClubProvider>
              <AppContent />
            </ClubProvider>
          } />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
