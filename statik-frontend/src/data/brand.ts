import type { CollectionDefinition } from '../types/catalog';

export const trustPoints = [
  { title: 'Australia to Everywhere', body: 'Premium streetwear rooted in Australian car culture and built to travel globally.' },
  { title: 'Engineered Drops', body: 'Small-batch collections with sharp category edits instead of cluttered catalogue noise.' },
  { title: 'Secure Checkout', body: 'Clear support pages, protected checkout flows, and transparent post-purchase expectations.' },
  { title: 'Refined Quality', body: 'Heavyweight silhouettes, durable trims, and understated graphics designed to age well.' },
];

export const shopCollections: CollectionDefinition[] = [
  {
    slug: 'new-arrivals',
    label: 'New Arrivals',
    eyebrow: 'Freshly loaded',
    description: 'The latest pieces cut for late-night drives, pit-lane mornings, and the space between work and the weekend.',
    href: '/shop/new-arrivals',
    filters: { tags: ['new'] },
    image: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=1200&q=80',
    accent: 'from-blood/30 via-transparent to-transparent',
  },
  {
    slug: 'best-sellers',
    label: 'Best Sellers',
    eyebrow: 'Culture staples',
    description: 'The pieces the community keeps coming back to: heavyweight essentials, clean graphics, and daily carries.',
    href: '/shop/best-sellers',
    filters: { tags: ['best-seller'] },
    image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80',
    accent: 'from-uv/40 via-transparent to-transparent',
  },
  {
    slug: 'tees',
    label: 'Tees',
    eyebrow: 'Core layers',
    description: 'Heavy cotton silhouettes built for heat, motion, and effortless layering around the scene.',
    href: '/shop/tees',
    filters: { tags: ['tees'] },
    image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1200&q=80',
    accent: 'from-white/10 via-transparent to-transparent',
  },
  {
    slug: 'hoodies',
    label: 'Hoodies',
    eyebrow: 'After-dark weight',
    description: 'Structured fleece and oversized cuts built for cold starts, warehouse meets, and night sessions.',
    href: '/shop/hoodies',
    filters: { tags: ['hoodies'] },
    image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1200&q=80',
    accent: 'from-blood/20 via-transparent to-transparent',
  },
  {
    slug: 'shoes',
    label: 'Shoes',
    eyebrow: 'Next drop',
    description: 'Footwear and trackside-ready moves are being built now. Join the list for first access when the category opens.',
    href: '/shop/shoes',
    filters: { tags: ['shoes'] },
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1200&q=80',
    accent: 'from-uv/35 via-transparent to-transparent',
    comingSoon: true,
  },
  {
    slug: 'accessories',
    label: 'Accessories',
    eyebrow: 'Carry and finish',
    description: 'Bags, headwear, stickers, and small accessories that complete the uniform without overplaying it.',
    href: '/shop/accessories',
    filters: { tags: ['accessories'] },
    image: 'https://images.unsplash.com/photo-1523398002811-999ca8dec234?auto=format&fit=crop&w=1200&q=80',
    accent: 'from-white/10 via-transparent to-transparent',
  },
  {
    slug: 'men',
    label: 'Men',
    eyebrow: 'Fit edit',
    description: 'Pieces tagged for the men’s edit, plus utility-led silhouettes that sit naturally inside the STATIK uniform.',
    href: '/shop/men',
    filters: { tags: ['men'] },
    image: 'https://images.unsplash.com/photo-1517438476312-10d79c077509?auto=format&fit=crop&w=1200&q=80',
    accent: 'from-blood/25 via-transparent to-transparent',
  },
  {
    slug: 'women',
    label: 'Women',
    eyebrow: 'Capsule incoming',
    description: 'The women’s capsule is being assembled with the same sharp restraint and engineered silhouettes as the core line.',
    href: '/shop/women',
    filters: { tags: ['women'] },
    image: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=1200&q=80',
    accent: 'from-uv/35 via-transparent to-transparent',
    comingSoon: true,
  },
  {
    slug: 'unisex',
    label: 'Unisex',
    eyebrow: 'Shared uniform',
    description: 'The backbone of the range: oversized layers and accessories designed to work across the entire culture.',
    href: '/shop/unisex',
    filters: { tags: ['unisex'] },
    image: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=1200&q=80',
    accent: 'from-white/10 via-transparent to-transparent',
  },
  {
    slug: 'featured-drop',
    label: 'Featured Drop',
    eyebrow: 'Night Shift 01',
    description: 'A disciplined first-world collection cut around graphite tones, sharp layering, and late-night movement.',
    href: '/shop/featured-drop',
    filters: { tags: ['featured-drop'], collection: ['night-shift-01'] },
    image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80',
    accent: 'from-blood/30 via-transparent to-transparent',
  },
  {
    slug: 'sale',
    label: 'Sale',
    eyebrow: 'Rare markdowns',
    description: 'When a piece moves here, it is a final chance rather than a permanent discount rack.',
    href: '/shop/sale',
    filters: { tags: ['sale'] },
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=1200&q=80',
    accent: 'from-blood/25 via-transparent to-transparent',
    comingSoon: true,
  },
  {
    slug: 'all-products',
    label: 'All Products',
    eyebrow: 'Full catalogue',
    description: 'Everything currently live across apparel, accessories, and the active STATIK drop.',
    href: '/shop',
    filters: {},
    image: 'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&w=1200&q=80',
    accent: 'from-white/10 via-transparent to-transparent',
  },
];

