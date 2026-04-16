import { useState, type FormEvent } from 'react';
import { submitNewsletter } from '../api';

export default function NewsletterSignup({ compact = false }: { compact?: boolean }) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setStatus('loading');

    try {
      await submitNewsletter({ email });
      setStatus('success');
      setEmail('');
    } catch (error) {
      console.error(error);
      setStatus('error');
    }
  };

  return (
    <form onSubmit={handleSubmit} className={`space-y-4 ${compact ? '' : 'panel p-6 md:p-8'}`}>
      {!compact ? (
        <div className="max-w-xl">
          <p className="eyebrow">Join the signal</p>
          <h3 className="headline-md mt-3">Get first access to drops, editorials, and category launches.</h3>
          <p className="body-muted mt-3">
            STATIK mail is for launch alerts, collection notes, and community features — not inbox noise.
          </p>
        </div>
      ) : null}
      <div className={`grid gap-3 ${compact ? 'md:grid-cols-[1fr_auto]' : 'md:grid-cols-[1fr_auto]'}`}>
        <label className="sr-only" htmlFor={`newsletter-email-${compact ? 'compact' : 'full'}`}>
          Email address
        </label>
        <input
          id={`newsletter-email-${compact ? 'compact' : 'full'}`}
          type="email"
          className="field"
          placeholder="Email address"
          autoComplete="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
        <button type="submit" className="btn-primary min-w-[180px]" disabled={status === 'loading'}>
          {status === 'loading' ? 'Joining…' : 'Get drop access'}
        </button>
      </div>
      {status === 'success' ? (
        <p className="text-sm text-emerald-300">You’re in. Expect launch notes, featured drop access, and community updates.</p>
      ) : null}
      {status === 'error' ? (
        <p className="text-sm text-red-300">We could not save your email just now. Please try again.</p>
      ) : null}
    </form>
  );
}
