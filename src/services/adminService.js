import api from './api';

/**
 * adminService — all calls hit the real Django backend /api/admin/ endpoints.
 *
 * Backend URL structure (admindashboard/urls.py mounted at /api/admin/):
 *   Tournaments : /api/admin/tournaments/          (CRUD via ModelViewSet)
 *   Teams       : /api/admin/teams/                (CRUD via ModelViewSet)
 *   Matches     : /api/admin/matches/              (CRUD via ModelViewSet)
 *   Clubs       : /api/admin/clubs/                (CRUD via ModelViewSet)
 *   Users       : /api/admin/users/                (ListAPIView)
 *   Leaderboard : /api/admin/global-leaderboard/  (ListAPIView)
 *   Score update: /api/admin/update-score/<id>/   (PATCH)
 */

// ─── Normalizers (backend → frontend) ────────────────────────────────────────

/**
 * Backend Tournament: { id, name, description, start_date, end_date, status }
 */
const normalizeTournament = (t) => ({
  id: t.id,
  name: t.name || '',
  description: t.description || '',
  startDate: t.start_date || '',
  endDate: t.end_date || '',
  status: t.status || 'Unknown',
});

/**
 * Backend Team: { id, name, logo, country_code }
 */
const normalizeTeam = (t) => ({
  id: t.id,
  name: t.name || '',
  logo: t.logo || `https://api.dicebear.com/7.x/identicon/svg?seed=${encodeURIComponent(t.name || 'team')}`,
  countryCode: t.country_code || '',
});

/**
 * Backend Match: { id, tournament: {...}, home_team: {...}, away_team: {...},
 *   kickoff, home_score, away_score, is_finished, prediction_lock_time }
 */
const normalizeMatch = (m) => {
  const now = new Date();
  const kickoff = m.kickoff ? new Date(m.kickoff) : null;

  let status = 'Upcoming';
  if (m.is_finished) status = 'Completed';
  else if (kickoff && now > kickoff) status = 'Live';

  return {
    id: m.id,
    tournament: m.tournament
      ? { id: m.tournament.id, name: m.tournament.name }
      : null,
    homeTeam: m.home_team
      ? { id: m.home_team.id, name: m.home_team.name, logo: m.home_team.logo || '' }
      : null,
    awayTeam: m.away_team
      ? { id: m.away_team.id, name: m.away_team.name, logo: m.away_team.logo || '' }
      : null,
    kickoff: m.kickoff || '',
    predictionLockTime: m.prediction_lock_time || '',
    homeScore: m.home_score ?? null,
    awayScore: m.away_score ?? null,
    isFinished: m.is_finished || false,
    status,
  };
};

/**
 * Backend Club: { id, name, place, created_at, is_active }
 */
const normalizeClub = (c) => ({
  id: c.id,
  name: c.name || '',
  place: c.place || '',
  createdAt: c.created_at || '',
  isActive: c.is_active,
  totalPoints: c.total_points || 0,
});

/**
 * Backend User (admin): { name, phone, total_points, is_active }
 */
const normalizeUser = (u, idx) => ({
  id: u.id || idx,
  name: u.name || '',
  phone: u.phone || '',
  totalPoints: u.total_points || 0,
  isActive: u.is_active,
});

/**
 * Backend Leaderboard: { user, username, total_points }
 */
const normalizeLeaderboardEntry = (item, idx) => ({
  rank: idx + 1,
  userId: item.user,
  name: item.username || `Predictor #${item.user}`,
  points: item.total_points || 0,
});

// ─── Service ─────────────────────────────────────────────────────────────────

