import { useQuery } from "@tanstack/react-query";
import { Heart, MapPin, Star } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { AppHeader } from "../../../shared/components/AppHeader";
import { PageTransition } from "../../../shared/components/PageTransition";
import { Skeleton } from "../../../shared/components/Skeleton";
import { queryKeys } from "../../../shared/api/queryKeys";
import { cn } from "../../../shared/utils/cn";
import { useWishlist } from "../../../shared/hooks/useWishlist";
import { fetchRecommendedHotels } from "../api/homeApi";
import type { Hotel } from "../types/homeTypes";

function RecommendedHotelRow({ hotel }: { hotel: Hotel }) {
  const { isWishlisted, toggleWishlist } = useWishlist();
  const isFavorite = isWishlisted(hotel.id);
  const location = useLocation();
  const price = hotel.pricePerNight.toLocaleString("en-IN");

  return (
    <Link
      to={`/hotels/${hotel.id}${location.search}`}
      className="block w-full overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition active:scale-[0.99]"
    >
      <div className="relative h-[180px] w-full overflow-hidden bg-secondary">
        <img src={hotel.image} alt={hotel.name} className="h-full w-full object-cover" />

        <button
          type="button"
          aria-label={isFavorite ? "Remove from wishlist" : "Add to wishlist"}
          aria-pressed={isFavorite}
          onClick={(event) => {
            event.preventDefault();
            event.stopPropagation();
            toggleWishlist({
              id: hotel.id,
              name: hotel.name,
              image: hotel.image,
              city: hotel.city,
              starRating: hotel.starRating,
              pricePerNight: hotel.pricePerNight,
            });
          }}
          className="absolute right-3 top-3 flex size-9 items-center justify-center rounded-full bg-card/95 text-foreground shadow-sm backdrop-blur transition active:scale-95"
        >
          <Heart
            aria-hidden="true"
            className={cn("size-5", isFavorite ? "fill-destructive text-destructive" : "text-foreground")}
            strokeWidth={1.8}
          />
        </button>

        <div className="absolute bottom-3 left-3 flex items-center gap-1 rounded-lg bg-card/95 px-2.5 py-1.5 text-xs font-semibold text-foreground shadow-sm backdrop-blur">
          <Star aria-hidden="true" className="size-3.5 fill-primary text-primary" />
          <span>{hotel.starRating.toFixed(1)}</span>
        </div>
      </div>

      <div className="p-4">
        <h3 className="truncate text-base font-bold text-foreground">{hotel.name}</h3>

        <div className="mt-2 flex items-center gap-1.5">
          <MapPin aria-hidden="true" className="size-4 shrink-0 text-muted-foreground" />
          <p className="truncate text-sm text-muted-foreground">
            {hotel.city}, {hotel.country}
          </p>
        </div>

        <p className="mt-2 truncate text-xs text-muted-foreground">{hotel.amenities[0] ?? "Comfort stay"}</p>

        <div className="mt-4 flex items-end justify-between gap-3">
          <div>
            <p className="text-lg font-bold text-foreground">₹{price}</p>
            <p className="text-xs text-muted-foreground">/ night</p>
          </div>

          {hotel.originalPrice ? (
            <span className="rounded-full bg-secondary px-2.5 py-1 text-[11px] font-semibold text-secondary-foreground">
              Free cancellation
            </span>
          ) : null}
        </div>
      </div>
    </Link>
  );
}

/** "View all" destination for the home page's Recommended for you rail. */
export default function AllRecommendedHotelsPage() {
  const recommendedHotelsQuery = useQuery({ queryKey: queryKeys.recommendedHotels, queryFn: fetchRecommendedHotels });

  return (
    <PageTransition>
      <section className="min-h-dvh bg-muted pb-8">
        <AppHeader title="Recommended for you" subtitle="Handpicked stays based on your searches" />

        <div className="flex flex-col gap-4 px-4 pt-2">
          {recommendedHotelsQuery.isLoading
            ? Array.from({ length: 4 }).map((_, index) => (
                <Skeleton key={index} className="h-64 w-full overflow-hidden rounded-2xl border border-border bg-card shadow-sm" />
              ))
            : recommendedHotelsQuery.data?.map((hotel) => <RecommendedHotelRow key={hotel.id} hotel={hotel} />)}
        </div>
      </section>
    </PageTransition>
  );
}
