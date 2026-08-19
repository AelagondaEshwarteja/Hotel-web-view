import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useMemo, useState } from "react";
import { MapContainer, Marker, TileLayer, useMap } from "react-leaflet";
import { formatCurrency } from "../../../shared/utils/formatters";
import type { HotelListItem } from "../types/hotelListTypes";

type HotelMapPreviewProps = {
  hotels: HotelListItem[];
};

/** Builds a price-bubble marker icon so pins read like a real booking-site map pin, not a stock Leaflet marker. */
function buildPriceIcon(price: number, isSelected: boolean) {
  const label = formatCurrency(price);
  const bg = isSelected ? "#1f6feb" : "#ffffff";
  const fg = isSelected ? "#ffffff" : "#1c1c1e";
  const border = isSelected ? "#1f6feb" : "#d9dbe0";

  return L.divIcon({
    className: "",
    html: `
      <div style="display:flex;flex-direction:column;align-items:center;transform:translateY(-4px);">
        <div style="white-space:nowrap;background:${bg};color:${fg};border:1px solid ${border};border-radius:9999px;padding:4px 10px;font-size:12px;font-weight:700;box-shadow:0 2px 6px rgba(0,0,0,0.18);font-family:inherit;">
          ${label}
        </div>
        <div style="width:0;height:0;border-left:6px solid transparent;border-right:6px solid transparent;border-top:7px solid ${bg};margin-top:-1px;filter:drop-shadow(0 1px 1px rgba(0,0,0,0.15));"></div>
      </div>
    `,
    iconSize: [0, 0],
    iconAnchor: [0, 0],
  });
}

/** Recentres/refits the map whenever the underlying hotel set changes (e.g. after a filter or a new search). */
function FitBoundsOnChange({ hotels }: { hotels: HotelListItem[] }) {
  const map = useMap();

  useMemo(() => {
    if (hotels.length === 0) {
      return;
    }

    if (hotels.length === 1) {
      map.setView([hotels[0].latitude, hotels[0].longitude], 14);
      return;
    }

    const bounds = L.latLngBounds(hotels.map((hotel) => [hotel.latitude, hotel.longitude] as [number, number]));
    map.fitBounds(bounds, { padding: [48, 48] });
  }, [hotels, map]);

  return null;
}

export function HotelMapPreview({ hotels }: HotelMapPreviewProps) {
  const [selectedId, setSelectedId] = useState<string | null>(hotels[0]?.id ?? null);
  const selectedHotel = hotels.find((hotel) => hotel.id === selectedId) ?? hotels[0];

  const center = useMemo<[number, number]>(() => {
    if (hotels.length === 0) {
      // Rough centre of India as a sane default when there's nothing to show yet.
      return [22.9734, 78.6569];
    }
    return [hotels[0].latitude, hotels[0].longitude];
  }, [hotels]);

  if (hotels.length === 0) {
    return null;
  }

  return (
    <div className="px-4 pt-3">
      <div className="relative h-[60dvh] overflow-hidden rounded-2xl border border-border shadow-inner">
        <MapContainer
          center={center}
          zoom={13}
          scrollWheelZoom
          className="h-full w-full"
          attributionControl={false}
        >
          {/* Free OpenStreetMap raster tiles — no API key required. */}
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />

          <FitBoundsOnChange hotels={hotels} />

          {hotels.map((hotel) => (
            <Marker
              key={hotel.id}
              position={[hotel.latitude, hotel.longitude]}
              icon={buildPriceIcon(hotel.finalPrice, hotel.id === selectedId)}
              eventHandlers={{ click: () => setSelectedId(hotel.id) }}
            />
          ))}
        </MapContainer>

        <div className="pointer-events-none absolute bottom-2 right-2 rounded-md bg-card/90 px-1.5 py-0.5 text-[9px] font-medium text-muted-foreground shadow-sm">
          © OpenStreetMap
        </div>
      </div>

      {selectedHotel ? (
        <div className="mt-3 flex items-center gap-3 rounded-2xl border border-border bg-card p-3 shadow-sm">
          <img
            src={selectedHotel.image}
            alt={selectedHotel.name}
            className="size-16 shrink-0 rounded-xl object-cover"
          />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-bold text-foreground">{selectedHotel.name}</p>
            <p className="truncate text-xs text-muted-foreground">{selectedHotel.area}</p>
            <p className="mt-0.5 text-sm font-bold text-foreground">
              {formatCurrency(selectedHotel.finalPrice)} <span className="text-xs font-medium text-muted-foreground">/ night</span>
            </p>
          </div>
        </div>
      ) : null}
    </div>
  );
}