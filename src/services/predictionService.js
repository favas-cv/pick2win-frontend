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
  myPredictions: { promise: null, data: null, timestamp: 0 },
  leaderboards: {} // key is `${clubId}_${tournamentId}`, val is { promise, data, timestamp }
};
const CACHE_TTL_PREDICTIONS = 300000; // 5 minutes
const CACHE_TTL_LEADERBOARD = 60000;  // 1 minute

// ─── Service ──────────────────────────────────────────────────────────────────

export const predictionService = {

  /**
   * GET /api/predictions/my-predictions/
   * Returns the authenticated user's prediction history.
   */
  getPredictions: async (force = false) => {
    const now = Date.now();
    const isFresh = cache.myPredictions.data && (now - cache.myPredictions.timestamp < CACHE_TTL_PREDICTIONS);

    if (!force) {
      if (isFresh) return cache.myPredictions.data;
      if (cache.myPredictions.promise) return cache.myPredictions.promise;
    }

    cache.myPredictions.promise = (async () => {
      try {
        const response = await api.get('/predictions/my-predictions/');
        const list = response.data.results ?? response.data;
        const mapped = list.map(normalizePrediction);
        cache.myPredictions.data = mapped;
        cache.myPredictions.timestamp = Date.now();
        return mapped;
      } finally {
        cache.myPredictions.promise = null;
      }
    })();

    return cache.myPredictions.promise;
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
    cache.leaderboards = {};           // invalidate all leaderboard caches on new prediction
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
    cache.leaderboards = {};           // invalidate all leaderboard caches on prediction update
    return normalizePrediction(response.data);
  },

  /**
   * GET /api/leaderboard/<club_id>/<tournament_id>/
   * Fetches leaderboard stats for a club/tournament and maps user names.
   */
  getLeaderboard: async (clubId, tournamentId) => {
    if (clubId == null || tournamentId == null) return [];

    const key = `${clubId}_${tournamentId}`;
    const now = Date.now();
    const cached = cache.leaderboards[key];
    const isFresh = cached && cached.data && (now - cached.timestamp < CACHE_TTL_LEADERBOARD);

    if (isFresh) {
      return cached.data;
    }
    if (cached && cached.promise) {
      return cached.promise;
    }

    if (!cache.leaderboards[key]) {
      cache.leaderboards[key] = { promise: null, data: null, timestamp: 0 };
    }

    cache.leaderboards[key].promise = (async () => {
      try {
        const response = await api.get(`/leaderboard/${clubId}/${tournamentId}/`);
        const board = response.data.results ?? response.data;

        const mapped = board.map((item, index) => ({
          rank: index + 1,
          userId: item.user?.id ?? item.user,
          name: item.name || item.username || item.user?.name || `Predictor ${item.user?.id ?? item.user}`,
          points: item.total_points,
          accuracy: 100, // Default display value
          avatar: item.profile_image || item.user?.profile_image || item.avatar || item.image || null,
        }));
        if (cache.leaderboards[key]) {
          cache.leaderboards[key].data = mapped;
          cache.leaderboards[key].timestamp = Date.now();
        }
        return mapped;
      } catch (err) {
        console.error('Leaderboard fetch failed:', err);
        if (cache.leaderboards[key]) {
          cache.leaderboards[key].promise = null;
        }
        return [];
      } finally {
        if (cache.leaderboards[key]) {
          cache.leaderboards[key].promise = null;
        }
      }
    })();

    return cache.leaderboards[key].promise;
  },

  getUserPredictionsHistory: async () => {
    return predictionService.getPredictions();
  },
};

export default predictionService;
