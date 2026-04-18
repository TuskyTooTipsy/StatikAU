import type { FormEvent } from 'react';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { networkApi } from '../api/network';
import { uploadMediaFile } from '../api/uploads';
import { useSessionStore } from '../store/session';

type MemberType = 'car_enthusiast' | 'bike_rider' | 'photographer_videographer' | 'business_owner' | 'car_group_owner' | 'event_host' | 'workshop_vendor' | 'spectator_fan' | 'other';

const memberTypes: Array<{ value: MemberType; label: string }> = [
  { value: 'car_enthusiast', label: 'Car enthusiast' },
  { value: 'bike_rider', label: 'Bike rider' },
  { value: 'photographer_videographer', label: 'Photographer / videographer' },
  { value: 'business_owner', label: 'Business owner' },
  { value: 'car_group_owner', label: 'Car group owner' },
  { value: 'event_host', label: 'Event host' },
  { value: 'workshop_vendor', label: 'Workshop / vendor' },
  { value: 'spectator_fan', label: 'Spectator / fan' },
  { value: 'other', label: 'Other' },
];

const eventTypeOptions = ['meet', 'cruise', 'track day', 'drift', 'drag / roll racing', 'show and shine', 'workshop', 'community night', 'sponsor activation', 'motorsport event', 'ride day / bike event', 'other'];
const interestOptions = ['JDM', 'Euro', 'Aussie muscle', '4x4', 'bikes', 'track', 'drift', 'drag', 'detailing', 'media', 'events', 'business'];

function toggle(values: string[], value: string) {
  return values.includes(value) ? values.filter((item) => item !== value) : [...values, value];
}

