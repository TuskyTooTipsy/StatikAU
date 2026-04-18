import type { FormEvent } from 'react';
import { useMemo, useState } from 'react';
import DashboardShell from '../../components/platform/DashboardShell';
import { accountNav } from '../../data/platform';
import { networkApi } from '../../api/network';
import { uploadMediaFile } from '../../api/uploads';
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
    about: viewerProfile?.about || '',
    currentlyBuilding: viewerProfile?.currentlyBuilding || '',
    sceneTags: (viewerProfile?.sceneTags || []).join(', '),
    analyticsVisibility: viewerProfile?.analyticsVisibility || 'public' as 'public' | 'private',
  });
  const [message, setMessage] = useState<string | null>(null);
  const [uploading, setUploading] = useState({ avatar: 0, banner: 0 });

  const tagsPreview = useMemo(() => form.sceneTags.split(',').map((item) => item.trim()).filter(Boolean), [form.sceneTags]);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    try {
      const profile = await networkApi.updateMyProfile({
        ...form,
        sceneTags: tagsPreview,
      });
      if (viewerUser && site) {
        applyAuthPayload({ user: viewerUser, profile, site });
      }
      setMessage('Profile updated.');
    } catch (err: any) {
      setMessage(err.message);
    }
  }

  async function handleMediaUpload(kind: 'avatar' | 'banner', file?: File | null) {
    if (!file || !viewerProfile) return;
    try {
      setMessage(null);
      const uploaded = await uploadMediaFile(file, 'profile', viewerProfile.id, (value) => setUploading((prev) => ({ ...prev, [kind]: value })));
      setForm((prev) => ({ ...prev, [`${kind}Url`]: uploaded.url } as typeof prev));
      setUploading((prev) => ({ ...prev, [kind]: 100 }));
    } catch (error: any) {
      setMessage(error.message || 'Upload failed');
      setUploading((prev) => ({ ...prev, [kind]: 0 }));
    }
  }

  return (
    <DashboardShell eyebrow="Members / profile" title="Machine identity" nav={accountNav}>
      <div className="panel-cut space-y-6 p-6 md:p-8">
        <div className="grid gap-5 md:grid-cols-2">
          <div className="space-y-3">
            <label className="eyebrow">Avatar</label>
            {form.avatarUrl ? <img src={form.avatarUrl} alt="Avatar" className="h-28 w-28 border border-white/10 object-cover" style={{ clipPath: 'polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px))' }} /> : <div className="panel-blade text-sm text-silver/60">No avatar uploaded yet.</div>}
            <input type="file" accept="image/*,video/*" className="field-sharp" onChange={(e) => handleMediaUpload('avatar', e.target.files?.[0])} />
            {uploading.avatar > 0 && uploading.avatar < 100 ? <p className="text-xs uppercase tracking-[0.22em] text-silver/56">Uploading {uploading.avatar}%</p> : null}
          </div>
          <div className="space-y-3">
            <label className="eyebrow">Cover</label>
            {form.bannerUrl ? <img src={form.bannerUrl} alt="Banner" className="h-28 w-full border border-white/10 object-cover" style={{ clipPath: 'polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px))' }} /> : <div className="panel-blade text-sm text-silver/60">No cover uploaded yet.</div>}
            <input type="file" accept="image/*,video/*" className="field-sharp" onChange={(e) => handleMediaUpload('banner', e.target.files?.[0])} />
            {uploading.banner > 0 && uploading.banner < 100 ? <p className="text-xs uppercase tracking-[0.22em] text-silver/56">Uploading {uploading.banner}%</p> : null}
          </div>
        </div>

        <form className="grid gap-4" onSubmit={handleSubmit}>
          <div className="grid gap-4 md:grid-cols-2">
            <input className="field-sharp" placeholder="Display name" value={form.displayName} onChange={(e) => setForm({ ...form, displayName: e.target.value })} required />
            <input className="field-sharp" placeholder="Location / region" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <input className="field-sharp" placeholder="Primary machine" value={form.primaryCar} onChange={(e) => setForm({ ...form, primaryCar: e.target.value })} />
            <input className="field-sharp" placeholder="Currently building" value={form.currentlyBuilding} onChange={(e) => setForm({ ...form, currentlyBuilding: e.target.value })} />
          </div>
          <textarea className="field-sharp min-h-[120px]" placeholder="Short bio" value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} />
          <textarea className="field-sharp min-h-[160px]" placeholder="Build philosophy / owner note / profile intro" value={form.about} onChange={(e) => setForm({ ...form, about: e.target.value })} />
          <input className="field-sharp" placeholder="Scene tags, comma separated" value={form.sceneTags} onChange={(e) => setForm({ ...form, sceneTags: e.target.value })} />
          <select className="field-sharp" value={form.analyticsVisibility} onChange={(e) => setForm({ ...form, analyticsVisibility: e.target.value as 'public' | 'private' })}>
            <option value="public">Public analytics summary</option>
            <option value="private">Private analytics</option>
          </select>
          {tagsPreview.length ? <div className="flex flex-wrap gap-2">{tagsPreview.map((tag) => <span key={tag} className="status-chip">{tag}</span>)}</div> : null}
          <button className="btn-primary h-12 justify-center text-[11px]">Save profile</button>
          {message ? <p className="text-sm text-silver/70">{message}</p> : null}
        </form>
      </div>
    </DashboardShell>
  );
}
