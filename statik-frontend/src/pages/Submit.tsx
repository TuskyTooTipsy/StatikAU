import type { FormEvent } from 'react';
import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import EmptyPanel from '../components/EmptyPanel';
import MapboxLocationField from '../components/platform/MapboxLocationField';
import { networkApi } from '../api/network';
import { uploadMediaFile } from '../api/uploads';
import { usePageMeta } from '../hooks/usePageMeta';
import { useSessionStore } from '../store/session';
import type { CommunityPreview } from '../types/network';

const categoryConfig = [
  { value: 'Meet', description: 'Street, venue, lot, or late-night social gathering.', venueTypes: ['street', 'showground', 'business', 'outdoor'], entryTypes: ['spectator', 'mixed'] },
  { value: 'Cruise', description: 'Route-based gathering, convoy, or destination run.', venueTypes: ['street', 'outdoor', 'mixed'], entryTypes: ['driver', 'mixed'] },
  { value: 'Track Day', description: 'Circuit sessions, open laps, sprinting, or driver seat time.', venueTypes: ['raceway'], entryTypes: ['driver', 'mixed'] },
  { value: 'Drift', description: 'Drift night, matsuri, or practice-focused format.', venueTypes: ['raceway', 'showground'], entryTypes: ['driver', 'mixed'] },
  { value: 'Drag / Roll Racing', description: 'Drag strip, roll racing, or straight-line format.', venueTypes: ['raceway'], entryTypes: ['driver', 'mixed'] },
  { value: 'Show and Shine', description: 'Curated display event, judging, or feature lane.', venueTypes: ['showground', 'business', 'indoor', 'outdoor'], entryTypes: ['spectator', 'mixed'] },
  { value: 'Workshop', description: 'Hands-on technical, detailing, tuning, or content education.', venueTypes: ['workshop', 'business', 'indoor'], entryTypes: ['spectator', 'mixed'] },
  { value: 'Community Night', description: 'Member-focused gathering with a stronger social layer.', venueTypes: ['business', 'outdoor', 'mixed'], entryTypes: ['spectator', 'mixed'] },
  { value: 'Sponsor Activation', description: 'Brand-backed activation, partner placement, or launch event.', venueTypes: ['business', 'indoor', 'outdoor', 'mixed'], entryTypes: ['spectator', 'mixed'] },
  { value: 'Club / Group Hosted', description: 'Crew-run gathering tied directly to a group page.', venueTypes: ['street', 'showground', 'business', 'mixed'], entryTypes: ['spectator', 'mixed'] },
  { value: 'Motorsport Event', description: 'Competition, qualifying, or more formal race program.', venueTypes: ['raceway'], entryTypes: ['driver', 'spectator', 'mixed'] },
  { value: 'Ride Day / Bike Event', description: 'Bike-focused ride, meet, or track activity.', venueTypes: ['street', 'raceway', 'outdoor'], entryTypes: ['rider', 'mixed'] },
  { value: 'Learner / Training Event', description: 'Driver training, ride coaching, or learner support.', venueTypes: ['raceway', 'business', 'workshop'], entryTypes: ['driver', 'rider', 'mixed'] },
  { value: 'Charity Event', description: 'Cause-led community fundraising or awareness event.', venueTypes: ['mixed', 'outdoor', 'showground'], entryTypes: ['spectator', 'mixed'] },
  { value: 'Content / Media Event', description: 'Creator sessions, recaps, filming windows, or media grid days.', venueTypes: ['raceway', 'business', 'mixed'], entryTypes: ['spectator', 'mixed'] },
  { value: 'Business / Vendor Event', description: 'Open house, product launch, or vendor showcase.', venueTypes: ['business', 'indoor', 'outdoor'], entryTypes: ['spectator', 'mixed'] },
  { value: 'Other', description: 'Custom event format with full moderator review.', venueTypes: ['other'], entryTypes: ['other'] },
] as const;

const vehicleFocusOptions = ['JDM', 'Euro', 'Aussie muscle', '4x4', 'Truck', 'Bike', 'Stance', 'Drift', 'Track', 'Drag', 'Supercar', 'Mixed'];
const tagOptions = ['night', 'family-friendly', 'all-makes', 'invite-only', 'premium', 'filming', 'partner-backed', 'beginner-welcome', 'women-led', 'crew-hosted'];

