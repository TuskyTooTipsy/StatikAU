import type { ReactNode } from 'react';

interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: ReactNode;
  align?: 'left' | 'center';
}

export default function SectionHeading({
  eyebrow,
  title,
  description,
  action,
  align = 'left',
}: SectionHeadingProps) {
  return (
    <div className={`flex flex-col gap-5 ${align === 'center' ? 'items-center text-center' : 'md:flex-row md:items-end md:justify-between'}`}>
      <div className={`max-w-2xl ${align === 'center' ? 'items-center text-center' : ''}`}>
        {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
        <h2 className="headline-lg mt-3">{title}</h2>
        {description ? <p className="body-muted mt-4 max-w-2xl">{description}</p> : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}
