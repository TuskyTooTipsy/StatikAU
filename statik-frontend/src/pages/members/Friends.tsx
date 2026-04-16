import { useEffect, useState } from 'react';
import AvatarBadge from '../../components/AvatarBadge';
import EmptyPanel from '../../components/EmptyPanel';
import { networkApi } from '../../api/network';
import type { FriendsPayload } from '../../types/network';

export default function FriendsPage() {
  const [data, setData] = useState<FriendsPayload | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    try {
      const payload = await networkApi.getFriends();
      setData(payload);
    } catch (err: any) {
      setError(err.message);
    }
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="shell space-y-8 pb-16 pt-8">
      <div className="page-hero-cut p-6 md:p-8">
        <p className="eyebrow">Friends</p>
        <h1 className="headline-lg mt-3">Real connection states, not vanity follows.</h1>
        <p className="body-muted mt-4">Requests, approvals, removals, and pending states are all real and tied to actual member accounts.</p>
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <div className="panel-cut p-6 md:p-8">
          <p className="eyebrow">Incoming</p>
          <div className="mt-6 grid gap-3">
            {data?.incoming?.length ? data.incoming.map((item) => item.profile ? (
              <div key={item.request.id} className="panel-blade">
                <div className="flex items-center gap-3">
                  <AvatarBadge name={item.profile.displayName} src={item.profile.avatarUrl} size="md" />
                  <div>
                    <p className="font-semibold text-bone">{item.profile.displayName}</p>
                    <p className="text-xs uppercase tracking-[0.2em] text-silver/50">{item.profile.primaryCar || 'Member'}</p>
                  </div>
                </div>
                <div className="mt-4 flex gap-3">
                  <button type="button" onClick={async () => { await networkApi.respondFriendRequest(item.request.id, 'accept'); load(); }} className="btn-primary h-10 px-4 text-[11px]">Accept</button>
                  <button type="button" onClick={async () => { await networkApi.respondFriendRequest(item.request.id, 'reject'); load(); }} className="btn-secondary h-10 px-4 text-[11px]">Reject</button>
                </div>
              </div>
            ) : null) : <EmptyPanel eyebrow="Incoming" title="No pending requests" body="When another member tries to connect, it will land here." />}
          </div>
        </div>

        <div className="panel-cut p-6 md:p-8">
          <p className="eyebrow">Outgoing</p>
          <div className="mt-6 grid gap-3">
            {data?.outgoing?.length ? data.outgoing.map((item) => item.profile ? (
              <div key={item.request.id} className="panel-blade">
                <div className="flex items-center gap-3">
                  <AvatarBadge name={item.profile.displayName} src={item.profile.avatarUrl} size="md" />
                  <div>
                    <p className="font-semibold text-bone">{item.profile.displayName}</p>
                    <p className="text-xs uppercase tracking-[0.2em] text-silver/50">Awaiting response</p>
                  </div>
                </div>
              </div>
            ) : null) : <EmptyPanel eyebrow="Outgoing" title="No outgoing requests" body="Requests you send show here until the other member answers." />}
          </div>
        </div>

        <div className="panel-cut p-6 md:p-8">
          <p className="eyebrow">Friends</p>
          <div className="mt-6 grid gap-3">
            {data?.friends?.length ? data.friends.map((profile) => (
              <div key={profile.id} className="panel-blade">
                <div className="flex items-center gap-3">
                  <AvatarBadge name={profile.displayName} src={profile.avatarUrl} size="md" />
                  <div>
                    <p className="font-semibold text-bone">{profile.displayName}</p>
                    <p className="text-xs uppercase tracking-[0.2em] text-silver/50">{profile.primaryCar || 'Member'}</p>
                  </div>
                </div>
                <button type="button" onClick={async () => { await networkApi.removeFriend(profile.userId); load(); }} className="btn-secondary mt-4 h-10 px-4 text-[11px]">Remove</button>
              </div>
            )) : <EmptyPanel eyebrow="Friends" title="No friends yet" body="The friend system stays honest. It fills up only when both sides say yes." />}
          </div>
        </div>
      </div>

      {error ? <p className="text-sm text-[#ff8f8f]">{error}</p> : null}
    </div>
  );
}
