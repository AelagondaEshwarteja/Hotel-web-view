import { MapPin } from "lucide-react";
import { useMemo, useState } from "react";
import { formatCurrency } from "../../../shared/utils/formatters";
import type { HotelListItem } from "../types/hotelListTypes";

type HotelMapPreviewProps = {
  hotels: HotelListItem[];
};

export function HotelMapPreview({ hotels }: HotelMapPreviewProps) {
  const [selectedId, setSelectedId] = useState<string | null>(hotels[0]?.id ?? null);

  const pins = useMemo(() => {
    if (hotels.length === 0) {
      return [];
    }

    const lats = hotels.map((hotel) => hotel.latitude);
    const lngs = hotels.map((hotel) => hotel.longitude);
    const latMin = Math.min(...lats);
    const latMax = Math.max(...lats);
    const lngMin = Math.min(...lngs);
    const lngMax = Math.max(...lngs);
    const latSpan = latMax - latMin || 1;
    const lngSpan = lngMax - lngMin || 1;

    return hotels.map((hotel) => ({
      hotel,
      // Inverted lat: higher latitude renders nearer the top of the panel.
      top: 12 + (1 - (hotel.latitude - latMin) / latSpan) * 76,
      left: 12 + ((hotel.longitude - lngMin) / lngSpan) * 76,
    }));
  }, [hotels]);

  const selectedHotel = hotels.find((hotel) => hotel.id === selectedId) ?? hotels[0];

  if (hotels.length === 0) {
    return null;
  }

  return (
    <div className="px-4 pt-3">
      <div
        className="relative h-[60dvh] overflow-hidden rounded-2xl border border-border shadow-inner"
        style={{
          backgroundColor: "#e7ecdf",
          backgroundImage: [
            // Faint road grid so the panel reads as a map, not a blank card.
            "repeating-linear-gradient(0deg, rgba(120,134,107,0.35) 0, rgba(120,134,107,0.35) 2px, transparent 2px, transparent 64px)",
            "repeating-linear-gradient(90deg, rgba(120,134,107,0.35) 0, rgba(120,134,107,0.35) 2px, transparent 2px, transparent 64px)",
            // A couple of soft "green space" / "water" blobs for depth.
            "radial-gradient(circle at 18% 24%, rgba(134,178,101,0.55) 0%, rgba(134,178,101,0.55) 14%, transparent 15%)",
            "radial-gradient(circle at 78% 68%, rgba(120,180,214,0.5) 0%, rgba(120,180,214,0.5) 16%, transparent 17%)",
            "radial-gradient(circle at 65% 20%, rgba(134,178,101,0.4) 0%, rgba(134,178,101,0.4) 10%, transparent 11%)",
          ].join(", "),
        }}
      >
        {pins.map(({ hotel, top, left }) => (
          <button
            key={hotel.id}
            type="button"
            onClick={() => setSelectedId(hotel.id)}
            style={{ top: `${top}%`, left: `${left}%` }}
            className="absolute flex -translate-x-1/2 -translate-y-full flex-col items-center transition active:scale-95"
          >
            <span
              className={
                hotel.id === selectedId
                  ? "rounded-full bg-primary px-2.5 py-1 text-xs font-bold text-primary-foreground shadow-lg"
                  : "rounded-full bg-card px-2.5 py-1 text-xs font-bold text-foreground shadow-md"
              }
            >
              {formatCurrency(hotel.finalPrice)}
            </span>
            <MapPin
              aria-hidden="true"
              className={hotel.id === selectedId ? "-mt-0.5 size-5 fill-primary text-primary" : "-mt-0.5 size-5 fill-card text-foreground"}
            />
          </button>
        ))}
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
