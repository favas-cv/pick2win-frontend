import api, { isMockActive } from './api';

let mockMembers = [
  { id: 'm1', name: 'Alisson Becker', email: 'alisson@gmail.com', joinedDate: '2026-01-10', predictions: 24, points: 180, avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100' },
  { id: 'm2', name: 'Vinicius Jr', email: 'vini@realmadrid.com', joinedDate: '2026-02-14', predictions: 25, points: 154, avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100' },
  { id: 'm3', name: 'Neymar Santos', email: 'ney10@psg.com', joinedDate: '2026-03-01', predictions: 20, points: 142, avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100' },
  { id: 'm4', name: 'John Doe', email: 'john.doe@gmail.com', joinedDate: '2026-06-20', predictions: 12, points: 98, avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100' }
];

let mockClubTournaments = {
  'c-brazil': ['t-worldcup', 't-copaamerica'],
  'c-madrid': ['t-ucl', 't-laliga'],
  'c-united': ['t-ucl', 't-pl']
};

export const clubService = {
  getClubs: async () => {
    if (isMockActive) {
      await new Promise(resolve => setTimeout(resolve, 400));
      return [
        { id: 'c-brazil', name: 'Brazil Fans Club', logo: '🇧🇷', membersCount: 342, activeTournamentsCount: 2, inviteCode: 'BRAZIL10' },
        { id: 'c-madrid', name: 'Madridistas Hub', logo: '🇪🇸', membersCount: 890, activeTournamentsCount: 2, inviteCode: 'HALAMADRID' },
        { id: 'c-united', name: 'Red Devils United', logo: '👹', membersCount: 512, activeTournamentsCount: 2, inviteCode: 'MUFCDEV' }
      ];
    }
    const response = await api.get('/clubs/');
    return response.data;
  },

  getClubDetails: async (clubId) => {
    if (isMockActive) {
      await new Promise(resolve => setTimeout(resolve, 300));
      const clubs = await clubService.getClubs();
      return clubs.find(c => c.id === clubId) || clubs[0];
    }
    const response = await api.get(`/clubs/${clubId}/`);
    return response.data;
  },

  getClubMembers: async (clubId) => {
    if (isMockActive) {
      await new Promise(resolve => setTimeout(resolve, 400));
      return mockMembers;
    }
    const response = await api.get(`/clubs/${clubId}/members/`);
    return response.data;
  },

  generateInviteLink: async (clubId) => {
    if (isMockActive) {
      await new Promise(resolve => setTimeout(resolve, 300));
      const code = Math.random().toString(36).substring(2, 8).toUpperCase();
      return { code, link: `${window.location.origin}/join/${code}` };
    }
    const response = await api.post(`/clubs/${clubId}/generate-invite/`);
    return response.data;
  },

  getClubOwnerDashboard: async (clubId) => {
    if (isMockActive) {
      await new Promise(resolve => setTimeout(resolve, 500));
      return {
        totalMembers: mockMembers.length + 124,
        activeTournaments: mockClubTournaments[clubId]?.length || 0,
        predictionsSubmitted: 1482,
        clubRank: 12,
        inviteCode: 'BRAZIL10',
        registrationToken: 'REG-BR-2026-XYZ'
      };
    }
    const response = await api.get(`/clubs/${clubId}/owner-dashboard/`);
    return response.data;
  },

  getEnabledTournaments: async (clubId) => {
    if (isMockActive) {
      await new Promise(resolve => setTimeout(resolve, 300));
      return mockClubTournaments[clubId] || [];
    }
    const response = await api.get(`/clubs/${clubId}/tournaments/`);
    return response.data;
  },

  updateClubTournaments: async (clubId, enabledTournamentIds) => {
    if (isMockActive) {
      await new Promise(resolve => setTimeout(resolve, 400));
      mockClubTournaments[clubId] = enabledTournamentIds;
      return { status: 'success', enabled: enabledTournamentIds };
    }
    const response = await api.put(`/clubs/${clubId}/tournaments/`, { tournaments: enabledTournamentIds });
    return response.data;
  }
};

export default clubService;
