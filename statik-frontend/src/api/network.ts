import type {
  AdminOverviewPayload,
  AuthPayload,
  CommunityDetail,
  CommunityPreview,
  FriendsPayload,
  MemberHomePayload,
  NetworkEvent,
  NetworkProfile,
  NetworkSiteState,
  PublicPlatformPayload,
} from '../types/network';

const API_BASE = `${(import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '')}/api`;
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
  if (!headers.has('Content-Type') && options.body) headers.set('Content-Type', 'application/json');
  if (token) headers.set('Authorization', `Bearer ${token}`);

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

export const networkApi = {
  getPublicPlatform: () => request<PublicPlatformPayload>('/platform/public'),
  getMemberHome: () => request<MemberHomePayload>('/platform/member-home'),
  register: (payload: { email: string; password: string; displayName: string }) => request<AuthPayload>('/auth/register', { method: 'POST', body: JSON.stringify(payload) }),
  login: (payload: { email: string; password: string }) => request<AuthPayload>('/auth/login', { method: 'POST', body: JSON.stringify(payload) }),
  me: () => request<AuthPayload>('/auth/me'),
  logout: () => request<{ success: boolean }>('/auth/logout', { method: 'POST' }),
  listEvents: () => request<NetworkEvent[]>('/events'),
  getEvent: (slug: string) => request<NetworkEvent>(`/events/${slug}`),
  submitEvent: (payload: { name: string; location: string; date: string; time: string; description: string; category: string; organizer: string }) => request<NetworkEvent>('/events/submit', { method: 'POST', body: JSON.stringify(payload) }),
  rsvpEvent: (eventId: string, status: 'interested' | 'attending' | 'maybe') => request<NetworkEvent>(`/events/${eventId}/rsvp`, { method: 'POST', body: JSON.stringify({ status }) }),
  listProfiles: (params?: { featured?: boolean; verified?: boolean; viewerUserId?: string }) => {
    const search = new URLSearchParams();
    if (params?.featured) search.set('featured', 'true');
    if (params?.verified) search.set('verified', 'true');
    if (params?.viewerUserId) search.set('viewerUserId', params.viewerUserId);
    return request<NetworkProfile[]>(`/profiles${search.toString() ? `?${search.toString()}` : ''}`);
  },
  getProfile: (slug: string, viewerUserId?: string) => request<NetworkProfile>(`/profiles/${slug}${viewerUserId ? `?viewerUserId=${viewerUserId}` : ''}`),
  updateMyProfile: (payload: { displayName: string; bio: string; location: string; primaryCar: string; avatarUrl: string; bannerUrl: string }) => request<NetworkProfile>('/profiles/me', { method: 'PATCH', body: JSON.stringify(payload) }),
  getFriends: () => request<FriendsPayload>('/friends'),
  sendFriendRequest: (targetUserId: string) => request<{ success: boolean }>('/friends/requests', { method: 'POST', body: JSON.stringify({ targetUserId }) }),
  respondFriendRequest: (requestId: string, action: 'accept' | 'reject') => request<{ success: boolean }>(`/friends/requests/${requestId}/respond`, { method: 'POST', body: JSON.stringify({ action }) }),
  removeFriend: (userId: string) => request<{ success: boolean }>(`/friends/${userId}`, { method: 'DELETE' }),
  listCommunities: () => request<CommunityPreview[]>('/communities'),
  createCommunity: (payload: { name: string; description: string; visibility: 'public' | 'private'; avatarUrl: string; bannerUrl: string }) => request<CommunityDetail>('/communities', { method: 'POST', body: JSON.stringify(payload) }),
  getCommunity: (slug: string) => request<CommunityDetail>(`/communities/${slug}`),
  joinCommunity: (id: string) => request<{ success: boolean }>(`/communities/${id}/join`, { method: 'POST' }),
  leaveCommunity: (id: string) => request<{ success: boolean }>(`/communities/${id}/leave`, { method: 'POST' }),
  sendCommunityMessage: (id: string, payload: { type: 'text' | 'event' | 'location'; text: string; eventId?: string; location?: { lat: number; lng: number; label?: string } }) => request<CommunityDetail>(`/communities/${id}/messages`, { method: 'POST', body: JSON.stringify(payload) }),
  deleteCommunityMessage: (communityId: string, messageId: string) => request<{ success: boolean }>(`/communities/${communityId}/messages/${messageId}`, { method: 'DELETE' }),
  updateCommunityAdmin: (communityId: string, payload: { userId: string; action: 'promote' | 'demote' }) => request<{ success: boolean }>(`/communities/${communityId}/admins`, { method: 'POST', body: JSON.stringify(payload) }),
  kickCommunityMember: (communityId: string, userId: string) => request<{ success: boolean }>(`/communities/${communityId}/members/${userId}/kick`, { method: 'POST' }),
  getAdminOverview: () => request<AdminOverviewPayload>('/admin/overview'),
  updateSite: (payload: Partial<NetworkSiteState>) => request<NetworkSiteState>('/admin/site', { method: 'PATCH', body: JSON.stringify(payload) }),
  moderateProfile: (profileId: string, payload: { featured?: boolean; verified?: boolean; promoted?: boolean }) => request<{ success: boolean }>(`/admin/profiles/${profileId}`, { method: 'PATCH', body: JSON.stringify(payload) }),
  moderateEvent: (eventId: string, payload: { featured?: boolean; approvalStatus?: 'pending' | 'approved' | 'rejected' }) => request<{ success: boolean }>(`/admin/events/${eventId}`, { method: 'PATCH', body: JSON.stringify(payload) }),
};
