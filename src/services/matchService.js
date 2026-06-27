import api from './api';

/**
 * matchService — all calls hit the real Django backend.
 *
 * URL structure (from main urls.py + DRF routers):
 *   Tournaments: /api/tournaments/tournaments/   (router prefix doubles)
 *   Teams:       /api/tournaments/teams/
 *   Matches:     /api/matches/matches/
 */

// ─── Normalizers ─────────────────────────────────────────────────────────────

/**
 * Backend Tournament: { id, name, description, start_date, end_date, status }
 * Frontend expects:   { id, name, description, startDate, endDate, status, logo, sportType, matchCount }
 */
const normalizeTournament = (t) => ({
  id: t.id,
  name: t.name,
  description: t.description,
  startDate: t.start_date,
  endDate: t.end_date,
  status: t.status,
  logo: t.logo || '🏆',
  sportType: t.sport_type || 'Football',
  matchCount: t.match_count || 0,
});

/**
 * Backend Team: { id, name, logo, country_code }
 * Frontend expects: { id, name, logo, sportType, countryCode }
 */
const normalizeTeam = (t) => ({
  id: t.id,
  name: t.name,
  logo: t.logo || `https://api.dicebear.com/7.x/identicon/svg?seed=${encodeURIComponent(t.name)}`,
  sportType: t.sport_type || 'Football',
  countryCode: t.country_code,
});

/**
 * Backend Match: {
 *   id, tournament: {...}, home_team: {...}, away_team: {...},
 *   kickoff, home_score, away_score, is_finished, prediction_lock_time
 * }
 * Frontend expects: {
 *   id, tournamentId, tournamentName, teamA, teamB,
 *   kickoffTime, venue, status, scoreA, scoreB, predictionLockTime, isLocked
 * }
 */
const normalizeMatch = (m) => {
  const now = new Date();
  const kickoff = new Date(m.kickoff);
  const lockTime = m.prediction_lock_time ? new Date(m.prediction_lock_time) : kickoff;

  let matchStatus = 'Upcoming';
  if (m.is_finished) {
    matchStatus = 'Completed';
  } else if (now > kickoff) {
    matchStatus = 'Live';
  }

  return {
    id: m.id,
    tournamentId: m.tournament?.id,
    tournamentName: m.tournament?.name,
    teamA: m.home_team ? normalizeTeam(m.home_team) : null,
    teamB: m.away_team ? normalizeTeam(m.away_team) : null,
    kickoffTime: m.kickoff,
    predictionLockTime: m.prediction_lock_time,
    venue: m.venue || '',
    status: matchStatus,
    scoreA: m.home_score ?? null,
    scoreB: m.away_score ?? null,
    isLocked: now >= lockTime,
  };
};

const cache = {
  tournaments: { data: null, timestamp: 0 },
  matches: { data: null, timestamp: 0 },
  teams: { data: null, timestamp: 0 }
};
const CACHE_TTL = 30000; // 30 seconds

// ─── Service ─────────────────────────────────────────────────────────────────

export const matchService = {

  /** GET /api/tournaments/tournaments/ */
  getTournaments: async (force = false) => {
    if (!force && cache.tournaments.data && Date.now() - cache.tournaments.timestamp < CACHE_TTL) {
      return cache.tournaments.data;
    }
    const response = await api.get('/tournaments/tournaments/');
    const list = response.data.results ?? response.data;
    const mapped = list.map(normalizeTournament);
    cache.tournaments = { data: mapped, timestamp: Date.now() };
    return mapped;
  },

  /** GET /api/tournaments/tournaments/<id>/ */
  getTournamentDetails: async (tournamentId) => {
    const response = await api.get(`/tournaments/tournaments/${tournamentId}/`);
    return normalizeTournament(response.data);
  },

  /** POST /api/tournaments/tournaments/ — admin only */
  createTournament: async (tournamentData) => {
    const response = await api.post('/tournaments/tournaments/', tournamentData);
    cache.tournaments.timestamp = 0; // invalidate
    return normalizeTournament(response.data);
  },

  /** GET /api/tournaments/teams/ */
  getTeams: async (force = false) => {
    if (!force && cache.teams.data && Date.now() - cache.teams.timestamp < CACHE_TTL) {
      return cache.teams.data;
    }
    const response = await api.get('/tournaments/teams/');
    const list = response.data.results ?? response.data;
    const mapped = list.map(normalizeTeam);
    cache.teams = { data: mapped, timestamp: Date.now() };
    return mapped;
  },

  /** POST /api/tournaments/teams/ — admin only */
  createTeam: async (teamData) => {
    const response = await api.post('/tournaments/teams/', teamData);
    cache.teams.timestamp = 0; // invalidate
    return normalizeTeam(response.data);
  },

  /**
   * GET /api/matches/matches/
   * Optional filters: { tournamentId, status }
   */
  getMatches: async (filters = {}, force = false) => {
    const hasFilters = Object.keys(filters).length > 0;
    if (!hasFilters && !force && cache.matches.data && Date.now() - cache.matches.timestamp < CACHE_TTL) {
      return cache.matches.data;
    }

    const params = {};
    if (filters.tournamentId) params.tournament = filters.tournamentId;
    if (filters.status) params.status = filters.status;
    const response = await api.get('/matches/matches/', { params });
    const list = response.data.results ?? response.data;
    const mapped = list.map(normalizeMatch);

    if (!hasFilters) {
      cache.matches = { data: mapped, timestamp: Date.now() };
    }
    return mapped;
  },

  /** POST /api/matches/matches/ — admin only */
  createMatch: async (matchData) => {
    const response = await api.post('/matches/matches/', {
      tournament_id: matchData.tournamentId,
      home_team_id: matchData.teamAId,
      away_team_id: matchData.teamBId,
      kickoff: matchData.kickoffTime,
      prediction_lock_time: matchData.predictionLockTime || matchData.kickoffTime,
    });
    cache.matches.timestamp = 0; // invalidate
    return normalizeMatch(response.data);
  },

  /** PATCH /api/matches/matches/<id>/ — admin only, enter final scores */
  enterMatchResult: async (matchId, scoreA, scoreB) => {
    const response = await api.patch(`/matches/matches/${matchId}/`, {
      home_score: parseInt(scoreA),
      away_score: parseInt(scoreB),
      is_finished: true,
    });
    cache.matches.timestamp = 0; // invalidate
    return normalizeMatch(response.data);
  },
};

export default matchService;
