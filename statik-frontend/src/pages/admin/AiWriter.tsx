import { FormEvent, useState } from 'react';
import DashboardShell from '../../components/platform/DashboardShell';
import { adminNav } from '../../data/platform';
import { networkApi } from '../../api/network';

export default function AdminAiWriterPage() {
  const [form, setForm] = useState({ contentType: 'article' as 'article' | 'news', mode: 'draft', tone: 'sharp premium automotive editorial', length: 'medium', prompt: '', sourceContext: '' });
  const [output, setOutput] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function submit(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    try {
      const result = await networkApi.generateAiDraft(form);
      setOutput(result.output);
      setMessage('Draft generated and audit logged. It is not public until inserted into CMS and manually published.');
    } catch (err: any) {
      setMessage(err.message);
    } finally { setLoading(false); }
  }

  return (
    <DashboardShell eyebrow="Admin / AI writer" title="AI draft writer" nav={adminNav}>
      <div className="grid gap-6 xl:grid-cols-[0.85fr_1.15fr]">
        <form onSubmit={submit} className="panel-cut space-y-4 p-5">
          <p className="body-muted">Admin-only draft generation. The writer is constrained to provided source notes and linked platform facts. It must not fabricate events, quotes, stats, sponsors, attendance, or people.</p>
          <div className="grid gap-3 md:grid-cols-2"><select className="field-sharp" value={form.contentType} onChange={(e) => setForm({ ...form, contentType: e.target.value as any })}><option value="article">Article</option><option value="news">News</option></select><select className="field-sharp" value={form.mode} onChange={(e) => setForm({ ...form, mode: e.target.value })}><option value="draft">Full draft</option><option value="outline">Outline/questions</option><option value="headline">Headlines</option><option value="seo">SEO package</option><option value="recap">Event recap</option><option value="spotlight">Business/member spotlight</option></select></div>
          <div className="grid gap-3 md:grid-cols-2"><input className="field-sharp" value={form.tone} onChange={(e) => setForm({ ...form, tone: e.target.value })} /><select className="field-sharp" value={form.length} onChange={(e) => setForm({ ...form, length: e.target.value })}><option value="short">Short</option><option value="medium">Medium</option><option value="long">Long</option></select></div>
          <textarea className="field-sharp min-h-[150px]" placeholder="Source notes. Add exact facts, event details, business/service info, approved quotes, links, and what must not be invented." value={form.sourceContext} onChange={(e) => setForm({ ...form, sourceContext: e.target.value })} />
          <textarea className="field-sharp min-h-[120px]" placeholder="Instruction / prompt" value={form.prompt} onChange={(e) => setForm({ ...form, prompt: e.target.value })} />
          <button className="btn-primary h-12 justify-center text-[11px]" disabled={loading}>{loading ? 'Generating…' : 'Generate draft'}</button>
          {message ? <p className="text-sm text-silver/70">{message}</p> : null}
        </form>
        <section className="panel-cut p-5">
          <p className="eyebrow">Generated draft</p>
          {output ? <textarea className="field-sharp mt-4 min-h-[520px] whitespace-pre-line" value={output} onChange={(e) => setOutput(e.target.value)} /> : <div className="mt-4 panel-blade"><h3>No draft yet</h3><p className="mt-3 text-sm leading-7 text-silver/65">If AI is not configured, this panel will show the backend configuration warning and manual CMS remains fully usable.</p></div>}
        </section>
      </div>
    </DashboardShell>
  );
}
