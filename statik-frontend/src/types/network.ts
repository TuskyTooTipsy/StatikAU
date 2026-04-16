export interface NetworkSiteState {
  shopLocked: boolean;
  maintenanceMode: boolean;
  registrationOpen: boolean;
  brandTagline: string;
}

export interface NetworkUser {
  id: string;
  email: string;
  displayName: string;
  role: 'user' | 'admin';
  createdAt: string;
}

export interface NetworkProfile {
  id: string;
  userId: string;
  slug: string;
  displayName: string;
  bio: string;
  location: string;
  primaryCar: string;
  avatarUrl: string;
  bannerUrl: string;
  verified: boolean;
  featured: boolean;
  promoted: boolean;
  createdAt: string;
  stats?: {
    friendCount: number;
    communityCount: number;
    eventAttendanceCount: number;
  };
  friendCount?: number;
  mutualFriends?: number;
  isFriend?: boolean;
  role?: 'user' | 'admin';
}

export interface EventCounts {
  attending: number;
  interested: number;
  maybe: number;
}

export interface NetworkEvent {
  id: string;
  slug: string;
  name: string;
  location: string;
  date: string;
  time: string;
  description: string;
  category: string;
  organizer: string;
  featured: boolean;
  approvalStatus: 'pending' | 'approved' | 'rejected';
  createdByUserId: string;
  createdAt: string;
  counts?: EventCounts;
  viewerStatus?: 'interested' | 'attending' | 'maybe' | null;
  notable?: {
    attending: NetworkProfile[];
    interested: NetworkProfile[];
    maybe: NetworkProfile[];
  };
}

export interface CommunityPreview {
  id: string;
  slug: string;
  name: string;
  description: string;
  visibility: 'public' | 'private';
  avatarUrl: string;
  bannerUrl: string;
  memberCount: number;
  isMember?: boolean;
  isAdmin?: boolean;
}

export interface CommunityMessage {
  id: string;
  communityId: string;
  userId: string;
  type: 'text' | 'event' | 'location';
  text: string;
  eventId?: string;
  location?: {
    lat: number;
    lng: number;
    label?: string;
  };
  createdAt: string;
  profile?: NetworkProfile;
  event?: NetworkEvent | null;
}

export interface CommunityDetail extends CommunityPreview {
  owner: NetworkProfile | null;
  admins: NetworkProfile[];
  members: NetworkProfile[];
  messages: CommunityMessage[];
}

export interface FriendRequestEnvelope {
  request: {
    id: string;
    fromUserId: string;
    toUserId: string;
    status: 'pending' | 'accepted' | 'rejected';
    createdAt: string;
    updatedAt: string;
  };
  profile: NetworkProfile | null;
}

export interface FriendsPayload {
  friends: NetworkProfile[];
  incoming: FriendRequestEnvelope[];
  outgoing: FriendRequestEnvelope[];
}

export interface PublicPlatformPayload {
  site: NetworkSiteState;
  featuredProfiles: NetworkProfile[];
  featuredEvents: NetworkEvent[];
  publicCommunities: CommunityPreview[];
  counts: {
    members: number;
    approvedEvents: number;
    publicCommunities: number;
  };
  foundingPhase: boolean;
  needsAdminBootstrap: boolean;
}

export interface MemberHomePayload {
  site: NetworkSiteState;
  suggestedProfiles: NetworkProfile[];
  communities: CommunityPreview[];
  pendingRequests: number;
  upcomingEvents: NetworkEvent[];
  myCounts: {
    friends: number;
    communities: number;
    attending: number;
  };
}

export interface AuthPayload {
  token?: string;
  foundingAdmin?: boolean;
  user: NetworkUser;
  profile: NetworkProfile;
  site: NetworkSiteState;
}

export interface AdminOverviewPayload {
  site: NetworkSiteState;
  counts: {
    users: number;
    featuredProfiles: number;
    verifiedProfiles: number;
    approvedEvents: number;
    pendingEvents: number;
    communities: number;
    messages: number;
  };
  profiles: NetworkProfile[];
  events: NetworkEvent[];
  communities: Array<CommunityPreview & { createdAt: string }>;
  auditLogs: Array<{
    id: string;
    actorUserId: string | null;
    action: string;
    targetType: string;
    targetId: string;
    createdAt: string;
    detail?: string;
  }>;
}
