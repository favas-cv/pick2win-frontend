import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const ClubContext = createContext(null);

export const MOCK_CLUBS = [
  {
    id: 'c-brazil',
    name: 'Brazil Fans Club',
    logo: '🇧🇷',
    membersCount: 342,
    activeTournamentsCount: 3,
    inviteCode: 'BRAZIL10',
    ownerId: 'u-owner'
  },
  {
    id: 'c-madrid',
    name: 'Madridistas Hub',
    logo: '🇪🇸',
    membersCount: 890,
    activeTournamentsCount: 4,
    inviteCode: 'HALAMADRID',
    ownerId: 'u-owner2'
  },
  {
    id: 'c-united',
    name: 'Red Devils United',
    logo: '👹',
    membersCount: 512,
    activeTournamentsCount: 2,
    inviteCode: 'MUFCDEV',
    ownerId: 'u-owner3'
  }
];

export const ClubProvider = ({ children }) => {
  const { user, updateActiveClub } = useAuth();
  const [clubs, setClubs] = useState(MOCK_CLUBS);
  const [activeClub, setActiveClub] = useState(null);

  // In-memory membership status repository
  const [memberships, setMemberships] = useState([
    { id: 'm1', name: 'Alisson Becker', email: 'alisson@gmail.com', clubId: 'c-brazil', status: 'Approved', joinedDate: '2026-01-10', predictions: 24, points: 180, avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100' },
    { id: 'm2', name: 'Vinicius Jr', email: 'vini@realmadrid.com', clubId: 'c-brazil', status: 'Approved', joinedDate: '2026-02-14', predictions: 25, points: 154, avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100' },
    { id: 'm3', name: 'Neymar Santos', email: 'ney10@psg.com', clubId: 'c-brazil', status: 'Approved', joinedDate: '2026-03-01', predictions: 20, points: 142, avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100' },
    { id: 'm-john', name: 'John Doe', email: 'john.doe@gmail.com', clubId: 'c-brazil', status: 'Approved', joinedDate: '2026-06-20', predictions: 12, points: 98, avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100' },
    { id: 'm-john-madrid', name: 'John Doe', email: 'john.doe@gmail.com', clubId: 'c-madrid', status: 'Approved', joinedDate: '2026-06-21', predictions: 8, points: 64, avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100' },
    
    // Pending requests
    { id: 'm-french', name: 'Jean-Pierre', email: 'jp@soccer.fr', clubId: 'c-brazil', status: 'Pending', joinedDate: '2026-06-22', predictions: 0, points: 0, avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Jean' },
    { id: 'm-german', name: 'Klaus Muller', email: 'klaus@fussball.de', clubId: 'c-brazil', status: 'Pending', joinedDate: '2026-06-23', predictions: 0, points: 0, avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Klaus' },
    
    // Rejected
    { id: 'm-rejected', name: 'Spam Account', email: 'spam@bot.com', clubId: 'c-brazil', status: 'Rejected', joinedDate: '2026-06-15', predictions: 0, points: 0, avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Spam' }
  ]);

  useEffect(() => {
    if (user && user.role === 'user') {
      const userActiveClubId = user.activeClubId || user.joinedClubs?.[0] || 'c-brazil';
      const found = clubs.find(c => c.id === userActiveClubId);
      setActiveClub(found || clubs[0]);
    } else if (user && user.role === 'club_owner') {
      const ownerClub = clubs.find(c => c.id === user.managedClubId) || clubs[0];
      setActiveClub(ownerClub);
    } else {
      setActiveClub(clubs[0]);
    }
  }, [user, clubs]);

  const switchClub = (clubId) => {
    const found = clubs.find(c => c.id === clubId);
    if (found) {
      setActiveClub(found);
      if (user && user.role === 'user') {
        updateActiveClub(clubId);
      }
    }
  };

  const createClub = (name, logo, ownerId) => {
    const newClub = {
      id: `c-${Math.random().toString(36).substr(2, 9)}`,
      name,
      logo: logo || '⚽',
      membersCount: 1,
      activeTournamentsCount: 0,
      inviteCode: Math.random().toString(36).substr(2, 6).toUpperCase(),
      ownerId
    };
    setClubs(prev => [...prev, newClub]);
    return newClub;
  };

  // Club Owner Roster Actions
  const updateMembershipStatus = (memberId, status) => {
    setMemberships(prev => prev.map(m => {
      if (m.id === memberId) {
        return { ...m, status };
      }
      return m;
    }));
  };

  // User requesting membership join
  const requestJoinClub = (clubId) => {
    if (user && user.role === 'user') {
      // Check if already requested or joined
      const existing = memberships.find(m => m.clubId === clubId && m.email === user.email);
      if (existing) return existing.status;

      const newMembership = {
        id: `m-${Math.random().toString(36).substr(2, 9)}`,
        name: user.name,
        email: user.email,
        clubId,
        status: 'Pending', // Begins as Pending approval!
        joinedDate: new Date().toISOString().split('T')[0],
        predictions: 0,
        points: 0,
        avatar: user.avatar
      };

      setMemberships(prev => [...prev, newMembership]);
      return 'Pending';
    }
    return null;
  };

  return (
    <ClubContext.Provider value={{ 
      clubs, activeClub, switchClub, createClub, 
      memberships, updateMembershipStatus, requestJoinClub 
    }}>
      {children}
    </ClubContext.Provider>
  );
};

export const useClub = () => useContext(ClubContext);
