import { Link, useParams } from 'react-router-dom';
import QRCode from 'qrcode';
import { useEffect, useMemo, useState } from 'react';
import { profiles } from '../data/platform';
import { usePageMeta } from '../hooks/usePageMeta';

export default function ProfileDetail() {
  const { slug } = useParams();
  const profile = profiles.find((item) => item.slug === slug) || profiles[0];
  const [qrSrc, setQrSrc] = useState('');
  const profileUrl = `https://statik.cc/u/${profile.slug}`;

  usePageMeta(profile.displayName, profile.bio);

  useEffect(() => {
    QRCode.toDataURL(profileUrl, { margin: 1, width: 320, color: { dark: '#F5F7FA', light: '#050505' } }).then(setQrSrc).catch(console.error);
  }, [profileUrl]);

  const topLinks = useMemo(() => [...profile.links].sort((a, b) => b.clicks - a.clicks), [profile.links]);

  return (
    <div className="space-y-10 pb-12 pt-8">
      <section className="shell">
        <div className="relative overflow-hidden rounded-[2.75rem] border border-white/10">
          <img src={profile.banner} alt={profile.displayName} className="h-[500px] w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/55 to-black/10" />
          <div className="absolute inset-x-0 bottom-0 p-6 md:p-10">
            <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
              <div className="flex items-end gap-5">
                <img src={profile.avatar} alt={profile.displayName} className="h-28 w-28 rounded-full border border-white/15 object-cover shadow-2xl shadow-black/50" />
                <div>
                  <p className="eyebrow">Public profile / QR ready</p>
                  <h1 className="headline-md mt-2">{profile.displayName}</h1>
                  <p className="mt-3 text-base text-silver/72">{profile.location} • {profile.primaryCar}</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-3">
                <button type="button" className="btn-primary h-11 px-5 text-xs">Share profile</button>
                <button type="button" className="btn-secondary h-11 px-5 text-xs">Download QR</button>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="shell grid gap-8 xl:grid-cols-[1fr_340px]">
        <div className="space-y-6">
          <div className="panel p-6 md:p-8">
            <p className="eyebrow">Bio</p>
            <p className="mt-4 max-w-3xl text-base leading-8 text-silver/74">{profile.bio}</p>
            <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-4"><p className="text-xs uppercase tracking-[0.24em] text-silver/50">Views</p><p className="mt-3 text-2xl font-semibold text-bone">{profile.analytics.profileViews}</p></div>
              <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-4"><p className="text-xs uppercase tracking-[0.24em] text-silver/50">QR visits</p><p className="mt-3 text-2xl font-semibold text-bone">{profile.analytics.qrVisits}</p></div>
              <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-4"><p className="text-xs uppercase tracking-[0.24em] text-silver/50">Link clicks</p><p className="mt-3 text-2xl font-semibold text-bone">{profile.analytics.linkClicks}</p></div>
              <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-4"><p className="text-xs uppercase tracking-[0.24em] text-silver/50">Engagement</p><p className="mt-3 text-2xl font-semibold text-bone">{profile.analytics.engagementRate}</p></div>
            </div>
          </div>
          <div className="panel p-6 md:p-8">
            <p className="eyebrow">Garage</p>
            <div className="mt-4 grid gap-5 md:grid-cols-2">
              {profile.garage.map((car) => (
                <div key={car.id} className="overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.03]">
                  <img src={car.image} alt={car.name} className="h-56 w-full object-cover" />
                  <div className="space-y-3 p-5">
                    <h3 className="text-xl font-semibold text-bone">{car.name}</h3>
                    <p className="text-sm text-silver/62">{car.chassis}</p>
                    <p className="text-sm text-silver/72">{car.power}</p>
                    <p className="text-sm leading-7 text-silver/64">{car.setup}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="panel p-6 md:p-8">
            <p className="eyebrow">Approved gallery</p>
            <div className="mt-4 grid gap-4 md:grid-cols-3">
              {profile.media.map((item) => (
                <div key={item.id} className="overflow-hidden rounded-[1.75rem] border border-white/10 bg-white/[0.03]">
                  {item.type === 'video' ? (
                    <video src={item.url} poster={profile.banner} className="h-48 w-full object-cover" controls muted loop />
                  ) : (
                    <img src={item.url} alt={item.caption} className="h-48 w-full object-cover" />
                  )}
                  <p className="p-4 text-sm text-silver/68">{item.caption}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="space-y-5">
          <div className="panel p-6">
            <p className="eyebrow">QR code</p>
            <div className="mt-4 rounded-[2rem] border border-white/10 bg-black p-4">
              {qrSrc ? <img src={qrSrc} alt={`${profile.displayName} QR code`} className="mx-auto h-64 w-64 rounded-2xl" /> : null}
            </div>
            <p className="mt-4 text-xs uppercase tracking-[0.22em] text-silver/55">{profileUrl}</p>
          </div>
          <div className="panel p-6">
            <p className="eyebrow">Top links</p>
            <div className="mt-4 space-y-3">
              {topLinks.map((link) => (
                <a key={link.id} href={link.href} className="block rounded-[1.5rem] border border-white/10 bg-white/5 p-4 transition hover:border-white/20">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-sm font-semibold text-bone">{link.label}</p>
                      <p className="mt-1 text-xs uppercase tracking-[0.22em] text-silver/55">{link.type}</p>
                    </div>
                    <p className="text-sm text-silver/65">{link.clicks} clicks</p>
                  </div>
                </a>
              ))}
            </div>
          </div>
          <div className="panel p-6">
            <p className="eyebrow">Sponsors</p>
            <div className="mt-4 flex flex-wrap gap-3">
              {profile.sponsors.map((sponsor) => <span key={sponsor} className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs uppercase tracking-[0.22em] text-bone">{sponsor}</span>)}
            </div>
          </div>
          <div className="panel p-6">
            <p className="eyebrow">Socials</p>
            <div className="mt-4 space-y-3">
              {profile.socials.map((social) => (
                <a key={social.platform} href={social.url} className="block text-sm text-silver/72 transition hover:text-bone">{social.platform} • {social.handle}</a>
              ))}
            </div>
            <Link to="/events" className="mt-5 inline-flex items-center gap-2 text-xs uppercase tracking-[0.24em] text-bone">See featured events ↗</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
