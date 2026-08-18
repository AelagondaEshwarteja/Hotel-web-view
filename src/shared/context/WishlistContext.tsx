import { useEffect, useMemo, useState, type PropsWithChildren } from "react";
import type { WishlistItem } from "../types/wishlist";
import { WishlistContext, type WishlistContextValue } from "./wishlistContextInstance";

const STORAGE_KEY = "wishlist";

function readInitialItems(): WishlistItem[] {
  if (typeof window === "undefined") {
    return [];
  }
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as WishlistItem[]) : [];
  } catch {
    return [];
  }
}

export function WishlistProvider({ children }: PropsWithChildren) {
  const [items, setItems] = useState<WishlistItem[]>(readInitialItems);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // Storage can fail (private browsing, quota) — the wishlist still works in-memory for this session.
    }
  }, [items]);

  const value = useMemo<WishlistContextValue>(
    () => ({
      items,
      isWishlisted: (id) => items.some((item) => item.id === id),
      toggleWishlist: (item) =>
        setItems((current) =>
          current.some((existing) => existing.id === item.id)
            ? current.filter((existing) => existing.id !== item.id)
            : [...current, item],
        ),
      removeFromWishlist: (id) => setItems((current) => current.filter((item) => item.id !== id)),
    }),
    [items],
  );

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
}
