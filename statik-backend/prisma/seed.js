"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function main() {
    // Seed products with sample data
    const products = [
        {
            title: 'Die-cut Sticker',
            slug: 'die-cut-sticker',
            shortDesc: 'Premium vinyl die-cut STATIK sticker.',
            description: 'Show your allegiance to the culture with our premium die-cut STATIK sticker. Perfect for windshields, laptops, and toolboxes.',
            price: 5.0,
            compareAt: null,
            tags: ['accessory'],
            images: {
                create: [
                    { url: '/images/die-cut-sticker-1.jpg', alt: 'Die-cut sticker', position: 0 },
                ],
            },
        },
        {
            title: 'Statik Tee',
            slug: 'statik-tee',
            shortDesc: 'Heavyweight unisex tee with subtle STATIK branding.',
            description: 'Our heavyweight tee is crafted from premium cotton for a structured fit. Subtle branding keeps it low-key yet unmistakably STATIK.',
            price: 45.0,
            compareAt: 55.0,
            tags: ['apparel'],
            images: {
                create: [
                    { url: '/images/statik-tee-1.jpg', alt: 'Statik Tee front', position: 0 },
                ],
            },
        },
        {
            title: 'Statik Shorts',
            slug: 'statik-shorts',
            shortDesc: 'Comfortable shorts designed for the urban racer.',
            description: 'These shorts blend performance materials with STATIK aesthetics. Perfect for track days and casual wear.',
            price: 50.0,
            compareAt: 60.0,
            tags: ['apparel'],
            images: {
                create: [
                    { url: '/images/statik-shorts-1.jpg', alt: 'Statik Shorts', position: 0 },
                ],
            },
        },
        {
            title: 'Statik Pack',
            slug: 'statik-pack',
            shortDesc: 'Everyday carry pack for the modern driver.',
            description: 'A versatile pack built with durable materials and minimalist STATIK branding. Fits your essentials for the road.',
            price: 80.0,
            compareAt: 90.0,
            tags: ['accessory'],
            images: {
                create: [
                    { url: '/images/statik-pack-1.jpg', alt: 'Statik Pack', position: 0 },
                ],
            },
        },
        {
            title: 'Cuffed Beanie',
            slug: 'cuffed-beanie',
            shortDesc: 'Warm cuffed beanie with woven STATIK label.',
            description: 'Stay warm and sharp with our cuffed beanie. The woven STATIK label keeps it premium and understated.',
            price: 30.0,
            compareAt: 35.0,
            tags: ['accessory'],
            images: {
                create: [
                    { url: '/images/cuffed-beanie-1.jpg', alt: 'Cuffed Beanie', position: 0 },
                ],
            },
        },
        {
            title: 'Statik Uni-Sex Heavy Weight Hoodie',
            slug: 'statik-hoodie',
            shortDesc: 'Oversized heavyweight hoodie with bold STATIK marks.',
            description: 'An oversized hoodie crafted from heavyweight fleece, featuring bold STATIK graphics and a luxuriously soft interior.',
            price: 90.0,
            compareAt: 100.0,
            tags: ['apparel'],
            images: {
                create: [
                    { url: '/images/statik-hoodie-1.jpg', alt: 'Statik Hoodie front', position: 0 },
                ],
            },
        },
    ];
    for (const product of products) {
        await prisma.product.upsert({
            where: { slug: product.slug },
            update: {},
            create: product,
        });
    }
}
main()
    .catch((e) => {
    console.error(e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
