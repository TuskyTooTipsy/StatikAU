import { FormEvent, useState } from 'react';
import { usePageMeta } from '../hooks/usePageMeta';

const submissionTypes = ['Event submission', 'Car photo set', 'Short video', 'Community spotlight', 'Sponsor placement', 'Brand deal request', 'Business promo'];

export default function Submit() {
  const [submitted, setSubmitted] = useState(false);
  usePageMeta('Submit', 'Submit events, media, brand deals, and community content into the STATIK moderation pipeline.');

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setSubmitted(true);
  }

  return (
    <div className="shell space-y-10 py-8">
      <div className="page-hero rounded-[2.5rem] border border-white/10 p-6 md:p-10">
        <p className="eyebrow">Moderated intake / nothing self-publishes</p>
        <h1 className="headline-lg mt-3">Every submission goes through review.</h1>
        <p className="body-muted mt-5 max-w-3xl text-base">Events, images, short clips, spotlights, sponsor deals, and business promotions all enter the same structured moderation system with status tracking, admin notes, and revision requests.</p>
      </div>
      <div className="grid gap-8 xl:grid-cols-[1fr_340px]">
        <form onSubmit={handleSubmit} className="panel space-y-5 p-6 md:p-8">
          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <label className="text-xs uppercase tracking-[0.24em] text-silver/50">Full name</label>
              <input className="field mt-3" placeholder="Your name" />
            </div>
            <div>
              <label className="text-xs uppercase tracking-[0.24em] text-silver/50">Email</label>
              <input type="email" className="field mt-3" placeholder="name@email.com" />
            </div>
          </div>
          <div>
            <label className="text-xs uppercase tracking-[0.24em] text-silver/50">Submission type</label>
            <select className="field mt-3">
              {submissionTypes.map((item) => <option key={item}>{item}</option>)}
            </select>
          </div>
          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <label className="text-xs uppercase tracking-[0.24em] text-silver/50">Title</label>
              <input className="field mt-3" placeholder="Submission title" />
            </div>
            <div>
              <label className="text-xs uppercase tracking-[0.24em] text-silver/50">Location / source</label>
              <input className="field mt-3" placeholder="Location or reference source" />
            </div>
          </div>
          <div>
            <label className="text-xs uppercase tracking-[0.24em] text-silver/50">Details</label>
            <textarea className="field mt-3 min-h-[180px]" placeholder="Describe the event, build, media, sponsor offer, or collaboration request." />
          </div>
          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <label className="text-xs uppercase tracking-[0.24em] text-silver/50">Media upload placeholder</label>
              <div className="mt-3 rounded-[1.75rem] border border-dashed border-white/15 bg-white/[0.03] px-5 py-10 text-sm text-silver/60">Images and sub-30-second videos would be validated, scanned, and staged here.</div>
            </div>
            <div>
              <label className="text-xs uppercase tracking-[0.24em] text-silver/50">Moderation acknowledgement</label>
              <div className="mt-3 rounded-[1.75rem] border border-white/10 bg-white/[0.03] p-5 text-sm leading-7 text-silver/68">By submitting, you acknowledge that STATIK may approve, reject, request changes, or hold content for review before any public display.</div>
            </div>
          </div>
          <button type="submit" className="btn-primary h-12 px-6 text-xs">Submit to moderation queue</button>
          {submitted ? <p className="text-sm text-bone">Submission staged. In the production flow this would create a moderation record, notification state, and audit trail entry.</p> : null}
        </form>
        <div className="space-y-5">
          <div className="panel p-6">
            <p className="eyebrow">Pipeline states</p>
            <div className="mt-4 space-y-3 text-sm text-silver/68">
              <p>1. Submission received</p>
              <p>2. Validation + media checks</p>
              <p>3. Moderator review</p>
              <p>4. Approval / rejection / revision request</p>
              <p>5. Audit log + notification update</p>
            </div>
          </div>
          <div className="panel p-6">
            <p className="eyebrow">Best-fit use cases</p>
            <div className="mt-4 space-y-4 text-sm leading-7 text-silver/68">
              <p>• user-submitted events</p>
              <p>• car photos and reels</p>
              <p>• community spotlights</p>
              <p>• business and sponsor submissions</p>
              <p>• brand deal opportunities</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
