import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/navigation/Navbar';
import BottomNavigation from '../components/navigation/BottomNavigation';
import HowToPlayButton from '../components/common/HowToPlayButton';

export const UserLayout = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login/user" replace />;
  }

  if (user.role !== 'user' && user.role !== 'club_admin') {
    if (user.role === 'admin') {
      return <Navigate to="/admin/dashboard" replace />;
    }

    if (user.role === 'club_owner') {
      return <Navigate to="/owner/dashboard" replace />;
    }
  }

  return (
    <div className="min-h-screen bg-transparent text-slate-900 flex flex-col font-sans">
      <Navbar />
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 pt-20 pb-24 md:pb-8">
        <div className="page-transition">
          <Outlet />
        </div>
      </main>
      <HowToPlayButton />
      <BottomNavigation />
    </div>
  );
};

export default UserLayout;