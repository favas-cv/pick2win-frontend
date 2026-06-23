import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ClubProvider } from './context/ClubContext';

// Layouts
import AuthLayout from './layouts/AuthLayout';
import UserLayout from './layouts/UserLayout';
import OwnerLayout from './layouts/OwnerLayout';
import AdminLayout from './layouts/AdminLayout';

// Public Landing Page
import LandingPage from './pages/LandingPage';

// Pages - Auth separate flows
import UserLogin from './pages/auth/UserLogin';
import OwnerLogin from './pages/auth/OwnerLogin';
import AdminLogin from './pages/auth/AdminLogin';
import Register from './pages/auth/Register';
import OwnerRegister from './pages/auth/OwnerRegister';
import ForgotPassword from './pages/auth/ForgotPassword';

// Pages - User
import UserHome from './pages/user/Home';
import UserTournaments from './pages/user/Tournaments';
import TournamentDetails from './pages/user/TournamentDetails';
import UserLeaderboard from './pages/user/Leaderboard';
import UserProfile from './pages/user/Profile';

// Pages - Owner
import OwnerDashboard from './pages/owner/Dashboard';
import OwnerMembers from './pages/owner/Members';
import OwnerInviteLink from './pages/owner/InviteLink';
import OwnerTournamentSelection from './pages/owner/TournamentSelection';
import OwnerLeaderboard from './pages/owner/Leaderboard';
import OwnerHistory from './pages/owner/History';

// Pages - Admin
import AdminDashboard from './pages/admin/Dashboard';
import AdminClubOwners from './pages/admin/ClubOwners';
import AdminClubs from './pages/admin/Clubs';
import AdminTeams from './pages/admin/Teams';
import AdminTournaments from './pages/admin/Tournaments';
import AdminMatches from './pages/admin/Matches';
import AdminResults from './pages/admin/Results';
import AdminLeaderboard from './pages/admin/Leaderboard';
import AdminAnalytics from './pages/admin/Analytics';

// Role-based auth home checker
const CheckAuthHome = () => {
  const { user } = useAuth();
  
  if (!user) return <LandingPage />;
  if (user.role === 'admin') return <Navigate to="/admin/dashboard" replace />;
  if (user.role === 'club_owner') return <Navigate to="/owner/dashboard" replace />;
  return <Navigate to="/user/home" replace />;
};

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ClubProvider>
          <Routes>
            {/* Default Route: Landing Page or Role Dashboard */}
            <Route path="/" element={<CheckAuthHome />} />

            {/* Auth Layout Paths */}
            <Route element={<AuthLayout />}>
              {/* Redirect legacy /login to user login */}
              <Route path="/login" element={<Navigate to="/login/user" replace />} />
              <Route path="/login/user" element={<UserLogin />} />
              <Route path="/login/owner" element={<OwnerLogin />} />
              <Route path="/login/admin" element={<AdminLogin />} />
              <Route path="/register" element={<Register />} />
              <Route path="/register/owner" element={<OwnerRegister />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
            </Route>

            {/* User Mobile-First Dashboard Paths */}
            <Route path="/user" element={<UserLayout />}>
              <Route path="home" element={<UserHome />} />
              <Route path="tournaments" element={<UserTournaments />} />
              <Route path="tournaments/:id" element={<TournamentDetails />} />
              <Route path="leaderboard" element={<UserLeaderboard />} />
              <Route path="profile" element={<UserProfile />} />
            </Route>

            {/* Club Owner Portal Paths */}
            <Route path="/owner" element={<OwnerLayout />}>
              <Route path="dashboard" element={<OwnerDashboard />} />
              <Route path="members" element={<OwnerMembers />} />
              <Route path="invite" element={<OwnerInviteLink />} />
              <Route path="tournaments" element={<OwnerTournamentSelection />} />
              <Route path="leaderboard" element={<OwnerLeaderboard />} />
              <Route path="history" element={<OwnerHistory />} />
            </Route>

            {/* System Admin Dashboard Paths */}
            <Route path="/admin" element={<AdminLayout />}>
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="owners" element={<AdminClubOwners />} />
              <Route path="clubs" element={<AdminClubs />} />
              <Route path="teams" element={<AdminTeams />} />
              <Route path="tournaments" element={<AdminTournaments />} />
              <Route path="matches" element={<AdminMatches />} />
              <Route path="results" element={<AdminResults />} />
              <Route path="leaderboards" element={<AdminLeaderboard />} />
              <Route path="analytics" element={<AdminAnalytics />} />
            </Route>

            {/* Catch-all Route Redirection */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </ClubProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
