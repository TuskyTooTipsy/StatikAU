import type { FormEvent } from 'react';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { networkApi } from '../api/network';
import { useSessionStore } from '../store/session';

export default function JoinPage() {
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [needsBootstrap, setNeedsBootstrap] = useState(false);
  const applyAuthPayload = useSessionStore((state) => state.applyAuthPayload);
  const navigate = useNavigate();

  useEffect(() => {
    networkApi.getPublicPlatform().then((payload) => setNeedsBootstrap(payload.needsAdminBootstrap)).catch(() => undefined);
  }, []);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const payload = await networkApi.register({ displayName, email, password });
      applyAuthPayload(payload);
      navigate('/members');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="shell py-12">
      <div className="mx-auto max-w-2xl page-hero-cut p-6 md:p-8">
        <p className="eyebrow">Create account</p>
        <h1 className="headline-lg mt-3">Get inside the network.</h1>
        <p className="body-muted mt-4">This is where event intent, community chat, friends, and member discovery actually start to matter.</p>
        {needsBootstrap ? <div className="mt-5 panel-blade"><h3>Founding admin setup</h3><p>The first account on a fresh install becomes the admin account so the platform can be configured without fake seeded users.</p></div> : null}
        <form onSubmit={handleSubmit} className="mt-8 grid gap-4">
          <input className="field-sharp" placeholder="Display name" value={displayName} onChange={(e) => setDisplayName(e.target.value)} required minLength={2} />
          <input className="field-sharp" placeholder="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <input className="field-sharp" placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={8} />
          <button className="btn-primary h-12 justify-center text-[11px]" type="submit" disabled={submitting}>{submitting ? 'Creating…' : 'Create account'}</button>
          {error ? <p className="text-sm text-[#ff8f8f]">{error}</p> : null}
        </form>
        <p className="mt-5 text-sm text-silver/64">Already inside? <Link to="/sign-in" className="text-bone">Sign in</Link>.</p>
      </div>
    </div>
  );
}