export default function JoinPage() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    displayName: '', email: '', password: '', username: '', termsAccepted: false,
    location: '', memberType: 'car_enthusiast' as MemberType, bio: '', interestTags: [] as string[], preferredEventTypes: [] as string[], discoveryVisible: true, newestMemberVisible: true,
    vehicleType: 'car' as 'car' | 'bike' | 'truck' | 'other', year: '', make: '', model: '', trim: '', specialEdition: '', stage: '',
  });
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [needsBootstrap, setNeedsBootstrap] = useState(false);
  const applyAuthPayload = useSessionStore((state) => state.applyAuthPayload);
  const navigate = useNavigate();

  useEffect(() => { networkApi.getPublicPlatform().then((payload) => setNeedsBootstrap(payload.needsAdminBootstrap)).catch(() => undefined); }, []);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const firstVehicle = form.make.trim() && form.model.trim() ? { vehicleType: form.vehicleType, year: form.year, make: form.make, model: form.model, trim: form.trim, specialEdition: form.specialEdition, stage: form.stage } : undefined;
      let payload = await networkApi.register({
        displayName: form.displayName,
        email: form.email,
        password: form.password,
        username: form.username || undefined,
        termsAccepted: form.termsAccepted,
        location: form.location,
        memberType: form.memberType,
        bio: form.bio,
        interestTags: form.interestTags,
        preferredEventTypes: form.preferredEventTypes,
        discoveryVisible: form.discoveryVisible,
        newestMemberVisible: form.newestMemberVisible,
        firstVehicle,
      });
      applyAuthPayload(payload);
      if (avatarFile && payload.profile?.id) {
        const uploaded = await uploadMediaFile(avatarFile, 'profile', payload.profile.id);
        const updated = await networkApi.updateMyProfile({
          displayName: payload.profile.displayName,
          bio: payload.profile.bio || '',
          location: payload.profile.location || '',
          primaryCar: payload.profile.primaryCar || '',
          avatarUrl: uploaded.url,
          bannerUrl: payload.profile.bannerUrl || '',
          about: payload.profile.about || '',
          currentlyBuilding: payload.profile.currentlyBuilding || '',
          sceneTags: payload.profile.sceneTags || [],
          analyticsVisibility: payload.profile.analyticsVisibility || 'public',
          memberType: form.memberType,
          interestTags: form.interestTags,
          preferredEventTypes: form.preferredEventTypes,
          discoveryVisible: form.discoveryVisible,
          newestMemberVisible: form.newestMemberVisible,
          showLocation: true,
          showEventActivity: true,
          showGroupAffiliations: true,
        });
        payload = { ...payload, profile: updated };
        applyAuthPayload(payload);
      }
      navigate('/members');
    } catch (err: any) {
      setError(err.message);
    } finally { setSubmitting(false); }
  }

  return (
    <div className="shell py-12">
      <div className="mx-auto max-w-4xl page-hero-cut p-6 md:p-8">
        <p className="eyebrow">Create account / Step {step} of 4</p>
        <h1 className="headline-lg mt-3">Get inside the network with a profile that can actually be found.</h1>
        <p className="body-muted mt-4">Optional details help events, garages, members, groups, and approved businesses connect without forcing a fake setup.</p>
        {needsBootstrap ? <div className="mt-5 panel-blade"><h3>Founding admin setup</h3><p>The first account on a fresh install becomes the admin account so the platform can be configured without fake seeded users.</p></div> : null}

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          {step === 1 ? (
            <section className="grid gap-4">
              <input className="field-sharp" placeholder="Display name" value={form.displayName} onChange={(e) => setForm({ ...form, displayName: e.target.value })} required minLength={2} />
              <input className="field-sharp" placeholder="Username / handle" value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} minLength={3} />
              <input className="field-sharp" placeholder="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
              <input className="field-sharp" placeholder="Password" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required minLength={8} />
              <label className="panel-blade flex items-start gap-3 text-sm text-silver/70"><input type="checkbox" checked={form.termsAccepted} onChange={(e) => setForm({ ...form, termsAccepted: e.target.checked })} /> I accept the platform rules and understand public content is moderated before publishing.</label>
            </section>
          ) : null}

          {step === 2 ? (
            <section className="grid gap-4">
              <div className="grid gap-4 md:grid-cols-2"><input className="field-sharp" placeholder="Region / location" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} /><select className="field-sharp" value={form.memberType} onChange={(e) => setForm({ ...form, memberType: e.target.value as MemberType })}>{memberTypes.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}</select></div>
              <textarea className="field-sharp min-h-[110px]" placeholder="Short bio" value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} />
              <div><p className="mb-3 text-[10px] uppercase tracking-[0.24em] text-silver/44">Interest tags</p><div className="flex flex-wrap gap-2">{interestOptions.map((tag) => <button type="button" key={tag} onClick={() => setForm({ ...form, interestTags: toggle(form.interestTags, tag) })} className={`status-chip ${form.interestTags.includes(tag) ? 'border-white/30 bg-white/10 text-bone' : ''}`}>{tag}</button>)}</div></div>
              <div><p className="mb-3 text-[10px] uppercase tracking-[0.24em] text-silver/44">Preferred event types</p><div className="flex flex-wrap gap-2">{eventTypeOptions.map((tag) => <button type="button" key={tag} onClick={() => setForm({ ...form, preferredEventTypes: toggle(form.preferredEventTypes, tag) })} className={`status-chip ${form.preferredEventTypes.includes(tag) ? 'border-white/30 bg-white/10 text-bone' : ''}`}>{tag}</button>)}</div></div>
              <div className="grid gap-3 md:grid-cols-2"><label className="panel-blade flex items-center gap-3 text-sm"><input type="checkbox" checked={form.discoveryVisible} onChange={(e) => setForm({ ...form, discoveryVisible: e.target.checked })} /> Show me in member discovery</label><label className="panel-blade flex items-center gap-3 text-sm"><input type="checkbox" checked={form.newestMemberVisible} onChange={(e) => setForm({ ...form, newestMemberVisible: e.target.checked })} /> Show me in newest members</label></div>
              <label className="panel-blade"><span className="text-sm text-bone">Avatar upload</span><input className="mt-3 block w-full text-sm text-silver/70" type="file" accept="image/*" onChange={(e) => setAvatarFile(e.target.files?.[0] || null)} /></label>
            </section>
          ) : null}

          {step === 3 ? (
            <section className="grid gap-4">
              <p className="body-muted">Optional first garage vehicle. Skip it if the build is not ready or the exact car is uncommon.</p>
              <div className="grid gap-4 md:grid-cols-4"><select className="field-sharp" value={form.vehicleType} onChange={(e) => setForm({ ...form, vehicleType: e.target.value as any })}><option value="car">Car</option><option value="bike">Bike</option><option value="truck">Truck / 4x4</option><option value="other">Other</option></select><input className="field-sharp" placeholder="Year" value={form.year} onChange={(e) => setForm({ ...form, year: e.target.value })} /><input className="field-sharp" placeholder="Make" value={form.make} onChange={(e) => setForm({ ...form, make: e.target.value })} /><input className="field-sharp" placeholder="Model" value={form.model} onChange={(e) => setForm({ ...form, model: e.target.value })} /></div>
              <div className="grid gap-4 md:grid-cols-3"><input className="field-sharp" placeholder="Trim / variant" value={form.trim} onChange={(e) => setForm({ ...form, trim: e.target.value })} /><input className="field-sharp" placeholder="Special edition" value={form.specialEdition} onChange={(e) => setForm({ ...form, specialEdition: e.target.value })} /><input className="field-sharp" placeholder="Build stage" value={form.stage} onChange={(e) => setForm({ ...form, stage: e.target.value })} /></div>
            </section>
          ) : null}

          {step === 4 ? (
            <section className="grid gap-4 md:grid-cols-2">
              <Link to="/members/garage" className="panel-blade"><h3>Create garage</h3><p className="mt-3 text-sm text-silver/65">Build out the full dossier after account creation.</p></Link>
              <Link to="/members/communities" className="panel-blade"><h3>Create group</h3><p className="mt-3 text-sm text-silver/65">Start a crew page or join an existing community.</p></Link>
              <Link to="/submit" className="panel-blade"><h3>Submit event</h3><p className="mt-3 text-sm text-silver/65">Send a real event into admin review.</p></Link>
              <Link to="/businesses" className="panel-blade"><h3>List business later</h3><p className="mt-3 text-sm text-silver/65">Business listings go pending until admin approval.</p></Link>
            </section>
          ) : null}

          <div className="flex flex-wrap justify-between gap-3 border-t border-white/10 pt-5">
            <button type="button" className="btn-secondary h-11 px-4 text-[11px]" disabled={step === 1 || submitting} onClick={() => setStep((value) => Math.max(1, value - 1))}>Back</button>
            {step < 4 ? <button type="button" className="btn-primary h-11 px-4 text-[11px]" onClick={() => setStep((value) => Math.min(4, value + 1))}>Continue</button> : <button className="btn-primary h-11 px-5 text-[11px]" type="submit" disabled={submitting || !form.termsAccepted}>{submitting ? 'Creating…' : 'Create account'}</button>}
          </div>
          {error ? <p className="text-sm text-[#ff8f8f]">{error}</p> : null}
        </form>
        <p className="mt-5 text-sm text-silver/64">Already inside? <Link to="/sign-in" className="text-bone">Sign in</Link>.</p>
      </div>
    </div>
  );
}
