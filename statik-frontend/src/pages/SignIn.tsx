import type { FormEvent } from 'react';
import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { networkApi } from '../api/network';
import { useSessionStore } from '../store/session';

export default function SignInPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const applyAuthPayload = useSessionStore((state) => state.applyAuthPayload);
  const navigate = useNavigate();
  const location = useLocation() as { state?: { from?: string } };

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const payload = await networkApi.login({ email, password });
      applyAuthPayload(payload);
      navigate(location.state?.from || '/members');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="shell py-12">
      <div className="mx-auto max-w-2xl page-hero-cut p-6 md:p-8">
        <p className="eyebrow">Sign in</p>
        <h1 className="headline-lg mt-3">Enter the member layer.</h1>
        <p className="body-muted mt-4">Friend requests, community chat, real event intent, and profile interaction all sit behind the account layer.</p>
        <form onSubmit={handleSubmit} className="mt-8 grid gap-4">
          <input className="field-sharp" placeholder="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <input className="field-sharp" placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={8} />
          <button className="btn-primary h-12 justify-center text-[11px]" type="submit" disabled={submitting}>{submitting ? 'Entering…' : 'Sign in'}</button>
          {error ? <p className="text-sm text-[#ff8f8f]">{error}</p> : null}
        </form>
        <p className="mt-5 text-sm text-silver/64">Need an account? <Link to="/join" className="text-bone">Create one here</Link>.</p>
      </div>
    </div>
  );
}
