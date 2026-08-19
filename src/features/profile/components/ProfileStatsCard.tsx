import { Briefcase, Heart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { UserProfile } from "../data/profileData";

type ProfileStatsCardProps = {
  profile: UserProfile;
};

export function ProfileStatsCard({ profile }: ProfileStatsCardProps) {
  const navigate = useNavigate();

  return (
    <div className="-mt-8 mx-1 flex overflow-hidden rounded-2xl border border-border bg-card shadow-md">
      <button
        type="button"
        onClick={() => navigate("/bookings")}
        className="flex-1 border-r border-border py-4 text-center transition active:bg-secondary"
      >
        <Briefcase aria-hidden="true" className="mx-auto size-[18px] text-primary" />
        <p className="mt-1.5 text-lg font-bold text-foreground">{profile.bookingsCount}</p>
        <p className="mt-0.5 text-xs text-muted-foreground">Bookings</p>
      </button>

      <button
        type="button"
        onClick={() => navigate("/wishlist")}
        className="flex-1 py-4 text-center transition active:bg-secondary"
      >
        <Heart aria-hidden="true" className="mx-auto size-[18px] text-primary" />
        <p className="mt-1.5 text-lg font-bold text-foreground">{profile.wishlistCount}</p>
        <p className="mt-0.5 text-xs text-muted-foreground">Wishlist</p>
      </button>
    </div>
  );
}
