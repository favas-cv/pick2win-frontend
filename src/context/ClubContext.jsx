import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const ClubContext = createContext(null);

/**
 * ClubContext — manages the authenticated user's club membership.
 *
 * Club data is fetched from the backend at /api/clubs/mine/.
 * Since users are automatically added to a club when they register via invite token,
 * any user who has a club membership is treated as "Approved".
 */
export const ClubProvider = ({ children }) => {
  const { user, profile } = useAuth();

  const [clubs, setClubs] = useState([]);
  const [activeClub, setActiveClub] = useState(null);
  const [loadingClubs, setLoadingClubs] = useState(false);

  // Parse user's clubs from profile when profile is fetched/updated
  useEffect(() => {
    if (!user || !profile) {
      setClubs([]);
      setActiveClub(null);
      return;
    }

    setLoadingClubs(true);
    try {
      let myClubs = [];
      if (profile.club) {
        myClubs = [profile.club];
      } else if (profile.id && !profile.username) {
        myClubs = [profile];
      } else if (Array.isArray(profile)) {
        myClubs = profile;
      }
      const normalizedClubs = myClubs.map((club) => ({
        ...club,
      }));

      setClubs(normalizedClubs);

      // Restore previously active club from localStorage, or default to first
      const savedClubId = localStorage.getItem('activeClubId');
      const found = savedClubId
        ? normalizedClubs.find(c => String(c.id) === savedClubId)
        : null;
      setActiveClub(found || normalizedClubs[0] || null);
    } catch (err) {
      console.warn('Could not parse clubs:', err);
      setClubs([]);
      setActiveClub(null);
    } finally {
      setLoadingClubs(false);
    }
  }, [user, profile]);

  const switchClub = (clubId) => {
    const found = clubs.find(c => c.id === clubId);
    if (found) {
      setActiveClub(found);
      localStorage.setItem('activeClubId', String(clubId));
    }
  };

  /**
   * Build a normalized memberships array from clubs data.
   * Each user is always "Approved" in their clubs since the backend adds them
   * directly on invite-based registration (no pending step).
   */
  const memberships = clubs.map(club => ({
    clubId: club.id,
    role: club.role,       // 'member' | 'club_admin'
    status: 'Approved',   // Backend auto-approves — no pending state
    joinedDate: club.joined_at,
  }));

  /**
   * Attempt to "request join" — not supported by the backend currently.
   * Users can only join via invite link. This is kept as a no-op stub.
   */
  const requestJoinClub = () => {
    console.warn('requestJoinClub: Users join via invite link only.');
  };

  return (
    <ClubContext.Provider value={{
      clubs,
      activeClub,
      switchClub,
      memberships,
      requestJoinClub,
      loadingClubs,
    }}>
      {children}
    </ClubContext.Provider>
  );
};

export const useClub = () => useContext(ClubContext);