export const adminService = {

  // ── Tournaments ──────────────────────────────────────────────────────────

  /** GET /api/admin/tournaments/ */
  getTournaments: async () => {
    const res = await api.get('/admin/tournaments/');
    const list = res.data.results ?? res.data;
    return list.map(normalizeTournament);
  },

  /** POST /api/admin/tournaments/ */
  createTournament: async (payload) => {
    const res = await api.post('/admin/tournaments/', {
      name: payload.name,
      description: payload.description || '',
      start_date: payload.startDate,
      end_date: payload.endDate,
      status: payload.status || 'Upcoming',
    });
    return normalizeTournament(res.data);
  },

  /** PATCH /api/admin/tournaments/<id>/ */
  updateTournament: async (id, payload) => {
    const res = await api.patch(`/admin/tournaments/${id}/`, payload);
    return normalizeTournament(res.data);
  },

  /** DELETE /api/admin/tournaments/<id>/ */
  deleteTournament: async (id) => {
    await api.delete(`/admin/tournaments/${id}/`);
  },

  // ── Teams ─────────────────────────────────────────────────────────────────

  /** GET /api/admin/teams/ */
  getTeams: async () => {
    const res = await api.get('/admin/teams/');
    const list = res.data.results ?? res.data;
    return list.map(normalizeTeam);
  },

  /** POST /api/admin/teams/ */
  createTeam: async (payload) => {
    const res = await api.post('/admin/teams/', {
      name: payload.name,
      logo: payload.logo || null,
      country_code: payload.countryCode || '',
    });
    return normalizeTeam(res.data);
  },

  /** DELETE /api/admin/teams/<id>/ */
  deleteTeam: async (id) => {
    await api.delete(`/admin/teams/${id}/`);
  },

  // ── Matches ───────────────────────────────────────────────────────────────

  /** GET /api/admin/matches/ */
  getMatches: async () => {
    const res = await api.get('/admin/matches/');
    const list = res.data.results ?? res.data;
    return list.map(normalizeMatch);
  },

  /** POST /api/admin/matches/ */
  createMatch: async (payload) => {
    const res = await api.post('/admin/matches/', {
      tournament_id: payload.tournamentId,
      home_team_id: payload.homeTeamId,
      away_team_id: payload.awayTeamId,
      kickoff: payload.kickoff,
      prediction_lock_time: payload.predictionLockTime || payload.kickoff,
    });
    return normalizeMatch(res.data);
  },

  // ── Score Update ──────────────────────────────────────────────────────────

  /** PATCH /api/admin/update-score/<match_id>/ */
  updateMatchScore: async (matchId, homeScore, awayScore) => {
    const res = await api.patch(`/admin/update-score/${matchId}/`, {
      home_score: parseInt(homeScore),
      away_score: parseInt(awayScore),
      is_finished: true,
    });
    return res.data;
  },

  // ── Clubs ─────────────────────────────────────────────────────────────────

  /** GET /api/admin/clubs/ */
  getClubs: async () => {
    const res = await api.get('/admin/clubs/');
    const list = res.data.results ?? res.data;
    return list.map(normalizeClub);
  },

  /** PATCH /api/admin/clubs/<id>/ — toggle active status */
  toggleClubStatus: async (id, isActive) => {
    const res = await api.patch(`/admin/clubs/${id}/`, { is_active: isActive });
    return normalizeClub(res.data);
  },

  // ── Users ─────────────────────────────────────────────────────────────────

  /** GET /api/admin/users/ */
  getUsers: async () => {
    const res = await api.get('/admin/users/');
    const list = res.data.results ?? res.data;
    return list.map(normalizeUser);
  },

  // ── Global Leaderboard ────────────────────────────────────────────────────

  /** GET /api/admin/global-leaderboard/ */
  getGlobalLeaderboard: async () => {
    const res = await api.get('/admin/global-leaderboard/');
    const list = res.data.results ?? res.data;
    return list.map(normalizeLeaderboardEntry);
  },

  // ── Dashboard Stats (aggregated from multiple calls) ─────────────────────

  getDashboardStats: async () => {
    const [tournaments, teams, matches, clubs, users] = await Promise.allSettled([
      api.get('/admin/tournaments/'),
      api.get('/admin/teams/'),
      api.get('/admin/matches/'),
      api.get('/admin/clubs/'),
      api.get('/admin/users/'),
    ]);

    const count = (settled) => {
      if (settled.status !== 'fulfilled') return '—';
      const data = settled.value.data;
      if (data.count !== undefined) return data.count;
      if (Array.isArray(data)) return data.length;
      if (data.results) return data.results.length;
      return '—';
    };

    return {
      tournaments: count(tournaments),
      teams: count(teams),
      matches: count(matches),
      clubs: count(clubs),
      users: count(users),
    };
  },
};

export default adminService;
