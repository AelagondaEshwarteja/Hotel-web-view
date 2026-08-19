import { Skeleton } from "../../../shared/components/Skeleton";
import type { Hotel } from "../types/homeTypes";
import { HotelCard } from "./HotelCard";

type RecommendedHotelsProps = {
  hotels: Hotel[] | undefined;
  isLoading: boolean;
  onViewAll: () => void;
};

export function RecommendedHotels({ hotels, isLoading, onViewAll }: RecommendedHotelsProps) {
  return (
    <section className="px-4 pt-6">
      <div className="flex items-center justify-between px-1">
        <h2 className="text-sm font-bold text-foreground">Recommended for you</h2>
        {!isLoading && hotels && hotels.length > 0 ? (
          <button
            type="button"
            onClick={onViewAll}
            className="text-xs font-bold text-primary transition active:scale-95"
          >
            View all
          </button>
        ) : null}
      </div>

      <div className="flex gap-4 overflow-x-auto pb-3 snap-x snap-mandatory scrollbar-none">
        {isLoading
          ? Array.from({ length: 4 }).map(
              (_, index) => (
                <Skeleton
                  key={index}
                  className="h-64 w-[285px] min-w-[285px] snap-start overflow-hidden rounded-2xl border border-border bg-card shadow-sm"
                />
              ),
            )
          : hotels?.map((hotel) => <HotelCard key={hotel.id} hotel={hotel} />)}
      </div>
    </section>
  );
}
