import type {
  AdminOverviewPayload,
  AuthPayload,
  CommunityDetail,
  CommunityPost,
  CommunityPreview,
  FriendsPayload,
  GarageVehicle,
  MemberHomePayload,
  NetworkEvent,
  NetworkProfile,
  NetworkProfileLink,
  NetworkShortLink,
  NetworkSiteState,
  ProfilePost,
  PublicPlatformPayload,
} from '../types/network';

const API_ORIGIN = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '');
const API_BASE = API_ORIGIN ? `${API_ORIGIN}/api` : '';
const TOKEN_KEY = 'statik_session_token';

export function getStoredToken() {
  if (typeof window === 'undefined') return null;
  return window.localStorage.getItem(TOKEN_KEY);
}

export function setStoredToken(token: string | null) {
  if (typeof window === 'undefined') return;
  if (token) window.localStorage.setItem(TOKEN_KEY, token);
  else window.localStorage.removeItem(TOKEN_KEY);
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getStoredToken();
  const headers = new Headers(options.headers || {});
  const body = options.body;
  const isFormData = typeof FormData !== 'undefined' && body instanceof FormData;
  if (!headers.has('Content-Type') && body && !isFormData) headers.set('Content-Type', 'application/json');
  if (token) headers.set('Authorization', `Bearer ${token}`);

  if (!API_BASE) {
    throw new Error('Frontend API is not configured. Set VITE_API_BASE_URL in Netlify and redeploy the site.');
  }

  const response = await fetch(`${API_BASE}${path}`, { ...options, headers });
  if (!response.ok) {
    let message = 'Request failed';
    try {
      const json = await response.json();
      message = json.error || message;
    } catch {
      // ignore
    }
    throw new Error(message);
  }
  return response.json();
}

export function getApiOrigin() {
  return API_ORIGIN;
}

