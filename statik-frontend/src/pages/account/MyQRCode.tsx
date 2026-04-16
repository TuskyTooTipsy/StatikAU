import { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import DashboardShell from '../../components/platform/DashboardShell';
import { accountNav } from '../../data/platform';
import { useSessionStore } from '../../store/session';

export default function MyQRCode() {
  const { currentProfile } = useSessionStore();
  const [src, setSrc] = useState('');
  const url = `https://statik.cc/u/${currentProfile.slug}`;

  useEffect(() => {
    QRCode.toDataURL(url, { margin: 1, width: 360, color: { dark: '#F5F7FA', light: '#050505' } }).then(setSrc).catch(console.error);
  }, [url]);

  return (
    <DashboardShell eyebrow="Account / qr" title="My QR code" nav={accountNav}>
      <div className="panel p-6 md:p-8">
        <div className="grid gap-8 xl:grid-cols-[360px_1fr] xl:items-center">
          <div className="rounded-[2rem] border border-white/10 bg-black p-4">{src ? <img src={src} alt="Profile QR code" className="mx-auto h-[320px] w-[320px] rounded-2xl" /> : null}</div>
          <div>
            <h2 className="text-2xl font-semibold text-bone">Use this everywhere your car shows up.</h2>
            <p className="mt-4 text-sm leading-7 text-silver/68">Windows, paddock boards, steering wheel quick cards, profile boards, helmet cases, stickers, promo cards, and event booth signage all become traffic sources when your QR drives people into your STATIK page.</p>
            <p className="mt-5 text-xs uppercase tracking-[0.22em] text-silver/55">{url}</p>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
