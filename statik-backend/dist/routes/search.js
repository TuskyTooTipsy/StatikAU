"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = searchRouter;
const express_1 = require("express");
const store_1 = require("../lib/store");
function searchRouter() {
    const router = (0, express_1.Router)();
    router.get('/', async (req, res) => {
        const q = typeof req.query.q === 'string' ? req.query.q.trim().toLowerCase() : '';
        if (!q)
            return res.json([]);
        const db = (0, store_1.readDb)();
        const activeUserIds = new Set(db.users.filter((user) => !user.banned && !user.suspendedUntil).map((user) => user.id));
        const publishedContent = (0, store_1.getPublishedContent)(db);
        const results = [
            ...db.events.filter((event) => event.approvalStatus === 'approved' && `${event.name} ${event.location} ${event.description} ${event.category}`.toLowerCase().includes(q)).map((event) => ({ id: event.id, type: 'event', title: event.name, description: event.location, href: `/events/${event.slug}` })),
            ...db.profiles.filter((profile) => activeUserIds.has(profile.userId) && profile.discoveryVisible !== false && `${profile.displayName} ${profile.bio} ${profile.location} ${profile.memberType || ''}`.toLowerCase().includes(q)).map((profile) => ({ id: profile.id, type: 'profile', title: profile.displayName, description: profile.bio || 'STATIK member', href: `/profiles/${profile.slug}` })),
            ...db.communities.filter((community) => community.visibility === 'public' && community.discoverable !== false && `${community.name} ${community.description} ${community.region} ${community.tags?.join(' ') || ''}`.toLowerCase().includes(q)).map((community) => ({ id: community.id, type: 'community', title: community.name, description: community.description, href: `/members/communities/${community.slug}` })),
            ...publishedContent.filter((item) => `${item.title} ${item.excerpt} ${item.category} ${item.tags.join(' ')}`.toLowerCase().includes(q)).map((item) => ({ id: item.id, type: item.type, title: item.title, description: item.excerpt, href: `/${item.type === 'article' ? 'articles' : 'news'}/${item.slug}` })),
            ...db.businessListings.filter((business) => business.status === 'approved' && `${business.businessName} ${business.description} ${business.category} ${business.subcategories.join(' ')} ${business.region}`.toLowerCase().includes(q)).map((business) => ({ id: business.id, type: 'business', title: business.businessName, description: business.region || business.category, href: `/businesses/${business.slug}` })),
        ].slice(0, 30);
        return res.json(results);
    });
    return router;
}
