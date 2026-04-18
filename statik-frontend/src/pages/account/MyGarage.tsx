import type { FormEvent } from 'react';
import { useEffect, useMemo, useState } from 'react';
import DashboardShell from '../../components/platform/DashboardShell';
import MediaGrid from '../../components/platform/MediaGrid';
import { accountNav } from '../../data/platform';
import { networkApi } from '../../api/network';
import { uploadMediaFile } from '../../api/uploads';
import { useSessionStore } from '../../store/session';
import type { CommunityPreview, GarageVehicle, VehicleRegistryPayload } from '../../types/network';
import {
  buildStages as fallbackBuildStages,
  findMake as fallbackFindMake,
  findModel as fallbackFindModel,
  makeOptions as fallbackMakeOptions,
  ownershipStatuses as fallbackOwnershipStatuses,
  purposeTags as fallbackPurposeTags,
  setupTags as fallbackSetupTags,
  vehicleRegistry as fallbackRegistry,
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
  engineCode: string;
  induction: string;
  fuelType: string;
  transmission: string;
  colourWrap: string;
  wheelTyreSpec: string;
  suspensionSetup: string;
  engineMods: string;
  aeroBodyMods: string;
  interiorAudioNotes: string;
  performanceNotes: string;
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
  engineCode: '',
  induction: '',
  fuelType: '',
  transmission: '',
  colourWrap: '',
  wheelTyreSpec: '',
  suspensionSetup: '',
  engineMods: '',
  aeroBodyMods: '',
  interiorAudioNotes: '',
  performanceNotes: '',
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
  return Array.from({ length: 85 }, (_, index) => String(currentYear - index));
}

function toggleListValue(values: string[], value: string) {
  return values.includes(value) ? values.filter((item) => item !== value) : [...values, value];
}

function SmartComboBox({ label, value, options, placeholder, required, onChange }: { label: string; value: string; options: string[]; placeholder?: string; required?: boolean; onChange: (value: string) => void }) {
  const [open, setOpen] = useState(false);
  const normalized = value.toLowerCase();
  const unique = Array.from(new Set([...options, 'Other'])).filter(Boolean);
  const filtered = unique.filter((option) => !normalized || option.toLowerCase().includes(normalized)).slice(0, 9);

  return (
    <div className="relative">
      <label className="mb-2 block text-[10px] uppercase tracking-[0.24em] text-silver/44">{label}</label>
      <input
        className="field-sharp"
        value={value}
        required={required}
        placeholder={placeholder || label}
        onFocus={() => setOpen(true)}
        onChange={(event) => { onChange(event.target.value); setOpen(true); }}
        onBlur={() => window.setTimeout(() => setOpen(false), 120)}
      />
      {open && filtered.length ? (
        <div className="absolute z-30 mt-2 max-h-72 w-full overflow-auto rounded-[1rem] border border-white/10 bg-[#08090b] p-2 shadow-2xl">
          {filtered.map((option) => (
            <button key={option} type="button" onMouseDown={(event) => event.preventDefault()} onClick={() => { onChange(option); setOpen(false); }} className="block w-full rounded-[0.85rem] px-3 py-2 text-left text-sm text-silver/78 transition hover:bg-white/[0.06] hover:text-bone">
              {option}
            </button>
          ))}
          {!unique.some((option) => option.toLowerCase() === value.toLowerCase()) && value.trim() ? <div className="px-3 py-2 text-xs uppercase tracking-[0.18em] text-silver/42">Custom entry will be saved</div> : null}
        </div>
      ) : null}
    </div>
  );
}

function vehicleLabel(vehicle: GarageVehicle) {
  return [vehicle.year, vehicle.make, vehicle.model, vehicle.trim || vehicle.specialEdition].filter(Boolean).join(' ') || 'Untitled vehicle';
}

