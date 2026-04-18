import { useEffect, useMemo, useState } from 'react';
import QRCode from 'qrcode';
import DashboardShell from '../../components/platform/DashboardShell';
import { accountNav } from '../../data/platform';
import { networkApi } from '../../api/network';
import type { NetworkShortLink } from '../../types/network';

export default function MyQRCode() {
  const [links, setLinks] = useState<NetworkShortLink[]>([]);
  const [selectedId, setSelectedId] = useState<string>('');
  const [src, setSrc] = useState('');

  useEffect(() => {
    networkApi.listMyShortLinks().then((payload) => {
      setLinks(payload);
      if (payload[0]) setSelectedId(payload[0].id);
    }).catch(console.error);
  }, []);

  const selected = useMemo(() => links.find((item) => item.id === selectedId) || links[0] || null, [links, selectedId]);

  useEffect(() => {
    if (!selected?.qrUrl) return;
    QRCode.toDataURL(selected.qrUrl, { margin: 1, width: 420, color: { dark: '#F5F7FA', light: '#050505' } }).then(setSrc).catch(console.error);
  }, [selected?.qrUrl]);

  return (
    <DashboardShell eyebrow="Members / QR" title="QR deployment assets" nav={accountNav}>
      <div className="panel-cut p-6 md:p-8">
        <div className="grid gap-8 xl:grid-cols-[360px_1fr] xl:items-start">
          <div className="border border-white/10 bg-black p-4" style={{ clipPath: 'polygon(0 0, calc(100% - 14px) 0, 100% 14px, 100% 100%, 14px 100%, 0 calc(100% - 14px))' }}>
            {src ? <img src={src} alt="QR code" className="mx-auto h-[320px] w-[320px]" /> : <div className="h-[320px] bg-white/5" />}
          </div>
          <div className="space-y-4">
            <div>
              <p className="eyebrow">Active destination</p>
              <select className="field-sharp mt-4 max-w-xl" value={selected?.id || ''} onChange={(e) => setSelectedId(e.target.value)}>
                {links.map((link) => <option key={link.id} value={link.id}>{link.targetType} • {link.slug}</option>)}
              </select>
            </div>
            <div className="panel-blade">
              <h3>{selected?.shortUrl || 'No share URL yet'}</h3>
              <p className="mt-3 text-sm leading-7 text-silver/68">This QR encodes the tracked STATIK short link, so scans feed back into the real click + QR analytics stack instead of a fake client-only generator.</p>
              {src ? <a href={src} download={`statik-${selected?.slug || 'qr'}.png`} className="btn-primary mt-5 h-11 px-4 text-[11px]">Download PNG</a> : null}
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              <div className="panel-blade"><h3>Good placements</h3><p className="mt-3 text-sm text-silver/68">Event boards, pit sheets, build placards, trailer windows, and garage wall cards.</p></div>
              <div className="panel-blade"><h3>Real tracking</h3><p className="mt-3 text-sm text-silver/68">QR scans use the short-link redirect path with qr source tagging, so scan totals are not guessed.</p></div>
            </div>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
