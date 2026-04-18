import { useEffect, useState } from 'react';
import DashboardShell from '../../components/platform/DashboardShell';
import { adminNav } from '../../data/platform';
import { networkApi } from '../../api/network';
import type { AdminMessageRecord } from '../../types/network';

export default function AdminMessages() {
  const [messages, setMessages] = useState<AdminMessageRecord[]>([]);
  const [q, setQ] = useState('');
  const [userId, setUserId] = useState('');
  const [communityId, setCommunityId] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  async function load() {
    try {
      setError(null);
      setMessages(await networkApi.searchAdminMessages({ q, userId, communityId }));
    } catch (err: any) {
      setError(err.message || 'Message search failed.');
    }
  }

  useEffect(() => {
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function moderate(messageId: string, hidden?: boolean, deleted?: boolean) {
    const moderationNote = window.prompt('Moderation note for this message action?', hidden ? 'Hidden from public/group chat.' : deleted ? 'Removed for moderation.' : 'Restored after review.') || '';
    setBusyId(messageId);
    try {
      await networkApi.moderateAdminMessage(messageId, { hidden, deleted, moderationNote });
      await load();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setBusyId(null);
    }
  }

  return (
    <DashboardShell eyebrow="Admin / messages" title="Message moderation search" nav={adminNav}>
      <section className="panel-cut p-6 md:p-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="eyebrow">Sensitive moderation access</p>
            <h2 className="headline-md mt-3">Search group chat and message records with access logging.</h2>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-silver/68">Every search/view runs through the admin API and is audit logged. Use this only for moderation, safety, reports and dispute review.</p>
          </div>
          <button className="btn-primary h-11 px-5 text-xs" type="button" onClick={() => void load()}>Search messages</button>
        </div>
        <div className="mt-6 grid gap-3 lg:grid-cols-3">
          <input className="field-sharp" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Keyword / message text" />
          <input className="field-sharp" value={userId} onChange={(e) => setUserId(e.target.value)} placeholder="User ID filter" />
          <input className="field-sharp" value={communityId} onChange={(e) => setCommunityId(e.target.value)} placeholder="Community ID filter" />
        </div>
        {error ? <p className="mt-5 text-sm text-[#ff8f8f]">{error}</p> : null}
        <div className="mt-6 grid gap-4">
          {messages.map((message) => (
            <article key={message.id} className="panel-blade">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.22em] text-silver/45">{message.community?.name || message.communityId} · {new Date(message.createdAt).toLocaleString()}</p>
                  <p className="mt-3 text-sm leading-7 text-bone">{message.text}</p>
                  <p className="mt-3 font-mono text-xs text-silver/45">user {message.userId} · message {message.id}</p>
                  {message.hidden || message.deleted ? <p className="mt-3 text-xs uppercase tracking-[0.2em] text-[#ffcf91]">{message.deleted ? 'deleted' : 'hidden'} {message.moderationNote ? `· ${message.moderationNote}` : ''}</p> : null}
                </div>
                <div className="flex flex-wrap gap-2">
                  <button disabled={busyId === message.id} className="btn-secondary h-10 px-4 text-xs" onClick={() => void moderate(message.id, true, false)}>Hide</button>
                  <button disabled={busyId === message.id} className="btn-secondary h-10 px-4 text-xs" onClick={() => void moderate(message.id, false, true)}>Delete</button>
                  {(message.hidden || message.deleted) ? <button disabled={busyId === message.id} className="btn-primary h-10 px-4 text-xs" onClick={() => void moderate(message.id, false, false)}>Restore</button> : null}
                </div>
              </div>
            </article>
          ))}
          {!messages.length ? <div className="empty-state">No message records match this search. Refine the keyword, user or community filter.</div> : null}
        </div>
      </section>
    </DashboardShell>
  );
}
