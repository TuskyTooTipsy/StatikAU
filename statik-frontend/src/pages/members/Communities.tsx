import type { FormEvent } from 'react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import EmptyPanel from '../../components/EmptyPanel';
import { networkApi } from '../../api/network';
import type { CommunityPreview } from '../../types/network';

export default function CommunitiesPage() {
  const [communities, setCommunities] = useState<CommunityPreview[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({ name: '', description: '', visibility: 'public' as 'public' | 'private', avatarUrl: '', bannerUrl: '' });

  async function load() {
    try {
      setCommunities(await networkApi.listCommunities());
    } catch (err: any) {
      setError(err.message);
    }
  }

  useEffect(() => { load(); }, []);

  async function handleCreate(event: FormEvent) {
    event.preventDefault();
    try {
      await networkApi.createCommunity(form);
      setForm({ name: '', description: '', visibility: 'public', avatarUrl: '', bannerUrl: '' });
      load();
    } catch (err: any) {
      setError(err.message);
    }
  }

  async function handleMembership(community: CommunityPreview) {
    try {
      if (community.isMember) await networkApi.leaveCommunity(community.id);
      else await networkApi.joinCommunity(community.id);
      load();
    } catch (err: any) {
      setError(err.message);
    }
  }

  return (
    <div className="shell space-y-8 pb-16 pt-8">
      <div className="page-hero-cut p-6 md:p-8">
        <p className="eyebrow">Communities</p>
        <h1 className="headline-lg mt-3">Create the group layer around real cars, builds, and local culture.</h1>
        <p className="body-muted mt-4">Public communities can be joined directly. Private communities are real private spaces and must add members intentionally.</p>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.02fr_0.98fr]">
        <div className="panel-cut p-6 md:p-8">
          <p className="eyebrow">Available communities</p>
          <div className="mt-6 grid gap-4">
            {communities.length ? communities.map((community) => (
              <div key={community.id} className="panel-blade">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <h3>{community.name}</h3>
                    <p className="mt-3 text-sm leading-7 text-silver/72">{community.description}</p>
                    <p className="mt-3 text-xs uppercase tracking-[0.22em] text-silver/56">{community.memberCount} members • {community.visibility}</p>
                  </div>
                  <div className="grid gap-3">
                    <Link to={`/members/communities/${community.slug}`} className="btn-secondary h-10 px-4 text-[11px] justify-center">Open</Link>
                    <button type="button" onClick={() => handleMembership(community)} className="btn-primary h-10 px-4 text-[11px]">{community.isMember ? 'Leave' : 'Join'}</button>
                  </div>
                </div>
              </div>
            )) : <EmptyPanel eyebrow="Communities" title="No communities yet" body="Create the first community to start the culture layer on the inside." />}
          </div>
        </div>

        <div className="panel-cut p-6 md:p-8">
          <p className="eyebrow">Create community</p>
          <form className="mt-6 grid gap-4" onSubmit={handleCreate}>
            <input className="field-sharp" placeholder="Community name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required minLength={2} />
            <textarea className="field-sharp min-h-[140px]" placeholder="Describe the community" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required minLength={10} />
            <select className="field-sharp" value={form.visibility} onChange={(e) => setForm({ ...form, visibility: e.target.value as 'public' | 'private' })}>
              <option value="public">Public</option>
              <option value="private">Private</option>
            </select>
            <input className="field-sharp" placeholder="Avatar image URL (optional)" value={form.avatarUrl} onChange={(e) => setForm({ ...form, avatarUrl: e.target.value })} />
            <input className="field-sharp" placeholder="Banner image URL (optional)" value={form.bannerUrl} onChange={(e) => setForm({ ...form, bannerUrl: e.target.value })} />
            <button className="btn-primary h-12 justify-center text-[11px]" type="submit">Create community</button>
          </form>
        </div>
      </div>

      {error ? <p className="text-sm text-[#ff8f8f]">{error}</p> : null}
    </div>
  );
}
