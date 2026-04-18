import type { ChangeEvent, FormEvent } from 'react';
import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import EmptyPanel from '../../components/EmptyPanel';
import AvatarBadge from '../../components/AvatarBadge';
import { uploadMediaFile } from '../../api/uploads';
import { networkApi } from '../../api/network';
import { useSessionStore } from '../../store/session';
import type { CommunityPreview } from '../../types/network';

type CreateCommunityForm = {
  name: string;
  description: string;
  visibility: 'public' | 'private';
  region: string;
  tags: string;
  rules: string;
  applicationQuestions: string;
  discoverable: boolean;
};

const initialForm: CreateCommunityForm = {
  name: '',
  description: '',
  visibility: 'public',
  region: '',
  tags: '',
  rules: '',
  applicationQuestions: '',
  discoverable: true,
};

function splitLines(value: string) {
  return value
    .split(/\n|,/)
    .map((item) => item.trim())
    .filter(Boolean);
}

export default function CommunitiesPage() {
  const viewerProfile = useSessionStore((state) => state.viewerProfile);
  const [communities, setCommunities] = useState<CommunityPreview[]>([]);
  const [form, setForm] = useState<CreateCommunityForm>(initialForm);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [avatarProgress, setAvatarProgress] = useState(0);
  const [bannerProgress, setBannerProgress] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [requestDrafts, setRequestDrafts] = useState<Record<string, string[]>>({});
  const [error, setError] = useState<string | null>(null);

  async function load() {
    try {
      setError(null);
      setCommunities(await networkApi.listCommunities());
    } catch (err: any) {
      setError(err.message);
    }
  }

  useEffect(() => {
    load();
  }, []);

  const joinedCommunities = useMemo(
    () => communities.filter((community) => community.isMember),
    [communities],
  );

  const discoverableCommunities = useMemo(
    () => communities,
    [communities],
  );

  async function handleMembership(community: CommunityPreview) {
    try {
      setError(null);
      if (community.isMember) {
        await networkApi.leaveCommunity(community.id);
      } else if (community.visibility === 'private') {
        await networkApi.requestCommunityAccess(community.id, (requestDrafts[community.id] || []).filter((item) => item.trim()));
      } else {
        await networkApi.joinCommunity(community.id);
      }
      await load();
    } catch (err: any) {
      setError(err.message);
    }
  }

  async function handleCreate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError(null);
    setAvatarProgress(0);
    setBannerProgress(0);
    try {
      const created = await networkApi.createCommunity({
        name: form.name,
        description: form.description,
        visibility: form.visibility,
        region: form.region.trim(),
        tags: splitLines(form.tags).slice(0, 8),
        rules: splitLines(form.rules).slice(0, 6),
        applicationQuestions: splitLines(form.applicationQuestions).slice(0, 4),
        discoverable: form.discoverable,
        avatarUrl: '',
        bannerUrl: '',
      });

      const patchPayload: { avatarUrl?: string; bannerUrl?: string } = {};
      if (avatarFile) {
        const avatar = await uploadMediaFile(avatarFile, 'community', created.id, setAvatarProgress);
        patchPayload.avatarUrl = avatar.url;
      }
      if (bannerFile) {
        const banner = await uploadMediaFile(bannerFile, 'community', created.id, setBannerProgress);
        patchPayload.bannerUrl = banner.url;
      }
      if (patchPayload.avatarUrl || patchPayload.bannerUrl) {
        await networkApi.updateCommunity(created.id, patchPayload);
      }

      setForm(initialForm);
      setAvatarFile(null);
      setBannerFile(null);
      setAvatarProgress(0);
      setBannerProgress(0);
      await load();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  function handleFile(event: ChangeEvent<HTMLInputElement>, setter: (file: File | null) => void) {
    setter(event.target.files?.[0] || null);
  }

  return (
    <div className="shell space-y-8 pb-16 pt-8">
      <div className="page-hero-cut p-6 md:p-8 xl:p-10">
        <div className="grid gap-8 xl:grid-cols-[1.05fr_0.95fr] xl:items-end">
          <div>
            <p className="eyebrow">Groups / crews / communities</p>
            <h1 className="headline-lg mt-3">Turn groups into real scene identities, not bland categories.</h1>
            <p className="body-muted mt-4 max-w-3xl">
              Each group is a real page with membership state, media, hosted events, featured members, highlighted builds, and admin-controlled visibility.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="stat-block"><span className="stat-value">{communities.length}</span><span className="stat-label">discoverable rooms</span></div>
            <div className="stat-block"><span className="stat-value">{joinedCommunities.length}</span><span className="stat-label">you are in</span></div>
            <div className="stat-block"><span className="stat-value">{communities.filter((community) => community.isAdmin).length}</span><span className="stat-label">you manage</span></div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.02fr_0.98fr]">
        <div className="panel-cut p-6 md:p-8">
          <div className="flex items-end justify-between gap-3">
            <div>
              <p className="eyebrow">Crew registry</p>
              <h2 className="headline-md mt-3">Join what fits your scene, or start the one that does not exist yet.</h2>
            </div>
            <span className="text-[11px] uppercase tracking-[0.24em] text-silver/56">{discoverableCommunities.length} visible now</span>
          </div>

          <div className="mt-6 grid gap-4">
            {discoverableCommunities.length ? discoverableCommunities.map((community) => (
              <div key={community.id} className="panel-blade">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <AvatarBadge name={community.name} src={community.avatarUrl} size="lg" />
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h3>{community.name}</h3>
                        <span className="status-chip">{community.visibility}</span>
                        {community.isAdmin ? <span className="status-chip">managed</span> : null}
                        {community.hasPendingRequest ? <span className="status-chip">request pending</span> : null}
                      </div>
                      <p className="mt-3 text-sm leading-7 text-silver/72">{community.description}</p>
                      <div className="mt-4 flex flex-wrap gap-3 text-xs uppercase tracking-[0.22em] text-silver/56">
                        <span>{community.memberCount} members</span>
                        {community.region ? <span>{community.region}</span> : null}
                        {(community.tags || []).slice(0, 4).map((tag) => <span key={tag}>{tag}</span>)}
                      </div>
                      {community.visibility === 'private' && !community.isMember && !community.hasPendingRequest && (community.applicationQuestions || []).length ? (
                        <div className="mt-4 grid gap-3">
                          {community.applicationQuestions?.map((question, index) => (
                            <label key={`${community.id}-${index}`} className="grid gap-2 text-sm text-silver/70">
                              <span>{question}</span>
                              <input
                                className="field-sharp"
                                value={(requestDrafts[community.id] || [])[index] || ''}
                                onChange={(event) => setRequestDrafts((current) => {
                                  const next = [...(current[community.id] || [])];
                                  next[index] = event.target.value;
                                  return { ...current, [community.id]: next };
                                })}
                                placeholder="Your answer"
                              />
                            </label>
                          ))}
                        </div>
                      ) : null}
                    </div>
                  </div>
                  <div className="grid gap-3 sm:min-w-[160px]">
                    {community.visibility === 'public' || community.isMember || community.isAdmin ? (
                      <Link to={`/members/communities/${community.slug}`} className="btn-secondary h-10 justify-center px-4 text-[11px]">Open page</Link>
                    ) : (
                      <div className="btn-secondary h-10 cursor-default justify-center px-4 text-[11px] opacity-60">Preview only</div>
                    )}
                    <button
                      type="button"
                      disabled={community.hasPendingRequest}
                      onClick={() => handleMembership(community)}
                      className="btn-primary h-10 px-4 text-[11px] disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {community.isMember ? 'Leave group' : community.visibility === 'private' ? (community.hasPendingRequest ? 'Pending review' : 'Request access') : 'Join group'}
                    </button>
                  </div>
                </div>
              </div>
            )) : (
              <EmptyPanel
                eyebrow="Groups"
                title="No discoverable groups yet"
                body="Nothing is padded with fake activity. The first real crew can claim the tone of the network here."
              />
            )}
          </div>
        </div>

        <div className="panel-cut p-6 md:p-8">
          <p className="eyebrow">Create group</p>
          <h2 className="headline-md mt-3">Build a page with real identity, not just a chat room.</h2>
          <form className="mt-6 grid gap-4" onSubmit={handleCreate}>
            <input
              className="field-sharp"
              placeholder="Group name"
              value={form.name}
              onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
              required
              minLength={2}
            />
            <textarea
              className="field-sharp min-h-[120px]"
              placeholder="What the group is about, what it stands for, and who it is for"
              value={form.description}
              onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))}
              required
              minLength={10}
            />
            <div className="grid gap-4 md:grid-cols-2">
              <input
                className="field-sharp"
                placeholder="Region / city / state"
                value={form.region}
                onChange={(event) => setForm((current) => ({ ...current, region: event.target.value }))}
              />
              <select
                className="field-sharp"
                value={form.visibility}
                onChange={(event) => setForm((current) => ({ ...current, visibility: event.target.value as 'public' | 'private' }))}
              >
                <option value="public">Public</option>
                <option value="private">Private</option>
              </select>
            </div>
            <textarea
              className="field-sharp min-h-[88px]"
              placeholder="Style / scene / build tags — one per line or comma separated"
              value={form.tags}
              onChange={(event) => setForm((current) => ({ ...current, tags: event.target.value }))}
            />
            <textarea
              className="field-sharp min-h-[96px]"
              placeholder="Rules — one per line"
              value={form.rules}
              onChange={(event) => setForm((current) => ({ ...current, rules: event.target.value }))}
            />
            {form.visibility === 'private' ? (
              <textarea
                className="field-sharp min-h-[96px]"
                placeholder="Application questions — one per line"
                value={form.applicationQuestions}
                onChange={(event) => setForm((current) => ({ ...current, applicationQuestions: event.target.value }))}
              />
            ) : null}
            <label className="panel-blade block cursor-pointer">
              <span className="text-[11px] uppercase tracking-[0.24em] text-silver/56">Avatar upload</span>
              <input type="file" accept="image/*,video/*" className="mt-3 block w-full text-sm text-silver/70" onChange={(event) => handleFile(event, setAvatarFile)} />
              <p className="mt-2 text-xs text-silver/56">{avatarFile ? `${avatarFile.name}${avatarProgress ? ` · ${avatarProgress}%` : ''}` : 'Optional identity mark.'}</p>
            </label>
            <label className="panel-blade block cursor-pointer">
              <span className="text-[11px] uppercase tracking-[0.24em] text-silver/56">Banner upload</span>
              <input type="file" accept="image/*,video/*" className="mt-3 block w-full text-sm text-silver/70" onChange={(event) => handleFile(event, setBannerFile)} />
              <p className="mt-2 text-xs text-silver/56">{bannerFile ? `${bannerFile.name}${bannerProgress ? ` · ${bannerProgress}%` : ''}` : 'Optional full-width identity surface.'}</p>
            </label>
            <label className="flex items-center gap-3 text-sm text-silver/72">
              <input
                type="checkbox"
                checked={form.discoverable}
                onChange={(event) => setForm((current) => ({ ...current, discoverable: event.target.checked }))}
              />
              Show this group in discovery.
            </label>
            <button className="btn-primary h-12 justify-center text-[11px] disabled:opacity-60" type="submit" disabled={!viewerProfile || submitting}>
              {submitting ? 'Building group…' : 'Create group'}
            </button>
          </form>
        </div>
      </div>

      {error ? <p className="text-sm text-[#ff8f8f]">{error}</p> : null}
    </div>
  );
}
