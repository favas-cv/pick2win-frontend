import api from './api';

/**
 * clubService — all calls hit the real Django backend.
 * Base prefix (from main urls.py): /api/club-admin/
 */
export const clubService = {

  /**
   * GET /api/clubs/mine/
   * Returns an array of clubs the authenticated user belongs to.
   */
  getMyClubs: async () => {
    const response = await api.get('/clubs/mine/');
    return response.data;
  },

  /**
   * GET /api/club-admin/members/
   * Club admin only — lists all members. Backend uses request.user to find club.
   */
  getClubMembers: async () => {
    const response = await api.get('/club-admin/members/');
    return response.data;
  },

  /**
   * POST /api/club-admin/generate-link/
   * Club admin only — creates a new invite token.
   * Body: { club_id }
   * Returns: { invite_link: "https/token=..." }
   */
  generateInviteLink: async (clubId) => {
    const response = await api.post('/club-admin/generate-link/', { club_id: clubId });
    return response.data;
  },
};

export default clubService;
