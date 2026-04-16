import type { ReactNode } from 'react';

export default function EmptyPanel({ eyebrow, title, body, action }: { eyebrow: string; title: string; body: string; action?: ReactNode }) {
  return (
    <div className="panel-cut p-6 md:p-8">
      <p className="eyebrow">{eyebrow}</p>
      <h3 className="mt-3 text-2xl font-semibold tracking-[-0.04em] text-bone">{title}</h3>
      <p className="body-muted mt-3 max-w-2xl">{body}</p>
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  );
}