export const networkApi = {
  getPublicPlatform: () => request<PublicPlatformPayload>('/platform/public'),
  getMemberHome: () => request<MemberHomePayload>('/platform/member-home'),
  register: (payload: { email: string; password: string; displayName: string }) => request<AuthPayload>('/auth/register', { method: 'POST', body: JSON.stringify(payload) }),
  login: (payload: { email: string; password: string }) => request<AuthPayload>('/auth/login', { method: 'POST', body: JSON.stringify(payload) }),
  me: () => request<AuthPayload>('/auth/me'),
  logout: () => request<{ success: boolean }>('/auth/logout', { method: 'POST' }),

  listEvents: () => request<NetworkEvent[]>('/events'),
  getEvent: (slug: string) => request<NetworkEvent>(`/events/${slug}`),
  submitEvent: (payload: { name: string; location: string; date: string; time: string; description: string; category: string; organizer: string; hostCommunityId?: string }) => request<NetworkEvent>('/events/submit', { method: 'POST', body: JSON.stringify(payload) }),
  rsvpEvent: (eventId: string, status: 'interested' | 'attending' | 'maybe') => request<NetworkEvent>(`/events/${eventId}/rsvp`, { method: 'POST', body: JSON.stringify({ status }) }),

  listProfiles: (params?: { featured?: boolean; verified?: boolean; viewerUserId?: string }) => {
    const search = new URLSearchParams();
    if (params?.featured) search.set('featured', 'true');
    if (params?.verified) search.set('verified', 'true');
    if (params?.viewerUserId) search.set('viewerUserId', params.viewerUserId);
    return request<NetworkProfile[]>(`/profiles${search.toString() ? `?${search.toString()}` : ''}`);
  },
  getProfile: (slug: string, viewerUserId?: string, source?: string) => {
    const search = new URLSearchParams();
    if (viewerUserId) search.set('viewerUserId', viewerUserId);
    if (source) search.set('source', source);
    return request<NetworkProfile>(`/profiles/${slug}${search.toString() ? `?${search.toString()}` : ''}`);
  },
  updateMyProfile: (payload: { displayName: string; bio: string; location: string; primaryCar: string; avatarUrl: string; bannerUrl: string; about: string; currentlyBuilding: string; sceneTags: string[]; analyticsVisibility: 'public' | 'private' }) => request<NetworkProfile>('/profiles/me', { method: 'PATCH', body: JSON.stringify(payload) }),
  getMyGarage: () => request<GarageVehicle[]>('/profiles/me/garage'),
  createGarageVehicle: (payload: Partial<GarageVehicle> & { make: string; model: string }) => request<GarageVehicle[]>('/profiles/me/garage', { method: 'POST', body: JSON.stringify(payload) }),
  updateGarageVehicle: (vehicleId: string, payload: Partial<GarageVehicle>) => request<GarageVehicle[]>(`/profiles/me/garage/${vehicleId}`, { method: 'PATCH', body: JSON.stringify(payload) }),
  deleteGarageVehicle: (vehicleId: string) => request<{ success: boolean }>(`/profiles/me/garage/${vehicleId}`, { method: 'DELETE' }),
  getMyProfilePosts: () => request<ProfilePost[]>('/profiles/me/posts'),
  createProfilePost: (payload: { caption: string; mediaIds: string[]; pinned?: boolean; featured?: boolean }) => request<ProfilePost[]>('/profiles/me/posts', { method: 'POST', body: JSON.stringify(payload) }),
  updateProfilePost: (postId: string, payload: Partial<{ caption: string; mediaIds: string[]; pinned: boolean; featured: boolean }>) => request<ProfilePost[]>(`/profiles/me/posts/${postId}`, { method: 'PATCH', body: JSON.stringify(payload) }),
  deleteProfilePost: (postId: string) => request<{ success: boolean }>(`/profiles/me/posts/${postId}`, { method: 'DELETE' }),
  getMyLinks: () => request<NetworkProfileLink[]>('/profiles/me/links'),
  createMyLink: (payload: { label: string; href: string; type: 'social' | 'build' | 'garage' | 'group' | 'other' }) => request<NetworkProfileLink[]>('/profiles/me/links', { method: 'POST', body: JSON.stringify(payload) }),
  updateMyLink: (linkId: string, payload: Partial<{ label: string; href: string; type: 'social' | 'build' | 'garage' | 'group' | 'other' }>) => request<NetworkProfileLink[]>(`/profiles/me/links/${linkId}`, { method: 'PATCH', body: JSON.stringify(payload) }),
  deleteMyLink: (linkId: string) => request<{ success: boolean }>(`/profiles/me/links/${linkId}`, { method: 'DELETE' }),
  getMyAnalytics: () => request<NonNullable<NetworkProfile['analytics']>>('/profiles/me/analytics'),

  getFriends: () => request<FriendsPayload>('/friends'),
  sendFriendRequest: (targetUserId: string) => request<{ success: boolean }>('/friends/requests', { method: 'POST', body: JSON.stringify({ targetUserId }) }),
  respondFriendRequest: (requestId: string, action: 'accept' | 'reject') => request<{ success: boolean }>(`/friends/requests/${requestId}/respond`, { method: 'POST', body: JSON.stringify({ action }) }),
  removeFriend: (userId: string) => request<{ success: boolean }>(`/friends/${userId}`, { method: 'DELETE' }),

  listCommunities: () => request<CommunityPreview[]>('/communities'),
  createCommunity: (payload: { name: string; description: string; visibility: 'public' | 'private'; avatarUrl: string; bannerUrl: string; region?: string; tags?: string[]; rules?: string[]; applicationQuestions?: string[]; discoverable?: boolean }) => request<CommunityDetail>('/communities', { method: 'POST', body: JSON.stringify(payload) }),
  updateCommunity: (communityId: string, payload: Partial<CommunityDetail>) => request<{ success: boolean }>(`/communities/${communityId}`, { method: 'PATCH', body: JSON.stringify(payload) }),
  getCommunity: (slug: string) => request<CommunityDetail>(`/communities/${slug}`),
  joinCommunity: (id: string) => request<{ success: boolean }>(`/communities/${id}/join`, { method: 'POST' }),
  requestCommunityAccess: (id: string, answers: string[]) => request<{ success: boolean }>(`/communities/${id}/join-request`, { method: 'POST', body: JSON.stringify({ answers }) }),
  reviewCommunityJoinRequest: (communityId: string, requestId: string, action: 'approve' | 'reject') => request<{ success: boolean }>(`/communities/${communityId}/join-requests/${requestId}/review`, { method: 'POST', body: JSON.stringify({ action }) }),
  leaveCommunity: (id: string) => request<{ success: boolean }>(`/communities/${id}/leave`, { method: 'POST' }),
  createCommunityPost: (id: string, payload: { caption: string; mediaIds: string[]; linkedEventId?: string; pinned?: boolean; featured?: boolean }) => request<CommunityDetail>(`/communities/${id}/posts`, { method: 'POST', body: JSON.stringify(payload) }),
  updateCommunityPost: (communityId: string, postId: string, payload: Partial<CommunityPost>) => request<{ success: boolean }>(`/communities/${communityId}/posts/${postId}`, { method: 'PATCH', body: JSON.stringify(payload) }),
  deleteCommunityPost: (communityId: string, postId: string) => request<{ success: boolean }>(`/communities/${communityId}/posts/${postId}`, { method: 'DELETE' }),
  sendCommunityMessage: (id: string, payload: { type: 'text' | 'event' | 'location'; text: string; eventId?: string; location?: { lat: number; lng: number; label?: string } }) => request<CommunityDetail>(`/communities/${id}/messages`, { method: 'POST', body: JSON.stringify(payload) }),
  deleteCommunityMessage: (communityId: string, messageId: string) => request<{ success: boolean }>(`/communities/${communityId}/messages/${messageId}`, { method: 'DELETE' }),
  updateCommunityAdmin: (communityId: string, payload: { userId: string; action: 'promote' | 'demote' }) => request<{ success: boolean }>(`/communities/${communityId}/admins`, { method: 'POST', body: JSON.stringify(payload) }),
  kickCommunityMember: (communityId: string, userId: string) => request<{ success: boolean }>(`/communities/${communityId}/members/${userId}/kick`, { method: 'POST' }),

  initUpload: (payload: { ownerType: 'profile' | 'vehicle' | 'profile_post' | 'community' | 'community_post' | 'event'; ownerId: string; fileName: string; mimeType: string; size: number }) => request<{ assetId: string; uploadId: string; uploadUrl: string; maxBytes: number }>('/media/uploads/init', { method: 'POST', body: JSON.stringify(payload) }),
  deleteMedia: (assetId: string) => request<{ success: boolean }>(`/media/assets/${assetId}`, { method: 'DELETE' }),

  listMyShortLinks: () => request<NetworkShortLink[]>('/links/me'),
  claimShortLink: (shortLinkId: string, slug: string) => request<{ success: boolean }>('/links/claim', { method: 'POST', body: JSON.stringify({ shortLinkId, slug }) }),

  trackAnalytics: (payload: { eventType: 'vehicle_view' | 'profile_post_view' | 'community_post_view' | 'event_click' | 'garage_view'; targetType: 'vehicle' | 'profile_post' | 'community_post' | 'event' | 'profile'; targetId: string; source?: string }) => request<{ success: boolean }>('/analytics/track', { method: 'POST', body: JSON.stringify(payload) }),
  reportContent: (payload: { targetType: 'profile' | 'community' | 'profile_post' | 'community_post' | 'media'; targetId: string; reason: string }) => request<{ success: boolean }>('/reports', { method: 'POST', body: JSON.stringify(payload) }),

  getAdminOverview: () => request<AdminOverviewPayload>('/admin/overview'),
  updateSite: (payload: Partial<NetworkSiteState>) => request<NetworkSiteState>('/admin/site', { method: 'PATCH', body: JSON.stringify(payload) }),
  moderateProfile: (profileId: string, payload: { featured?: boolean; verified?: boolean; promoted?: boolean; analyticsVisibility?: 'public' | 'private' }) => request<{ success: boolean }>(`/admin/profiles/${profileId}`, { method: 'PATCH', body: JSON.stringify(payload) }),
  moderateEvent: (eventId: string, payload: { featured?: boolean; approvalStatus?: 'pending' | 'approved' | 'rejected' }) => request<{ success: boolean }>(`/admin/events/${eventId}`, { method: 'PATCH', body: JSON.stringify(payload) }),
  moderateCommunity: (communityId: string, payload: Partial<CommunityDetail>) => request<{ success: boolean }>(`/admin/communities/${communityId}`, { method: 'PATCH', body: JSON.stringify(payload) }),
  moderateReport: (reportId: string, payload: { status: 'open' | 'resolved' | 'dismissed'; note?: string }) => request<{ success: boolean }>(`/admin/reports/${reportId}`, { method: 'PATCH', body: JSON.stringify(payload) }),
  adminDeleteMedia: (assetId: string) => request<{ success: boolean }>(`/admin/media/${assetId}`, { method: 'DELETE' }),
};
