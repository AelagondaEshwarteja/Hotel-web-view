import { createContext } from "react";
import type { WishlistItem } from "../types/wishlist";

export type WishlistContextValue = {
  items: WishlistItem[];
  isWishlisted: (id: string) => boolean;
  toggleWishlist: (item: WishlistItem) => void;
  removeFromWishlist: (id: string) => void;
};

export const WishlistContext = createContext<WishlistContextValue | null>(null);
