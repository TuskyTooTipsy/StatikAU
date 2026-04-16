import { Router } from 'express';
import { requireAuth } from '../lib/auth';
import { countMutualFriends, getFriendUserIds, profileStats, readDb } from '../lib/store';

function mapProfileCard(db: ReturnType<typeof readDb>, profile: any, viewerUserId?: string) {
  const stats = profileStats(db, profile.id);
  return {
    ...profile,
    stats,
    mutualFriends: viewerUserId ? countMutualFriends(db, profile.userId, viewerUserId) : 0,
  };
}

function mapCommunityPreview(community: any) {
  return {
    id: community.id,
    slug: community.slug,
    name: community.name,
    description: community.description,
    visibility: community.visibility,
    avatarUrl: community.avatarUrl,
    bannerUrl: community.bannerUrl,
    memberCount: community.memberUserIds.length,
  };
}

export default function platformRouter() {
  const router = Router();

  router.get('/public', async (_req, res) => {
    const db = readDb();
    const featuredProfiles = db.profiles
      .filter((profile) => profile.featured || profile.verified || profile.promoted)
      .sort((a, b) => {
        const aStats = profileStats(db, a.id);
        const bStats = profileStats(db, b.id);
        return (Number(b.promoted) - Number(a.promoted)) || (Number(b.featured) - Number(a.featured)) || (bStats.friendCount - aStats.friendCount);
      })
      .slice(0, 6)
      .map((profile) => mapProfileCard(db, profile));

    const featuredEvents = db.events
      .filter((event) => event.approvalStatus === 'approved' && event.featured)
      .sort((a, b) => a.date.localeCompare(b.date))
      .slice(0, 6)
      .map((event) => {
        const responses = db.eventResponses.filter((response) => response.eventId === event.id);
        return {
          ...event,
          counts: {
            attending: responses.filter((item) => item.status === 'attending').length,
            interested: responses.filter((item) => item.status === 'interested').length,
            maybe: responses.filter((item) => item.status === 'maybe').length,
          },
        };
      });

    const publicCommunities = db.communities
      .filter((community) => community.visibility === 'public')
      .sort((a, b) => b.memberUserIds.length - a.memberUserIds.length)
      .slice(0, 5)
      .map(mapCommunityPreview);

    return res.json({
      site: db.site,
      featuredProfiles,
      featuredEvents,
      publicCommunities,
      counts: {
        members: db.users.length,
        approvedEvents: db.events.filter((event) => event.approvalStatus === 'approved').length,
        publicCommunities: db.communities.filter((community) => community.visibility === 'public').length,
      },
      foundingPhase: db.users.length < 25,
      needsAdminBootstrap: db.users.length === 0,
    });
  });

  router.get('/member-home', requireAuth, async (req, res) => {
    const db = readDb();
    const viewer = (req as any).viewer;
    const friendIds = new Set(getFriendUserIds(db, viewer.user.id));

    const suggestedProfiles = db.profiles
      .filter((profile) => profile.userId !== viewer.user.id && !friendIds.has(profile.userId))
      .sort((a, b) => {
        const aScore = Number(a.verified) + Number(a.featured) + profileStats(db, a.id).friendCount;
        const bScore = Number(b.verified) + Number(b.featured) + profileStats(db, b.id).friendCount;
        return bScore - aScore;
      })
      .slice(0, 8)
      .map((profile) => mapProfileCard(db, profile, viewer.user.id));

    const communities = db.communities
      .filter((community) => community.memberUserIds.includes(viewer.user.id) || community.visibility === 'public')
      .slice(0, 8)
      .map(mapCommunityPreview);

    const pendingRequests = db.friendRequests.filter((request) => request.toUserId === viewer.user.id && request.status === 'pending').length;

    return res.json({
      site: db.site,
      suggestedProfiles,
      communities,
      pendingRequests,
      upcomingEvents: db.events
        .filter((event) => event.approvalStatus === 'approved')
        .sort((a, b) => a.date.localeCompare(b.date))
        .slice(0, 8),
      myCounts: {
        friends: getFriendUserIds(db, viewer.user.id).length,
        communities: db.communities.filter((community) => community.memberUserIds.includes(viewer.user.id)).length,
        attending: db.eventResponses.filter((item) => item.userId === viewer.user.id && item.status === 'attending').length,
      },
    });
  });

  return router;
}
