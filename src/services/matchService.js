import api, { isMockActive } from './api';

// In-memory lists of teams, tournaments, and matches
let mockTeams = [
  { id: 'tm-1', name: 'Brazil', logo: 'https://api.dicebear.com/7.x/identicon/svg?seed=Brazil', sportType: 'Football', isGlobal: true, status: 'Active' },
  { id: 'tm-2', name: 'Argentina', logo: 'https://api.dicebear.com/7.x/identicon/svg?seed=Argentina', sportType: 'Football', isGlobal: true, status: 'Active' },
  { id: 'tm-3', name: 'Portugal', logo: 'https://api.dicebear.com/7.x/identicon/svg?seed=Portugal', sportType: 'Football', isGlobal: true, status: 'Active' },
  { id: 'tm-4', name: 'Spain', logo: 'https://api.dicebear.com/7.x/identicon/svg?seed=Spain', sportType: 'Football', isGlobal: true, status: 'Active' },
  { id: 'tm-5', name: 'Real Madrid', logo: 'https://api.dicebear.com/7.x/identicon/svg?seed=Real%20Madrid', sportType: 'Football', isGlobal: true, status: 'Active' },
  { id: 'tm-6', name: 'Manchester United', logo: 'https://api.dicebear.com/7.x/identicon/svg?seed=Manchester%20United', sportType: 'Football', isGlobal: true, status: 'Active' },
  { id: 'tm-7', name: 'Local Club A', logo: 'https://api.dicebear.com/7.x/identicon/svg?seed=LocalA', sportType: 'Football', isGlobal: false, status: 'Active' },
  { id: 'tm-8', name: 'Local Club B', logo: 'https://api.dicebear.com/7.x/identicon/svg?seed=LocalB', sportType: 'Football', isGlobal: false, status: 'Active' }
];

let mockTournaments = [
  { id: 't-worldcup', name: 'FIFA World Cup 2026', logo: '🏆', sportType: 'Football', matchCount: 64, status: 'Active', description: 'The grandest stage of world football.', startDate: '2026-06-01', endDate: '2026-07-15' },
  { id: 't-copaamerica', name: 'Copa America 2026', logo: '🌎', sportType: 'Football', matchCount: 32, status: 'Active', description: 'South American continental championship.', startDate: '2026-06-10', endDate: '2026-07-10' },
  { id: 't-ucl', name: 'UEFA Champions League', logo: '⭐️', sportType: 'Football', matchCount: 125, status: 'Active', description: 'European club elite tournament.', startDate: '2025-09-15', endDate: '2026-05-30' },
  { id: 't-pl', name: 'English Premier League', logo: '🦁', sportType: 'Football', matchCount: 380, status: 'Active', description: 'Most watched league in the world.', startDate: '2025-08-10', endDate: '2026-05-24' },
  { id: 't-laliga', name: 'La Liga Santander', logo: '🇪🇸', sportType: 'Football', matchCount: 380, status: 'Active', description: 'The absolute tier of Spanish football.', startDate: '2025-08-12', endDate: '2026-05-25' }
];

// Kickoff dates helper
const getFutureTime = (hours) => new Date(Date.now() + hours * 60 * 60 * 1000).toISOString();
const getPastTime = (hours) => new Date(Date.now() - hours * 60 * 60 * 1000).toISOString();

let mockMatches = [
  {
    id: 'm-101',
    tournamentId: 't-worldcup',
    tournamentName: 'FIFA World Cup 2026',
    teamA: mockTeams[0], // Brazil
    teamB: mockTeams[1], // Argentina
    kickoffTime: getFutureTime(4), // 4 hours from now (Open for prediction)
    venue: 'Maracanã Stadium',
    status: 'Upcoming',
    scoreA: null,
    scoreB: null
  },
  {
    id: 'm-102',
    tournamentId: 't-worldcup',
    tournamentName: 'FIFA World Cup 2026',
    teamA: mockTeams[2], // Portugal
    teamB: mockTeams[3], // Spain
    kickoffTime: getFutureTime(24), // Tomorrow (Open for prediction)
    venue: 'Santiago Bernabéu',
    status: 'Upcoming',
    scoreA: null,
    scoreB: null
  },
  {
    id: 'm-103',
    tournamentId: 't-copaamerica',
    tournamentName: 'Copa America 2026',
    teamA: mockTeams[0], // Brazil
    teamB: mockTeams[7], // Local Club B
    kickoffTime: getFutureTime(0.05), // Starts in 3 minutes (LOCKED - less than 5 min to kickoff)
    venue: 'MetLife Stadium',
    status: 'Upcoming',
    scoreA: null,
    scoreB: null
  },
  {
    id: 'm-104',
    tournamentId: 't-ucl',
    tournamentName: 'UEFA Champions League',
    teamA: mockTeams[4], // Real Madrid
    teamB: mockTeams[5], // Man Utd
    kickoffTime: getPastTime(1), // Started 1 hour ago
    venue: 'Wembley Stadium',
    status: 'Live',
    scoreA: 2,
    scoreB: 1
  },
  {
    id: 'm-105',
    tournamentId: 't-ucl',
    tournamentName: 'UEFA Champions League',
    teamA: mockTeams[5], // Man Utd
    teamB: mockTeams[4], // Real Madrid
    kickoffTime: getPastTime(48), // Completed
    venue: 'Old Trafford',
    status: 'Completed',
    scoreA: 1,
    scoreB: 3
  }
];