export const navGroups = {
  featured: ['new-arrivals', 'best-sellers', 'featured-drop'],
  categories: ['tees', 'hoodies', 'accessories', 'shoes'],
  fits: ['men', 'women', 'unisex'],
};

export const brandPillars = [
  {
    title: 'Who We Are',
    body: 'STATIK is a premium automotive streetwear and media label built for people who actually live the scene. The brand sits where apparel, machine aesthetics, midnight movement, and community identity overlap.',
  },
  {
    title: 'What STATIK Stands For',
    body: 'Clarity over chaos. Quality over noise. Real culture over spectatorship. Every page, garment, and campaign should feel restrained, confident, and mechanically precise.',
  },
  {
    title: 'Why We Build',
    body: 'Because car culture has always deserved garments that feel as intentional as the machines and images that inspire it. STATIK is built to give that culture a sharper uniform.',
  },
  {
    title: 'Built in Australia, worn anywhere',
    body: 'The perspective is local, the visual language is global, and the ambition is to create a brand world that travels without losing its roots.',
  },
];

export const communityHighlights = [
  {
    title: 'Night Run Frames',
    copy: 'Campaign cuts that pair structured garments with sodium-lit roads, body lines, and late-hour stillness.',
    image: 'https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=1200&q=80',
    tag: 'Campaign',
  },
  {
    title: 'Built Not Borrowed',
    copy: 'Driver and build spotlights focused on the people shaping their cars and their visual identity with equal intent.',
    image: 'https://images.unsplash.com/photo-1494905998402-395d579af36f?auto=format&fit=crop&w=1200&q=80',
    tag: 'Community',
  },
  {
    title: 'Garage to Grid',
    copy: 'Editorial modules designed to feel like a premium social feed, without leaning on noisy embeds or borrowed clout.',
    image: 'https://images.unsplash.com/photo-1489824904134-891ab64532f1?auto=format&fit=crop&w=1200&q=80',
    tag: 'Media',
  },
];

export const faqItems = [
  {
    question: 'How long does order processing take?',
    answer: 'Most orders are processed within two to five business days. During launches, featured drops, or heavy traffic windows, that timeline may stretch slightly, but the order status and dispatch timing should always stay clear.',
  },
  {
    question: 'Do you ship internationally?',
    answer: 'Yes. STATIK is built in Australia and intended to travel. Shipping speeds vary by region, but every order receives tracking once it moves from packing to carrier handoff.',
  },
  {
    question: 'Are your drops limited?',
    answer: 'Selected pieces and featured collections are released in controlled runs. When a product is tagged as part of a drop, restocks are never guaranteed.',
  },
  {
    question: 'Can I return or exchange an item?',
    answer: 'If an item arrives damaged, incorrect, or defective, contact support promptly with your order details and images. For general change-of-mind requests, approval depends on item condition and local consumer law.',
  },
  {
    question: 'How should I choose sizing?',
    answer: 'Use the fit notes on each product page first. STATIK pieces are intentionally cut with structure in mind, so some items sit oversized, while others are kept sharper through the shoulders and body.',
  },
  {
    question: 'Do you take collaborations or media enquiries?',
    answer: 'Yes, but selectively. Use the contact form and choose the most relevant context for your message. Brand alignment, quality, and culture fit matter more than volume.',
  },
];

export const shippingPoints = [
  'Orders are typically processed within 2–5 business days before dispatch.',
  'Tracking is supplied once the shipment has been packed, labelled, and accepted by the carrier.',
  'Australian deliveries usually land sooner than international orders, but all destinations depend on carrier network volume and customs movement.',
  'During launches and featured drops, premium presentation and careful packing take priority over rushed handling.',
];

export const returnPoints = [
  'If the wrong item arrives, or the product is damaged in transit, reach out within 14 days with order details and clear photos.',
  'For unworn items in original condition, change-of-mind returns are reviewed case by case in line with local law and release type.',
  'Limited drop pieces, final markdowns, and opened accessories may be excluded from return or exchange unless there is a fault.',
  'Approved returns should be packed cleanly and sent back with the original garment presentation where possible.',
];
