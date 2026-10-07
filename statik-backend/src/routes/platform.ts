import { Router } from 'express';
import { requireAuth } from '../lib/auth';
import { countMutualFriends, getFriendUserIds, getMediaList, getProfileGarage, getPublishedContent, mapBusinessPublic, mapContentPublic, profileStats, readDb } from '../lib/store';

function mapProfileCard(db: ReturnType<typeof readDb>, profile: any, viewerUserId?: string) {
  const stats = profileStats(db, profile.id);
  return {
    ...profile,
    stats,
    mutualFriends: viewerUserId ? countMutualFriends(db, profile.userId, viewerUserId) : 0,
  };
}

function mapCommunityPreview(community: any, viewerUserId?: string) {
  return {
    id: community.id,
    slug: community.slug,
    name: community.name,
    description: community.description,
    visibility: community.visibility,
    avatarUrl: community.avatarUrl,
    bannerUrl: community.bannerUrl,
    region: community.region,
    tags: community.tags,
    memberCount: community.memberUserIds.length,
    isMember: viewerUserId ? community.memberUserIds.includes(viewerUserId) : false,
  };
}

function eventCounts(db: ReturnType<typeof readDb>, eventId: string) {
  const responses = db.eventResponses.filter((response) => response.eventId === eventId);
  return {
    attending: responses.filter((item) => item.status === 'attending').length,
    interested: responses.filter((item) => item.status === 'interested').length,
    maybe: responses.filter((item) => item.status === 'maybe').length,
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

    const approvedEvents = db.events.filter((event) => event.approvalStatus === 'approved');
    const featuredEvents = approvedEvents
      .filter((event) => event.featured || event.sponsored || event.sourceType === 'statik_hosted')
      .sort((a, b) => a.date.localeCompare(b.date))
      .slice(0, 6)
      .map((event) => ({ ...event, counts: eventCounts(db, event.id), media: getMediaList(db, event.mediaIds || []) }));

    const publicCommunities = db.communities
      .filter((community) => community.visibility === 'public' && community.discoverable)
      .sort((a, b) => b.memberUserIds.length - a.memberUserIds.length)
      .slice(0, 5)
      .map((community) => mapCommunityPreview(community));

    const upcoming = approvedEvents
      .filter((event) => !event.date || event.date >= new Date().toISOString().slice(0, 10))
      .sort((a, b) => a.date.localeCompare(b.date));

    const eventCategories = Object.entries(
      upcoming.reduce((acc: Record<string, number>, event) => {
        acc[event.category] = (acc[event.category] || 0) + 1;
        return acc;
      }, {}),
    )
      .map(([label, count]) => ({ label, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 8);

    const newestMembers = db.profiles
      .filter((profile) => db.site.newestMembersEnabled !== false && profile.discoveryVisible !== false && profile.newestMemberVisible !== false)
      .filter((profile) => {
        const user = db.users.find((item) => item.id === profile.userId);
        if (!user || user.isBanned) return false;
        if (user.suspensionEndsAt && new Date(user.suspensionEndsAt).getTime() > Date.now()) return false;
        if (db.site.newestMembersRequireCompleteProfile && !profile.profileComplete) return false;
        return true;
      })
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
      .slice(0, 6)
      .map((profile) => {
        const garage = getProfileGarage(db, profile.id, null);
        return { ...mapProfileCard(db, profile), location: profile.showLocation === false ? '' : profile.location, featuredVehicle: garage.find((vehicle: any) => vehicle.featured) || garage[0] || null };
      });

    const latestArticles = db.site.articlesEnabled === false ? [] : getPublishedContent(db, 'article').slice(0, 3).map((item) => mapContentPublic(db, item));
    const latestNews = db.site.newsEnabled === false ? [] : getPublishedContent(db, 'news').slice(0, 3).map((item) => mapContentPublic(db, item));
    const trustedBusinesses = db.site.businessDirectoryEnabled === false ? [] : db.businessListings
      .filter((business) => business.status === 'approved' && (business.trusted || business.sponsored || business.featured))
      .sort((a, b) => Number(b.sponsored) - Number(a.sponsored) || Number(b.featured) - Number(a.featured) || b.updatedAt.localeCompare(a.updatedAt))
      .slice(0, 4)
      .map((business) => mapBusinessPublic(db, business));

    return res.json({
      site: db.site,
      featuredProfiles,
      featuredEvents,
      flagshipEvents: upcoming.filter((event) => event.featured || event.sponsored).slice(0, 4).map((event) => ({ ...event, counts: eventCounts(db, event.id), media: getMediaList(db, event.mediaIds || []) })),
      upcomingEvents: upcoming.slice(0, 8).map((event) => ({ ...event, counts: eventCounts(db, event.id), media: getMediaList(db, event.mediaIds || []) })),
      eventCategories,
      publicCommunities,
      newestMembers,
      latestArticles,
      latestNews,
      trustedBusinesses,
      counts: {
        approvedEvents: approvedEvents.length,
        publicCommunities: db.communities.filter((community) => community.visibility === 'public' && community.discoverable).length,
        sponsoredEvents: approvedEvents.filter((event) => event.sponsored).length,
        newestMembers: newestMembers.length,
        publishedArticles: db.contentItems.filter((item) => item.type === 'article' && item.status === 'published').length,
        publishedNews: db.contentItems.filter((item) => item.type === 'news' && item.status === 'published').length,
        approvedBusinesses: db.businessListings.filter((item) => item.status === 'approved').length,
      },
      foundingPhase: db.users.length < 25,
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
      .filter((community) => (community.memberUserIds.includes(viewer.user.id) || community.visibility === 'public') && community.discoverable)
      .slice(0, 8)
      .map((community) => mapCommunityPreview(community, viewer.user.id));

    const pendingRequests = db.friendRequests.filter((request) => request.toUserId === viewer.user.id && request.status === 'pending').length;

    const newestMembers = db.profiles
      .filter((profile) => db.site.newestMembersEnabled !== false && profile.discoveryVisible !== false && profile.newestMemberVisible !== false)
      .filter((profile) => {
        const user = db.users.find((item) => item.id === profile.userId);
        if (!user || user.isBanned) return false;
        if (user.suspensionEndsAt && new Date(user.suspensionEndsAt).getTime() > Date.now()) return false;
        if (db.site.newestMembersRequireCompleteProfile && !profile.profileComplete) return false;
        return true;
      })
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
      .slice(0, 6)
      .map((profile) => {
        const garage = getProfileGarage(db, profile.id, null);
        return { ...mapProfileCard(db, profile), location: profile.showLocation === false ? '' : profile.location, featuredVehicle: garage.find((vehicle: any) => vehicle.featured) || garage[0] || null };
      });

    const latestArticles = db.site.articlesEnabled === false ? [] : getPublishedContent(db, 'article').slice(0, 3).map((item) => mapContentPublic(db, item));
    const latestNews = db.site.newsEnabled === false ? [] : getPublishedContent(db, 'news').slice(0, 3).map((item) => mapContentPublic(db, item));
    const trustedBusinesses = db.site.businessDirectoryEnabled === false ? [] : db.businessListings
      .filter((business) => business.status === 'approved' && (business.trusted || business.sponsored || business.featured))
      .sort((a, b) => Number(b.sponsored) - Number(a.sponsored) || Number(b.featured) - Number(a.featured) || b.updatedAt.localeCompare(a.updatedAt))
      .slice(0, 4)
      .map((business) => mapBusinessPublic(db, business));

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
        vehicles: db.garageVehicles.filter((vehicle) => vehicle.profileId === viewer.profile.id).length,
        posts: db.profilePosts.filter((post) => post.profileId === viewer.profile.id).length,
      },
    });
  });

  return router;
}
