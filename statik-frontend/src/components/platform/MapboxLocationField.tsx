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

declare global {
  interface Window {
    google?: any;
    __statikGoogleMapsPromise?: Promise<any>;
  }
}

const GOOGLE_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string | undefined;
const GOOGLE_SCRIPT_ID = 'statik-google-maps-script';

function loadGoogleMaps() {
  if (!GOOGLE_KEY) return Promise.reject(new Error('Google Maps API key missing'));
  if (window.google?.maps?.places) return Promise.resolve(window.google);
  if (window.__statikGoogleMapsPromise) return window.__statikGoogleMapsPromise;

  window.__statikGoogleMapsPromise = new Promise((resolve, reject) => {
    const existing = document.getElementById(GOOGLE_SCRIPT_ID) as HTMLScriptElement | null;
    if (existing) {
      existing.addEventListener('load', () => resolve(window.google));
      existing.addEventListener('error', () => reject(new Error('Could not load Google Maps')));
      return;
    }
    const script = document.createElement('script');
    script.id = GOOGLE_SCRIPT_ID;
    script.async = true;
    script.defer = true;
    script.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(GOOGLE_KEY)}&libraries=places&v=weekly`;
    script.onload = () => resolve(window.google);
    script.onerror = () => reject(new Error('Could not load Google Maps'));
    document.head.appendChild(script);
  });
  return window.__statikGoogleMapsPromise;
}

function extractAddressComponent(place: any, types: string[]) {
  const components = place?.address_components || [];
  const match = components.find((component: any) => types.some((type) => component.types?.includes(type)));
  return match?.long_name || '';
}

function mapPlaceToValue(place: any, fallbackLabel: string): LocationValue | null {
  const location = place?.geometry?.location;
  if (!location) return null;
  const lat = typeof location.lat === 'function' ? location.lat() : location.lat;
  const lng = typeof location.lng === 'function' ? location.lng() : location.lng;
  const address = place.formatted_address || place.name || fallbackLabel;
  return {
    label: place.name || address || fallbackLabel,
    address,
    lat,
    lng,
    placeId: place.place_id,
    suburb: extractAddressComponent(place, ['locality', 'postal_town', 'sublocality']),
    region: extractAddressComponent(place, ['administrative_area_level_1']),
    country: extractAddressComponent(place, ['country']),
  };
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
  const [error, setError] = useState<string | null>(null);
  const mapDivRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const mapRef = useRef<any>(null);
  const markerRef = useRef<any>(null);
  const geocoderRef = useRef<any>(null);
  const autocompleteRef = useRef<any>(null);

  const hasGoogle = Boolean(GOOGLE_KEY);
  const center = useMemo(() => ({ lat: value.lat ?? -27.6877, lng: value.lng ?? 152.8099 }), [value.lat, value.lng]);

  useEffect(() => {
    setQuery(value.label || value.address || '');
  }, [value.label, value.address]);

  useEffect(() => {
    if (!hasGoogle || !mapDivRef.current || !inputRef.current) return;
    let cancelled = false;

    loadGoogleMaps()
      .then((google) => {
        if (cancelled || !mapDivRef.current || !inputRef.current) return;
        const map = new google.maps.Map(mapDivRef.current, {
          center,
          zoom: value.lat && value.lng ? 14 : 9,
          mapTypeControl: false,
          fullscreenControl: false,
          streetViewControl: false,
          clickableIcons: false,
          styles: [
            { elementType: 'geometry', stylers: [{ color: '#141414' }] },
            { elementType: 'labels.text.fill', stylers: [{ color: '#c7c0b5' }] },
            { elementType: 'labels.text.stroke', stylers: [{ color: '#111111' }] },
            { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#2d2a27' }] },
            { featureType: 'poi', elementType: 'geometry', stylers: [{ color: '#1f1f1f' }] },
            { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#0e1418' }] },
          ],
        });
        const marker = new google.maps.Marker({
          map,
          position: center,
          draggable: true,
          title: value.label || 'Event location',
        });
        const geocoder = new google.maps.Geocoder();
        const autocomplete = new google.maps.places.Autocomplete(inputRef.current, {
          componentRestrictions: { country: 'au' },
          fields: ['place_id', 'name', 'formatted_address', 'geometry', 'address_components'],
          types: ['establishment', 'geocode'],
        });
        autocomplete.bindTo('bounds', map);

        const updateFromLatLng = (latLng: any) => {
          const lat = typeof latLng.lat === 'function' ? latLng.lat() : latLng.lat;
          const lng = typeof latLng.lng === 'function' ? latLng.lng() : latLng.lng;
          marker.setPosition({ lat, lng });
          map.panTo({ lat, lng });
          geocoder.geocode({ location: { lat, lng } }, (results: any[], status: string) => {
            const place = results?.[0];
            if (status === 'OK' && place) {
              onChange({
                label: place.formatted_address || value.label || 'Pinned location',
                address: place.formatted_address,
                lat,
                lng,
                placeId: place.place_id,
                suburb: extractAddressComponent(place, ['locality', 'postal_town', 'sublocality']),
                region: extractAddressComponent(place, ['administrative_area_level_1']),
                country: extractAddressComponent(place, ['country']),
              });
            } else {
              onChange({ ...value, label: value.label || 'Pinned location', lat, lng });
            }
          });
        };

        autocomplete.addListener('place_changed', () => {
          const place = autocomplete.getPlace();
          const next = mapPlaceToValue(place, query);
          if (!next) {
            setError('Selected place has no map coordinates. Try a venue, street address, or suburb.');
            return;
          }
          setError(null);
          onChange(next);
          marker.setPosition({ lat: next.lat, lng: next.lng });
          map.panTo({ lat: next.lat, lng: next.lng });
          map.setZoom(15);
        });
        marker.addListener('dragend', () => updateFromLatLng(marker.getPosition()));
        map.addListener('click', (event: any) => updateFromLatLng(event.latLng));

        mapRef.current = map;
        markerRef.current = marker;
        geocoderRef.current = geocoder;
        autocompleteRef.current = autocomplete;
      })
      .catch((err) => setError(err.message || 'Could not load map'));

    return () => {
      cancelled = true;
      markerRef.current?.setMap?.(null);
      mapRef.current = null;
      markerRef.current = null;
      geocoderRef.current = null;
      autocompleteRef.current = null;
    };
  }, [hasGoogle]);

  useEffect(() => {
    if (!mapRef.current || !markerRef.current || value.lat == null || value.lng == null) return;
    const position = { lat: value.lat, lng: value.lng };
    markerRef.current.setPosition(position);
    mapRef.current.panTo(position);
    if ((mapRef.current.getZoom?.() || 0) < 12) mapRef.current.setZoom(14);
  }, [value.lat, value.lng]);

  function updateManual(partial: Partial<LocationValue>) {
    onChange({ ...value, ...partial, label: partial.label ?? value.label ?? query });
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-4">
        <label className="text-xs uppercase tracking-[0.24em] text-silver/50">{label}</label>
        {value.lat && value.lng ? <span className="text-[10px] uppercase tracking-[0.24em] text-silver/44">{value.lat.toFixed(5)}, {value.lng.toFixed(5)}</span> : null}
      </div>
      <input
        ref={inputRef}
        className="field-sharp"
        value={query}
        onChange={(event) => {
          setQuery(event.target.value);
          updateManual({ label: event.target.value, address: event.target.value });
        }}
        placeholder="Search venue, suburb, track, street, or address"
        autoComplete="off"
      />
      {hasGoogle ? (
        <div className="space-y-3">
          <div className="overflow-hidden rounded-[1.25rem] border border-white/10 bg-black/35">
            <div ref={mapDivRef} className="aspect-square min-h-[260px] w-full" />
          </div>
          <div className="rounded-[1.2rem] border border-white/10 bg-white/[0.03] p-4 text-sm text-silver/64">
            {helper} Google Places suggestions appear as you type. Drag the pin or click the map to correct the exact gate/meet point.
          </div>
        </div>
      ) : (
        <div className="rounded-[1.4rem] border border-dashed border-white/12 bg-white/[0.03] p-5 text-sm leading-7 text-silver/64">
          Google Maps is locked until <span className="text-bone">VITE_GOOGLE_MAPS_API_KEY</span> is configured. Manual address and coordinates still save, and admin Settings will warn until the map provider is live.
        </div>
      )}
      <div className="grid gap-3 md:grid-cols-2">
        <input className="field-sharp" placeholder="Latitude" value={value.lat ?? ''} onChange={(event) => updateManual({ lat: Number(event.target.value) || undefined })} />
        <input className="field-sharp" placeholder="Longitude" value={value.lng ?? ''} onChange={(event) => updateManual({ lng: Number(event.target.value) || undefined })} />
      </div>
      {value.address ? <p className="text-xs uppercase tracking-[0.18em] text-silver/44">Selected: {value.address}</p> : null}
      {error ? <p className="text-sm text-[#ff8f8f]">{error}</p> : null}
    </div>
  );
}
