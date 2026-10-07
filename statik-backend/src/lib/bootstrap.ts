import { env } from './env';
import { hashPassword } from './auth';
import { createId, logAudit, mutateDb, nowIso, readDb, slugify, uniqueSlug } from './store';

export function ensureBootstrapAdmin() {
  const email = env.ADMIN_EMAIL?.trim().toLowerCase();
  const password = env.ADMIN_PASSWORD;
  const displayName = env.ADMIN_DISPLAY_NAME?.trim() || 'STATIK Admin';
  const production = env.NODE_ENV === 'production';

  if (production && !env.UPLOAD_SIGNING_SECRET) {
    throw new Error('UPLOAD_SIGNING_SECRET must be set before starting the production service.');
  }

  const existingDb = readDb();
  const hasAdmin = existingDb.users.some((user) => user.role === 'admin');

  if (!email && !password) {
    if (production && !hasAdmin) {
      throw new Error('No production administrator exists. Set ADMIN_EMAIL and ADMIN_PASSWORD before starting the service.');
    }
    if (!hasAdmin) {
      console.warn('[bootstrap-admin] No admin exists yet. Public registrations will remain standard users; configure ADMIN_EMAIL and ADMIN_PASSWORD to create an administrator.');
    }
    return;
  }

  if (!email || !password) {
    if (production && !hasAdmin) {
      throw new Error('ADMIN_EMAIL and ADMIN_PASSWORD must both be set before starting production without an existing administrator.');
    }
    console.warn('[bootstrap-admin] ADMIN_EMAIL and ADMIN_PASSWORD must both be set. Skipping admin bootstrap.');
    return;
  }

  const existingUser = existingDb.users.find((item) => item.email.toLowerCase() === email);

  if (existingUser) {
    if (existingUser.role !== 'admin') {
      mutateDb((db) => {
        const user = db.users.find((item) => item.id === existingUser.id);
        if (!user) return;
        user.role = 'admin';
        logAudit(db, user.id, 'bootstrap_admin_promoted', 'user', user.id, 'Promoted to admin from environment bootstrap');
      });
      console.log(`[bootstrap-admin] Promoted existing user ${email} to admin.`);
    } else {
      console.log(`[bootstrap-admin] Admin account already exists for ${email}.`);
    }
    return;
  }

  mutateDb((db) => {
    const userId = createId('user');
    const profileId = createId('profile');
    const createdAt = nowIso();
    const slug = uniqueSlug(displayName || slugify(email.split('@')[0]), db.profiles.map((item) => item.slug));

    db.profiles.push({
      id: profileId,
      userId,
      slug,
      displayName,
      bio: '',
      location: '',
      primaryCar: '',
      avatarUrl: '',
      bannerUrl: '',
      verified: false,
      featured: false,
      promoted: false,
      about: '',
      currentlyBuilding: '',
      sceneTags: [],
      analyticsVisibility: 'public',
      createdAt,
    });

    db.users.push({
      id: userId,
      email,
      passwordHash: hashPassword(password),
      displayName,
      role: 'admin',
      profileId,
      createdAt,
    });

    logAudit(db, userId, 'bootstrap_admin_created', 'user', userId, 'Created from ADMIN_EMAIL/ADMIN_PASSWORD environment variables');
  });

  console.log(`[bootstrap-admin] Seeded admin account for ${email}.`);
}
