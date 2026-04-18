import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

export type Role = 'user' | 'admin';
export type EventStatus = 'pending' | 'approved' | 'rejected';
export type RSVPStatus = 'interested' | 'attending' | 'maybe';
export type CommunityVisibility = 'public' | 'private';
export type MessageType = 'text' | 'event' | 'location';
export type MediaKind = 'image' | 'video';
export type UploadStatus = 'pending' | 'uploaded' | 'failed' | 'deleted';
export type VehicleType = 'car' | 'bike' | 'truck' | 'other';
export type ProfileAnalyticsVisibility = 'public' | 'private';
export type LinkTargetType = 'profile' | 'vehicle' | 'community' | 'event';
export type AnalyticsEventType =
  | 'profile_view'
  | 'garage_view'
  | 'vehicle_view'
  | 'profile_post_view'
  | 'community_view'
  | 'community_post_view'
  | 'event_click'
  | 'shortlink_click'
  | 'qr_scan';

export interface SiteState {
  shopLocked: boolean;
  maintenanceMode: boolean;
  registrationOpen: boolean;
  brandTagline: string;
}

export interface UserRecord {
  id: string;
  email: string;
  passwordHash: string;
  displayName: string;
  role: Role;
  profileId: string;
  createdAt: string;
}

export interface SessionRecord {
  id: string;
  userId: string;
  tokenHash: string;
  createdAt: string;
}

export interface ProfileRecord {
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
  about: string;
  currentlyBuilding: string;
  sceneTags: string[];
  featuredVehicleId?: string;
  featuredPostId?: string;
  analyticsVisibility: ProfileAnalyticsVisibility;
  createdAt: string;
}

export interface EventRecord {
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
  approvalStatus: EventStatus;
  createdByUserId: string;
  hostCommunityId?: string;
  createdAt: string;
}

export interface EventResponseRecord {
  id: string;
  eventId: string;
  userId: string;
  status: RSVPStatus;
  createdAt: string;
  updatedAt: string;
}

export interface FriendRequestRecord {
  id: string;
  fromUserId: string;
  toUserId: string;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: string;
  updatedAt: string;
}

