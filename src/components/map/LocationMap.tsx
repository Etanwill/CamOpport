// src/components/map/LocationMap.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { MapPin, Navigation, ExternalLink, Loader } from "lucide-react";

interface LocationMapProps {
  venueName: string;
  venueCity: string;
  venueRegion?: string;
  isOnline?: boolean;
  // Precise venue location, geocoded from the employer's "zone" text at post
  // time (see ZoneLocationPicker + /api/geocode). When absent, we fall back
  // to the city-center coordinates below.
  zone?: string | null;
  latitude?: number | null;
  longitude?: number | null;
}

const CITY_COORDS: Record<string, [number, number]> = {
  "Yaoundé":    [3.8480,  11.5021],
  "Douala":     [4.0511,  9.7679],
  "Bafoussam":  [5.4737,  10.4179],
  "Bamenda":    [5.9597,  10.1455],
  "Garoua":     [9.3000,  13.3999],
  "Maroua":     [10.5908, 14.3154],
  "Ngaoundéré": [7.3267,  13.5840],
  "Bertoua":    [4.5785,  13.6846],
  "Ebolowa":    [2.9000,  11.1500],
  "Buea":       [4.1527,  9.2408],
  "Limbe":      [4.0167,  9.2000],
  "Kumba":      [4.6363,  9.4469],
};

// Always take a fresh, high-accuracy GPS reading — never a browser-cached
// one. Without this, the browser is free to silently hand back an old
// cached fix (sometimes minutes or hours stale) instead of your current
// position, which is what caused the in-app map and the external "Maps"
// link to briefly disagree on where you actually are.
const GEOLOCATION_OPTIONS: PositionOptions = {
  enableHighAccuracy: true,
  maximumAge: 0,
  timeout: 15000,
};

