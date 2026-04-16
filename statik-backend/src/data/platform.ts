export const platformEvents = [
  {
    id: 'evt-1',
    slug: 'midnight-pit-session',
    name: 'Midnight Pit Session',
    location: 'Brisbane Workshop District',
    date: '2026-04-24',
    time: '7:30 PM',
    description: 'STATIK hosts a night meet built around feature cars, filming zones, and moderated community showcase lanes.',
    category: 'Meet',
    heroImage: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1400&q=80',
    organizer: 'STATIK',
    source: 'internal',
    sourceLabel: 'STATIK official',
    approvalStatus: 'approved',
    featured: true,
  },
  {
    id: 'evt-2',
    slug: 'trackside-creator-grid',
    name: 'Trackside Creator Grid',
    location: 'Willowbank, QLD',
    date: '2026-05-16',
    time: '8:00 AM',
    description: 'Approved creators receive track access, QR signage, and dedicated media windows.',
    category: 'Track Day',
    heroImage: 'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&w=1400&q=80',
    organizer: 'STATIK Culture Team',
    source: 'scraper',
    sourceLabel: 'External source / approved',
    approvalStatus: 'approved',
    featured: false,
  },
];

export const platformPosts = [
  {
    id: 'post-1',
    slug: 'statik-season-launch',
    title: 'STATIK Season Launch',
    excerpt: 'We rebuilt the platform around events, profiles, and live culture.',
    body: 'Events are the engine. Updates are the feed. Profiles are the identity layer.',
    createdAt: '2026-04-10T18:00:00.000Z',
    category: 'Announcement',
    pinned: true,
    featured: true,
    likes: 312,
    comments: 28,
  },
];

export const platformProfiles = [
  {
    id: 'profile-1',
    slug: 'amintvt',
    displayName: 'amintvt',
    bio: 'Builder, filmer, and community anchor.',
    location: 'Brisbane, AU',
    primaryCar: 'Nissan Silvia S15',
    featured: true,
  },
  {
    id: 'profile-2',
    slug: 'nightapex',
    displayName: 'nightapex',
    bio: 'Trackside portraiture and event recap edits.',
    location: 'Gold Coast, AU',
    primaryCar: 'Toyota GR86',
    featured: false,
  },
];

export const platformSubmissions = [
  {
    id: 'sub-1',
    title: 'Willowbank privateer showcase',
    type: 'event',
    status: 'pending',
    submittedBy: 'nightapex',
    submittedAt: '2026-04-13T11:20:00.000Z',
  },
];

export const platformSummary = {
  stats: {
    approvedProfiles: 318,
    pendingModeration: 42,
    importedEvents: 14,
    sponsoredRevenue: 7800,
  },
};
