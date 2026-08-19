import { addDays, format, parseISO } from "date-fns";
import { MapPin } from "lucide-react";
import { useState } from "react";
import { BottomSheet } from "../../../shared/components/BottomSheet";
import { Counter } from "../../../shared/components/Counter";
import type { HotelSearchQueryParams } from "../types/hotelListTypes";

type CounterKey = "rooms" | "adults" | "children";

const COUNTER_BOUNDS: Record<CounterKey, { min: number; max: number }> = {
  rooms: { min: 1, max: 8 },
  adults: { min: 1, max: 12 },
  children: { min: 0, max: 6 },
};

type EditSearchSheetProps = {
  isOpen: boolean;
  onClose: () => void;
  params: HotelSearchQueryParams;
  onApply: (next: HotelSearchQueryParams) => void;
};

/**
 * A compact "edit search" dropdown for the hotel list page. Lets people
 * tweak destination, dates, and guests without losing their place in the
 * results — unlike navigating back to /home, which used to be the only
 * way to change a search.
 */
export function EditSearchSheet({ isOpen, onClose, params, onApply }: EditSearchSheetProps) {
  const [city, setCity] = useState(params.city);
  const [checkIn, setCheckIn] = useState(params.checkIn);
  const [checkOut, setCheckOut] = useState(params.checkOut);
  const [rooms, setRooms] = useState(params.rooms);
  const [adults, setAdults] = useState(params.adults);
  const [children, setChildren] = useState(params.children);

  // Reset the local draft to the current search whenever the sheet reopens.
  // Adjusting state during render (rather than in an effect) avoids an
  // extra render pass — this is the pattern React recommends for "reset
  // state when a prop changes" (see react.dev/learn/you-might-not-need-an-effect).
  const [prevIsOpen, setPrevIsOpen] = useState(isOpen);
  if (isOpen !== prevIsOpen) {
    setPrevIsOpen(isOpen);
    if (isOpen) {
      setCity(params.city);
      setCheckIn(params.checkIn);
      setCheckOut(params.checkOut);
      setRooms(params.rooms);
      setAdults(params.adults);
      setChildren(params.children);
    }
  }

  function updateCount(key: CounterKey, delta: number) {
    const bounds = COUNTER_BOUNDS[key];
    const apply = (value: number) => Math.min(bounds.max, Math.max(bounds.min, value + delta));

    if (key === "rooms") setRooms((value) => apply(value));
    if (key === "adults") setAdults((value) => apply(value));
    if (key === "children") setChildren((value) => apply(value));
  }

  function handleCheckInChange(value: string) {
    setCheckIn(value);
    if (value && checkOut && parseISO(value) >= parseISO(checkOut)) {
      setCheckOut(format(addDays(parseISO(value), 1), "yyyy-MM-dd"));
    }
  }

  function handleApply() {
    if (!city.trim() || !checkIn || !checkOut) {
      return;
    }

    onApply({ city: city.trim(), checkIn, checkOut, rooms, adults, children });
    onClose();
  }

  const guestsLabel = `${rooms} Room${rooms > 1 ? "s" : ""} · ${adults} Adult${adults > 1 ? "s" : ""}${
    children > 0 ? `, ${children} Child${children > 1 ? "ren" : ""}` : ""
  }`;

  return (
    <BottomSheet
      isOpen={isOpen}
      onClose={onClose}
      title="Edit search"
      footer={
        <button
          type="button"
          onClick={handleApply}
          className="h-11 w-full rounded-lg bg-primary text-sm font-bold text-primary-foreground transition active:scale-[0.98]"
        >
          Update search
        </button>
      }
    >
      <div className="flex flex-col gap-4 pb-2">
        <label className="block">
          <span className="mb-1.5 block text-xs font-bold text-muted-foreground">Destination</span>
          <span className="flex items-center gap-2.5 rounded-xl border border-border bg-background px-3.5 py-3">
            <MapPin aria-hidden="true" className="size-4 shrink-0 text-primary" />
            <input
              type="text"
              value={city}
              onChange={(event) => setCity(event.target.value)}
              placeholder="Where are you going?"
              className="w-full min-w-0 bg-transparent text-sm font-semibold text-foreground outline-none placeholder:font-normal placeholder:text-muted-foreground"
            />
          </span>
        </label>

        <div className="grid grid-cols-2 gap-3">
          <label className="block">
            <span className="mb-1.5 block text-xs font-bold text-muted-foreground">Check-in</span>
            <input
              type="date"
              value={checkIn}
              min={format(new Date(), "yyyy-MM-dd")}
              onChange={(event) => handleCheckInChange(event.target.value)}
              className="w-full rounded-xl border border-border bg-background px-3 py-3 text-sm font-semibold text-foreground outline-none focus:border-primary"
            />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-xs font-bold text-muted-foreground">Check-out</span>
            <input
              type="date"
              value={checkOut}
              min={checkIn ? format(addDays(parseISO(checkIn), 1), "yyyy-MM-dd") : undefined}
              onChange={(event) => setCheckOut(event.target.value)}
              className="w-full rounded-xl border border-border bg-background px-3 py-3 text-sm font-semibold text-foreground outline-none focus:border-primary"
            />
          </label>
        </div>

        <div className="rounded-xl border border-border">
          <p className="px-3.5 pt-3 text-xs font-bold text-muted-foreground">Rooms and guests</p>
          <div className="divide-y divide-border px-3.5">
            <Counter
              label="Rooms"
              value={rooms}
              min={COUNTER_BOUNDS.rooms.min}
              max={COUNTER_BOUNDS.rooms.max}
              onChange={(delta) => updateCount("rooms", delta)}
            />
            <Counter
              label="Adults"
              description="Age 18+"
              value={adults}
              min={COUNTER_BOUNDS.adults.min}
              max={COUNTER_BOUNDS.adults.max}
              onChange={(delta) => updateCount("adults", delta)}
            />
            <Counter
              label="Children"
              description="Age 0-17"
              value={children}
              min={COUNTER_BOUNDS.children.min}
              max={COUNTER_BOUNDS.children.max}
              onChange={(delta) => updateCount("children", delta)}
            />
          </div>
          <p className="px-3.5 pb-3 pt-1 text-xs font-medium text-muted-foreground">{guestsLabel}</p>
        </div>
      </div>
    </BottomSheet>
  );
}
