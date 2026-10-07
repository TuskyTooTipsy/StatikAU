export interface VehicleRegistryPayload {
  version: string;
  source: string;
  allowCustom: boolean;
  registry: Array<{
    make: string;
    vehicleType: 'car' | 'bike' | 'truck' | 'other';
    models: Array<{
      name: string;
      generations?: string[];
      trims?: string[];
      specialEditions?: string[];
      bodyStyles?: string[];
      drivetrains?: string[];
      engines?: string[];
      transmissions?: string[];
      regionMarkets?: string[];
    }>;
  counts?: { makes: number; carMakes: number; bikeMakes: number; truckMakes: number; models: number };
  }>;
  buildStages: string[];
  ownershipStatuses: string[];
  purposeTags: string[];
  setupTags: string[];
}

export interface RuntimeDiagnostics {
  publicAppUrl: string;
  publicServerUrl: string;
  allowedOrigins: string[];
  storageProvider: string;
  mapProviderConfigured?: boolean;
  storagePublicUrl: string;
  aiProviderConfigured?: boolean;
  aiProvider?: string;
  maxUploadBytes: number;
  nodeEnv: string;
  warnings: string[];
}

export interface NetworkSiteState {
  shopLocked: boolean;
  maintenanceMode: boolean;
  registrationOpen: boolean;
  brandTagline: string;
  eventVisibilityMode?: 'open' | 'curated';
  mapProvider?: 'google' | 'mapbox' | 'manual';
  importsEnabled?: boolean;
  featureWindowDaysDefault?: number;
  homepageHeroMode?: 'events' | 'hybrid';
  messageModerationEnabled?: boolean;
  approvalWorkflowDefault?: 'manual' | 'trusted_auto_queue';
  sponsorEventModuleEnabled?: boolean;
  auditRetentionDays?: number;
  newestMembersEnabled?: boolean;
  articlesEnabled?: boolean;
  newsEnabled?: boolean;
  businessDirectoryEnabled?: boolean;
  aiWriterEnabled?: boolean;
  newestMembersRequireCompleteProfile?: boolean;
}

export interface NetworkUser {
  id: string;
  email: string;
  displayName: string;
  role: 'user' | 'admin';
  createdAt: string;
}

export interface MediaAsset {
  id: string;
  ownerUserId: string;
  ownerType: 'profile' | 'vehicle' | 'profile_post' | 'community' | 'community_post' | 'event' | 'content' | 'business';
  ownerId: string;
  kind: 'image' | 'video';
  fileName: string;
  originalFilename?: string;
  displayTitle?: string;
  caption?: string;
  altText?: string;
  thumbnailUrl?: string;
  mimeType: string;
  size: number;
  url: string;
  status: 'pending' | 'uploaded' | 'failed' | 'deleted';
  createdAt: string;
  updatedAt: string;
}

export interface NetworkProfileLink {
  id: string;
  profileId: string;
  label: string;
  href: string;
  type: 'social' | 'build' | 'garage' | 'group' | 'other';
  createdAt: string;
  updatedAt: string;
}

export interface NetworkShortLink {
  id: string;
  slug: string;
  targetType: 'profile' | 'vehicle' | 'community' | 'event' | 'article' | 'news' | 'business';
  targetId: string;
  ownerUserId: string;
  clickCount: number;
  qrScanCount: number;
  createdAt: string;
  updatedAt: string;
  targetHref?: string | null;
  shortUrl?: string;
  qrUrl?: string;
}

export interface GarageTimelinePoint {
  id: string;
  title: string;
  note: string;
  date: string;
}

export interface GarageVehicle {
  id: string;
  profileId: string;
  vehicleType: 'car' | 'bike' | 'truck' | 'other';
  year: string;
  make: string;
  model: string;
  trim: string;
  generation?: string;
  specialEdition?: string;
  bodyStyle?: string;
  drivetrain?: string;
  engineFamily?: string;
  transmission?: string;
  nickname: string;
  stage: string;
  ownershipStatus?: string;
  statusTags: string[];
  purposeTags?: string[];
  setupTags?: string[];
  engineCode?: string;
  induction?: string;
  fuelType?: string;
  colourWrap?: string;
  wheelTyreSpec?: string;
  suspensionSetup?: string;
  engineMods?: string;
  aeroBodyMods?: string;
  interiorAudioNotes?: string;
  performanceNotes?: string;
  visibility: 'public' | 'private';
  description: string;
  modTags: string[];
  heroMediaId?: string;
  mediaIds: string[];
  linkedCommunityIds: string[];
  timeline: GarageTimelinePoint[];
  featured: boolean;
  createdAt: string;
  updatedAt: string;
  heroMedia?: MediaAsset | null;
  media: MediaAsset[];
  communities?: CommunityPreview[];
  owner?: NetworkProfile | null;
}

