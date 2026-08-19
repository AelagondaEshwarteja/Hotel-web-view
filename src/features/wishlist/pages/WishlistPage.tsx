import { Heart, MapPin, ShieldCheck, Star } from "lucide-react";
import { Link } from "react-router-dom";
import { AppHeader } from "../../../shared/components/AppHeader";
import { EmptyState } from "../../../shared/components/EmptyState";
import { PageTransition } from "../../../shared/components/PageTransition";
import { useWishlist } from "../../../shared/hooks/useWishlist";
import { formatCurrency } from "../../../shared/utils/formatters";

export default function WishlistPage() {
  const { items, toggleWishlist } = useWishlist();

  return (
    <PageTransition>
      <section className="min-h-dvh bg-muted">
        <AppHeader
          title="Wishlist"
          subtitle={items.length > 0 ? `${items.length} ${items.length === 1 ? "hotel" : "hotels"} saved` : undefined}
          showBack={false}
          showMenu={false}
        />

        {items.length === 0 ? (
          <EmptyState
            icon={Heart}
            title="Save hotels you love"
            description="Tap the heart on any hotel card to keep it here for later."
          />
        ) : (
          <div className="space-y-3 p-4">
            {items.map((item) => (
              <article key={item.id} className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
                <div className="relative">
                  <Link to={`/hotels/${item.id}`} className="block">
                    <img src={item.image} alt={item.name} className="h-40 w-full object-cover" />
                  </Link>

                  <button
                    type="button"
                    aria-label={`Remove ${item.name} from wishlist`}
                    aria-pressed="true"
                    onClick={() =>
                      toggleWishlist({
                        id: item.id,
                        name: item.name,
                        image: item.image,
                        city: item.city,
                        starRating: item.starRating,
                        pricePerNight: item.pricePerNight,
                        freeCancel: item.freeCancel,
                      })
                    }
                    className="absolute right-2.5 top-2.5 flex size-9 items-center justify-center rounded-full bg-card/95 shadow-sm backdrop-blur transition active:scale-95"
                  >
                    <Heart aria-hidden="true" className="size-[18px] fill-destructive text-destructive" strokeWidth={1.8} />
                  </button>
                </div>

                <Link to={`/hotels/${item.id}`} className="block p-3.5">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="min-w-0 truncate text-sm font-bold text-foreground">{item.name}</h3>
                    <span className="flex shrink-0 items-center gap-0.5 rounded-md bg-secondary px-1.5 py-0.5 text-[0.65rem] font-bold text-secondary-foreground">
                      <Star aria-hidden="true" className="size-2.5 fill-primary text-primary" />
                      {item.starRating.toFixed(1)}
                    </span>
                  </div>

                  <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                    <MapPin aria-hidden="true" className="size-3.5 shrink-0" />
                    <span className="truncate">{item.city}</span>
                  </div>

                  <div className="mt-2.5 flex items-end justify-between gap-2">
                    {item.freeCancel ? (
                      <p className="flex items-center gap-1 text-[0.65rem] font-semibold text-primary">
                        <ShieldCheck aria-hidden="true" className="size-3" />
                        Free cancellation
                      </p>
                    ) : (
                      <span />
                    )}

                    {item.pricePerNight !== undefined ? (
                      <p className="text-right">
                        <span className="text-base font-bold text-foreground">{formatCurrency(item.pricePerNight)}</span>
                        <span className="block text-[0.65rem] text-muted-foreground">per night, taxes included</span>
                      </p>
                    ) : null}
                  </div>
                </Link>
              </article>
            ))}
          </div>
        )}
      </section>
    </PageTransition>
  );
}
