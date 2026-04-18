import type { FormEvent } from 'react';
import { useEffect, useState } from 'react';
import DashboardShell from '../../components/platform/DashboardShell';
import MediaGrid from '../../components/platform/MediaGrid';
import { accountNav } from '../../data/platform';
import { networkApi } from '../../api/network';
import { uploadMediaFile } from '../../api/uploads';
import { useSessionStore } from '../../store/session';
import type { ProfilePost } from '../../types/network';

export default function MyPosts() {
  const viewerProfile = useSessionStore((state) => state.viewerProfile);
  const [posts, setPosts] = useState<ProfilePost[]>([]);
  const [message, setMessage] = useState<string | null>(null);
  const [caption, setCaption] = useState('');
  const [mediaIds, setMediaIds] = useState<string[]>([]);
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({});

  async function load() {
    try {
      setPosts(await networkApi.getMyProfilePosts());
    } catch (error: any) {
      setMessage(error.message);
    }
  }

  useEffect(() => { load(); }, []);

  async function handleCreate(event: FormEvent) {
    event.preventDefault();
    try {
      await networkApi.createProfilePost({ caption, mediaIds });
      setCaption('');
      setMediaIds([]);
      setUploadProgress({});
      load();
    } catch (error: any) {
      setMessage(error.message);
    }
  }

  async function handleUpload(file?: File | null) {
    if (!file || !viewerProfile) return;
    const key = `profile-post-${Date.now()}`;
    try {
      const uploaded = await uploadMediaFile(file, 'profile', viewerProfile.id, (value) => setUploadProgress((prev) => ({ ...prev, [key]: value })));
      setMediaIds((prev) => [...prev, uploaded.id]);
      setUploadProgress((prev) => ({ ...prev, [key]: 100 }));
    } catch (error: any) {
      setMessage(error.message || 'Upload failed');
    }
  }

  return (
    <DashboardShell eyebrow="Members / posts" title="Profile media posts" nav={accountNav}>
      <div className="grid gap-6 xl:grid-cols-[0.96fr_1.04fr]">
        <div className="panel-cut p-6 md:p-8">
          <p className="eyebrow">Create post</p>
          <form className="mt-6 grid gap-4" onSubmit={handleCreate}>
            <textarea className="field-sharp min-h-[180px]" placeholder="Caption / update / build note" value={caption} onChange={(e) => setCaption(e.target.value)} required />
            <input type="file" accept="image/*,video/*" className="field-sharp" multiple onChange={(e) => Array.from(e.target.files || []).forEach((file) => void handleUpload(file))} />
            {Object.keys(uploadProgress).length ? <div className="grid gap-2">{Object.entries(uploadProgress).map(([key, value]) => <p key={key} className="text-xs uppercase tracking-[0.22em] text-silver/56">Upload {value}%</p>)}</div> : null}
            <button className="btn-primary h-12 justify-center text-[11px]">Publish post</button>
          </form>
        </div>
        <div className="panel-cut p-6 md:p-8">
          <p className="eyebrow">Published</p>
          <div className="mt-6 grid gap-4">
            {posts.length ? posts.map((post) => (
              <div key={post.id} className="panel-blade space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <p className="text-sm uppercase tracking-[0.22em] text-silver/56">{new Date(post.createdAt).toLocaleString()}</p>
                  <button type="button" onClick={async () => { await networkApi.deleteProfilePost(post.id); load(); }} className="btn-secondary h-10 px-4 text-[11px]">Delete</button>
                </div>
                <p className="text-sm leading-7 text-silver/72">{post.caption}</p>
                {post.media.length ? <MediaGrid media={post.media} compact /> : <p className="text-sm text-silver/56">No media attached.</p>}
              </div>
            )) : <p className="text-sm text-silver/60">No profile posts yet.</p>}
          </div>
        </div>
      </div>
      {message ? <p className="text-sm text-silver/70">{message}</p> : null}
    </DashboardShell>
  );
}
