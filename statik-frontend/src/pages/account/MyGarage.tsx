import type { FormEvent } from 'react';
import { useEffect, useMemo, useState } from 'react';
import DashboardShell from '../../components/platform/DashboardShell';
import MediaGrid from '../../components/platform/MediaGrid';
import { accountNav } from '../../data/platform';
import { networkApi } from '../../api/network';
import { uploadMediaFile } from '../../api/uploads';
import { useSessionStore } from '../../store/session';
import type { CommunityPreview, GarageVehicle } from '../../types/network';
import {
  buildStages,
  findMake,
  findModel,
  makeOptions,
  ownershipStatuses,
  purposeTags,
  setupTags,
} from '../../data/vehicleRegistry';

type VehicleType = 'car' | 'bike' | 'truck' | 'other';

type FormState = {
  vehicleType: VehicleType;
  year: string;
  make: string;
  model: string;
  generation: string;
  trim: string;
  specialEdition: string;
  bodyStyle: string;
  drivetrain: string;
  engineFamily: string;
  transmission: string;
  nickname: string;
  stage: string;
  ownershipStatus: string;
  description: string;
  statusTags: string;
  modTags: string;
  visibility: 'public' | 'private';
};

const EMPTY_FORM: FormState = {
  vehicleType: 'car',
  year: '',
  make: '',
  model: '',
  generation: '',
  trim: '',
  specialEdition: '',
  bodyStyle: '',
  drivetrain: '',
  engineFamily: '',
  transmission: '',
  nickname: '',
  stage: '',
  ownershipStatus: '',
  description: '',
  statusTags: '',
  modTags: '',
  visibility: 'public',
};

function parseCsv(value: string) {
  return value.split(',').map((item) => item.trim()).filter(Boolean);
}

function yearOptions() {
  const currentYear = new Date().getFullYear() + 1;
  return Array.from({ length: 70 }, (_, index) => String(currentYear - index));
}

function toggleListValue(values: string[], value: string) {
  return values.includes(value) ? values.filter((item) => item !== value) : [...values, value];
}