function parseLines(value: string) {
  return value.split('\n').map((item) => item.trim()).filter(Boolean);
}

function toggleValue(values: string[], value: string) {
  return values.includes(value) ? values.filter((item) => item !== value) : [...values, value];
}

export default function Submit() {
  const viewerUser = useSessionStore((state) => state.viewerUser);
  const viewerProfile = useSessionStore((state) => state.viewerProfile);
  const [communities, setCommunities] = useState<CommunityPreview[]>([]);
  const [message, setMessage] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [mediaIds, setMediaIds] = useState<string[]>([]);
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({});
  const [selectedVehicleFocus, setSelectedVehicleFocus] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [form, setForm] = useState({
    name: '',
    date: '',
    time: '',
    category: 'Meet',
    organizer: viewerProfile?.displayName || '',
    hostCommunityId: '',
    description: '',
    venueType: 'other',
    entryType: 'mixed',
    pricingType: 'other',
    sponsored: false,
    sponsorName: '',
    spectatorFriendly: true,
    familyFriendly: false,
    recurring: false,
    indoorOutdoor: 'unknown' as 'indoor' | 'outdoor' | 'mixed' | 'unknown',
    submittedByName: viewerProfile?.displayName || '',
    submittedByEmail: viewerUser?.email || '',
    hostLinksText: '',
  });
  const [locationDetails, setLocationDetails] = useState<{ label: string; address?: string; lat?: number; lng?: number; placeId?: string; suburb?: string; region?: string; country?: string }>({ label: '', address: '' });

  usePageMeta('Submit Event', 'Submit a real automotive event into the STATIK moderation flow with structured intake, map placement, and direct media uploads.');

  useEffect(() => {
    if (!viewerUser) return;
    void networkApi.listCommunities()
      .then((items) => setCommunities(items.filter((item) => item.isAdmin || item.isMember)))
      .catch((error: any) => setMessage(error.message));
  }, [viewerUser]);

  useEffect(() => {
    setForm((current) => ({
      ...current,
      organizer: current.organizer || viewerProfile?.displayName || '',
      submittedByName: current.submittedByName || viewerProfile?.displayName || '',
      submittedByEmail: current.submittedByEmail || viewerUser?.email || '',
    }));
  }, [viewerProfile?.displayName, viewerUser?.email]);

  const activeCategory = useMemo(() => categoryConfig.find((item) => item.value === form.category) || categoryConfig[0], [form.category]);

  useEffect(() => {
    if (!(activeCategory.venueTypes as readonly string[]).includes(form.venueType)) {
      setForm((current) => ({ ...current, venueType: activeCategory.venueTypes[0] || 'other' }));
    }
    if (!(activeCategory.entryTypes as readonly string[]).includes(form.entryType)) {
      setForm((current) => ({ ...current, entryType: activeCategory.entryTypes[0] || 'mixed' }));
    }
  }, [activeCategory]);

  async function handleMediaUpload(file?: File | null) {
    if (!file || !viewerProfile) return;
    const tempKey = `${Date.now()}-${file.name}`;
    try {
      const uploaded = await uploadMediaFile(file, 'profile', viewerProfile.id, (value) => setUploadProgress((prev) => ({ ...prev, [tempKey]: value })));
      setMediaIds((prev) => [...prev, uploaded.id]);
      setUploadProgress((prev) => ({ ...prev, [tempKey]: 100 }));
      setMessage(null);
    } catch (error: any) {
      setMessage(error.message || 'Upload failed');
      setUploadProgress((prev) => ({ ...prev, [tempKey]: 0 }));
    }
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!viewerUser) return;
    setSubmitting(true);
    try {
      await networkApi.submitEvent({
        name: form.name,
        location: locationDetails.label || locationDetails.address || 'Location pending review',
        date: form.date,
        time: form.time || 'TBC',
        description: form.description,
        category: form.category,
        organizer: form.organizer,
        hostCommunityId: form.hostCommunityId || undefined,
        sponsored: form.sponsored,
        sponsorName: form.sponsorName || undefined,
        venueType: form.venueType,
        entryType: form.entryType,
        pricingType: form.pricingType,
        vehicleFocus: selectedVehicleFocus,
        tags: selectedTags,
        spectatorFriendly: form.spectatorFriendly,
        familyFriendly: form.familyFriendly,
        recurring: form.recurring,
        indoorOutdoor: form.indoorOutdoor,
        hostLinks: parseLines(form.hostLinksText),
        mediaIds,
        locationDetails: locationDetails.label || locationDetails.address ? locationDetails : undefined,
        submittedByName: form.submittedByName || undefined,
        submittedByEmail: form.submittedByEmail || undefined,
      });
      setMessage('Submission received. It is now in the admin approval bay with full status history and review notes.');
      setMediaIds([]);
      setUploadProgress({});
      setSelectedVehicleFocus([]);
      setSelectedTags([]);
      setLocationDetails({ label: '', address: '' });
      setForm({
        name: '',
        date: '',
        time: '',
        category: 'Meet',
        organizer: viewerProfile?.displayName || '',
        hostCommunityId: '',
        description: '',
        venueType: 'other',
        entryType: 'mixed',
        pricingType: 'other',
        sponsored: false,
        sponsorName: '',
        spectatorFriendly: true,
        familyFriendly: false,
        recurring: false,
        indoorOutdoor: 'unknown',
        submittedByName: viewerProfile?.displayName || '',
        submittedByEmail: viewerUser?.email || '',
        hostLinksText: '',
      });
    } catch (error: any) {
      setMessage(error.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="shell space-y-10 py-8">
      <div className="page-hero-cut p-6 md:p-10">
        <p className="eyebrow">Event intake / moderated publishing only</p>
        <h1 className="headline-lg mt-3">Submit events with real structure, proper location placement, and direct media attached.</h1>
        <p className="body-muted mt-5 max-w-3xl text-base">STATIK now treats event intake like a serious quality pipeline: category-aware fields, better venue details, sponsor and host context, direct uploads, and a moderation trail instead of a dead-end form.</p>
      </div>

      <div className="grid gap-8 xl:grid-cols-[1fr_340px]">
        {!viewerUser ? (
          <div className="xl:col-span-2">
            <EmptyPanel
              eyebrow="Sign in required"
              title="Create an account to submit real events"
              body="Event submissions are fully backend-connected and moderation-tracked. Sign in first so your submission, media, notes, and revision state stay attached to a real account."
              action={<Link to="/join" className="btn-primary h-11 px-4 text-[11px]">Create account</Link>}
            />
          </div>
        ) : (
          <>
            <form onSubmit={handleSubmit} className="panel-cut space-y-5 p-6 md:p-8">
              <div className="grid gap-5 md:grid-cols-2">
                <div>
                  <label className="text-xs uppercase tracking-[0.24em] text-silver/50">Event title</label>
                  <input className="field-sharp mt-3" placeholder="Street meet, track day, workshop, launch night…" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
                </div>
                <div>
                  <label className="text-xs uppercase tracking-[0.24em] text-silver/50">Category</label>
                  <select className="field-sharp mt-3" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                    {categoryConfig.map((item) => <option key={item.value} value={item.value}>{item.value}</option>)}
                  </select>
                </div>
              </div>

              <div className="rounded-[1.3rem] border border-white/10 bg-white/[0.03] p-4 text-sm leading-7 text-silver/66">{activeCategory.description}</div>

              <div className="grid gap-5 md:grid-cols-2">
                <div>
                  <label className="text-xs uppercase tracking-[0.24em] text-silver/50">Date</label>
                  <input type="date" className="field-sharp mt-3" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} required />
                </div>
                <div>
                  <label className="text-xs uppercase tracking-[0.24em] text-silver/50">Time</label>
                  <input className="field-sharp mt-3" placeholder="6:30 PM / Gates 8:00 AM / TBC" value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })} />
                </div>
              </div>

              <MapboxLocationField value={locationDetails} onChange={setLocationDetails} label="Venue search" helper="Search like a map app, confirm the exact spot, then drag or click the pin if the venue marker needs refining." />

              <div className="grid gap-5 md:grid-cols-3">
                <div>
                  <label className="text-xs uppercase tracking-[0.24em] text-silver/50">Venue type</label>
                  <select className="field-sharp mt-3" value={form.venueType} onChange={(e) => setForm({ ...form, venueType: e.target.value })}>
                    {activeCategory.venueTypes.map((item) => <option key={item} value={item}>{item.replace(/_/g, ' ')}</option>)}
                    <option value="other">other</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs uppercase tracking-[0.24em] text-silver/50">Entry type</label>
                  <select className="field-sharp mt-3" value={form.entryType} onChange={(e) => setForm({ ...form, entryType: e.target.value })}>
                    {activeCategory.entryTypes.map((item) => <option key={item} value={item}>{item.replace(/_/g, ' ')}</option>)}
                    <option value="other">other</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs uppercase tracking-[0.24em] text-silver/50">Pricing</label>
                  <select className="field-sharp mt-3" value={form.pricingType} onChange={(e) => setForm({ ...form, pricingType: e.target.value })}>
                    <option value="free">free</option>
                    <option value="ticketed">ticketed</option>
                    <option value="invite_only">invite only</option>
                    <option value="other">other</option>
                  </select>
                </div>
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                <div>
                  <label className="text-xs uppercase tracking-[0.24em] text-silver/50">Organizer</label>
                  <input className="field-sharp mt-3" value={form.organizer} onChange={(e) => setForm({ ...form, organizer: e.target.value })} required />
                </div>
                <div>
                  <label className="text-xs uppercase tracking-[0.24em] text-silver/50">Host group</label>
                  <select className="field-sharp mt-3" value={form.hostCommunityId} onChange={(e) => setForm({ ...form, hostCommunityId: e.target.value })}>
                    <option value="">No linked group</option>
                    {communities.map((community) => <option key={community.id} value={community.id}>{community.name}</option>)}
                  </select>
                </div>
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                <div className="rounded-[1.2rem] border border-white/10 bg-white/[0.03] p-4">
                  <p className="text-[10px] uppercase tracking-[0.24em] text-silver/46">Vehicle focus</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {vehicleFocusOptions.map((tag) => (
                      <button key={tag} type="button" onClick={() => setSelectedVehicleFocus((current) => toggleValue(current, tag))} className={`status-chip ${selectedVehicleFocus.includes(tag) ? 'bg-white/18 text-bone' : ''}`}>{tag}</button>
                    ))}
                  </div>
                </div>
                <div className="rounded-[1.2rem] border border-white/10 bg-white/[0.03] p-4">
                  <p className="text-[10px] uppercase tracking-[0.24em] text-silver/46">Event tags</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {tagOptions.map((tag) => (
                      <button key={tag} type="button" onClick={() => setSelectedTags((current) => toggleValue(current, tag))} className={`status-chip ${selectedTags.includes(tag) ? 'bg-white/18 text-bone' : ''}`}>{tag}</button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                <label className="panel-blade flex cursor-pointer items-center justify-between gap-4 p-4 text-sm text-silver/72"><span>Spectator friendly</span><input type="checkbox" checked={form.spectatorFriendly} onChange={(e) => setForm({ ...form, spectatorFriendly: e.target.checked })} /></label>
                <label className="panel-blade flex cursor-pointer items-center justify-between gap-4 p-4 text-sm text-silver/72"><span>Family suitable</span><input type="checkbox" checked={form.familyFriendly} onChange={(e) => setForm({ ...form, familyFriendly: e.target.checked })} /></label>
                <label className="panel-blade flex cursor-pointer items-center justify-between gap-4 p-4 text-sm text-silver/72"><span>Recurring format</span><input type="checkbox" checked={form.recurring} onChange={(e) => setForm({ ...form, recurring: e.target.checked })} /></label>
                <label className="panel-blade flex cursor-pointer items-center justify-between gap-4 p-4 text-sm text-silver/72"><span>Sponsor-supported</span><input type="checkbox" checked={form.sponsored} onChange={(e) => setForm({ ...form, sponsored: e.target.checked })} /></label>
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                <div>
                  <label className="text-xs uppercase tracking-[0.24em] text-silver/50">Indoor / outdoor</label>
                  <select className="field-sharp mt-3" value={form.indoorOutdoor} onChange={(e) => setForm({ ...form, indoorOutdoor: e.target.value as 'indoor' | 'outdoor' | 'mixed' | 'unknown' })}>
                    <option value="unknown">unknown</option>
                    <option value="indoor">indoor</option>
                    <option value="outdoor">outdoor</option>
                    <option value="mixed">mixed</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs uppercase tracking-[0.24em] text-silver/50">Sponsor name</label>
                  <input className="field-sharp mt-3" placeholder="Only if this event is sponsor-backed" value={form.sponsorName} onChange={(e) => setForm({ ...form, sponsorName: e.target.value })} />
                </div>
              </div>

              <div>
                <label className="text-xs uppercase tracking-[0.24em] text-silver/50">Description</label>
                <textarea className="field-sharp mt-3 min-h-[200px]" placeholder="What is happening, who it is for, how entry works, why it matters, and anything people should know before showing up." value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required />
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                <div>
                  <label className="text-xs uppercase tracking-[0.24em] text-silver/50">Host / info links</label>
                  <textarea className="field-sharp mt-3 min-h-[120px]" placeholder="One URL per line" value={form.hostLinksText} onChange={(e) => setForm({ ...form, hostLinksText: e.target.value })} />
                </div>
                <div>
                  <label className="text-xs uppercase tracking-[0.24em] text-silver/50">Submission contact</label>
                  <input className="field-sharp mt-3" placeholder="Your name" value={form.submittedByName} onChange={(e) => setForm({ ...form, submittedByName: e.target.value })} />
                  <input className="field-sharp mt-3" placeholder="Your email" type="email" value={form.submittedByEmail} onChange={(e) => setForm({ ...form, submittedByEmail: e.target.value })} />
                </div>
              </div>

              <div className="rounded-[1.25rem] border border-white/10 bg-white/[0.03] p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.24em] text-silver/46">Media uploads</p>
                    <p className="mt-2 text-sm text-silver/64">Attach flyers, location imagery, short promo clips, or sponsor assets now. These stay reviewable in admin before anything goes public.</p>
                  </div>
                  <span className="status-chip">{mediaIds.length} staged</span>
                </div>
                <input type="file" accept="image/*,video/*" className="field-sharp mt-4" multiple onChange={(e) => Array.from(e.target.files || []).forEach((file) => void handleMediaUpload(file))} />
                {Object.keys(uploadProgress).length ? <div className="mt-4 grid gap-2">{Object.entries(uploadProgress).map(([key, value]) => <p key={key} className="text-xs uppercase tracking-[0.22em] text-silver/56">{key.split('-').slice(-1)[0]} • {value}%</p>)}</div> : null}
              </div>

              <button type="submit" disabled={submitting} className="btn-primary h-12 px-6 text-xs">{submitting ? 'Submitting to approval bay…' : 'Submit to moderation queue'}</button>
              {message ? <p className="text-sm text-bone">{message}</p> : null}
            </form>
            <div className="space-y-5">
              <div className="panel-cut p-6">
                <p className="eyebrow">Pipeline states</p>
                <div className="mt-4 space-y-3 text-sm text-silver/68">
                  <p>1. Submission received</p>
                  <p>2. Media and field validation</p>
                  <p>3. Approval bay review</p>
                  <p>4. Approve / reject / revision request</p>
                  <p>5. Audit log + publish control</p>
                </div>
              </div>
              <div className="panel-cut p-6">
                <p className="eyebrow">What this intake now captures</p>
                <div className="mt-4 space-y-4 text-sm leading-7 text-silver/68">
                  <p>• category-aware event structure</p>
                  <p>• venue and pin placement</p>
                  <p>• host group linkage</p>
                  <p>• sponsor-backed visibility context</p>
                  <p>• direct flyer and clip uploads</p>
                  <p>• moderation-safe contact details</p>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
