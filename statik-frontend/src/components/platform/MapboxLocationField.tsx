import { useEffect, useMemo, useRef, useState } from 'react';

type LocationValue = {
  label: string;
  address?: string;
  lat?: number;
  lng?: number;
  placeId?: string;
  suburb?: string;
  region?: string;
  country?: string;
};

type Suggestion = {
  id: string;
  place_name: string;
  center: [number, number];
  text?: string;
  context?: Array<{ id: string; text: string }>;
};

declare global {
  interface Window {
    mapboxgl?: any;
  }
}

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN as string | undefined;
const MAPBOX_CSS_ID = 'statik-mapbox-css';
const MAPBOX_SCRIPT_ID = 'statik-mapbox-script';

function ensureMapbox() {
  return new Promise<any>((resolve, reject) => {
    if (!MAPBOX_TOKEN) {
      reject(new Error('Mapbox token missing'));
      return;
    }
    if (window.mapboxgl) {
      resolve(window.mapboxgl);
      return;
    }
    if (!document.getElementById(MAPBOX_CSS_ID)) {
      const css = document.createElement('link');
      css.id = MAPBOX_CSS_ID;
      css.rel = 'stylesheet';
      css.href = 'https://api.mapbox.com/mapbox-gl-js/v3.4.0/mapbox-gl.css';
      document.head.appendChild(css);
    }
    const existing = document.getElementById(MAPBOX_SCRIPT_ID) as HTMLScriptElement | null;
    if (existing) {
      existing.addEventListener('load', () => resolve(window.mapboxgl));
      existing.addEventListener('error', () => reject(new Error('Could not load Mapbox')));
      return;
    }
    const script = document.createElement('script');
    script.id = MAPBOX_SCRIPT_ID;
    script.src = 'https://api.mapbox.com/mapbox-gl-js/v3.4.0/mapbox-gl.js';
    script.async = true;
    script.onload = () => resolve(window.mapboxgl);
    script.onerror = () => reject(new Error('Could not load Mapbox'));
    document.body.appendChild(script);
  });
}

function parseContext(context?: Suggestion['context']) {
  const lookup = Object.fromEntries((context || []).map((entry) => [entry.id.split('.').shift(), entry.text]));
  return {
    suburb: lookup.locality || lookup.place || lookup.district,
    region: lookup.region,
    country: lookup.country,
  };
}

async function forwardSearch(query: string): Promise<Suggestion[]> {
  if (!MAPBOX_TOKEN || query.trim().length < 3) return [];
  const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json?autocomplete=true&limit=5&country=au&types=poi,address,place,locality,neighborhood&access_token=${MAPBOX_TOKEN}`;
  const response = await fetch(url);
  if (!response.ok) throw new Error('Could not load location suggestions');
  const json = await response.json();
  return (json.features || []) as Suggestion[];
}

async function reverseSearch(lng: number, lat: number) {
  if (!MAPBOX_TOKEN) return null;
  const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?limit=1&types=poi,address,place,locality&access_token=${MAPBOX_TOKEN}`;
  const response = await fetch(url);
  if (!response.ok) return null;
  const json = await response.json();
  return (json.features || [])[0] as Suggestion | undefined;
}

