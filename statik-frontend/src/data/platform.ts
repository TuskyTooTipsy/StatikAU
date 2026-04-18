import type {
  AdminMetric,
  Announcement,
  EventItem,
  OfficialPost,
  Profile,
  SearchResult,
  SiteConfig,
  SubmissionItem,
} from '../types/platform';

export const siteConfig: SiteConfig = {
  maintenanceMode: false,
  maintenanceMessage: 'STATIK is in controlled service mode. Public publishing is paused while moderation and data systems are being serviced.',
  pausedFor: 'non-admin users',
};

export const announcements: Announcement[] = [
  {
    id: 'ann-1',
    title: 'Performance Pulse weekend submissions are open',
    body: 'Submit your car, booth, or promo placement now. All entries go through admin review before they are published.',
    tone: 'warning',
    ctaLabel: 'Submit now',
    ctaHref: '/submit',
  },
  {
    id: 'ann-2',
    title: 'STATIK profiles now support QR links',
    body: 'Use your profile on stickers, windows, event boards, and paddock signage to turn real-world attention into digital traffic.',
    tone: 'info',
    ctaLabel: 'Explore profiles',
    ctaHref: '/community',
  },
];

export const events: EventItem[] = [
  {
    id: 'evt-1',
    slug: 'midnight-pit-session',
    name: 'Midnight Pit Session',
    location: 'Brisbane Workshop District',
    date: '2026-04-24',
    time: '7:30 PM',
    description:
      'STATIK hosts a night meet built around feature cars, controlled filming zones, partner activations, and a moderated community showcase lane.',
    category: 'Meet',
    heroImage: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1400&q=80',
    organizer: 'STATIK',
    source: 'internal',
    sourceLabel: 'STATIK official',
    approvalStatus: 'approved',
    featured: true,
    tags: ['night', 'meet', 'feature-cars'],
    attendanceLabel: '420 expected',
  },
  {
    id: 'evt-2',
    slug: 'blacktop-outlaws-watch-party',
    name: 'Blacktop Outlaws Watch Party',
    location: 'Gold Coast Industrial Estate',
    date: '2026-05-03',
    time: '6:00 PM',
    description:
      'A partner-backed social night with screened race footage, panel conversation, and a curated profile QR wall for local builders and creators.',
    category: 'Community',
    heroImage: 'https://images.unsplash.com/photo-1493238792000-8113da705763?auto=format&fit=crop&w=1400&q=80',
    organizer: 'STATIK x Growl Racing',
    source: 'partner-import',
    sourceLabel: 'Imported / approved',
    approvalStatus: 'approved',
    sponsored: true,
    tags: ['partner', 'screening', 'networking'],
    attendanceLabel: 'Sponsored placement',
  },
  {
    id: 'evt-3',
    slug: 'trackside-creator-grid',
    name: 'Trackside Creator Grid',
    location: 'Willowbank, QLD',
    date: '2026-05-16',
    time: '8:00 AM',
    description:
      'A profile-first attendance program where approved creators receive track access, QR signage, and dedicated media windows for reels and stills.',
    category: 'Track Day',
    heroImage: 'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&w=1400&q=80',
    organizer: 'STATIK Culture Team',
    source: 'scraped-qld-raceway',
    sourceLabel: 'External source / approved',
    approvalStatus: 'approved',
    tags: ['track', 'creator', 'media'],
    attendanceLabel: 'Applications live',
  },
  {
    id: 'evt-4',
    slug: 'late-apex-social',
    name: 'Late Apex Social',
    location: 'Sunshine Coast, QLD',
    date: '2026-03-22',
    time: '5:30 PM',
    description:
      'A smaller sunset-to-night social focused on community introductions, live partner pitches, and moderated user content capture.',
    category: 'Cruise',
    heroImage: 'https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=1400&q=80',
    organizer: 'STATIK Community',
    source: 'user-submission',
    sourceLabel: 'User submitted / approved',
    approvalStatus: 'approved',
    past: true,
    tags: ['social', 'sunset', 'community'],
    attendanceLabel: 'Archive',
  },
  {
    id: 'evt-5',
    slug: 'garage-tactics-workshop',
    name: 'Garage Tactics Workshop',
    location: 'Ipswich, QLD',
    date: '2026-06-07',
    time: '1:00 PM',
    description:
      'Workshop-floor learning session covering camera setups, sponsor decks, QR placement, and how to build a profile that converts attention.',
    category: 'Workshop',
    heroImage: 'https://images.unsplash.com/photo-1489824904134-891ab64532f1?auto=format&fit=crop&w=1400&q=80',
    organizer: 'STATIK x Partner Network',
    source: 'internal',
    sourceLabel: 'STATIK official',
    approvalStatus: 'approved',
    tags: ['workshop', 'profiles', 'sponsors'],
    attendanceLabel: '90 seats',
  },
];

