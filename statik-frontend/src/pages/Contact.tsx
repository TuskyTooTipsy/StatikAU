import { Link } from 'react-router-dom';
import { useState, type ChangeEvent, type FormEvent } from 'react';
import { submitContact } from '../api';
import { usePageMeta } from '../hooks/usePageMeta';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  usePageMeta('Contact', 'Support, collaboration, and media enquiries for STATIK.');

  const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setStatus('loading');

    try {
      await submitContact(form);
      setStatus('success');
      setForm({ name: '', email: '', message: '' });
    } catch (error) {
      console.error(error);
      setStatus('error');
    }
  };

  return (
    <div className="space-y-14 pb-10 pt-8">
      <section className="shell grid gap-8 xl:grid-cols-[0.95fr_1.05fr]">
        <div className="page-hero rounded-[2.5rem] border border-white/10 p-6 md:p-10">
          <p className="eyebrow">Contact / Support / Media</p>
          <h1 className="headline-xl mt-3">Reach the team with context, not friction.</h1>
          <p className="body-muted mt-5 max-w-2xl text-base">
            Use this page for support, order questions, collaboration proposals, wholesale conversations, or community and media submissions. Clear messages get cleaner replies.
          </p>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {[
              ['Support', 'Order issues, shipping questions, sizing, returns, and product assistance.'],
              ['Collaborations', 'Brand, campaign, and project conversations that fit the world of STATIK.'],
              ['Media / Community', 'Featured builds, event coverage, editorials, and submissions from the scene.'],
            ].map(([title, body]) => (
              <div key={title} className="rounded-[1.5rem] border border-white/10 bg-white/5 p-5">
                <p className="font-semibold text-bone">{title}</p>
                <p className="mt-3 text-sm leading-7 text-silver/65">{body}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="panel p-6 md:p-8">
          <h2 className="headline-md">Send a message</h2>
          <p className="body-muted mt-3">Expect polished support framing, stronger form UI, and a cleaner backend submission path.</p>
          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <div>
              <label htmlFor="name" className="text-xs uppercase tracking-[0.24em] text-silver/55">
                Name
              </label>
              <input id="name" name="name" value={form.name} onChange={handleChange} required className="field mt-3" />
            </div>
            <div>
              <label htmlFor="email" className="text-xs uppercase tracking-[0.24em] text-silver/55">
                Email
              </label>
              <input id="email" type="email" name="email" value={form.email} onChange={handleChange} required className="field mt-3" autoComplete="email" />
            </div>
            <div>
              <label htmlFor="message" className="text-xs uppercase tracking-[0.24em] text-silver/55">
                Message
              </label>
              <textarea id="message" name="message" rows={6} value={form.message} onChange={handleChange} required className="field mt-3 min-h-[180px] resize-y" />
            </div>
            <div className="flex flex-wrap gap-3">
              <button type="submit" className="btn-primary h-12 px-6 text-xs" disabled={status === 'loading'}>
                {status === 'loading' ? 'Sending…' : 'Send message'}
              </button>
              <Link className="btn-secondary h-12 px-6 text-xs" to="/faq">
                Read FAQ first
              </Link>
            </div>
            {status === 'success' ? <p className="text-sm text-emerald-300">Thanks — your message landed successfully.</p> : null}
            {status === 'error' ? <p className="text-sm text-red-300">We could not send your message just now. Please try again.</p> : null}
          </form>
        </div>
      </section>
    </div>
  );
}
