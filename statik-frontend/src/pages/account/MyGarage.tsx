import type { FormEvent } from 'react';
import { useEffect, useState } from 'react';
import DashboardShell from '../../components/platform/DashboardShell';
import MediaGrid from '../../components/platform/MediaGrid';
import { accountNav } from '../../data/platform';
import { networkApi } from '../../api/network';
import { uploadMediaFile } from '../../api/uploads';
import { useSessionStore } from '../../store/session';
import type { GarageVehicle } from '../../types/network';

export default function MyGarage() {
  const viewerProfile = useSessionStore((state) => state.viewerProfile);
  const [garage, setGarage] = useState<GarageVehicle[]>([]);
  const [message, setMessage] = useState<string | null>(null);
  const [newVehicle, setNewVehicle] = useState({
    vehicleType: 'car' as const,
    year: '',
    make: '',
    model: '',
    trim: '',
    nickname: '',
    stage: '',
    description: '',
    statusTags: '',
    modTags: '',
    visibility: 'public' as 'public' | 'private',
  });
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({});
  const [draftMediaIds, setDraftMediaIds] = useState<string[]>([]);

  async function load() {
    try {
      setGarage(await networkApi.getMyGarage());
    } catch (error: any) {
      setMessage(error.message);
    }
  }

  useEffect(() => { load(); }, []);

  async function handleCreate(event: FormEvent) {
    event.preventDefault();
    try {
      await networkApi.createGarageVehicle({
        ...newVehicle,
        statusTags: newVehicle.statusTags.split(',').map((item) => item.trim()).filter(Boolean),
        modTags: newVehicle.modTags.split(',').map((item) => item.trim()).filter(Boolean),
        mediaIds: draftMediaIds,
      });
      setNewVehicle({ vehicleType: 'car', year: '', make: '', model: '', trim: '', nickname: '', stage: '', description: '', statusTags: '', modTags: '', visibility: 'public' });
      setDraftMediaIds([]);
      setUploadProgress({});
      load();
      setMessage('Vehicle added to your garage.');
    } catch (error: any) {
      setMessage(error.message);
    }
  }

  async function handleDraftUpload(file?: File | null) {
    if (!file || !viewerProfile) return;
    const tempKey = `draft-${Date.now()}`;
    try {
      const uploaded = await uploadMediaFile(file, 'profile', viewerProfile.id, (value) => setUploadProgress((prev) => ({ ...prev, [tempKey]: value })));
      setDraftMediaIds((prev) => [...prev, uploaded.id]);
      setUploadProgress((prev) => ({ ...prev, [tempKey]: 100 }));
    } catch (error: any) {
      setMessage(error.message || 'Upload failed');
      setUploadProgress((prev) => ({ ...prev, [tempKey]: 0 }));
    }
  }

  return (
    <DashboardShell eyebrow="Members / garage" title="Build dossier registry" nav={accountNav}>
      <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <div className="panel-cut p-6 md:p-8">
          <p className="eyebrow">Registered bays</p>
          <div className="mt-6 grid gap-4">
            {garage.length ? garage.map((vehicle) => (
              <div key={vehicle.id} className="panel-blade space-y-4">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h3>{[vehicle.year, vehicle.make, vehicle.model].filter(Boolean).join(' ') || 'Untitled vehicle'}</h3>
                      {vehicle.nickname ? <span className="status-chip">{vehicle.nickname}</span> : null}
                      {vehicle.featured ? <span className="status-chip">featured bay</span> : null}
                    </div>
                    <p className="mt-2 text-sm text-silver/70">{vehicle.trim || 'No trim'} • {vehicle.vehicleType} • {vehicle.visibility}</p>
                    <p className="mt-3 text-sm leading-7 text-silver/72">{vehicle.description || 'No build description yet.'}</p>
                  </div>
                  <button type="button" onClick={async () => { await networkApi.deleteGarageVehicle(vehicle.id); load(); }} className="btn-secondary h-10 px-4 text-[11px]">Remove</button>
                </div>
                <div className="flex flex-wrap gap-2">{vehicle.statusTags.map((tag) => <span key={tag} className="status-chip">{tag}</span>)}</div>
                {vehicle.media?.length ? <MediaGrid media={vehicle.media} compact /> : <div className="text-sm text-silver/56">No gallery media attached yet.</div>}
              </div>
            )) : <div className="panel-blade text-sm text-silver/62">No vehicles added yet. Register your first machine to turn the garage into a real identity surface.</div>}
          </div>
        </div>

        <div className="panel-cut p-6 md:p-8">
          <p className="eyebrow">Add machine</p>
          <form className="mt-6 grid gap-4" onSubmit={handleCreate}>
            <div className="grid gap-4 md:grid-cols-2">
              <select className="field-sharp" value={newVehicle.vehicleType} onChange={(e) => setNewVehicle({ ...newVehicle, vehicleType: e.target.value as 'car' | 'bike' | 'truck' | 'other' })}>
                <option value="car">Car</option>
                <option value="bike">Bike</option>
                <option value="truck">Truck</option>
                <option value="other">Other</option>
              </select>
              <input className="field-sharp" placeholder="Year" value={newVehicle.year} onChange={(e) => setNewVehicle({ ...newVehicle, year: e.target.value })} />
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <input className="field-sharp" placeholder="Make" value={newVehicle.make} onChange={(e) => setNewVehicle({ ...newVehicle, make: e.target.value })} required />
              <input className="field-sharp" placeholder="Model" value={newVehicle.model} onChange={(e) => setNewVehicle({ ...newVehicle, model: e.target.value })} required />
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <input className="field-sharp" placeholder="Trim / chassis" value={newVehicle.trim} onChange={(e) => setNewVehicle({ ...newVehicle, trim: e.target.value })} />
              <input className="field-sharp" placeholder="Nickname / bay name" value={newVehicle.nickname} onChange={(e) => setNewVehicle({ ...newVehicle, nickname: e.target.value })} />
            </div>
            <input className="field-sharp" placeholder="Build stage" value={newVehicle.stage} onChange={(e) => setNewVehicle({ ...newVehicle, stage: e.target.value })} />
            <textarea className="field-sharp min-h-[140px]" placeholder="Build intent / spec notes / philosophy" value={newVehicle.description} onChange={(e) => setNewVehicle({ ...newVehicle, description: e.target.value })} />
            <input className="field-sharp" placeholder="Status tags, comma separated" value={newVehicle.statusTags} onChange={(e) => setNewVehicle({ ...newVehicle, statusTags: e.target.value })} />
            <input className="field-sharp" placeholder="Mods / parts / setup tags, comma separated" value={newVehicle.modTags} onChange={(e) => setNewVehicle({ ...newVehicle, modTags: e.target.value })} />
            <select className="field-sharp" value={newVehicle.visibility} onChange={(e) => setNewVehicle({ ...newVehicle, visibility: e.target.value as 'public' | 'private' })}>
              <option value="public">Public dossier</option>
              <option value="private">Private dossier</option>
            </select>
            <input type="file" accept="image/*,video/*" className="field-sharp" multiple onChange={(e) => Array.from(e.target.files || []).forEach((file) => void handleDraftUpload(file))} />
            {Object.keys(uploadProgress).length ? <div className="grid gap-2">{Object.entries(uploadProgress).map(([key, value]) => <p key={key} className="text-xs uppercase tracking-[0.22em] text-silver/56">Upload {value}%</p>)}</div> : null}
            <button className="btn-primary h-12 justify-center text-[11px]">Add to garage</button>
          </form>
        </div>
      </div>
      {message ? <p className="text-sm text-silver/70">{message}</p> : null}
    </DashboardShell>
  );
}
