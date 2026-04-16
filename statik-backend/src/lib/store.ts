import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

export type Role = 'user' | 'admin';
export type EventStatus = 'pending' | 'approved' | 'rejected';
export type RSVPStatus = 'interested' | 'attending' | 'maybe';
export type CommunityVisibility = 'public' | 'private';
export type MessageType = 'text' | 'event' | 'location';

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
  createdAt: string;
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
  messages: CommunityMessageRecord[];
  auditLogs: AuditLogRecord[];
}

const DATA_DIR = path.join(process.cwd(), 'data');
const DB_PATH = path.join(DATA_DIR, 'runtime-db.json');

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
    messages: [],
    auditLogs: [],
  };
}

function ensureDbFile() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  if (!fs.existsSync(DB_PATH)) {
    fs.writeFileSync(DB_PATH, JSON.stringify(defaultDb(), null, 2));
  }
}

export function readDb(): RuntimeDb {
  ensureDbFile();
  const raw = fs.readFileSync(DB_PATH, 'utf8');
  return { ...defaultDb(), ...JSON.parse(raw) } as RuntimeDb;
}

export function writeDb(db: RuntimeDb) {
  ensureDbFile();
  fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2));
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
    return { friendCount: 0, communityCount: 0, eventAttendanceCount: 0 };
  }
  const friendCount = getFriendUserIds(db, profile.userId).length;
  const communityCount = db.communities.filter((community) => community.memberUserIds.includes(profile.userId)).length;
  const eventAttendanceCount = db.eventResponses.filter((response) => response.userId === profile.userId && response.status === 'attending').length;
  return { friendCount, communityCount, eventAttendanceCount };
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
  db.auditLogs = db.auditLogs.slice(0, 200);
}