export default function LocationMap({
  venueName, venueCity, venueRegion, isOnline, zone, latitude, longitude,
}: LocationMapProps) {
  const mapRef         = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const [userLocation,    setUserLocation]    = useState<[number, number] | null>(null);
  const [gettingLocation, setGettingLocation] = useState(false);
  const [routeInfo,       setRouteInfo]       = useState<{ distance: string; duration: string } | null>(null);
  const [mapLoaded,       setMapLoaded]       = useState(false);
  const [routeError,      setRouteError]      = useState("");
  const [locationAccuracy, setLocationAccuracy] = useState<number | null>(null);

  // Use the precise geocoded pin when we have one, otherwise fall back to
  // the city-center approximation.
  const hasPreciseLocation = latitude != null && longitude != null;
  const venueCoords: [number, number] = hasPreciseLocation
    ? [latitude as number, longitude as number]
    : (CITY_COORDS[venueCity] ?? CITY_COORDS["Yaoundé"]);

  const calcDistance = (a: [number, number], b: [number, number]) => {
    const R    = 6371;
    const dLat = (b[0] - a[0]) * Math.PI / 180;
    const dLon = (b[1] - a[1]) * Math.PI / 180;
    const x    = Math.sin(dLat / 2) ** 2 +
      Math.cos(a[0] * Math.PI / 180) * Math.cos(b[0] * Math.PI / 180) * Math.sin(dLon / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x));
  };

  useEffect(() => {
    if (isOnline || !mapRef.current) return;

    // React 18 Strict Mode (dev only) mounts every component, cleans it up,
    // then mounts it again — all synchronously, before the async
    // import("leaflet").then(...) below ever gets a chance to run. Without
    // this flag, both the first effect's callback and the second effect's
    // callback would go on to call L.map() on the same container, which
    // throws "Map container is already initialized." `cancelled` is scoped
    // to *this* effect invocation, so when the first invocation's cleanup
    // runs, only its own (now-stale) pending callback gets silenced — the
    // second invocation still runs cleanly.
    let cancelled = false;

    import("leaflet").then((L) => {
      if (cancelled || mapInstanceRef.current) return;

      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        iconUrl:       "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        shadowUrl:     "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      });

      const map = L.map(mapRef.current!).setView(venueCoords, hasPreciseLocation ? 15 : 13);
      mapInstanceRef.current = map;

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 19,
      }).addTo(map);

      const venueIcon = L.divIcon({
        html: `<div style="background:#7c3aed;width:36px;height:36px;border-radius:50% 50% 50% 0;transform:rotate(-45deg);border:3px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.3)"></div>`,
        className: "",
        iconSize:   [36, 36],
        iconAnchor: [18, 36],
      });

      L.marker(venueCoords, { icon: venueIcon })
        .addTo(map)
        .bindPopup(`<strong>${venueName}</strong><br>${zone ? zone + "<br>" : ""}${venueCity}${venueRegion ? ", " + venueRegion : ""}`)
        .openPopup();

      setMapLoaded(true);
    });

    return () => {
      cancelled = true;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  const drawStraightFallback = (L: any, map: any, myCoords: [number, number]) => {
    const routeLine = L.polyline([myCoords, venueCoords], {
      color: "#7c3aed", weight: 3, opacity: 0.8, dashArray: "8, 6",
    }).addTo(map);
    (routeLine as any)._isRoute = true;

    const dist  = calcDistance(myCoords, venueCoords);
    const hours = dist / 60;
    setRouteInfo({
      distance: dist < 1 ? `${Math.round(dist * 1000)} m` : `${dist.toFixed(1)} km`,
      duration: hours < 1 ? `${Math.round(hours * 60)} min` : `${hours.toFixed(1)} hrs`,
    });
  };

  const logDirectionsRequest = (payload: {
    userLat: number; userLng: number; accuracy?: number;
    distance: string; duration: string; source: "osrm" | "fallback";
  }) => {
    // Fire-and-forget — purely so this is visible in your server logs to
    // confirm the browser's real location and the venue's real coordinates
    // were used. Never blocks or affects the map if it fails.
    fetch("/api/directions-log", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        venueName, venueCity, zone,
        userLat: payload.userLat, userLng: payload.userLng, accuracy: payload.accuracy,
        venueLat: venueCoords[0], venueLng: venueCoords[1],
        distance: payload.distance, duration: payload.duration,
        source: payload.source,
      }),
    }).catch(() => {});
  };

  const getMyLocation = () => {
    if (!navigator.geolocation) return;
    setGettingLocation(true);
    setRouteError("");

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const myCoords: [number, number] = [pos.coords.latitude, pos.coords.longitude];
        const accuracy = pos.coords.accuracy; // meters — large value ⇒ IP/network estimate, not GPS
        setLocationAccuracy(accuracy);
        setUserLocation(myCoords);
        setGettingLocation(false);

        const L   = await import("leaflet");
        const map = mapInstanceRef.current;
        if (!map) return;

        map.eachLayer((layer: any) => {
          if (layer._isUserMarker || layer._isRoute) map.removeLayer(layer);
        });

        const userIcon = L.divIcon({
          html: `<div style="background:#16a34a;width:28px;height:28px;border-radius:50%;border:3px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.3);display:flex;align-items:center;justify-content:center"><div style="width:10px;height:10px;background:white;border-radius:50%"></div></div>`,
          className: "",
          iconSize:   [28, 28],
          iconAnchor: [14, 14],
        });

        const userMarker = L.marker(myCoords, { icon: userIcon }).addTo(map);
        (userMarker as any)._isUserMarker = true;
        userMarker.bindPopup("📍 Your location");

        // Try to fetch the actual road route via OSRM's free public routing
        // API (no key required). Falls back to a straight dashed line + a
        // haversine estimate if the routing service is unreachable.
        try {
          const url = `https://router.project-osrm.org/route/v1/driving/${myCoords[1]},${myCoords[0]};${venueCoords[1]},${venueCoords[0]}?overview=full&geometries=geojson`;
          const res  = await fetch(url);
          const data = await res.json();
          const route = data?.routes?.[0];

          if (route?.geometry?.coordinates?.length) {
            // GeoJSON gives [lng, lat] pairs — Leaflet wants [lat, lng].
            const latLngs = route.geometry.coordinates.map((c: [number, number]) => [c[1], c[0]]);
            const routeLine = L.polyline(latLngs, { color: "#7c3aed", weight: 4, opacity: 0.85 }).addTo(map);
            (routeLine as any)._isRoute = true;

            map.fitBounds(L.latLngBounds(latLngs), { padding: [40, 40] });

            const km    = route.distance / 1000;
            const hours = route.duration / 3600;
            const distance = km < 1 ? `${Math.round(route.distance)} m` : `${km.toFixed(1)} km`;
            const duration = hours < 1 ? `${Math.round(route.duration / 60)} min` : `${hours.toFixed(1)} hrs`;
            setRouteInfo({ distance, duration });
            logDirectionsRequest({ userLat: myCoords[0], userLng: myCoords[1], accuracy, distance, duration, source: "osrm" });
          } else {
            drawStraightFallback(L, map, myCoords);
            map.fitBounds(L.latLngBounds([myCoords, venueCoords]), { padding: [40, 40] });
            setRouteError("Showing a straight-line estimate — couldn't fetch the road route.");
            const dist  = calcDistance(myCoords, venueCoords);
            const hours = dist / 60;
            logDirectionsRequest({
              userLat: myCoords[0], userLng: myCoords[1], accuracy,
              distance: dist < 1 ? `${Math.round(dist * 1000)} m` : `${dist.toFixed(1)} km`,
              duration: hours < 1 ? `${Math.round(hours * 60)} min` : `${hours.toFixed(1)} hrs`,
              source: "fallback",
            });
          }
        } catch {
          drawStraightFallback(L, map, myCoords);
          map.fitBounds(L.latLngBounds([myCoords, venueCoords]), { padding: [40, 40] });
          setRouteError("Showing a straight-line estimate — couldn't fetch the road route.");
          const dist  = calcDistance(myCoords, venueCoords);
          const hours = dist / 60;
          logDirectionsRequest({
            userLat: myCoords[0], userLng: myCoords[1], accuracy,
            distance: dist < 1 ? `${Math.round(dist * 1000)} m` : `${dist.toFixed(1)} km`,
            duration: hours < 1 ? `${Math.round(hours * 60)} min` : `${hours.toFixed(1)} hrs`,
            source: "fallback",
          });
        }
      },
      () => { setGettingLocation(false); setRouteError("Couldn't access your location. Check your browser's location permission."); },
      GEOLOCATION_OPTIONS
    );
  };

  const openGoogleMaps = () => {
    // Always use the exact same destination coordinates the in-app route
    // uses (precise geocoded pin, or the same city-center fallback) — never
    // a text search — so this link can never point somewhere different
    // from what "Get Directions" just showed.
    const dest = `${venueCoords[0]},${venueCoords[1]}`;

    if (userLocation) {
      // Already have the user's coordinates from "Get Directions" — reuse
      // the exact same numbers so both buttons agree on the same route.
      window.open(`https://www.google.com/maps/dir/${userLocation[0]},${userLocation[1]}/${dest}`, "_blank");
      return;
    }

    // "Maps" was clicked before "Get Directions" — fetch the user's
    // location first so this still opens a real from→to route instead of
    // just a destination search.
    if (!navigator.geolocation) {
      window.open(`https://www.google.com/maps/search/${dest}`, "_blank");
      return;
    }
    setGettingLocation(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const myCoords: [number, number] = [pos.coords.latitude, pos.coords.longitude];
        setUserLocation(myCoords);
        setLocationAccuracy(pos.coords.accuracy);
        setGettingLocation(false);
        window.open(`https://www.google.com/maps/dir/${myCoords[0]},${myCoords[1]}/${dest}`, "_blank");
      },
      () => {
        setGettingLocation(false);
        // Couldn't get location — still open something useful rather than nothing.
        window.open(`https://www.google.com/maps/search/${dest}`, "_blank");
      },
      GEOLOCATION_OPTIONS
    );
  };

  if (isOnline) return (
    <div className="card p-5 isolate">
      <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
        <MapPin size={16} className="text-primary-600" /> Location
      </h3>
      <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 text-center">
        <div className="text-3xl mb-2">🌐</div>
        <p className="text-sm font-semibold text-blue-700">This is an online event</p>
        <p className="text-xs text-blue-500 mt-1">No physical location — join from anywhere in Cameroon</p>
      </div>
    </div>
  );

  return (
    <div className="card p-5 isolate">
      <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
        <MapPin size={16} className="text-primary-600" /> Location & Directions
      </h3>

      <div className="flex items-center gap-2 mb-3 text-sm text-gray-600">
        <MapPin size={14} className="text-primary-500 flex-shrink-0" />
        <span>
          <strong>{zone ? zone : venueCity}</strong>
          {zone ? `, ${venueCity}` : ""}{venueRegion ? `, ${venueRegion}` : ""} — {venueName}
        </span>
      </div>

      <div className="relative rounded-xl overflow-hidden border border-gray-200 mb-3" style={{ height: 260 }}>
        <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
        <div ref={mapRef} style={{ height: "100%", width: "100%" }} />
        {!mapLoaded && (
          <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
            <Loader size={22} className="text-primary-500 animate-spin" />
          </div>
        )}
      </div>

      {routeInfo && (
        <div className="flex gap-3 mb-3">
          <div className="flex-1 bg-primary-50 rounded-xl p-3 text-center">
            <p className="text-base font-bold text-primary-700">{routeInfo.distance}</p>
            <p className="text-xs text-gray-500">Distance</p>
          </div>
          <div className="flex-1 bg-primary-50 rounded-xl p-3 text-center">
            <p className="text-base font-bold text-primary-700">{routeInfo.duration}</p>
            <p className="text-xs text-gray-500">Est. drive time</p>
          </div>
        </div>
      )}

      {routeError && <p className="text-xs text-amber-600 mb-3">{routeError}</p>}

      {locationAccuracy != null && locationAccuracy > 1000 && (
        <p className="text-xs text-amber-600 mb-3">
          ⚠️ Your location was estimated from your network (±{Math.round(locationAccuracy / 1000)} km), not GPS —
          it may be off, especially on a desktop/laptop. For an exact position, try this on your phone with GPS/location services on.
        </p>
      )}

      <div className="flex gap-2">
        <button onClick={getMyLocation} disabled={gettingLocation}
          className="flex-1 flex items-center justify-center gap-2 py-2.5 px-3 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-sm font-medium transition-colors disabled:opacity-60">
          {gettingLocation
            ? <><Loader size={14} className="animate-spin" /> Locating...</>
            : <><Navigation size={14} /> Get Directions</>}
        </button>
        <button onClick={openGoogleMaps} disabled={gettingLocation}
          className="flex items-center justify-center gap-2 py-2.5 px-3 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-xl text-sm font-medium transition-colors disabled:opacity-60">
          {gettingLocation
            ? <Loader size={14} className="animate-spin" />
            : <><ExternalLink size={14} /> Maps</>}
        </button>
      </div>
      <p className="text-xs text-gray-400 mt-2 text-center">
        Click "Get Directions" to see the road route from your location
        {!hasPreciseLocation && " (approximate city center — exact zone not provided)"}
      </p>
    </div>
  );
}