export default function MapboxLocationField({
  value,
  onChange,
  label = 'Location',
  helper = 'Search for a venue or address, then fine-tune the pin on the map.',
}: {
  value: LocationValue;
  onChange: (value: LocationValue) => void;
  label?: string;
  helper?: string;
}) {
  const [query, setQuery] = useState(value.label || value.address || '');
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const mapRef = useRef<any>(null);
  const markerRef = useRef<any>(null);
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const searchTimer = useRef<number | null>(null);

  const hasToken = Boolean(MAPBOX_TOKEN);
  const center = useMemo(() => ({ lng: value.lng ?? 152.8099, lat: value.lat ?? -27.6877 }), [value.lat, value.lng]);

  useEffect(() => {
    setQuery(value.label || value.address || '');
  }, [value.label, value.address]);

  useEffect(() => {
    if (!hasToken || !mapContainerRef.current) return;
    let cancelled = false;
    ensureMapbox()
      .then((mapboxgl) => {
        if (cancelled || !mapContainerRef.current) return;
        mapboxgl.accessToken = MAPBOX_TOKEN;
        const map = new mapboxgl.Map({
          container: mapContainerRef.current,
          style: 'mapbox://styles/mapbox/dark-v11',
          center: [center.lng, center.lat],
          zoom: value.lat && value.lng ? 12 : 8,
        });
        const marker = new mapboxgl.Marker({ draggable: true, color: '#d8d3cb' })
          .setLngLat([center.lng, center.lat])
          .addTo(map);
        marker.on('dragend', async () => {
          const { lng, lat } = marker.getLngLat();
          const reversed = await reverseSearch(lng, lat);
          const ctx = parseContext(reversed?.context);
          onChange({
            label: reversed?.text || reversed?.place_name || value.label,
            address: reversed?.place_name || value.address,
            lat,
            lng,
            placeId: reversed?.id || value.placeId,
            suburb: ctx.suburb,
            region: ctx.region,
            country: ctx.country,
          });
        });
        map.on('click', async (event: any) => {
          marker.setLngLat(event.lngLat);
          const reversed = await reverseSearch(event.lngLat.lng, event.lngLat.lat);
          const ctx = parseContext(reversed?.context);
          onChange({
            label: reversed?.text || reversed?.place_name || value.label,
            address: reversed?.place_name || value.address,
            lat: event.lngLat.lat,
            lng: event.lngLat.lng,
            placeId: reversed?.id || value.placeId,
            suburb: ctx.suburb,
            region: ctx.region,
            country: ctx.country,
          });
        });
        mapRef.current = map;
        markerRef.current = marker;
      })
      .catch((err) => setError(err.message));

    return () => {
      cancelled = true;
      markerRef.current?.remove?.();
      mapRef.current?.remove?.();
      markerRef.current = null;
      mapRef.current = null;
    };
  }, [hasToken]);

  useEffect(() => {
    if (!mapRef.current || !markerRef.current || value.lng == null || value.lat == null) return;
    markerRef.current.setLngLat([value.lng, value.lat]);
    mapRef.current.easeTo({ center: [value.lng, value.lat], duration: 450, zoom: Math.max(mapRef.current.getZoom?.() || 8, 11) });
  }, [value.lng, value.lat]);

  useEffect(() => {
    if (!hasToken) return;
    if (searchTimer.current) window.clearTimeout(searchTimer.current);
    if (query.trim().length < 3) {
      setSuggestions([]);
      return;
    }
    searchTimer.current = window.setTimeout(async () => {
      try {
        setLoadingSuggestions(true);
        setError(null);
        setSuggestions(await forwardSearch(query));
      } catch (err: any) {
        setError(err.message || 'Could not search locations');
      } finally {
        setLoadingSuggestions(false);
      }
    }, 220);
    return () => {
      if (searchTimer.current) window.clearTimeout(searchTimer.current);
    };
  }, [query, hasToken]);

  async function handleSuggestion(suggestion: Suggestion) {
    const ctx = parseContext(suggestion.context);
    onChange({
      label: suggestion.text || suggestion.place_name,
      address: suggestion.place_name,
      lat: suggestion.center[1],
      lng: suggestion.center[0],
      placeId: suggestion.id,
      suburb: ctx.suburb,
      region: ctx.region,
      country: ctx.country,
    });
    setQuery(suggestion.place_name);
    setSuggestions([]);
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-4">
        <label className="text-xs uppercase tracking-[0.24em] text-silver/50">{label}</label>
        {value.lat && value.lng ? <span className="text-[10px] uppercase tracking-[0.24em] text-silver/44">{value.lat.toFixed(5)}, {value.lng.toFixed(5)}</span> : null}
      </div>
      <input
        className="field-sharp"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Search venue, suburb, track, street, or address"
      />
      {hasToken ? (
        <div className="space-y-3">
          <div className="overflow-hidden rounded-[1.25rem] border border-white/10 bg-black/35">
            <div ref={mapContainerRef} className="h-64 w-full" />
          </div>
          <div className="rounded-[1.2rem] border border-white/10 bg-white/[0.03] p-4 text-sm text-silver/64">
            {helper}
          </div>
          {loadingSuggestions ? <p className="text-xs uppercase tracking-[0.22em] text-silver/46">Searching…</p> : null}
          {suggestions.length ? (
            <div className="grid gap-2 rounded-[1.25rem] border border-white/10 bg-white/[0.03] p-2">
              {suggestions.map((suggestion) => (
                <button key={suggestion.id} type="button" onClick={() => void handleSuggestion(suggestion)} className="rounded-[1rem] border border-transparent px-4 py-3 text-left transition hover:border-white/10 hover:bg-white/[0.04]">
                  <span className="block text-sm font-medium text-bone">{suggestion.text || suggestion.place_name}</span>
                  <span className="mt-1 block text-xs uppercase tracking-[0.18em] text-silver/48">{suggestion.place_name}</span>
                </button>
              ))}
            </div>
          ) : null}
        </div>
      ) : (
        <div className="rounded-[1.4rem] border border-dashed border-white/12 bg-white/[0.03] p-5 text-sm leading-7 text-silver/64">
          Map search is locked until <span className="text-bone">VITE_MAPBOX_TOKEN</span> is configured. The event can still be submitted with the typed location and manual coordinates.
        </div>
      )}
      <div className="grid gap-3 md:grid-cols-2">
        <input className="field-sharp" placeholder="Display label" value={value.label || ''} onChange={(event) => onChange({ ...value, label: event.target.value })} />
        <input className="field-sharp" placeholder="Address" value={value.address || ''} onChange={(event) => onChange({ ...value, address: event.target.value })} />
        <input className="field-sharp" placeholder="Latitude" value={value.lat ?? ''} onChange={(event) => onChange({ ...value, lat: Number(event.target.value) || undefined })} />
        <input className="field-sharp" placeholder="Longitude" value={value.lng ?? ''} onChange={(event) => onChange({ ...value, lng: Number(event.target.value) || undefined })} />
      </div>
      {error ? <p className="text-sm text-[#ff8f8f]">{error}</p> : null}
    </div>
  );
}
