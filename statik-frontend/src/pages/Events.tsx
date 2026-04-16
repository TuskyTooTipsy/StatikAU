import type { FormEvent } from 'react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import EmptyPanel from '../components/EmptyPanel';
import { networkApi } from '../api/network';
import type { NetworkEvent } from '../types/network';
import { useSessionStore } from '../store/session';

export default function EventsPage() {
  const [events, setEvents] = useState<NetworkEvent[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({ name: '', location: '', date: '', time: '', description: '', category: '', organizer: '' });
  const viewerUser = useSessionStore((state) => state.viewerUser);

  async function load() {
    try {
      setEvents(await networkApi.listEvents());
    } catch (err: any) {
      setError(err.message);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    try {
      await networkApi.submitEvent(form);
      setForm({ name: '', location: '', date: '', time: '', description: '', category: '', organizer: '' });
      await load();
      setError('Event submitted. It is now waiting for admin approval.');
    } catch (err: any) {
      setError(err.message);
    }
  }

  return (
    <div className="shell pb-16 pt-8 space-y-8">
      <div className="page-hero-cut p-6 md:p-8 xl:p-10">
        <p className="eyebrow">Events</p>
        <h1 className="headline-lg mt-3">Events should feel social, not like static listings.</h1>
        <p className="body-muted mt-4 max-w-3xl">Every approved event can collect real interested, attending, and maybe intent. Once you sign in, your status becomes part of the social layer instead of staying invisible.</p>
      </div>

      {events.length ? (
        <div className="grid gap-4">
          {events.map((event) => (
            <Link key={event.id} to={`/events/${event.slug}`} className="event-list-card">
              <div>
                <p className="text-[11px] uppercase tracking-[0.24em] text-silver/50">{event.category}</p>
                <h2 className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-bone">{event.name}</h2>
                <p className="mt-2 text-sm text-silver/70">{event.location} • {event.date} • {event.time}</p>
                <p className="mt-3 text-sm leading-7 text-silver/72">{event.description}</p>
              </div>
              <div className="grid gap-2 text-xs uppercase tracking-[0.22em] text-silver/56 sm:text-right">
                <span>{event.counts?.attending ?? 0} attending</span>
                <span>{event.counts?.interested ?? 0} interested</span>
                <span>{event.counts?.maybe ?? 0} maybe</span>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <EmptyPanel eyebrow="Events" title="No approved events yet" body="Once a member submits an event and an admin approves it, it appears here with real interaction states attached." />
      )}

      <div className="panel-cut p-6 md:p-8">
        <p className="eyebrow">Submit event</p>
        {viewerUser ? (
          <form className="mt-6 grid gap-4" onSubmit={handleSubmit}>
            <div className="grid gap-4 md:grid-cols-2">
              <input className="field-sharp" placeholder="Event name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
              <input className="field-sharp" placeholder="Location" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} required />
              <input className="field-sharp" placeholder="Date" type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} required />
              <input className="field-sharp" placeholder="Time" value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })} required />
              <input className="field-sharp" placeholder="Category" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} required />
              <input className="field-sharp" placeholder="Organizer" value={form.organizer} onChange={(e) => setForm({ ...form, organizer: e.target.value })} required />
            </div>
            <textarea className="field-sharp min-h-[140px]" placeholder="Describe the event" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required minLength={10} />
            <button className="btn-primary h-12 justify-center text-[11px]">Submit for approval</button>
          </form>
        ) : (
          <div className="mt-6"><EmptyPanel eyebrow="Submission" title="Sign in to submit an event" body="Event submissions are real moderation flows. Create an account, submit the details, and the admin team can approve or reject it." action={<Link to="/join" className="btn-primary h-11 px-4 text-[11px]">Create account</Link>} /></div>
        )}
      </div>

      {error ? <p className="text-sm text-[#ff8f8f]">{error}</p> : null}
    </div>
  );
}
