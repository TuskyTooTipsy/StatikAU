export type UserRole = 'guest' | 'user' | 'moderator' | 'admin' | 'super-admin';

export interface Announcement {
  id: string;
  title: string;
  body: string;
  tone: 'info' | 'warning' | 'success';
  ctaLabel?: string;
  ctaHref?: string;
}

export interface EventItem {
  id: string;
  slug: string;
  name: string;
  location: string;
  date: string;
  time: string;
  description: string;
  category: string;
  heroImage: string;
  organizer: string;
  source: string;
  sourceLabel: string;
  approvalStatus: 'approved' | 'pending' | 'rejected';
  featured?: boolean;
  sponsored?: boolean;
  recurring?: boolean;
  past?: boolean;
  tags: string[];
  attendanceLabel: string;
}

export interface OfficialPostMedia {
  id: string;
  type: 'image' | 'video';
  url: string;
  poster?: string;
}

export interface OfficialPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  body: string;
  createdAt: string;
  pinned?: boolean;
  featured?: boolean;
  category: string;
  media: OfficialPostMedia[];
  likes: number;
  comments: number;
  partner?: string;
}

export interface ProfileLink {
  id: string;
  label: string;
  href: string;
  clicks: number;
  type: 'social' | 'build' | 'partner' | 'media';
}

export interface GarageVehicle {
  id: string;
  name: string;
  chassis: string;
  power: string;
  setup: string;
  image: string;
}

export interface ProfileMedia {
  id: string;
  type: 'image' | 'video';
  url: string;
  caption: string;
}

export interface Profile {
  id: string;
  slug: string;
  displayName: string;
  avatar: string;
  banner: string;
  bio: string;
  location: string;
  primaryCar: string;
  sponsors: string[];
  socials: { platform: string; handle: string; url: string }[];
  links: ProfileLink[];
  garage: GarageVehicle[];
  media: ProfileMedia[];
  analytics: {
    profileViews: number;
    qrVisits: number;
    linkClicks: number;
    engagementRate: string;
  };
  featured?: boolean;
}

export interface SubmissionItem {
  id: string;
  title: string;
  type: 'event' | 'gallery' | 'video' | 'spotlight' | 'sponsor' | 'deal';
  status: 'pending' | 'approved' | 'revisions' | 'rejected';
  submittedBy: string;
  submittedAt: string;
  notes: string;
}

export interface AdminMetric {
  label: string;
  value: string;
  delta?: string;
}

export interface SearchResult {
  id: string;
  type: 'event' | 'profile' | 'post' | 'product' | 'submission';
  title: string;
  description: string;
  href: string;
  image?: string;
}

export interface SiteConfig {
  maintenanceMode: boolean;
  maintenanceMessage: string;
  pausedFor: string;
}