export interface ProfilePost {
  id: string;
  profileId: string;
  caption: string;
  mediaIds: string[];
  pinned: boolean;
  featured: boolean;
  createdAt: string;
  updatedAt: string;
  media: MediaAsset[];
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
  approvalStatus: 'pending' | 'approved' | 'rejected' | 'revision_requested';
  createdByUserId: string;
  createdAt: string;
  updatedAt?: string;
  hostCommunityId?: string;
  hostCommunity?: CommunityPreview | null;
  counts?: EventCounts;
  viewerStatus?: 'interested' | 'attending' | 'maybe' | null;
  notable?: {
    attending: NetworkProfile[];
    interested: NetworkProfile[];
    maybe: NetworkProfile[];
  };
  sourceType?: 'user_submission' | 'imported' | 'statik_hosted' | 'partner' | 'manual_admin';
  sourceName?: string;
  sourceUrl?: string;
  sponsored?: boolean;
  sponsorName?: string;
  venueType?: string;
  entryType?: string;
  pricingType?: string;
  vehicleFocus?: string[];
  tags?: string[];
  hostLinks?: string[];
  spectatorFriendly?: boolean;
  familyFriendly?: boolean;
  recurring?: boolean;
  indoorOutdoor?: 'indoor' | 'outdoor' | 'mixed' | 'unknown';
  locationDetails?: { label: string; address?: string; lat?: number; lng?: number; placeId?: string; suburb?: string; region?: string; country?: string } | null;
  media?: MediaAsset[];
  mediaIds?: string[];
  relatedEvents?: Array<{ id: string; slug: string; name: string; date: string; time: string; location: string; category: string }>;
  adminNotes?: string[];
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
  hasPendingRequest?: boolean;
  discoverable?: boolean;
  region?: string;
  tags?: string[];
  rules?: string[];
  applicationQuestions?: string[];
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
  about?: string;
  currentlyBuilding?: string;
  sceneTags?: string[];
  featuredVehicleId?: string;
  featuredPostId?: string;
  analyticsVisibility?: 'public' | 'private';
  memberType?: 'car_enthusiast' | 'bike_rider' | 'photographer_videographer' | 'business_owner' | 'car_group_owner' | 'event_host' | 'workshop_vendor' | 'spectator_fan' | 'other';
  interestTags?: string[];
  preferredEventTypes?: string[];
  discoveryVisible?: boolean;
  newestMemberVisible?: boolean;
  profileComplete?: boolean;
  showLocation?: boolean;
  showEventActivity?: boolean;
  showGroupAffiliations?: boolean;
  createdAt: string;
  updatedAt?: string;
  stats?: {
    friendCount: number;
    communityCount: number;
    eventAttendanceCount: number;
    vehicleCount: number;
    postCount: number;
  };
  friendCount?: number;
  mutualFriends?: number;
  isFriend?: boolean;
  role?: 'user' | 'admin';
  featuredVehicle?: GarageVehicle | null;
  garage?: GarageVehicle[];
  posts?: ProfilePost[];
  affiliations?: Array<{
    id: string;
    slug: string;
    name: string;
    visibility: 'public' | 'private';
    region?: string;
    role: 'owner' | 'admin' | 'member';
    count?: number;
  }>;
  externalLinks?: NetworkProfileLink[];
  shortLinks?: NetworkShortLink[];
  analytics?: {
    visibility: 'public' | 'private';
    profileViews?: number;
    uniqueVisitors?: number;
    garageViews?: number;
    linkClicks?: number;
    qrScans?: number;
    followerCount?: number;
    followerGrowthPoints?: Array<{ date: string; count: number }>;
    profileViewTrend?: Array<{ date: string; count: number }>;
    topVehicles?: Array<{ id: string; label: string; count: number }>;
    topPosts?: Array<{ id: string; caption: string; count: number }>;
    topAffiliations?: Array<{ id: string; slug: string; name: string; visibility: string; region?: string; role: string; count: number }>;
    sources?: Array<{ label: string; count: number }>;
    visibilitySpike?: string | null;
  };
}

