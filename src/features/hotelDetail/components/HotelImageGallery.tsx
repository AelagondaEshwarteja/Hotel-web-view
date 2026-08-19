import { ChevronLeft, Heart, Share2 } from "lucide-react";
import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useWishlist } from "../../../shared/hooks/useWishlist";
import { cn } from "../../../shared/utils/cn";
import type { HotelContentImage } from "../types/hotelDetailTypes";

type Props = {
  images: HotelContentImage[];
  wishlistItem: {
    id: string;
    name: string;
    city: string;
    starRating: number;
    pricePerNight?: number;
  };
};

export function HotelImageGallery({ images, wishlistItem }: Props) {
  const navigate = useNavigate();
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const { isWishlisted, toggleWishlist } = useWishlist();

  const favorite = isWishlisted(wishlistItem.id);

  function handleScroll() {
    const el = scrollerRef.current;

    if (!el || el.clientWidth === 0) return;

    setActiveIndex(Math.round(el.scrollLeft / el.clientWidth));
  }

  function handleWishlist() {
    toggleWishlist({
      id: wishlistItem.id,
      name: wishlistItem.name,
      image: images[0]?.url ?? "",
      city: wishlistItem.city,
      starRating: wishlistItem.starRating,
      pricePerNight: wishlistItem.pricePerNight,
    });
  }

  return (
    <div className="relative h-[18rem] overflow-hidden bg-muted sm:h-[20rem]">
      {/* Images */}
      <div
        ref={scrollerRef}
        onScroll={handleScroll}
        className="flex h-full snap-x snap-mandatory overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {images.map((image) => (
          <img
            key={image.url}
            src={image.url}
            alt={image.caption}
            className="h-full w-full shrink-0 snap-center object-cover"
          />
        ))}
      </div>

      {/* Back Button */}
      <button
        type="button"
        aria-label="Go back"
        onClick={() => navigate(-1)}
        className="absolute left-4 top-4 flex size-10 items-center justify-center rounded-full bg-card/95 text-foreground shadow-md backdrop-blur transition active:scale-95"
      >
        <ChevronLeft className="size-5" />
      </button>

      {/* Right Actions */}
      <div className="absolute right-4 top-4 flex gap-2">
        <button
          type="button"
          aria-label="Share hotel"
          className="flex size-10 items-center justify-center rounded-full bg-card/95 text-foreground shadow-md backdrop-blur transition active:scale-95"
        >
          <Share2 className="size-4" />
        </button>

        <button
          type="button"
          aria-label={
            favorite ? "Remove from wishlist" : "Add to wishlist"
          }
          aria-pressed={favorite}
          onClick={handleWishlist}
          className="flex size-10 items-center justify-center rounded-full bg-card/95 text-foreground shadow-md backdrop-blur transition active:scale-95"
        >
          <Heart
            className={cn(
              "size-4",
              favorite && "fill-primary text-primary",
            )}
          />
        </button>
      </div>
      {/* Image Dots */}
{images.length > 1 ? (
  <div
    className="absolute bottom-4 left-4 flex items-center gap-1"
    aria-hidden="true"
  >
    {images.map((image, index) => (
      <span
        key={`${image.url}-${index}`}
        className={cn(
          "h-1.5 rounded-full transition-all duration-200",
          activeIndex === index
            ? "w-4 bg-background"
            : "w-1.5 bg-background/50",
        )}
      />
    ))}
  </div>
) : null}

      {/* Image Counter */}
      <span className="absolute bottom-4 right-4 rounded-full bg-foreground/75 px-3 py-1 text-xs font-bold text-background backdrop-blur">
        {Math.min(activeIndex + 1, images.length)} / {images.length}
      </span>
    </div>
  );
}