export default function MyGarage() {
  const viewerProfile = useSessionStore((state) => state.viewerProfile);
  const [garage, setGarage] = useState<GarageVehicle[]>([]);
  const [communities, setCommunities] = useState<CommunityPreview[]>([]);
  const [message, setMessage] = useState<string | null>(null);
  const [newVehicle, setNewVehicle] = useState<FormState>(EMPTY_FORM);
  const [selectedPurposeTags, setSelectedPurposeTags] = useState<string[]>([]);
  const [selectedSetupTags, setSelectedSetupTags] = useState<string[]>([]);
  const [linkedCommunityIds, setLinkedCommunityIds] = useState<string[]>([]);
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({});
  const [draftMediaIds, setDraftMediaIds] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);

  const availableMakes = useMemo(() => makeOptions(newVehicle.vehicleType), [newVehicle.vehicleType]);
  const selectedMake = useMemo(() => findMake(newVehicle.vehicleType, newVehicle.make), [newVehicle.vehicleType, newVehicle.make]);
  const availableModels = selectedMake?.models || [];
  const selectedModel = useMemo(() => findModel(newVehicle.vehicleType, newVehicle.make, newVehicle.model), [newVehicle.vehicleType, newVehicle.make, newVehicle.model]);

  async function load() {
    try {
      const [garageItems, groupItems] = await Promise.all([networkApi.getMyGarage(), networkApi.listCommunities()]);
      setGarage(garageItems);
      setCommunities(groupItems.filter((item) => item.isMember || item.isAdmin));
      setMessage(null);
    } catch (error: any) {
      setMessage(error.message);
    }
  }

  useEffect(() => {
    void load();
  }, []);

  function resetDependentFields() {
    setNewVehicle((current) => ({
      ...current,
      model: '',
      generation: '',
      trim: '',
      specialEdition: '',
      bodyStyle: '',
      drivetrain: '',
      engineFamily: '',
      transmission: '',
    }));
  }

  async function handleCreate(event: FormEvent) {
    event.preventDefault();
    setSubmitting(true);
    try {
      await networkApi.createGarageVehicle({
        ...newVehicle,
        statusTags: parseCsv(newVehicle.statusTags),
        modTags: parseCsv(newVehicle.modTags),
        purposeTags: selectedPurposeTags,
        setupTags: selectedSetupTags,
        mediaIds: draftMediaIds,
        linkedCommunityIds,
      });
      setNewVehicle(EMPTY_FORM);
      setSelectedPurposeTags([]);
      setSelectedSetupTags([]);
      setLinkedCommunityIds([]);
      setDraftMediaIds([]);
      setUploadProgress({});
      setMessage('Build dossier added to your registry.');
      await load();
    } catch (error: any) {
      setMessage(error.message);
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDraftUpload(file?: File | null) {
    if (!file || !viewerProfile) return;
    const tempKey = `draft-${Date.now()}-${file.name}`;
    try {
      const uploaded = await uploadMediaFile(
        file,
        'profile',
        viewerProfile.id,
        (value) => setUploadProgress((prev) => ({ ...prev, [tempKey]: value })),
      );
      setDraftMediaIds((prev) => [...prev, uploaded.id]);
      setUploadProgress((prev) => ({ ...prev, [tempKey]: 100 }));
      setMessage(null);
    } catch (error: any) {
      setMessage(error.message || 'Upload failed');
      setUploadProgress((prev) => ({ ...prev, [tempKey]: 0 }));
    }
  }

  const generationOptions = selectedModel?.generations || [];
  const trimOptions = selectedModel?.trims || [];
  const specialEditionOptions = selectedModel?.specialEditions || [];
  const bodyStyleOptions = selectedModel?.bodyStyles || [];
  const drivetrainOptions = selectedModel?.drivetrains || [];
  const engineOptions = selectedModel?.engines || [];
  const transmissionOptions = selectedModel?.transmissions || [];

  return (
    <DashboardShell eyebrow="Members / garage" title="Build dossier registry" nav={accountNav}>
      <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <div className="panel-cut p-6 md:p-8">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="eyebrow">Registered bays</p>
              <h2 className="headline-md mt-3">Every machine gets a sharper spec plate, richer variant data, and stronger discovery value.</h2>
            </div>
            <span className="status-chip">{garage.length} live dossier{garage.length === 1 ? '' : 's'}</span>
          </div>
          <div className="mt-6 grid gap-4">
            {garage.length ? garage.map((vehicle) => (
              <div key={vehicle.id} className="panel-blade space-y-4">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="space-y-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3>{[vehicle.year, vehicle.make, vehicle.model].filter(Boolean).join(' ') || 'Untitled vehicle'}</h3>
                      {vehicle.trim ? <span className="status-chip">{vehicle.trim}</span> : null}
                      {vehicle.specialEdition ? <span className="status-chip">{vehicle.specialEdition}</span> : null}
                      {vehicle.nickname ? <span className="status-chip">{vehicle.nickname}</span> : null}
                      {vehicle.featured ? <span className="status-chip">featured bay</span> : null}
                    </div>
                    <p className="text-sm text-silver/70">
                      {[vehicle.vehicleType, vehicle.generation, vehicle.bodyStyle, vehicle.drivetrain, vehicle.transmission, vehicle.visibility].filter(Boolean).join(' • ')}
                    </p>
                    <p className="text-sm leading-7 text-silver/72">{vehicle.description || 'No build philosophy added yet.'}</p>
                  </div>
                  <button type="button" onClick={async () => { await networkApi.deleteGarageVehicle(vehicle.id); void load(); }} className="btn-secondary h-10 px-4 text-[11px]">Remove</button>
                </div>
                <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                  <div className="rounded-[1.1rem] border border-white/10 bg-black/30 p-4">
                    <p className="text-[10px] uppercase tracking-[0.24em] text-silver/46">Registry</p>
                    <p className="mt-3 text-sm text-silver/72">Stage: {vehicle.stage || 'Not set'}</p>
                    <p className="mt-2 text-sm text-silver/72">Ownership: {vehicle.ownershipStatus || 'Not set'}</p>
                    <p className="mt-2 text-sm text-silver/72">Engine: {vehicle.engineFamily || 'Not set'}</p>
                  </div>
                  <div className="rounded-[1.1rem] border border-white/10 bg-black/30 p-4 md:col-span-1 xl:col-span-2">
                    <p className="text-[10px] uppercase tracking-[0.24em] text-silver/46">Usage tags</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {[...vehicle.statusTags, ...(vehicle.purposeTags || []), ...(vehicle.setupTags || []), ...vehicle.modTags].length
                        ? [...vehicle.statusTags, ...(vehicle.purposeTags || []), ...(vehicle.setupTags || []), ...vehicle.modTags].map((tag) => <span key={`${vehicle.id}-${tag}`} className="status-chip">{tag}</span>)
                        : <span className="text-sm text-silver/54">No tags added yet.</span>}
                    </div>
                  </div>
                </div>
                {vehicle.media?.length ? <MediaGrid media={vehicle.media} compact /> : <div className="text-sm text-silver/56">No gallery media attached yet.</div>}
              </div>
            )) : (
              <div className="panel-blade text-sm text-silver/62">No vehicles added yet. Claim your first bay, select the closest chassis data, then finish the dossier with media and setup tags.</div>
            )}
          </div>
        </div>

        <div className="panel-cut p-6 md:p-8">
          <p className="eyebrow">Add machine</p>
          <h2 className="headline-md mt-3">Structured vehicle selection with enthusiast trims, special editions, and a custom fallback when needed.</h2>
          <form className="mt-6 grid gap-4" onSubmit={handleCreate}>
            <div className="grid gap-4 md:grid-cols-2">
              <select className="field-sharp" value={newVehicle.vehicleType} onChange={(e) => { setNewVehicle({ ...EMPTY_FORM, vehicleType: e.target.value as VehicleType }); setSelectedPurposeTags([]); setSelectedSetupTags([]); }}>
                <option value="car">Car</option>
                <option value="bike">Bike</option>
                <option value="truck">Truck</option>
                <option value="other">Other</option>
              </select>
              <input className="field-sharp" list="garage-year-options" placeholder="Year" value={newVehicle.year} onChange={(e) => setNewVehicle({ ...newVehicle, year: e.target.value })} />
              <datalist id="garage-year-options">{yearOptions().map((year) => <option key={year} value={year} />)}</datalist>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <input
                  className="field-sharp"
                  list="garage-make-options"
                  placeholder="Make"
                  value={newVehicle.make}
                  onChange={(e) => {
                    const nextMake = e.target.value;
                    if (nextMake !== newVehicle.make) resetDependentFields();
                    setNewVehicle((current) => ({ ...current, make: nextMake }));
                  }}
                  required
                />
                <datalist id="garage-make-options">
                  {availableMakes.map((make) => <option key={make.name} value={make.name} />)}
                  <option value="Other" />
                </datalist>
              </div>
              <div>
                <input
                  className="field-sharp"
                  list="garage-model-options"
                  placeholder="Model"
                  value={newVehicle.model}
                  onChange={(e) => {
                    const nextModel = e.target.value;
                    setNewVehicle((current) => ({
                      ...current,
                      model: nextModel,
                      generation: '',
                      trim: '',
                      specialEdition: '',
                      bodyStyle: '',
                      drivetrain: '',
                      engineFamily: '',
                      transmission: '',
                    }));
                  }}
                  required
                />
                <datalist id="garage-model-options">
                  {availableModels.map((model) => <option key={model.name} value={model.name} />)}
                  <option value="Other" />
                </datalist>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <input className="field-sharp" list="garage-generation-options" placeholder="Generation / chassis" value={newVehicle.generation} onChange={(e) => setNewVehicle({ ...newVehicle, generation: e.target.value })} />
              <datalist id="garage-generation-options">{generationOptions.map((item) => <option key={item} value={item} />)}<option value="Other" /></datalist>
              <input className="field-sharp" list="garage-trim-options" placeholder="Trim" value={newVehicle.trim} onChange={(e) => setNewVehicle({ ...newVehicle, trim: e.target.value })} />
              <datalist id="garage-trim-options">{trimOptions.map((item) => <option key={item} value={item} />)}<option value="Other" /></datalist>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <input className="field-sharp" list="garage-special-options" placeholder="Special edition / performance variant" value={newVehicle.specialEdition} onChange={(e) => setNewVehicle({ ...newVehicle, specialEdition: e.target.value })} />
              <datalist id="garage-special-options">{specialEditionOptions.map((item) => <option key={item} value={item} />)}<option value="Other" /></datalist>
              <input className="field-sharp" placeholder="Nickname / bay name" value={newVehicle.nickname} onChange={(e) => setNewVehicle({ ...newVehicle, nickname: e.target.value })} />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <input className="field-sharp" list="garage-bodystyle-options" placeholder="Body style" value={newVehicle.bodyStyle} onChange={(e) => setNewVehicle({ ...newVehicle, bodyStyle: e.target.value })} />
              <datalist id="garage-bodystyle-options">{bodyStyleOptions.map((item) => <option key={item} value={item} />)}<option value="Other" /></datalist>
              <input className="field-sharp" list="garage-drivetrain-options" placeholder="Drivetrain" value={newVehicle.drivetrain} onChange={(e) => setNewVehicle({ ...newVehicle, drivetrain: e.target.value })} />
              <datalist id="garage-drivetrain-options">{drivetrainOptions.map((item) => <option key={item} value={item} />)}<option value="Other" /></datalist>
              <input className="field-sharp" list="garage-engine-options" placeholder="Engine family" value={newVehicle.engineFamily} onChange={(e) => setNewVehicle({ ...newVehicle, engineFamily: e.target.value })} />
              <datalist id="garage-engine-options">{engineOptions.map((item) => <option key={item} value={item} />)}<option value="Other" /></datalist>
              <input className="field-sharp" list="garage-transmission-options" placeholder="Transmission" value={newVehicle.transmission} onChange={(e) => setNewVehicle({ ...newVehicle, transmission: e.target.value })} />
              <datalist id="garage-transmission-options">{transmissionOptions.map((item) => <option key={item} value={item} />)}<option value="Other" /></datalist>
            </div>

            {selectedModel ? (
              <div className="rounded-[1.2rem] border border-white/10 bg-white/[0.03] p-4 text-sm text-silver/68">
                <p className="text-[10px] uppercase tracking-[0.24em] text-silver/44">Model intelligence</p>
                <p className="mt-3">Suggested trims, engines, drivetrains, and editions have narrowed around <span className="text-bone">{selectedModel.name}</span>. If your exact setup is uncommon, keep typing your own values.</p>
              </div>
            ) : null}

            <div className="grid gap-4 md:grid-cols-2">
              <select className="field-sharp" value={newVehicle.stage} onChange={(e) => setNewVehicle({ ...newVehicle, stage: e.target.value })}>
                <option value="">Build stage</option>
                {buildStages.map((stage) => <option key={stage} value={stage}>{stage}</option>)}
              </select>
              <select className="field-sharp" value={newVehicle.ownershipStatus} onChange={(e) => setNewVehicle({ ...newVehicle, ownershipStatus: e.target.value })}>
                <option value="">Ownership status</option>
                {ownershipStatuses.map((status) => <option key={status} value={status}>{status}</option>)}
              </select>
            </div>

            <textarea className="field-sharp min-h-[140px]" placeholder="Build intent / registry notes / what makes this chassis matter" value={newVehicle.description} onChange={(e) => setNewVehicle({ ...newVehicle, description: e.target.value })} />
            <input className="field-sharp" placeholder="Status tags, comma separated" value={newVehicle.statusTags} onChange={(e) => setNewVehicle({ ...newVehicle, statusTags: e.target.value })} />
            <input className="field-sharp" placeholder="Parts / mod tags, comma separated" value={newVehicle.modTags} onChange={(e) => setNewVehicle({ ...newVehicle, modTags: e.target.value })} />

            <div className="grid gap-4">
              <div className="rounded-[1.2rem] border border-white/10 bg-white/[0.03] p-4">
                <p className="text-[10px] uppercase tracking-[0.24em] text-silver/46">Vehicle purpose</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {purposeTags.map((tag) => (
                    <button key={tag} type="button" onClick={() => setSelectedPurposeTags((current) => toggleListValue(current, tag))} className={`status-chip ${selectedPurposeTags.includes(tag) ? 'bg-white/18 text-bone' : ''}`}>{tag}</button>
                  ))}
                </div>
              </div>
              <div className="rounded-[1.2rem] border border-white/10 bg-white/[0.03] p-4">
                <p className="text-[10px] uppercase tracking-[0.24em] text-silver/46">Setup tags</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {setupTags.map((tag) => (
                    <button key={tag} type="button" onClick={() => setSelectedSetupTags((current) => toggleListValue(current, tag))} className={`status-chip ${selectedSetupTags.includes(tag) ? 'bg-white/18 text-bone' : ''}`}>{tag}</button>
                  ))}
                </div>
              </div>
            </div>

            {communities.length ? (
              <div className="rounded-[1.2rem] border border-white/10 bg-white/[0.03] p-4">
                <p className="text-[10px] uppercase tracking-[0.24em] text-silver/46">Linked groups</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {communities.map((community) => (
                    <button key={community.id} type="button" onClick={() => setLinkedCommunityIds((current) => toggleListValue(current, community.id))} className={`status-chip ${linkedCommunityIds.includes(community.id) ? 'bg-white/18 text-bone' : ''}`}>{community.name}</button>
                  ))}
                </div>
              </div>
            ) : null}

            <select className="field-sharp" value={newVehicle.visibility} onChange={(e) => setNewVehicle({ ...newVehicle, visibility: e.target.value as 'public' | 'private' })}>
              <option value="public">Public dossier</option>
              <option value="private">Private dossier</option>
            </select>

            <div className="rounded-[1.2rem] border border-white/10 bg-white/[0.03] p-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.24em] text-silver/46">Gallery intake</p>
                  <p className="mt-2 text-sm text-silver/64">Upload real photos or short clips now. They attach to the dossier on create.</p>
                </div>
                <span className="status-chip">{draftMediaIds.length} staged</span>
              </div>
              <input type="file" accept="image/*,video/*" className="field-sharp mt-4" multiple onChange={(e) => Array.from(e.target.files || []).forEach((file) => void handleDraftUpload(file))} />
              {Object.keys(uploadProgress).length ? <div className="mt-4 grid gap-2">{Object.entries(uploadProgress).map(([key, value]) => <p key={key} className="text-xs uppercase tracking-[0.22em] text-silver/56">{key.split('-').slice(-1)[0]} • {value}%</p>)}</div> : null}
            </div>

            <button disabled={submitting} className="btn-primary h-12 justify-center text-[11px]">{submitting ? 'Registering dossier…' : 'Add to garage'}</button>
          </form>
        </div>
      </div>
      {message ? <p className="text-sm text-silver/70">{message}</p> : null}
    </DashboardShell>
  );
}
