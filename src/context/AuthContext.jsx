import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const MOCK_USERS = {
  admin: {
    id: 'u-admin',
    name: 'Sarah Connor (Admin)',
    email: 'admin@predit.com',
    role: 'admin',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
    token: 'mock-admin-token-12345'
  },
  club_owner: {
    id: 'u-owner',
    name: 'Carlos Silva (Owner)',
    email: 'owner@brazilfans.com',
    role: 'club_owner',
    status: 'Approved', // Approved by default for testing
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    token: 'mock-owner-token-54321',
    managedClubId: 'c-brazil'
  },
  user: {
    id: 'u-user',
    name: 'John Doe',
    email: 'john.doe@gmail.com',
    role: 'user',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150',
    token: 'mock-user-token-99999',
    joinedClubs: ['c-brazil', 'c-madrid'],
    activeClubId: 'c-brazil'
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true);

  // In-memory list of club owners for the admin to approve/reject/suspend
  const [owners, setOwners] = useState([
    { id: 'u-owner', name: 'Carlos Silva', email: 'owner@brazilfans.com', clubName: 'Brazil Fans Club', logo: '🇧🇷', status: 'Approved', joined: '2026-06-01' },
    { id: 'u-owner2', name: 'Jean Dupont', email: 'jean@lesbleus.fr', clubName: 'French Connection', logo: '🇫🇷', status: 'Pending', joined: '2026-06-22' },
    { id: 'u-owner3', name: 'Mateo Messi', email: 'mateo@messifans.ar', clubName: 'Albiceleste Club', logo: '🇦🇷', status: 'Pending', joined: '2026-06-23' }
  ]);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('token');
    
    if (storedUser && storedToken) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      setToken(storedToken);
    }
    setLoading(false);
  }, []);

  // Separate login flow supporting role-checking
  const login = async (email, password, role) => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 600));

    let matchedUser = null;

    if (role === 'admin') {
      if (email === 'admin@predit.com' || email === 'admin@predictionpro.com') {
        matchedUser = MOCK_USERS.admin;
      } else {
        setLoading(false);
        throw new Error('Unauthorized role login');
      }
    } else if (role === 'club_owner') {
      // Check in our in-memory list
      const activeOwner = owners.find(o => o.email === email);
      if (activeOwner) {
        matchedUser = {
          id: activeOwner.id,
          name: activeOwner.name,
          email: activeOwner.email,
          role: 'club_owner',
          status: activeOwner.status,
          avatar: MOCK_USERS.club_owner.avatar,
          token: `mock-owner-token-${activeOwner.id}`,
          managedClubId: 'c-brazil' // Default testing club
        };
      } else if (email === 'owner@brazilfans.com') {
        matchedUser = MOCK_USERS.club_owner;
      } else {
        setLoading(false);
        throw new Error('Unauthorized role login');
      }
    } else {
      // General User
      matchedUser = {
        ...MOCK_USERS.user,
        email: email || 'john.doe@gmail.com',
        name: email ? email.split('@')[0] : 'John Doe'
      };
    }

    setUser(matchedUser);
    setToken(matchedUser.token);
    localStorage.setItem('token', matchedUser.token);
    localStorage.setItem('user', JSON.stringify(matchedUser));
    setLoading(false);
    return matchedUser;
  };

  const register = async (name, email, password, role = 'user', inviteCode = '') => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 800));

    let newUser = null;

    if (role === 'club_owner') {
      // New Club Owner registers as PENDING
      const newOwner = {
        id: `u-owner-${Math.random().toString(36).substr(2, 9)}`,
        name,
        email,
        clubName: `${name}'s Fans Club`,
        logo: '⚽',
        status: 'Pending',
        joined: new Date().toISOString().split('T')[0]
      };
      
      setOwners(prev => [...prev, newOwner]);

      newUser = {
        id: newOwner.id,
        name: newOwner.name,
        email: newOwner.email,
        role: 'club_owner',
        status: 'Pending',
        avatar: `https://api.dicebear.com/7.x/adventurer/svg?seed=${name}`,
        token: `mock-owner-token-${newOwner.id}`,
        managedClubId: 'c-brazil'
      };
    } else {
      newUser = {
        id: `u-${Math.random().toString(36).substr(2, 9)}`,
        name,
        email,
        role: 'user',
        avatar: `https://api.dicebear.com/7.x/adventurer/svg?seed=${name}`,
        token: `mock-token-${Math.random().toString(36).substr(2, 9)}`,
        joinedClubs: inviteCode ? ['c-brazil'] : [],
        activeClubId: inviteCode ? 'c-brazil' : null
      };
    }

    setUser(newUser);
    setToken(newUser.token);
    localStorage.setItem('token', newUser.token);
    localStorage.setItem('user', JSON.stringify(newUser));
    setLoading(false);
    return newUser;
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  const updateActiveClub = (clubId) => {
    if (user && user.role === 'user') {
      const updated = { ...user, activeClubId: clubId };
      setUser(updated);
      localStorage.setItem('user', JSON.stringify(updated));
    }
  };

  const joinClub = (clubId) => {
    if (user && user.role === 'user') {
      const joinedClubs = user.joinedClubs || [];
      if (!joinedClubs.includes(clubId)) {
        const updated = {
          ...user,
          joinedClubs: [...joinedClubs, clubId],
          activeClubId: clubId
        };
        setUser(updated);
        localStorage.setItem('user', JSON.stringify(updated));
        return true;
      }
    }
    return false;
  };

  // Administrative actions to approve owners
  const updateOwnerStatus = (ownerId, newStatus) => {
    setOwners(prev => prev.map(o => {
      if (o.id === ownerId) {
        return { ...o, status: newStatus };
      }
      return o;
    }));

    // If current logged-in owner status changes, sync session state
    if (user && user.id === ownerId) {
      const updated = { ...user, status: newStatus };
      setUser(updated);
      localStorage.setItem('user', JSON.stringify(updated));
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, token, loading, login, register, logout, 
      updateActiveClub, joinClub, owners, updateOwnerStatus 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