export default function MyGarage() {
  const viewerProfile = useSessionStore((state) => state.viewerProfile);
  const [garage, setGarage] = useState<GarageVehicle[]>([]);
  const [communities, setCommunities] = useState<CommunityPreview[]>([]);
  const [registryPayload, setRegistryPayload] = useState<VehicleRegistryPayload | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [newVehicle, setNewVehicle] = useState<FormState>(EMPTY_FORM);
  const [selectedPurposeTags, setSelectedPurposeTags] = useState<string[]>([]);
  const [selectedSetupTags, setSelectedSetupTags] = useState<string[]>([]);
  const [linkedCommunityIds, setLinkedCommunityIds] = useState<string[]>([]);
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({});
  const [draftMediaIds, setDraftMediaIds] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);

  const registry = registryPayload?.registry || fallbackRegistry;
  const buildStages = registryPayload?.buildStages || fallbackBuildStages;
  const ownershipStatuses = registryPayload?.ownershipStatuses || fallbackOwnershipStatuses;
  const purposeTags = registryPayload?.purposeTags || fallbackPurposeTags;
  const setupTags = registryPayload?.setupTags || fallbackSetupTags;

  const availableMakes = useMemo(() => {
    const fromBackend = registry.filter((item) => item.vehicleType === newVehicle.vehicleType).map((item) => item.make).sort();
    return fromBackend.length ? fromBackend : fallbackMakeOptions(newVehicle.vehicleType);
  }, [newVehicle.vehicleType, registry]);
  const selectedMake = useMemo(() => registry.find((item) => item.vehicleType === newVehicle.vehicleType && item.make.toLowerCase() === newVehicle.make.toLowerCase()) || fallbackFindMake(newVehicle.vehicleType, newVehicle.make), [newVehicle.vehicleType, newVehicle.make, registry]);
  const availableModels = selectedMake?.models || [];
  const selectedModel = useMemo(() => availableModels.find((item) => item.name.toLowerCase() === newVehicle.model.toLowerCase()) || fallbackFindModel(newVehicle.vehicleType, newVehicle.make, newVehicle.model), [availableModels, newVehicle.vehicleType, newVehicle.make, newVehicle.model]);

  async function load() {
    try {
      const [garageItems, groupItems, registryData] = await Promise.all([networkApi.getMyGarage(), networkApi.listCommunities(), networkApi.getVehicleRegistry()]);
      setGarage(garageItems);
      setCommunities(groupItems.filter((item) => item.isMember || item.isAdmin));
      setRegistryPayload(registryData);
      setMessage(null);
    } catch (error: any) {
      setMessage(error.message);
    }
  }

  useEffect(() => {
    void load();
  }, []);

  function updateVehicleField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setNewVehicle((current) => ({ ...current, [key]: value }));
  }

  function resetAfterMake(nextMake: string) {
    setNewVehicle((current) => ({
      ...current,
      make: nextMake,
      model: '',
      generation: '',
      trim: '',
      specialEdition: '',
      bodyStyle: '',
      drivetrain: '',
      engineFamily: '',
      engineCode: '',
      transmission: '',
    }));
  }

  function resetAfterModel(nextModel: string) {
    setNewVehicle((current) => ({
      ...current,
      model: nextModel,
      generation: '',
      trim: '',
      specialEdition: '',
      bodyStyle: '',
      drivetrain: '',
      engineFamily: '',
      engineCode: '',
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
        heroMediaId: draftMediaIds[0],
        linkedCommunityIds,
      });
      setNewVehicle(EMPTY_FORM);
      setSelectedPurposeTags([]);
      setSelectedSetupTags([]);
      setLinkedCommunityIds([]);
      setDraftMediaIds([]);
      setUploadProgress({});
      setMessage('Build dossier added to your private registry. Visibility rules are applied from the dossier setting.');
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
              <h2 className="headline-md mt-3">Private machine files, spec plates, build media, and event-ready identity — isolated per owner.</h2>
            </div>
            <span className="status-chip">{garage.length} live dossier{garage.length === 1 ? '' : 's'}</span>
          </div>
          <div className="mt-6 grid gap-4">
            {garage.length ? garage.map((vehicle) => (
              <div key={vehicle.id} className="panel-blade space-y-4">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="space-y-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3>{vehicleLabel(vehicle)}</h3>
                      {vehicle.generation ? <span className="status-chip">{vehicle.generation}</span> : null}
                      {vehicle.specialEdition ? <span className="status-chip">{vehicle.specialEdition}</span> : null}
                      {vehicle.nickname ? <span className="status-chip">Bay: {vehicle.nickname}</span> : null}
                      {vehicle.visibility === 'private' ? <span className="status-chip">private</span> : <span className="status-chip">public</span>}
                    </div>
                    <p className="text-sm text-silver/70">{[vehicle.vehicleType, vehicle.bodyStyle, vehicle.drivetrain, vehicle.transmission, vehicle.engineFamily, vehicle.engineCode].filter(Boolean).join(' • ')}</p>
                    <p className="text-sm leading-7 text-silver/72">{vehicle.description || 'No build philosophy added yet.'}</p>
                  </div>
                  <button type="button" onClick={async () => { await networkApi.deleteGarageVehicle(vehicle.id); void load(); }} className="btn-secondary h-10 px-4 text-[11px]">Remove</button>
                </div>
                <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                  <div className="rounded-[1.1rem] border border-white/10 bg-black/30 p-4">
                    <p className="text-[10px] uppercase tracking-[0.24em] text-silver/46">Spec plate</p>
                    <p className="mt-3 text-sm text-silver/72">Stage: {vehicle.stage || 'Not set'}</p>
                    <p className="mt-2 text-sm text-silver/72">Ownership: {vehicle.ownershipStatus || 'Not set'}</p>
                    <p className="mt-2 text-sm text-silver/72">Colour/wrap: {vehicle.colourWrap || 'Not set'}</p>
                  </div>
                  <div className="rounded-[1.1rem] border border-white/10 bg-black/30 p-4">
                    <p className="text-[10px] uppercase tracking-[0.24em] text-silver/46">Setup file</p>
                    <p className="mt-3 text-sm text-silver/72">Wheels/tyres: {vehicle.wheelTyreSpec || 'Not set'}</p>
                    <p className="mt-2 text-sm text-silver/72">Suspension: {vehicle.suspensionSetup || 'Not set'}</p>
                    <p className="mt-2 text-sm text-silver/72">Induction: {vehicle.induction || 'Not set'}</p>
                  </div>
                  <div className="rounded-[1.1rem] border border-white/10 bg-black/30 p-4">
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
              <div className="panel-blade text-sm text-silver/62">No vehicles added yet. Claim your first garage bay, pick the closest chassis data, or use custom entries for uncommon builds.</div>
            )}
          </div>
        </div>

        <div className="panel-cut p-6 md:p-8">
          <p className="eyebrow">Add machine</p>
          <h2 className="headline-md mt-3">Backend-backed dependent selection with special-edition intelligence and a safe custom fallback.</h2>
          <form className="mt-6 grid gap-4" onSubmit={handleCreate}>
            <div className="grid gap-4 md:grid-cols-2">
              <select className="field-sharp" value={newVehicle.vehicleType} onChange={(e) => { setNewVehicle({ ...EMPTY_FORM, vehicleType: e.target.value as VehicleType }); setSelectedPurposeTags([]); setSelectedSetupTags([]); }}>
                <option value="car">Car</option>
                <option value="bike">Bike</option>
                <option value="truck">Truck / ute / 4x4</option>
                <option value="other">Other</option>
              </select>
              <SmartComboBox label="Year" value={newVehicle.year} options={yearOptions()} onChange={(value) => updateVehicleField('year', value)} />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <SmartComboBox label="Make" value={newVehicle.make} options={availableMakes} onChange={resetAfterMake} required />
              <SmartComboBox label="Model" value={newVehicle.model} options={availableModels.map((model) => model.name)} onChange={resetAfterModel} required />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <SmartComboBox label="Generation / chassis" value={newVehicle.generation} options={generationOptions} onChange={(value) => updateVehicleField('generation', value)} />
              <SmartComboBox label="Trim" value={newVehicle.trim} options={trimOptions} onChange={(value) => updateVehicleField('trim', value)} />
              <SmartComboBox label="Special edition / performance variant" value={newVehicle.specialEdition} options={specialEditionOptions} onChange={(value) => updateVehicleField('specialEdition', value)} />
              <input className="field-sharp" placeholder="Nickname / bay name" value={newVehicle.nickname} onChange={(e) => updateVehicleField('nickname', e.target.value)} />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <SmartComboBox label="Body style" value={newVehicle.bodyStyle} options={bodyStyleOptions} onChange={(value) => updateVehicleField('bodyStyle', value)} />
              <SmartComboBox label="Drivetrain" value={newVehicle.drivetrain} options={drivetrainOptions} onChange={(value) => updateVehicleField('drivetrain', value)} />
              <SmartComboBox label="Engine family" value={newVehicle.engineFamily} options={engineOptions} onChange={(value) => updateVehicleField('engineFamily', value)} />
              <input className="field-sharp" placeholder="Engine code / swap code" value={newVehicle.engineCode} onChange={(e) => updateVehicleField('engineCode', e.target.value)} />
              <SmartComboBox label="Transmission" value={newVehicle.transmission} options={transmissionOptions} onChange={(value) => updateVehicleField('transmission', value)} />
              <input className="field-sharp" placeholder="Induction / fuel" value={[newVehicle.induction, newVehicle.fuelType].filter(Boolean).join(' / ')} onChange={(e) => { const [induction = '', fuelType = ''] = e.target.value.split('/').map((item) => item.trim()); setNewVehicle((current) => ({ ...current, induction, fuelType })); }} />
            </div>

            {selectedModel ? (
              <div className="rounded-[1.2rem] border border-white/10 bg-white/[0.03] p-4 text-sm text-silver/68">
                <p className="text-[10px] uppercase tracking-[0.24em] text-silver/44">Registry intelligence • {registryPayload?.version || 'fallback'}</p>
                <p className="mt-3">Suggestions narrowed around <span className="text-bone">{selectedMake?.make} {selectedModel.name}</span>. Exact build not listed? Keep typing a custom value — the dossier still saves cleanly.</p>
              </div>
            ) : null}

            <div className="grid gap-4 md:grid-cols-2">
              <select className="field-sharp" value={newVehicle.stage} onChange={(e) => updateVehicleField('stage', e.target.value)}>
                <option value="">Build stage</option>
                {buildStages.map((stage) => <option key={stage} value={stage}>{stage}</option>)}
              </select>
              <select className="field-sharp" value={newVehicle.ownershipStatus} onChange={(e) => updateVehicleField('ownershipStatus', e.target.value)}>
                <option value="">Ownership status</option>
                {ownershipStatuses.map((status) => <option key={status} value={status}>{status}</option>)}
              </select>
            </div>

            <textarea className="field-sharp min-h-[120px]" placeholder="Build philosophy / dossier notes / intent" value={newVehicle.description} onChange={(e) => updateVehicleField('description', e.target.value)} />
            <div className="grid gap-4 md:grid-cols-2">
              <input className="field-sharp" placeholder="Colour / wrap" value={newVehicle.colourWrap} onChange={(e) => updateVehicleField('colourWrap', e.target.value)} />
              <input className="field-sharp" placeholder="Wheels / tyres" value={newVehicle.wheelTyreSpec} onChange={(e) => updateVehicleField('wheelTyreSpec', e.target.value)} />
              <input className="field-sharp" placeholder="Suspension setup" value={newVehicle.suspensionSetup} onChange={(e) => updateVehicleField('suspensionSetup', e.target.value)} />
              <input className="field-sharp" placeholder="Engine mods" value={newVehicle.engineMods} onChange={(e) => updateVehicleField('engineMods', e.target.value)} />
              <input className="field-sharp" placeholder="Aero / body mods" value={newVehicle.aeroBodyMods} onChange={(e) => updateVehicleField('aeroBodyMods', e.target.value)} />
              <input className="field-sharp" placeholder="Interior / audio notes" value={newVehicle.interiorAudioNotes} onChange={(e) => updateVehicleField('interiorAudioNotes', e.target.value)} />
            </div>
            <input className="field-sharp" placeholder="Performance notes" value={newVehicle.performanceNotes} onChange={(e) => updateVehicleField('performanceNotes', e.target.value)} />
            <input className="field-sharp" placeholder="Status tags, comma separated" value={newVehicle.statusTags} onChange={(e) => updateVehicleField('statusTags', e.target.value)} />
            <input className="field-sharp" placeholder="Parts / mod tags, comma separated" value={newVehicle.modTags} onChange={(e) => updateVehicleField('modTags', e.target.value)} />

            <div className="grid gap-4">
              <div className="rounded-[1.2rem] border border-white/10 bg-white/[0.03] p-4">
                <p className="text-[10px] uppercase tracking-[0.24em] text-silver/46">Vehicle purpose</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {purposeTags.map((tag) => <button key={tag} type="button" onClick={() => setSelectedPurposeTags((current) => toggleListValue(current, tag))} className={`status-chip ${selectedPurposeTags.includes(tag) ? 'bg-white/18 text-bone' : ''}`}>{tag}</button>)}
                </div>
              </div>
              <div className="rounded-[1.2rem] border border-white/10 bg-white/[0.03] p-4">
                <p className="text-[10px] uppercase tracking-[0.24em] text-silver/46">Setup tags</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {setupTags.map((tag) => <button key={tag} type="button" onClick={() => setSelectedSetupTags((current) => toggleListValue(current, tag))} className={`status-chip ${selectedSetupTags.includes(tag) ? 'bg-white/18 text-bone' : ''}`}>{tag}</button>)}
                </div>
              </div>
            </div>

            {communities.length ? (
              <div className="rounded-[1.2rem] border border-white/10 bg-white/[0.03] p-4">
                <p className="text-[10px] uppercase tracking-[0.24em] text-silver/46">Linked groups</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {communities.map((community) => <button key={community.id} type="button" onClick={() => setLinkedCommunityIds((current) => toggleListValue(current, community.id))} className={`status-chip ${linkedCommunityIds.includes(community.id) ? 'bg-white/18 text-bone' : ''}`}>{community.name}</button>)}
                </div>
              </div>
            ) : null}

            <select className="field-sharp" value={newVehicle.visibility} onChange={(e) => updateVehicleField('visibility', e.target.value as 'public' | 'private')}>
              <option value="public">Public dossier</option>
              <option value="private">Private dossier</option>
            </select>

            <div className="rounded-[1.2rem] border border-white/10 bg-white/[0.03] p-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.24em] text-silver/46">Gallery intake</p>
                  <p className="mt-2 text-sm text-silver/64">Upload real photos or short clips. They attach to the dossier after creation, under your owner scope.</p>
                </div>
                <span className="status-chip">{draftMediaIds.length} staged</span>
              </div>
              <input type="file" accept="image/*,video/*,.heic,.heif" className="field-sharp mt-4" multiple onChange={(e) => Array.from(e.target.files || []).forEach((file) => void handleDraftUpload(file))} />
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
