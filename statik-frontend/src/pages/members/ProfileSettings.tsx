import type { FormEvent } from 'react';
import { useState } from 'react';
import { networkApi } from '../../api/network';
import { useSessionStore } from '../../store/session';

export default function ProfileSettingsPage() {
  const viewerProfile = useSessionStore((state) => state.viewerProfile);
  const applyAuthPayload = useSessionStore((state) => state.applyAuthPayload);
  const viewerUser = useSessionStore((state) => state.viewerUser);
  const site = useSessionStore((state) => state.site);
  const [form, setForm] = useState({
    displayName: viewerProfile?.displayName || '',
    bio: viewerProfile?.bio || '',
    location: viewerProfile?.location || '',
    primaryCar: viewerProfile?.primaryCar || '',
    avatarUrl: viewerProfile?.avatarUrl || '',
    bannerUrl: viewerProfile?.bannerUrl || '',
  });
  const [message, setMessage] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    try {
      const profile = await networkApi.updateMyProfile(form);
      if (viewerUser && site) {
        applyAuthPayload({ user: viewerUser, profile, site });
      }
      setMessage('Profile updated.');
    } catch (err: any) {
      setMessage(err.message);
    }
  }

  return (
    <div className="shell py-8">
      <div className="mx-auto max-w-3xl page-hero-cut p-6 md:p-8">
        <p className="eyebrow">My profile</p>
        <h1 className="headline-lg mt-3">Control how you appear inside the network.</h1>
        <form className="mt-8 grid gap-4" onSubmit={handleSubmit}>
          <input className="field-sharp" placeholder="Display name" value={form.displayName} onChange={(e) => setForm({ ...form, displayName: e.target.value })} required />
          <textarea className="field-sharp min-h-[140px]" placeholder="Bio" value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} />
          <input className="field-sharp" placeholder="Location" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
          <input className="field-sharp" placeholder="Primary car" value={form.primaryCar} onChange={(e) => setForm({ ...form, primaryCar: e.target.value })} />
          <input className="field-sharp" placeholder="Avatar URL" value={form.avatarUrl} onChange={(e) => setForm({ ...form, avatarUrl: e.target.value })} />
          <input className="field-sharp" placeholder="Banner URL" value={form.bannerUrl} onChange={(e) => setForm({ ...form, bannerUrl: e.target.value })} />
          <button className="btn-primary h-12 justify-center text-[11px]">Save profile</button>
          {message ? <p className="text-sm text-silver/70">{message}</p> : null}
        </form>
      </div>
    </div>
  );
}
