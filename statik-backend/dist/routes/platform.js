"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = platformRouter;
const express_1 = require("express");
const auth_1 = require("../lib/auth");
const store_1 = require("../lib/store");
function mapProfileCard(db, profile, viewerUserId) {
    const stats = (0, store_1.profileStats)(db, profile.id);
    return {
        ...profile,
        stats,
        mutualFriends: viewerUserId ? (0, store_1.countMutualFriends)(db, profile.userId, viewerUserId) : 0,
    };
}
function mapCommunityPreview(community) {
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
function platformRouter() {
    const router = (0, express_1.Router)();
    router.get('/public', async (_req, res) => {
        const db = (0, store_1.readDb)();
        const featuredProfiles = db.profiles
            .filter((profile) => profile.featured || profile.verified || profile.promoted)
            .sort((a, b) => {
            const aStats = (0, store_1.profileStats)(db, a.id);
            const bStats = (0, store_1.profileStats)(db, b.id);
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
    router.get('/member-home', auth_1.requireAuth, async (req, res) => {
        const db = (0, store_1.readDb)();
        const viewer = req.viewer;
        const friendIds = new Set((0, store_1.getFriendUserIds)(db, viewer.user.id));
        const suggestedProfiles = db.profiles
            .filter((profile) => profile.userId !== viewer.user.id && !friendIds.has(profile.userId))
            .sort((a, b) => {
            const aScore = Number(a.verified) + Number(a.featured) + (0, store_1.profileStats)(db, a.id).friendCount;
            const bScore = Number(b.verified) + Number(b.featured) + (0, store_1.profileStats)(db, b.id).friendCount;
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
                friends: (0, store_1.getFriendUserIds)(db, viewer.user.id).length,
                communities: db.communities.filter((community) => community.memberUserIds.includes(viewer.user.id)).length,
                attending: db.eventResponses.filter((item) => item.userId === viewer.user.id && item.status === 'attending').length,
            },
        });
    });
    return router;
}