export interface CommunityRecord {
  id: string;
  slug: string;
  name: string;
  description: string;
  avatarUrl: string;
  bannerUrl: string;
  visibility: CommunityVisibility;
  ownerUserId: string;
  adminUserIds: string[];
  memberUserIds: string[];
  region: string;
  tags: string[];
  rules: string[];
  applicationQuestions: string[];
  featuredMemberUserIds: string[];
  featuredVehicleIds: string[];
  featuredPostIds: string[];
  featuredEventIds: string[];
  discoverable: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CommunityJoinRequestRecord {
  id: string;
  communityId: string;
  userId: string;
  status: 'pending' | 'approved' | 'rejected';
  answers: string[];
  createdAt: string;
  updatedAt: string;
}

export interface CommunityMessageRecord {
  id: string;
  communityId: string;
  userId: string;
  type: MessageType;
  text: string;
  eventId?: string;
  location?: {
    lat: number;
    lng: number;
    label?: string;
  };
  createdAt: string;
}

export interface MediaAssetRecord {
  id: string;
  ownerUserId: string;
  ownerType: 'profile' | 'vehicle' | 'profile_post' | 'community' | 'community_post' | 'event';
  ownerId: string;
  kind: MediaKind;
  fileName: string;
  mimeType: string;
  size: number;
  storageKey: string;
  url: string;
  status: UploadStatus;
  createdAt: string;
  updatedAt: string;
}

export interface PendingUploadRecord {
  id: string;
  ownerUserId: string;
  ownerType: MediaAssetRecord['ownerType'];
  ownerId: string;
  assetId: string;
  fileName: string;
  mimeType: string;
  size: number;
  status: 'pending' | 'uploaded' | 'failed';
  createdAt: string;
  expiresAt: string;
}

export interface VehicleTimelineRecord {
  id: string;
  title: string;
  note: string;
  date: string;
}

export interface GarageVehicleRecord {
  id: string;
  profileId: string;
  vehicleType: VehicleType;
  year: string;
  make: string;
  model: string;
  trim: string;
  nickname: string;
  stage: string;
  statusTags: string[];
  visibility: 'public' | 'private';
  description: string;
  modTags: string[];
  heroMediaId?: string;
  mediaIds: string[];
  linkedCommunityIds: string[];
  timeline: VehicleTimelineRecord[];
  featured: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ProfilePostRecord {
  id: string;
  profileId: string;
  caption: string;
  mediaIds: string[];
  pinned: boolean;
  featured: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CommunityPostRecord {
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
}

export interface ProfileLinkRecord {
  id: string;
  profileId: string;
  label: string;
  href: string;
  type: 'social' | 'build' | 'garage' | 'group' | 'other';
  createdAt: string;
  updatedAt: string;
}

export interface ShortLinkRecord {
  id: string;
  slug: string;
  targetType: LinkTargetType;
  targetId: string;
  ownerUserId: string;
  clickCount: number;
  qrScanCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface AnalyticsEventRecord {
  id: string;
  actorUserId: string | null;
  sessionKey: string;
  source: string;
  eventType: AnalyticsEventType;
  targetType: string;
  targetId: string;
  createdAt: string;
}

export interface ReportRecord {
  id: string;
  reporterUserId: string;
  targetType: 'profile' | 'community' | 'profile_post' | 'community_post' | 'media';
  targetId: string;
  reason: string;
  status: 'open' | 'resolved' | 'dismissed';
  createdAt: string;
  resolvedAt?: string;
  note?: string;
}

export interface AuditLogRecord {
  id: string;
  actorUserId: string | null;
  action: string;
  targetType: string;
  targetId: string;
  createdAt: string;
  detail?: string;
}

export interface RuntimeDb {
  site: SiteState;
  users: UserRecord[];
  sessions: SessionRecord[];
  profiles: ProfileRecord[];
  events: EventRecord[];
  eventResponses: EventResponseRecord[];
  friendRequests: FriendRequestRecord[];
  communities: CommunityRecord[];
  communityJoinRequests: CommunityJoinRequestRecord[];
  messages: CommunityMessageRecord[];
  mediaAssets: MediaAssetRecord[];
  pendingUploads: PendingUploadRecord[];
  garageVehicles: GarageVehicleRecord[];
  profilePosts: ProfilePostRecord[];
  communityPosts: CommunityPostRecord[];
  profileLinks: ProfileLinkRecord[];
  shortLinks: ShortLinkRecord[];
  analyticsEvents: AnalyticsEventRecord[];
  reports: ReportRecord[];
  auditLogs: AuditLogRecord[];
}

const DATA_DIR = path.join(process.cwd(), 'data');
const DB_PATH = path.join(DATA_DIR, 'runtime-db.json');
export const UPLOADS_DIR = path.join(DATA_DIR, 'uploads');

function defaultDb(): RuntimeDb {
  return {
    site: {
      shopLocked: true,
      maintenanceMode: false,
      registrationOpen: true,
      brandTagline: 'Private scene network for people who actually show up.',
    },
    users: [],
    sessions: [],
    profiles: [],
    events: [],
    eventResponses: [],
    friendRequests: [],
    communities: [],
    communityJoinRequests: [],
    messages: [],
    mediaAssets: [],
    pendingUploads: [],
    garageVehicles: [],
    profilePosts: [],
    communityPosts: [],
    profileLinks: [],
    shortLinks: [],
    analyticsEvents: [],
    reports: [],
    auditLogs: [],
  };
}

function ensureDirs() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  if (!fs.existsSync(UPLOADS_DIR)) fs.mkdirSync(UPLOADS_DIR, { recursive: true });
  if (!fs.existsSync(DB_PATH)) fs.writeFileSync(DB_PATH, JSON.stringify(defaultDb(), null, 2));
}

function normalizeProfile(profile: any): ProfileRecord {
  return {
    ...profile,
    about: profile.about || '',
    currentlyBuilding: profile.currentlyBuilding || '',
    sceneTags: Array.isArray(profile.sceneTags) ? profile.sceneTags : [],
    featuredVehicleId: profile.featuredVehicleId || undefined,
    featuredPostId: profile.featuredPostId || undefined,
    analyticsVisibility: profile.analyticsVisibility === 'private' ? 'private' : 'public',
  };
}

function normalizeCommunity(community: any): CommunityRecord {
  const now = community.createdAt || nowIso();
  return {
    ...community,
    adminUserIds: Array.isArray(community.adminUserIds) ? community.adminUserIds : [],
    memberUserIds: Array.isArray(community.memberUserIds) ? community.memberUserIds : [],
    region: community.region || '',
    tags: Array.isArray(community.tags) ? community.tags : [],
    rules: Array.isArray(community.rules) ? community.rules : [],
    applicationQuestions: Array.isArray(community.applicationQuestions) ? community.applicationQuestions : [],
    featuredMemberUserIds: Array.isArray(community.featuredMemberUserIds) ? community.featuredMemberUserIds : [],
    featuredVehicleIds: Array.isArray(community.featuredVehicleIds) ? community.featuredVehicleIds : [],
    featuredPostIds: Array.isArray(community.featuredPostIds) ? community.featuredPostIds : [],
    featuredEventIds: Array.isArray(community.featuredEventIds) ? community.featuredEventIds : [],
    discoverable: typeof community.discoverable === 'boolean' ? community.discoverable : true,
    createdAt: now,
    updatedAt: community.updatedAt || now,
  };
}

function normalizeVehicle(vehicle: any): GarageVehicleRecord {
  const now = vehicle.createdAt || nowIso();
  return {
    ...vehicle,
    vehicleType: ['car', 'bike', 'truck', 'other'].includes(vehicle.vehicleType) ? vehicle.vehicleType : 'car',
    year: vehicle.year || '',
    make: vehicle.make || '',
    model: vehicle.model || '',
    trim: vehicle.trim || '',
    nickname: vehicle.nickname || '',
    stage: vehicle.stage || '',
    statusTags: Array.isArray(vehicle.statusTags) ? vehicle.statusTags : [],
    visibility: vehicle.visibility === 'private' ? 'private' : 'public',
    description: vehicle.description || '',
    modTags: Array.isArray(vehicle.modTags) ? vehicle.modTags : [],
    mediaIds: Array.isArray(vehicle.mediaIds) ? vehicle.mediaIds : [],
    linkedCommunityIds: Array.isArray(vehicle.linkedCommunityIds) ? vehicle.linkedCommunityIds : [],
    timeline: Array.isArray(vehicle.timeline) ? vehicle.timeline : [],
    featured: Boolean(vehicle.featured),
    createdAt: now,
    updatedAt: vehicle.updatedAt || now,
  };
}

function normalizeDb(raw: Partial<RuntimeDb>): RuntimeDb {
  const db = { ...defaultDb(), ...raw } as RuntimeDb;
  db.profiles = (db.profiles || []).map(normalizeProfile);
  db.communities = (db.communities || []).map(normalizeCommunity);
  db.garageVehicles = (db.garageVehicles || []).map(normalizeVehicle);
  db.communityJoinRequests = (db.communityJoinRequests || []).map((item: any) => ({ ...item, answers: Array.isArray(item.answers) ? item.answers : [] }));
  db.profilePosts = (db.profilePosts || []).map((item: any) => ({ ...item, mediaIds: Array.isArray(item.mediaIds) ? item.mediaIds : [], pinned: Boolean(item.pinned), featured: Boolean(item.featured), updatedAt: item.updatedAt || item.createdAt || nowIso() }));
  db.communityPosts = (db.communityPosts || []).map((item: any) => ({ ...item, mediaIds: Array.isArray(item.mediaIds) ? item.mediaIds : [], pinned: Boolean(item.pinned), featured: Boolean(item.featured), updatedAt: item.updatedAt || item.createdAt || nowIso() }));
  db.profileLinks = (db.profileLinks || []).map((item: any) => ({ ...item, type: item.type || 'other', updatedAt: item.updatedAt || item.createdAt || nowIso() }));
  db.shortLinks = (db.shortLinks || []).map((item: any) => ({ ...item, clickCount: Number(item.clickCount || 0), qrScanCount: Number(item.qrScanCount || 0), updatedAt: item.updatedAt || item.createdAt || nowIso() }));
  db.analyticsEvents = (db.analyticsEvents || []).map((item: any) => ({ ...item, source: item.source || 'direct' }));
  db.mediaAssets = (db.mediaAssets || []).map((item: any) => ({ ...item, status: item.status || 'uploaded', updatedAt: item.updatedAt || item.createdAt || nowIso() }));
  db.pendingUploads = (db.pendingUploads || []).map((item: any) => ({ ...item, status: item.status || 'pending' }));
  db.reports = db.reports || [];
  db.auditLogs = db.auditLogs || [];
  return db;
}

export function readDb(): RuntimeDb {
  ensureDirs();
  const raw = fs.readFileSync(DB_PATH, 'utf8');
  return normalizeDb(JSON.parse(raw));
}

export function writeDb(db: RuntimeDb) {
  ensureDirs();
  fs.writeFileSync(DB_PATH, JSON.stringify(normalizeDb(db), null, 2));
}

export function mutateDb<T>(mutator: (db: RuntimeDb) => T): T {
  const db = readDb();
  const result = mutator(db);
  writeDb(db);
  return result;
}

export function nowIso() {
  return new Date().toISOString();
}

export function createId(prefix: string) {
  return `${prefix}_${crypto.randomUUID().replace(/-/g, '')}`;
}

export function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '') || 'member';
}

export function uniqueSlug(base: string, existing: string[]) {
  let candidate = slugify(base);
  let index = 2;
  while (existing.includes(candidate)) {
    candidate = `${slugify(base)}-${index}`;
    index += 1;
  }
  return candidate;
}

export function tokenHash(token: string) {
  return crypto.createHash('sha256').update(token).digest('hex');
}

export function getUserByToken(token?: string | null) {
  if (!token) return null;
  const db = readDb();
  const session = db.sessions.find((item) => item.tokenHash === tokenHash(token));
  if (!session) return null;
  const user = db.users.find((item) => item.id === session.userId);
  if (!user) return null;
  const profile = db.profiles.find((item) => item.id === user.profileId) || null;
  return { user, profile, session };
}

export function getFriendUserIds(db: RuntimeDb, userId: string) {
  return db.friendRequests
    .filter((request) => request.status === 'accepted' && (request.fromUserId === userId || request.toUserId === userId))
    .map((request) => (request.fromUserId === userId ? request.toUserId : request.fromUserId));
}

export function countMutualFriends(db: RuntimeDb, aUserId: string, bUserId: string) {
  const a = new Set(getFriendUserIds(db, aUserId));
  const b = new Set(getFriendUserIds(db, bUserId));
  let count = 0;
  a.forEach((id) => {
    if (b.has(id)) count += 1;
  });
  return count;
}

export function profileStats(db: RuntimeDb, profileId: string) {
  const profile = db.profiles.find((item) => item.id === profileId);
  if (!profile) {
    return { friendCount: 0, communityCount: 0, eventAttendanceCount: 0, vehicleCount: 0, postCount: 0 };
  }
  const friendCount = getFriendUserIds(db, profile.userId).length;
  const communityCount = db.communities.filter((community) => community.memberUserIds.includes(profile.userId)).length;
  const eventAttendanceCount = db.eventResponses.filter((response) => response.userId === profile.userId && response.status === 'attending').length;
  const vehicleCount = db.garageVehicles.filter((vehicle) => vehicle.profileId === profile.id).length;
  const postCount = db.profilePosts.filter((post) => post.profileId === profile.id).length;
  return { friendCount, communityCount, eventAttendanceCount, vehicleCount, postCount };
}

export function canManageCommunity(community: CommunityRecord, userId: string) {
  return community.ownerUserId === userId || community.adminUserIds.includes(userId);
}

export function logAudit(db: RuntimeDb, actorUserId: string | null, action: string, targetType: string, targetId: string, detail?: string) {
  db.auditLogs.unshift({
    id: createId('audit'),
    actorUserId,
    action,
    targetType,
    targetId,
    createdAt: nowIso(),
    detail,
  });
  db.auditLogs = db.auditLogs.slice(0, 300);
}

export function getMedia(db: RuntimeDb, mediaId?: string | null) {
  if (!mediaId) return null;
  return db.mediaAssets.find((item) => item.id === mediaId && item.status === 'uploaded') || null;
}

export function getMediaList(db: RuntimeDb, mediaIds: string[]) {
  return mediaIds.map((mediaId) => getMedia(db, mediaId)).filter(Boolean) as MediaAssetRecord[];
}

export function getProfileGarage(db: RuntimeDb, profileId: string, viewerUserId?: string | null) {
  const profile = db.profiles.find((item) => item.id === profileId) || null;
  const viewerIsOwner = profile ? profile.userId === viewerUserId : false;
  return db.garageVehicles
    .filter((vehicle) => vehicle.profileId === profileId)
    .filter((vehicle) => vehicle.visibility === 'public' || viewerIsOwner)
    .sort((a, b) => Number(b.featured) - Number(a.featured) || b.updatedAt.localeCompare(a.updatedAt))
    .map((vehicle) => ({
      ...vehicle,
      heroMedia: getMedia(db, vehicle.heroMediaId) || getMedia(db, vehicle.mediaIds[0]),
      media: getMediaList(db, vehicle.mediaIds),
      communities: vehicle.linkedCommunityIds.map((communityId) => db.communities.find((item) => item.id === communityId)).filter(Boolean),
    }));
}

export function getProfilePosts(db: RuntimeDb, profileId: string) {
  return db.profilePosts
    .filter((post) => post.profileId === profileId)
    .sort((a, b) => Number(b.pinned) - Number(a.pinned) || b.createdAt.localeCompare(a.createdAt))
    .map((post) => ({
      ...post,
      media: getMediaList(db, post.mediaIds),
    }));
}

export function getCommunityPosts(db: RuntimeDb, communityId: string) {
  return db.communityPosts
    .filter((post) => post.communityId === communityId)
    .sort((a, b) => Number(b.pinned) - Number(a.pinned) || Number(b.featured) - Number(a.featured) || b.createdAt.localeCompare(a.createdAt))
    .map((post) => ({
      ...post,
      media: getMediaList(db, post.mediaIds),
      authorProfile: db.profiles.find((item) => item.userId === post.authorUserId) || null,
      linkedEvent: post.linkedEventId ? db.events.find((event) => event.id === post.linkedEventId) || null : null,
    }));
}

export function getProfileShortLinks(db: RuntimeDb, profile: ProfileRecord) {
  const vehicleIds = db.garageVehicles.filter((vehicle) => vehicle.profileId === profile.id).map((vehicle) => vehicle.id);
  return db.shortLinks.filter((item) => item.targetId === profile.id || vehicleIds.includes(item.targetId));
}

export function getProfileAffiliations(db: RuntimeDb, userId: string) {
  return db.communities
    .filter((community) => community.memberUserIds.includes(userId))
    .map((community) => ({
      id: community.id,
      slug: community.slug,
      name: community.name,
      visibility: community.visibility,
      region: community.region,
      role: community.ownerUserId === userId ? 'owner' : community.adminUserIds.includes(userId) ? 'admin' : 'member',
    }));
}

export function getShortLinkBySlug(db: RuntimeDb, slug: string) {
  return db.shortLinks.find((item) => item.slug === slug) || null;
}

export function findOrCreateShortLink(db: RuntimeDb, params: { targetType: LinkTargetType; targetId: string; ownerUserId: string; preferredSlug: string }) {
  const existing = db.shortLinks.find((item) => item.targetType === params.targetType && item.targetId === params.targetId);
  if (existing) return existing;
  const slug = uniqueSlug(params.preferredSlug, db.shortLinks.map((item) => item.slug));
  const link: ShortLinkRecord = {
    id: createId('short'),
    slug,
    targetType: params.targetType,
    targetId: params.targetId,
    ownerUserId: params.ownerUserId,
    clickCount: 0,
    qrScanCount: 0,
    createdAt: nowIso(),
    updatedAt: nowIso(),
  };
  db.shortLinks.push(link);
  return link;
}

export function trackAnalyticsEvent(db: RuntimeDb, event: Omit<AnalyticsEventRecord, 'id' | 'createdAt'>) {
  db.analyticsEvents.unshift({
    id: createId('metric'),
    createdAt: nowIso(),
    ...event,
  });
  db.analyticsEvents = db.analyticsEvents.slice(0, 5000);
}

export function dayKey(iso: string) {
  return iso.slice(0, 10);
}

export function aggregateCountByDay(events: AnalyticsEventRecord[], days = 14) {
  const today = new Date();
  const points: Array<{ date: string; count: number }> = [];
  for (let offset = days - 1; offset >= 0; offset -= 1) {
    const date = new Date(today);
    date.setUTCDate(today.getUTCDate() - offset);
    const label = date.toISOString().slice(0, 10);
    points.push({ date: label, count: 0 });
  }
  const map = new Map(points.map((point) => [point.date, point]));
  events.forEach((event) => {
    const key = dayKey(event.createdAt);
    const point = map.get(key);
    if (point) point.count += 1;
  });
  return points;
}

export function uniqueVisitors(events: AnalyticsEventRecord[]) {
  return new Set(events.map((event) => event.sessionKey)).size;
}

export function hashVisitorKey(input: string) {
  return crypto.createHash('sha256').update(input).digest('hex');
}

export function removeMediaFile(storageKey?: string) {
  if (!storageKey) return;
  const filePath = path.join(UPLOADS_DIR, storageKey);
  if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
}