export interface CommunityMessage {
  id: string;
  communityId: string;
  userId: string;
  type: 'text' | 'event' | 'location';
  text: string;
  eventId?: string;
  hidden?: boolean;
  hiddenAt?: string;
  hiddenByUserId?: string;
  deleted?: boolean;
  deletedAt?: string;
  deletedByUserId?: string;
  moderationNote?: string;
  location?: {
    lat: number;
    lng: number;
    label?: string;
  };
  createdAt: string;
  profile?: NetworkProfile;
  event?: NetworkEvent | null;
}

export interface CommunityPost {
  id: string;
  communityId: string;
  authorUserId: string;
  caption: string;
  mediaIds: string[];
  linkedEventId?: string;
  pinned: boolean;
  featured: boolean;
  createdAt: string;
  updatedAt: string;
  media: MediaAsset[];
  authorProfile?: NetworkProfile | null;
  linkedEvent?: NetworkEvent | null;
}

export interface CommunityJoinRequest {
  id: string;
  communityId: string;
  userId: string;
  status: 'pending' | 'approved' | 'rejected';
  answers: string[];
  createdAt: string;
  updatedAt: string;
  profile?: NetworkProfile | null;
}

export interface CommunityDetail extends CommunityPreview {
  owner: NetworkProfile | null;
  admins: NetworkProfile[];
  members: NetworkProfile[];
  messages: CommunityMessage[];
  posts: CommunityPost[];
  joinRequests: CommunityJoinRequest[];
  hostedEvents: NetworkEvent[];
  featuredMembers: NetworkProfile[];
  featuredVehicles: GarageVehicle[];
  featuredMemberUserIds?: string[];
  featuredVehicleIds?: string[];
  memberVehicles?: GarageVehicle[];
  applicationQuestions: string[];
  discoverable: boolean;
  createdAt: string;
  updatedAt: string;
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

export interface ContentItem {
  id: string;
  type: 'article' | 'news';
  slug: string;
  title: string;
  excerpt: string;
  body: string;
  heroMediaId?: string;
  galleryMediaIds: string[];
  category: string;
  tags: string[];
  authorUserId?: string | null;
  authorDisplayName?: string;
  status: 'draft' | 'pending' | 'published' | 'scheduled' | 'archived';
  publishedAt?: string;
  scheduledFor?: string;
  createdAt: string;
  updatedAt: string;
  featured: boolean;
  sponsored: boolean;
  sponsorBusinessId?: string;
  relatedEventIds: string[];
  relatedBusinessIds: string[];
  relatedProfileIds: string[];
  relatedCommunityIds: string[];
  aiAssisted: boolean;
  metaTitle?: string;
  metaDescription?: string;
  heroMedia?: MediaAsset | null;
  galleryMedia?: MediaAsset[];
  canonicalShareUrl?: string;
  shortLink?: NetworkShortLink;
}

export interface BusinessListing {
  id: string;
  slug: string;
  businessName: string;
  ownerUserId?: string | null;
  status: 'draft' | 'pending' | 'approved' | 'rejected' | 'suspended' | 'archived';
  trusted: boolean;
  sponsored: boolean;
  featured: boolean;
  featuredUntil?: string | null;
  sponsoredUntil?: string | null;
  category: string;
  subcategories: string[];
  description: string;
  services: string[];
  specialties: string[];
  region: string;
  address?: string;
  phone?: string;
  email?: string;
  website?: string;
  socialLinks: string[];
  logoMediaId?: string;
  bannerMediaId?: string;
  galleryMediaIds: string[];
  openingHours?: string;
  offers?: string[];
  contactCount: number;
  createdAt: string;
  updatedAt: string;
  approvedAt?: string;
  logoMedia?: MediaAsset | null;
  bannerMedia?: MediaAsset | null;
  galleryMedia?: MediaAsset[];
  canonicalShareUrl?: string;
  shortLink?: NetworkShortLink;
}

export interface PublicPlatformPayload {
  site: NetworkSiteState;
  featuredProfiles: NetworkProfile[];
  featuredEvents: NetworkEvent[];
  flagshipEvents?: NetworkEvent[];
  upcomingEvents?: NetworkEvent[];
  eventCategories?: Array<{ label: string; count: number }>;
  publicCommunities: CommunityPreview[];
  newestMembers?: NetworkProfile[];
  latestArticles?: ContentItem[];
  latestNews?: ContentItem[];
  trustedBusinesses?: BusinessListing[];
  counts: {
    approvedEvents: number;
    publicCommunities: number;
    sponsoredEvents?: number;
    newestMembers?: number;
    publishedArticles?: number;
    publishedNews?: number;
    approvedBusinesses?: number;
  };
  foundingPhase: boolean;
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
    vehicles?: number;
    posts?: number;
  };
}

