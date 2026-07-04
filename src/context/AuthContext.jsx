import React, { createContext, useContext, useState, useEffect } from 'react';
import authService from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true);

  // Rehydrate user from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('token');

    if (storedUser && storedToken) {
      try {
        setUser(JSON.parse(storedUser));
        setToken(storedToken);
      } catch {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      }
    }
    setLoading(false);
  }, []);

  const applyAuthData = (data) => {
    if (!data?.token) {
      throw new Error('Invalid credentials');
    }

    const loggedUser = {
      id: data.user_id,
      name: data.name,
      phone: data.phone,
      role: data.role || 'user',
      token: data.token,
    };

    setUser(loggedUser);
    setToken(data.token);
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(loggedUser));
    return loggedUser;
  };

  /**
   * login(phone, password, role)
   * `role` is determined by which login page the user came from:
   *   'user'       → UserLogin page  → redirects to /user/home
   *   'club_owner' → OwnerLogin page → redirects to /owner/dashboard
   *   'admin'      → AdminLogin page → redirects to /admin/dashboard
   *
   * The backend returns { token, user_id, name, phone }.
   * Role is not in the backend response yet, so the calling page passes it explicitly.
   */
  const login = async (phone, password) => {
    setLoading(true);
    try {
      const data = await authService.login(phone, password);
      return applyAuthData(data);
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    setLoading(true);
    try {
      const data = await authService.register(userData);
      return applyAuthData(data);
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const registerClubOwner = async (clubOwnerData) => {
    setLoading(true);
    try {
      return await authService.registerClubOwner(clubOwnerData);
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const confirmLogout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setShowLogoutModal(false);
  };

  const logout = () => {
    setShowLogoutModal(true);
  };

  return (
    <AuthContext.Provider value={{
      user, token, loading,
      login, register, registerClubOwner, logout,
    }}>
      {children}
      {showLogoutModal && (
        <LogoutConfirmationModal
          onConfirm={confirmLogout}
          onCancel={() => setShowLogoutModal(false)}
        />
      )}
    </AuthContext.Provider>
  );
};

const LogoutConfirmationModal = ({ onConfirm, onCancel }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white w-full max-w-sm rounded-2xl p-6 shadow-xl border border-slate-100 transform transition-all animate-scaleIn">
        <h3 className="text-lg font-black text-slate-900 leading-6">Log Out</h3>
        <p className="mt-2.5 text-xs font-semibold leading-relaxed text-slate-500">
          Are you sure you want to log out?<br />
          Make sure you remember your password before continuing.
        </p>
        <div className="mt-6 flex flex-col sm:flex-row gap-2.5">
          <button
            type="button"
            onClick={onCancel}
            className="w-full sm:flex-1 py-3 px-4 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 bg-white hover:bg-slate-50 active:bg-slate-100 transition duration-150 cursor-pointer text-center"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="w-full sm:flex-1 py-3 px-4 rounded-xl text-xs font-bold text-white bg-red-600 hover:bg-red-700 active:bg-red-800 shadow-md shadow-red-200/50 transition duration-150 cursor-pointer text-center"
          >
            Log Out
          </button>
        </div>
      </div>
    </div>
  );
};

export const useAuth = () => useContext(AuthContext);
