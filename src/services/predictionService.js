import api from './api';

/**
 * predictionService — all calls hit the real Django backend.
 *
 * Backend endpoints (from predictions/urls.py):
 *   GET  /api/predictions/my-predictions/   — list user's predictions
 *   POST /api/predictions/predict/           — submit a new prediction
 *   PATCH /api/predictions/predict/<pk>/    — update an existing prediction
 *
 * Backend Prediction shape:
 *   { id, match: { id, tournament, home_team, away_team, kickoff,
 *                  home_score, away_score, is_finished, prediction_lock_time },
 *     home_prediction, away_prediction, points, is_calculated, created_at }
 *
 * Frontend normalized shape:
 *   { id, matchId, tournamentName, matchInfo: { teamA, teamB, kickoffTime,
 *     status, scoreA, scoreB }, predictedScoreA, predictedScoreB,
 *     submittedAt, pointsEarned, status }
 */

// ─── Normalizer ───────────────────────────────────────────────────────────────

const normalizePrediction = (p) => {
  const m = p.match || {};
  const now = new Date();
  const kickoff = m.kickoff ? new Date(m.kickoff) : null;

  let matchStatus = 'Upcoming';
  if (m.is_finished) matchStatus = 'Completed';
  else if (kickoff && now > kickoff) matchStatus = 'Live';

  let predStatus = 'Active';
  if (p.is_calculated) {
    if (p.points >= 3) predStatus = 'Correct Score';
    else if (p.points >= 1) predStatus = 'Correct Winner';
    else predStatus = 'Incorrect';
  }

  return {
    id: p.id,
    matchId: m.id,
    tournamentName: m.tournament?.name || '',
    matchInfo: {
      teamA: m.home_team
        ? {
            name: m.home_team.name,
            logo: m.home_team.logo ||
              `https://api.dicebear.com/7.x/identicon/svg?seed=${encodeURIComponent(m.home_team.name)}`,
          }
        : null,
      teamB: m.away_team
        ? {
            name: m.away_team.name,
            logo: m.away_team.logo ||
              `https://api.dicebear.com/7.x/identicon/svg?seed=${encodeURIComponent(m.away_team.name)}`,
          }
        : null,
      kickoffTime: m.kickoff,
      status: matchStatus,
      scoreA: m.home_score ?? null,
      scoreB: m.away_score ?? null,
    },
    predictedScoreA: p.home_prediction,
    predictedScoreB: p.away_prediction,
    submittedAt: p.created_at,
    pointsEarned: p.points || 0,
    status: predStatus,
  };
};

const cache = {
  myPredictions: { data: null, timestamp: 0 },
};
const CACHE_TTL = 30000; // 30 seconds

// ─── Service ──────────────────────────────────────────────────────────────────

export const predictionService = {

  /**
   * GET /api/predictions/my-predictions/
   * Returns the authenticated user's prediction history.
   */
  getPredictions: async (force = false) => {
    if (!force && cache.myPredictions.data && Date.now() - cache.myPredictions.timestamp < CACHE_TTL) {
      return cache.myPredictions.data;
    }
    const response = await api.get('/predictions/my-predictions/');
    const list = response.data.results ?? response.data;
    const mapped = list.map(normalizePrediction);
    cache.myPredictions = { data: mapped, timestamp: Date.now() };
    return mapped;
  },

  /**
   * POST /api/predictions/predict/
   * Submit a new prediction for a match.
   * Payload: { match_id, home_prediction, away_prediction }
   */
  submitPrediction: async (matchId, predictedScoreA, predictedScoreB) => {
    const response = await api.post('/predictions/predict/', {
      match_id: matchId,
      home_prediction: parseInt(predictedScoreA),
      away_prediction: parseInt(predictedScoreB),
    });
    cache.myPredictions.timestamp = 0; // invalidate cache
    return normalizePrediction(response.data);
  },

  /**
   * PATCH /api/predictions/predict/<pk>/
   * Update an existing prediction before the lock time.
   */
  updatePrediction: async (predictionId, predictedScoreA, predictedScoreB) => {
    const response = await api.patch(`/predictions/predict/${predictionId}/`, {
      home_prediction: parseInt(predictedScoreA),
      away_prediction: parseInt(predictedScoreB),
    });
    cache.myPredictions.timestamp = 0; // invalidate cache
    return normalizePrediction(response.data);
  },

  /**
   * GET /api/leaderboard/<club_id>/<tournament_id>/
   * Fetches leaderboard stats for a club/tournament and maps user names.
   */
  getLeaderboard: async (clubId, tournamentId) => {
    if (!clubId || !tournamentId) return [];
    try {
      const response = await api.get(`/leaderboard/${clubId}/${tournamentId}/`);
      const board = response.data.results ?? response.data;

      return board.map((item, index) => ({
        rank: index + 1,
        userId: item.user,
        name: item.username || `Predictor ${item.user}`,
        points: item.total_points,
        accuracy: 100, // Default display value
        logo: '👤',
      }));
    } catch (err) {
      console.error('Leaderboard fetch failed:', err);
      return [];
    }
  },

  getUserPredictionsHistory: async () => {
    return predictionService.getPredictions();
  },
};

export default predictionService;