export const officialPosts: OfficialPost[] = [
  {
    id: 'post-1',
    slug: 'statik-season-launch',
    title: 'STATIK Season Launch: events first, shop second, culture always.',
    excerpt: 'We rebuilt the platform around events, profiles, and live culture rather than treating apparel as the whole business.',
    body:
      'STATIK now behaves like a full culture platform. Events are the engine. Updates are the feed. Profiles are the identity layer. The shop still matters, but it lives inside a bigger world built for people who actually show up.',
    createdAt: '2026-04-10T18:00:00.000Z',
    pinned: true,
    featured: true,
    category: 'Announcement',
    media: [
      {
        id: 'post-1-media-1',
        type: 'image',
        url: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=1400&q=80',
      },
    ],
    likes: 312,
    comments: 28,
  },
  {
    id: 'post-2',
    slug: 'creator-profiles-live',
    title: 'Creator-style profile pages are live with QR, analytics, and garage builds.',
    excerpt: 'Your car can now point people somewhere real: a clean profile with links, garage details, media, and sponsor-ready analytics.',
    body:
      'Profiles are built for the real world. Put the QR on a car, helmet case, stand, or event board. Let people scan, discover the build, hit your socials, and move deeper into the wider STATIK ecosystem.',
    createdAt: '2026-04-12T09:30:00.000Z',
    category: 'Profiles',
    media: [
      {
        id: 'post-2-media-1',
        type: 'image',
        url: '/brand/profile-reference.png',
      },
    ],
    likes: 184,
    comments: 19,
    partner: 'STATIK identity system',
  },
  {
    id: 'post-3',
    slug: 'partner-grid-open',
    title: 'Partner grid and promoted event placements are now open.',
    excerpt: 'Brands can apply for featured event slots, profile boosts, official update placements, and real lead capture through the platform.',
    body:
      'The monetization model now goes beyond apparel. Promoted events, sponsor placements, brand deal intake, profile visibility packages, and premium community submissions all feed the system without overwhelming the public experience.',
    createdAt: '2026-04-13T13:00:00.000Z',
    category: 'Partners',
    media: [
      {
        id: 'post-3-media-1',
        type: 'image',
        url: 'https://images.unsplash.com/photo-1517520287167-4bbf64a00d66?auto=format&fit=crop&w=1400&q=80',
      },
    ],
    likes: 96,
    comments: 11,
  },
];

