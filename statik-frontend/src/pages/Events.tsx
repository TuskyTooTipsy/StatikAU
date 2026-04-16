import { useMemo, useState } from 'react';
import EventCard from '../components/platform/EventCard';
import { events } from '../data/platform';
import { usePageMeta } from '../hooks/usePageMeta';

const categories = ['All', 'Meet', 'Community', 'Track Day', 'Cruise', 'Workshop'];

export default function Events() {
  const [view, setView] = useState<'calendar' | 'list'>('calendar');
  const [category, setCategory] = useState('All');
  const [showPast, setShowPast] = useState(false);

  usePageMeta('Events', 'Discover featured automotive events, imported motorsport schedules, and approved community gatherings.');

  const filtered = useMemo(
    () =>
      events.filter((event) => (category === 'All' ? true : event.category === category)).filter((event) => (showPast ? true : !event.past)),
    [category, showPast],
  );

  return (
    <div className="shell space-y-10 py-8">
      <div className="page-hero rounded-[2.5rem] border border-white/10 p-6 md:p-10">
        <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr] xl:items-end">
          <div>
            <p className="eyebrow">Events / imported + manual + user submissions</p>
            <h1 className="headline-lg mt-3">A real automotive event platform, not just a flat list.</h1>
            <p className="body-muted mt-5 max-w-3xl text-base">Every public event is approved. Imported events are staged first. User submissions are moderated. Sponsored placements and featured slots are clearly controlled.</p>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            {['Featured events', 'Approval queue', 'Past archive'].map((item) => (
              <div key={item} className="rounded-[1.5rem] border border-white/10 bg-white/5 px-4 py-4 text-sm text-bone">{item}</div>
            ))}
          </div>
        </div>
      </div>
      <div className="panel p-5">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex flex-wrap gap-2">
            {categories.map((item) => (
              <button key={item} type="button" onClick={() => setCategory(item)} className={`filter-chip ${category === item ? 'filter-chip-active' : ''}`}>{item}</button>
            ))}
          </div>
          <div className="flex flex-wrap gap-3">
            <button type="button" onClick={() => setView('calendar')} className={`filter-chip ${view === 'calendar' ? 'filter-chip-active' : ''}`}>Calendar view</button>
            <button type="button" onClick={() => setView('list')} className={`filter-chip ${view === 'list' ? 'filter-chip-active' : ''}`}>List view</button>
            <button type="button" onClick={() => setShowPast((value) => !value)} className={`filter-chip ${showPast ? 'filter-chip-active' : ''}`}>{showPast ? 'Hide past' : 'Show past'}</button>
          </div>
        </div>
      </div>
      {view === 'calendar' ? (
        <div className="panel overflow-hidden p-6">
          <div className="grid gap-4 md:grid-cols-7">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => <div key={day} className="rounded-2xl border border-white/10 bg-white/5 px-3 py-3 text-xs uppercase tracking-[0.24em] text-silver/55">{day}</div>)}
            {filtered.map((event) => (
              <div key={event.id} className="rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-4 md:col-span-2">
                <p className="text-xs uppercase tracking-[0.22em] text-silver/55">{event.date}</p>
                <p className="mt-3 text-lg font-semibold text-bone">{event.name}</p>
                <p className="mt-2 text-sm text-silver/65">{event.location}</p>
                <p className="mt-3 text-xs uppercase tracking-[0.2em] text-bone">{event.category}</p>
              </div>
            ))}
          </div>
        </div>
      ) : null}
      <div className="grid gap-6 xl:grid-cols-3">
        {filtered.map((event) => <EventCard key={event.id} event={event} />)}
      </div>
    </div>
  );
}
