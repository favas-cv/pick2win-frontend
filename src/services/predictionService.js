import api, { isMockActive } from './api';

let mockPredictions = [
  {
    id: 'p-1',
    matchId: 'm-105',
    tournamentName: 'UEFA Champions League',
    matchInfo: {
      teamA: { name: 'Manchester United', logo: 'https://api.dicebear.com/7.x/identicon/svg?seed=Manchester%20United' },
      teamB: { name: 'Real Madrid', logo: 'https://api.dicebear.com/7.x/identicon/svg?seed=Real%20Madrid' },
      kickoffTime: '2026-06-21T18:00:00Z',
      status: 'Completed',
      scoreA: 1,
      scoreB: 3
    },
    predictedScoreA: 1,
    predictedScoreB: 3,
    submittedAt: '2026-06-21T17:40:00Z',
    pointsEarned: 3,
    status: 'Correct Score'
  },
  {
    id: 'p-2',
    matchId: 'm-104',
    tournamentName: 'UEFA Champions League',
    matchInfo: {
      teamA: { name: 'Real Madrid', logo: 'https://api.dicebear.com/7.x/identicon/svg?seed=Real%20Madrid' },
      teamB: { name: 'Manchester United', logo: 'https://api.dicebear.com/7.x/identicon/svg?seed=Manchester%20United' },
      kickoffTime: '2026-06-23T11:00:00Z',
      status: 'Live',
      scoreA: 2,
      scoreB: 1
    },
    predictedScoreA: 1,
    predictedScoreB: 1,
    submittedAt: '2026-06-23T10:30:00Z',
    pointsEarned: 0,
    status: 'Active'
  }
];

let mockLeaderboards = {
  'c-brazil': [
    { rank: 1, name: 'Lucas Silva', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100', points: 195, accuracy: 78 },
    { rank: 2, name: 'Beatriz Costa', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100', points: 182, accuracy: 72 },
    { rank: 3, name: 'Thiago Santos', avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100', points: 176, accuracy: 68 },
    { rank: 4, name: 'John Doe', avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100', points: 98, accuracy: 55 }
  ],
  'c-madrid': [
    { rank: 1, name: 'Sergio Ramos Fan', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100', points: 310, accuracy: 82 },
    { rank: 2, name: 'Raul Gonzalez', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100', points: 295, accuracy: 79 },
    { rank: 3, name: 'Zidane Magic', avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=100', points: 288, accuracy: 74 }
  ],
  'c-united': [
    { rank: 1, name: 'Bruno Magician', avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100', points: 154, accuracy: 64 },
    { rank: 2, name: 'Rooney Goal', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100', points: 148, accuracy: 62 }
  ]
};

export const predictionService = {
  submitPrediction: async (matchId, predictedScoreA, predictedScoreB, clubId) => {
    if (isMockActive) {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const existingIdx = mockPredictions.findIndex(p => p.matchId === matchId);
      const prediction = {
        id: existingIdx !== -1 ? mockPredictions[existingIdx].id : `p-${Math.random().toString(36).substr(2, 9)}`,
        matchId,
        predictedScoreA: parseInt(predictedScoreA),
        predictedScoreB: parseInt(predictedScoreB),
        submittedAt: new Date().toISOString(),
        pointsEarned: 0,
        status: 'Active',
        clubId
      };
      
      if (existingIdx !== -1) {
        mockPredictions[existingIdx] = { ...mockPredictions[existingIdx], ...prediction };
      } else {
        mockPredictions.push(prediction);
      }
      return prediction;
    }
    const response = await api.post('/predictions/', { matchId, scoreA: predictedScoreA, scoreB: predictedScoreB, clubId });
    return response.data;
  },

  getPredictions: async (clubId) => {
    if (isMockActive) {
      await new Promise(resolve => setTimeout(resolve, 400));
      return mockPredictions.filter(p => !clubId || p.clubId === clubId);
    }
    const response = await api.get('/predictions/', { params: { clubId } });
    return response.data;
  },

  getLeaderboard: async (clubId) => {
    if (isMockActive) {
      await new Promise(resolve => setTimeout(resolve, 400));
      return mockLeaderboards[clubId] || [];
    }
    const response = await api.get(`/clubs/${clubId}/leaderboard/`);
    return response.data;
  },

  getUserPredictionsHistory: async (userId, clubId) => {
    if (isMockActive) {
      await new Promise(resolve => setTimeout(resolve, 400));
      return mockPredictions;
    }
    const response = await api.get(`/users/${userId}/predictions/`, { params: { clubId } });
    return response.data;
  }
};

export default predictionService;