export const profiles: Profile[] = [
  {
    id: 'profile-1',
    slug: 'amintvt',
    displayName: 'amintvt',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
    banner: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=1600&q=80',
    bio: 'Builder, filmer, and community anchor. Focused on clean Japanese chassis, workshop storytelling, and turning real-world presence into digital identity.',
    location: 'Brisbane, AU',
    primaryCar: 'Nissan Silvia S15',
    sponsors: ['STATIK', 'Blacktop Supply', 'Nightlane Studios'],
    socials: [
      { platform: 'Instagram', handle: '@justamintvt', url: 'https://instagram.com' },
      { platform: 'TikTok', handle: '@justamintvt', url: 'https://tiktok.com' },
    ],
    links: [
      { id: 'link-1', label: 'Build breakdown', href: '#build', clicks: 312, type: 'build' },
      { id: 'link-2', label: 'Book filming', href: '#book', clicks: 178, type: 'media' },
      { id: 'link-3', label: 'Main Instagram', href: 'https://instagram.com', clicks: 611, type: 'social' },
    ],
    garage: [
      {
        id: 'car-1',
        name: 'S15 Spec-R',
        chassis: 'Nissan Silvia S15',
        power: '420whp',
        setup: 'Street / track hybrid, aero-front, coilover, forged wheel setup',
        image: 'https://images.unsplash.com/photo-1486496572940-2bb2341fdbdf?auto=format&fit=crop&w=1200&q=80',
      },
    ],
    media: [
      { id: 'media-1', type: 'image', url: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80', caption: 'Night wash session' },
      { id: 'media-2', type: 'image', url: 'https://images.unsplash.com/photo-1493238792000-8113da705763?auto=format&fit=crop&w=1200&q=80', caption: 'Workshop floor still' },
      { id: 'media-3', type: 'video', url: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4', caption: 'Rig test clip' },
    ],
    analytics: {
      profileViews: 3054,
      qrVisits: 912,
      linkClicks: 1101,
      engagementRate: '18.4%',
    },
    featured: true,
  },
  {
    id: 'profile-2',
    slug: 'nightapex',
    displayName: 'nightapex',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80',
    banner: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1600&q=80',
    bio: 'Trackside portraiture, high-shutter rollers, and event recap edits built for teams, brands, and drivers.',
    location: 'Gold Coast, AU',
    primaryCar: 'Toyota GR86',
    sponsors: ['STATIK', 'Apex Lighting'],
    socials: [
      { platform: 'Instagram', handle: '@nightapex.media', url: 'https://instagram.com' },
      { platform: 'YouTube', handle: 'Night Apex', url: 'https://youtube.com' },
    ],
    links: [
      { id: 'link-4', label: 'Media kit', href: '#media-kit', clicks: 209, type: 'partner' },
      { id: 'link-5', label: 'Book event coverage', href: '#book-coverage', clicks: 154, type: 'media' },
    ],
    garage: [
      {
        id: 'car-2',
        name: 'GR86 Daily',
        chassis: 'Toyota GR86',
        power: 'NA street setup',
        setup: 'Clean daily + content car with wheel and suspension package',
        image: 'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&w=1200&q=80',
      },
    ],
    media: [
      { id: 'media-4', type: 'image', url: 'https://images.unsplash.com/photo-1517520287167-4bbf64a00d66?auto=format&fit=crop&w=1200&q=80', caption: 'Grid walk capture' },
      { id: 'media-5', type: 'image', url: 'https://images.unsplash.com/photo-1517438476312-10d79c077509?auto=format&fit=crop&w=1200&q=80', caption: 'Brand deal shoot' },
    ],
    analytics: {
      profileViews: 2140,
      qrVisits: 488,
      linkClicks: 702,
      engagementRate: '14.2%',
    },
  },
  {
    id: 'profile-3',
    slug: 'boostandbrew',
    displayName: 'boostandbrew',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80',
    banner: 'https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=1600&q=80',
    bio: 'Cafe operator, event partner, and community host connecting late-night meets with clean hospitality and sponsor integrations.',
    location: 'Ipswich, AU',
    primaryCar: 'Mazda RX-7 FD',
    sponsors: ['Boost & Brew', 'STATIK'],
    socials: [
      { platform: 'Instagram', handle: '@boostandbrew', url: 'https://instagram.com' },
    ],
    links: [
      { id: 'link-6', label: 'Book the venue', href: '#venue', clicks: 189, type: 'partner' },
      { id: 'link-7', label: 'Community event menu', href: '#menu', clicks: 91, type: 'media' },
    ],
    garage: [
      {
        id: 'car-3',
        name: 'FD3S',
        chassis: 'Mazda RX-7 FD',
        power: 'Single turbo street setup',
        setup: 'Show-grade engine bay, polished intake path, trackside detailing',
        image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80',
      },
    ],
    media: [
      { id: 'media-6', type: 'image', url: 'https://images.unsplash.com/photo-1494905998402-395d579af36f?auto=format&fit=crop&w=1200&q=80', caption: 'Venue night' },
      { id: 'media-7', type: 'image', url: 'https://images.unsplash.com/photo-1489824904134-891ab64532f1?auto=format&fit=crop&w=1200&q=80', caption: 'Workshop detail' },
    ],
    analytics: {
      profileViews: 1488,
      qrVisits: 301,
      linkClicks: 411,
      engagementRate: '11.9%',
    },
  },
];

export const submissions: SubmissionItem[] = [
  {
    id: 'sub-1',
    title: 'Willowbank privateer showcase',
    type: 'event',
    status: 'pending',
    submittedBy: 'nightapex',
    submittedAt: '2026-04-13T11:20:00.000Z',
    notes: 'Awaiting admin review for location verification and hero media approval.',
  },
  {
    id: 'sub-2',
    title: 'S15 rig reel cut',
    type: 'video',
    status: 'revisions',
    submittedBy: 'amintvt',
    submittedAt: '2026-04-12T07:05:00.000Z',
    notes: 'Trim runtime to under 30 seconds and swap copyrighted audio.',
  },
  {
    id: 'sub-3',
    title: 'Performance shop sponsor feature',
    type: 'sponsor',
    status: 'approved',
    submittedBy: 'boostandbrew',
    submittedAt: '2026-04-11T16:00:00.000Z',
    notes: 'Approved for partner rail placement on event detail pages.',
  },
];

export const adminMetrics: AdminMetric[] = [
  { label: 'Pending moderation', value: '42', delta: '+8 today' },
  { label: 'Approved profiles', value: '318', delta: '+12 this week' },
  { label: 'Imported events staged', value: '14', delta: '2 duplicate conflicts' },
  { label: 'Sponsored placements', value: '$7.8k', delta: '+21% MoM' },
];

export const adminQueues = {
  users: [
    ['amintvt', 'Active admin', '3,054 profile views'],
    ['nightapex', 'Featured creator', '2 sponsor requests'],
    ['boostandbrew', 'Partner', 'Venue inquiry live'],
  ],
  imports: [
    ['Queensland Raceway calendar adapter', 'Last run: 08:10', '3 new, 1 duplicate'],
    ['Growl Racing events adapter', 'Last run: 08:14', '2 new staged'],
    ['Manual CSV import', 'Queued', 'awaiting moderation'],
  ],
  reports: [
    ['Comment report #184', 'Flagged language', 'needs moderator'],
    ['Profile report #221', 'Incorrect sponsor claim', 'under review'],
    ['Media report #228', 'copyright concern', 'hold publish'],
  ],
};

export const partnerPlacements = [
  {
    title: 'Promoted event module',
    body: 'Premium placement on event lists, detail pages, and the homepage event rail.',
  },
  {
    title: 'Featured profile package',
    body: 'Boost a builder, creator, or business profile with homepage and community visibility.',
  },
  {
    title: 'Brand deal intake',
    body: 'Collect creator applications, partner interest, and sponsor opportunities in one moderated funnel.',
  },
];

export const searchIndex: SearchResult[] = [
  ...events.map((event) => ({
    id: event.id,
    type: 'event' as const,
    title: event.name,
    description: `${event.category} • ${event.location} • ${event.sourceLabel}`,
    href: `/events/${event.slug}`,
    image: event.heroImage,
  })),
  ...profiles.map((profile) => ({
    id: profile.id,
    type: 'profile' as const,
    title: profile.displayName,
    description: `${profile.location} • ${profile.primaryCar}`,
    href: `/u/${profile.slug}`,
    image: profile.avatar,
  })),
  ...officialPosts.map((post) => ({
    id: post.id,
    type: 'post' as const,
    title: post.title,
    description: post.excerpt,
    href: `/updates`,
    image: post.media[0]?.url,
  })),
  ...submissions.map((submission) => ({
    id: submission.id,
    type: 'submission' as const,
    title: submission.title,
    description: `${submission.type} • ${submission.status}`,
    href: '/account/submissions',
  })),
];

export const platformSummary = {
  headline: 'STATIK is now the operating system for the scene.',
  subheadline:
    'Events drive discovery, profiles give people identity, updates keep the culture alive, and the shop becomes one monetization layer inside a bigger platform.',
  stats: [
    { value: '38', label: 'approved events in the next 90 days' },
    { value: '318', label: 'approved public profiles' },
    { value: '14.8k', label: 'monthly profile link clicks' },
    { value: '7', label: 'active sponsor placement lanes' },
  ],
};

export const accountNav = [
  { label: 'Profile', href: '/members/profile' },
  { label: 'Garage', href: '/members/garage' },
  { label: 'Posts', href: '/members/posts' },
  { label: 'Links', href: '/members/links' },
  { label: 'QR + share', href: '/members/qr' },
  { label: 'Analytics', href: '/members/analytics' },
];

export const adminNav = [
  { label: 'Admin Overview', href: '/admin' },
  { label: 'Users', href: '/admin/users' },
  { label: 'Events', href: '/admin/events' },
  { label: 'Event Imports', href: '/admin/imports' },
  { label: 'Official Posts', href: '/admin/posts' },
  { label: 'Community Submissions', href: '/admin/submissions' },
  { label: 'Comments / Reports', href: '/admin/reports' },
  { label: 'Sponsors / Deals', href: '/admin/sponsors' },
  { label: 'Shop Control', href: '/admin/shop' },
  { label: 'Announcements', href: '/admin/announcements' },
  { label: 'Analytics', href: '/admin/analytics' },
  { label: 'Site Settings', href: '/admin/settings' },
  { label: 'Roles / Permissions', href: '/admin/roles' },
  { label: 'Audit Logs', href: '/admin/audit-logs' },
];

export const brandAnalysisPath = '/design/brand-analysis.json';