export interface AuthPayload {
  token?: string;
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
    vehicles: number;
    posts: number;
    media: number;
    openReports: number;
    pendingImports?: number;
  };
  profiles: NetworkProfile[];
  events: NetworkEvent[];
  communities: Array<CommunityPreview & { createdAt: string; updatedAt?: string }>;
  reports: Array<{
    id: string;
    reporterUserId: string;
    targetType: 'profile' | 'community' | 'profile_post' | 'community_post' | 'media';
    targetId: string;
    reason: string;
    status: 'open' | 'resolved' | 'dismissed';
    createdAt: string;
    resolvedAt?: string;
    note?: string;
  }>;
  media: MediaAsset[];
  vehicles?: GarageVehicle[];
  shortLinks?: NetworkShortLink[];
  contentItems?: ContentItem[];
  businessListings?: BusinessListing[];
  aiGenerationLogs?: Array<{ id: string; actorUserId: string; contentType: 'article' | 'news'; prompt: string; sourceContext: string; output: string; provider: string; model: string; createdAt: string }>;
  auditLogs: Array<{
    id: string;
    actorUserId: string | null;
    action: string;
    targetType: string;
    targetId: string;
    createdAt: string;
    detail?: string;
    undoAction?: string;
  }>;
  approveBay?: {
    events: NetworkEvent[];
    imports: EventImportItem[];
    reports: Array<{ id: string; targetType: string; targetId: string; reason: string; status: string; createdAt: string; note?: string }>;
    content?: ContentItem[];
    businesses?: BusinessListing[];
    posts: Array<{ id: string; queueType: string; caption: string; createdAt: string }>;
  };
  importSources?: EventImportSource[];
  importRuns?: EventImportRun[];
  importItems?: EventImportItem[];
  diagnostics?: RuntimeDiagnostics;
}


export interface EventImportSource {
  id: string;
  key: string;
  name: string;
  baseUrl: string;
  enabled: boolean;
  createdAt: string;
  updatedAt: string;
  lastRunAt?: string;
  lastRunStatus?: 'queued' | 'success' | 'partial' | 'failed';
  lastRunMessage?: string;
}

export interface EventImportRun {
  id: string;
  sourceId: string;
  sourceKey: string;
  startedAt: string;
  finishedAt?: string;
  status: 'queued' | 'success' | 'partial' | 'failed';
  importedCount: number;
  duplicateCount: number;
  errorCount: number;
  note?: string;
}

export interface EventImportItem {
  id: string;
  sourceId: string;
  runId: string;
  sourceKey: string;
  sourceName: string;
  sourceUrl: string;
  title: string;
  location: string;
  date: string;
  time: string;
  category: string;
  description: string;
  imageUrl?: string;
  organizer?: string;
  hostHint?: string;
  rawText?: string;
  normalizedTags: string[];
  status: 'pending' | 'approved' | 'rejected' | 'archived';
  createdAt: string;
  updatedAt: string;
  linkedEventId?: string;
  duplicateOfEventId?: string;
  adminNote?: string;
}

export interface AdminUserSummary {
  id: string;
  email: string;
  displayName: string;
  role: 'user' | 'admin';
  createdAt: string;
  isBanned?: boolean;
  suspensionEndsAt?: string | null;
  moderationNote?: string;
  featureEndsAt?: string | null;
  profile: NetworkProfile | null;
  lastIps: string[];
  recentSessions: Array<{ id: string; createdAt: string; lastSeenAt?: string; ip?: string; userAgent?: string }>;
  recentActions: Array<{ id: string; action: string; targetType: string; targetId: string; createdAt: string; detail?: string }>;
  ownedCommunities: CommunityPreview[];
  adminCommunities: CommunityPreview[];
  hostedEvents: NetworkEvent[];
  vehicles: GarageVehicle[];
  media: MediaAsset[];
}

export interface AdminUserDetail extends AdminUserSummary {
  relatedReports: Array<{ id: string; targetType: string; targetId: string; reason: string; status: string; createdAt: string; note?: string }>;
  profilePosts: ProfilePost[];
  communityPosts: CommunityPost[];
  messages: CommunityMessage[];
  shortLinks: NetworkShortLink[];
  businesses?: BusinessListing[];
}

export interface AdminMessageRecord extends CommunityMessage {
  community?: CommunityPreview | null;
}