export const matchService = {
  getTournaments: async () => {
    if (isMockActive) {
      await new Promise(resolve => setTimeout(resolve, 400));
      return mockTournaments;
    }
    const response = await api.get('/tournaments/');
    return response.data;
  },

  getTournamentDetails: async (tournamentId) => {
    if (isMockActive) {
      await new Promise(resolve => setTimeout(resolve, 300));
      return mockTournaments.find(t => t.id === tournamentId) || mockTournaments[0];
    }
    const response = await api.get(`/tournaments/${tournamentId}/`);
    return response.data;
  },

  createTournament: async (tournamentData) => {
    if (isMockActive) {
      await new Promise(resolve => setTimeout(resolve, 500));
      const newTournament = {
        id: `t-${Math.random().toString(36).substr(2, 9)}`,
        matchCount: 0,
        ...tournamentData
      };
      mockTournaments.push(newTournament);
      return newTournament;
    }
    const response = await api.post('/tournaments/', tournamentData);
    return response.data;
  },

  getTeams: async () => {
    if (isMockActive) {
      await new Promise(resolve => setTimeout(resolve, 300));
      return mockTeams;
    }
    const response = await api.get('/teams/');
    return response.data;
  },

  createTeam: async (teamData) => {
    if (isMockActive) {
      await new Promise(resolve => setTimeout(resolve, 400));
      const newTeam = {
        id: `tm-${Math.random().toString(36).substr(2, 9)}`,
        ...teamData
      };
      mockTeams.push(newTeam);
      return newTeam;
    }
    const response = await api.post('/teams/', teamData);
    return response.data;
  },

  getMatches: async (filters = {}) => {
    if (isMockActive) {
      await new Promise(resolve => setTimeout(resolve, 500));
      let matches = [...mockMatches];
      
      if (filters.tournamentId) {
        matches = matches.filter(m => m.tournamentId === filters.tournamentId);
      }
      if (filters.status) {
        matches = matches.filter(m => m.status === filters.status);
      }
      return matches;
    }
    const response = await api.get('/matches/', { params: filters });
    return response.data;
  },

  createMatch: async (matchData) => {
    if (isMockActive) {
      await new Promise(resolve => setTimeout(resolve, 500));
      const teamAObj = mockTeams.find(t => t.id === matchData.teamAId) || mockTeams[0];
      const teamBObj = mockTeams.find(t => t.id === matchData.teamBId) || mockTeams[1];
      const tournamentObj = mockTournaments.find(t => t.id === matchData.tournamentId) || mockTournaments[0];
      
      const newMatch = {
        id: `m-${Math.random().toString(36).substr(2, 9)}`,
        tournamentId: matchData.tournamentId,
        tournamentName: tournamentObj.name,
        teamA: teamAObj,
        teamB: teamBObj,
        kickoffTime: matchData.kickoffTime,
        venue: matchData.venue,
        status: 'Upcoming',
        scoreA: null,
        scoreB: null
      };
      
      mockMatches.push(newMatch);
      // Increment tournament match count
      tournamentObj.matchCount += 1;
      return newMatch;
    }
    const response = await api.post('/matches/', matchData);
    return response.data;
  },

  enterMatchResult: async (matchId, scoreA, scoreB) => {
    if (isMockActive) {
      await new Promise(resolve => setTimeout(resolve, 500));
      const match = mockMatches.find(m => m.id === matchId);
      if (match) {
        match.scoreA = parseInt(scoreA);
        match.scoreB = parseInt(scoreB);
        match.status = 'Completed';
        return match;
      }
      throw new Error('Match not found');
    }
    const response = await api.post(`/matches/${matchId}/result/`, { scoreA, scoreB });
    return response.data;
  }
};

export default matchService;
