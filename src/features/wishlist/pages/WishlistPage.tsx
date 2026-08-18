import { Heart, MapPin, Star, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { AppHeader } from "../../../shared/components/AppHeader";
import { useWishlist } from "../../../shared/hooks/useWishlist";
import { EmptyState } from "../../../shared/components/EmptyState";
import { PageTransition } from "../../../shared/components/PageTransition";
import { formatCurrency } from "../../../shared/utils/formatters";
// edit from here R.N
export default function WishlistPage() {
  const { items, removeFromWishlist } = useWishlist();

  return (
    <PageTransition>
      <section className="min-h-dvh bg-muted">
        <AppHeader title="Wishlist" showBack={false} showMenu={false} />

        {items.length === 0 ? (
          <EmptyState
            icon={Heart}
            title="Save hotels you love"
            description="Tap the heart on any hotel card to keep it here for later."
          />
        ) : (
          <div className="space-y-3 p-4">
            {items.map((item) => (
              <article key={item.id} className="flex overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
                <Link to={`/hotels/${item.id}`} className="flex min-w-0 flex-1">
                  <img src={item.image} alt={item.name} className="h-28 w-28 shrink-0 object-cover" />
                  <div className="min-w-0 flex-1 p-3">
                    <h3 className="truncate text-sm font-bold text-foreground">{item.name}</h3>
                    <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                      <MapPin aria-hidden="true" className="size-3.5 shrink-0" />
                      <span className="truncate">{item.city}</span>
                    </div>
                    <div className="mt-1.5 flex items-center gap-1 text-xs font-semibold text-foreground">
                      <Star aria-hidden="true" className="size-3.5 fill-primary text-primary" />
                      {item.starRating.toFixed(1)}
                    </div>
                    {item.pricePerNight !== undefined ? (
                      <p className="mt-2 text-sm font-bold text-foreground">
                        {formatCurrency(item.pricePerNight)}
                        <span className="text-xs font-normal text-muted-foreground"> / night</span>
                      </p>
                    ) : null}
                  </div>
                </Link>

                <button
                  type="button"
                  aria-label={`Remove ${item.name} from wishlist`}
                  onClick={() => removeFromWishlist(item.id)}
                  className="flex w-11 shrink-0 items-center justify-center border-l border-border text-muted-foreground transition hover:bg-secondary hover:text-destructive active:scale-95"
                >
                  <Trash2 aria-hidden="true" className="size-4" />
                </button>
              </article>
            ))}
          </div>
        )}
      </section>
    </PageTransition>
  );
}




// export default function WishlistPage() {
//   return (
//     <PageTransition>
//       <section className="min-h-dvh bg-muted">
//         <AppHeader title="Wishlist" showBack={false} showMenu={false} />
//         <EmptyState
//           icon={Heart}
//           title="Save hotels you love"
//           description="Tap the heart on any hotel card to keep it here for later."
//         />
//       </section>
//     </PageTransition>
//   );
// }
