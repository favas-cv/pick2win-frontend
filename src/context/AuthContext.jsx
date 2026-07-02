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

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{
      user, token, loading,
      login, register, registerClubOwner, logout,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
