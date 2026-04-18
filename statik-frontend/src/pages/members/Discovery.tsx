import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import AvatarBadge from '../../components/AvatarBadge';
import DashboardShell from '../../components/platform/DashboardShell';
import EmptyPanel from '../../components/EmptyPanel';
import { networkApi } from '../../api/network';
import { accountNav } from '../../data/platform';
import type { NetworkProfile } from '../../types/network';

export default function MemberDiscoveryPage() {
  const [members, setMembers] = useState<NetworkProfile[]>([]);
  const [q, setQ] = useState('');
  const [memberType, setMemberType] = useState('');
  const [error, setError] = useState<string | null>(null);

  async function load() {
    try {
      setError(null);
      const payload = await networkApi.getNewestMembers({ limit: 80 });
      setMembers(payload.items || []);
    } catch (err: any) {
      setError(err.message || 'Member discovery failed to load.');
    }
  }

  useEffect(() => { void load(); }, []);

  const memberTypes = useMemo(() => Array.from(new Set(members.map((member) => member.memberType).filter(Boolean))) as string[], [members]);
  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return members.filter((member) => {
      const matchesType = !memberType || member.memberType === memberType;
      const matchesQ = !needle || [member.displayName, member.username, member.location, member.bio, member.primaryCar, member.memberType, ...(member.interestTags || [])].join(' ').toLowerCase().includes(needle);
      return matchesType && matchesQ;
    });
  }, [members, q, memberType]);

  return (
    <DashboardShell eyebrow="Members / discovery" title="Newest members and profile discovery" nav={accountNav}>
      <section className="panel-cut p-6 md:p-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="eyebrow">Real members only</p>
            <h2 className="headline-md mt-3">Discover newly joined profiles that opted into visibility.</h2>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-silver/68">Banned, suspended, private, and discovery-hidden accounts do not appear here. No fake member cards.</p>
          </div>
          <button className="btn-secondary h-11 px-5 text-xs" type="button" onClick={() => void load()}>Refresh</button>
        </div>
        <div className="mt-6 grid gap-3 md:grid-cols-[1fr_240px]">
          <input className="field-sharp" value={q} onChange={(event) => setQ(event.target.value)} placeholder="Search member, region, car, tags…" />
          <select className="field-sharp" value={memberType} onChange={(event) => setMemberType(event.target.value)}>
            <option value="">All member types</option>
            {memberTypes.map((type) => <option key={type} value={type}>{type.replaceAll('_', ' ')}</option>)}
          </select>
        </div>
        {error ? <p className="mt-4 text-sm text-[#ff8f8f]">{error}</p> : null}
        {filtered.length ? (
          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {filtered.map((member) => (
              <Link key={member.id} to={`/profiles/${member.slug}`} className="panel-blade transition hover:border-white/20">
                <div className="flex items-center gap-3">
                  <AvatarBadge name={member.displayName} src={member.avatarUrl} size="md" />
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="truncate text-bone">{member.displayName}</h3>
                      {member.verified ? <span className="status-chip">verified</span> : null}
                      {member.promoted ? <span className="status-chip">promoted</span> : null}
                    </div>
                    <p className="mt-1 text-xs uppercase tracking-[0.18em] text-silver/45">{member.username ? `@${member.username}` : member.slug}</p>
                  </div>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {member.memberType ? <span className="status-chip">{member.memberType.replaceAll('_', ' ')}</span> : null}
                  {member.showLocation !== false && member.location ? <span className="status-chip">{member.location}</span> : null}
                  {member.featuredVehicle ? <span className="status-chip">{member.featuredVehicle.make} {member.featuredVehicle.model}</span> : null}
                </div>
                <p className="mt-4 text-sm leading-7 text-silver/70">{member.bio || 'No bio added yet.'}</p>
              </Link>
            ))}
          </div>
        ) : (
          <div className="mt-6"><EmptyPanel eyebrow="Newest members" title="No visible members yet" body="When real users opt into discovery, they appear here. Private or incomplete profiles stay hidden." /></div>
        )}
      </section>
    </DashboardShell>
  );
}
