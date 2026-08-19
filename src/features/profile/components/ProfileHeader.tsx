import { ChevronLeft, Pencil, Settings } from "lucide-react";
import type { UserProfile } from "../data/profileData";
import { getUserFullName, getUserInitials } from "../utils/profileUtils";

type ProfileHeaderProps = {
  profile: UserProfile;
  onBackClick: () => void;
  onSettingsClick: () => void;
  onDetailsClick: () => void;
};

export function ProfileHeader({ profile, onBackClick, onSettingsClick, onDetailsClick }: ProfileHeaderProps) {
  const fullName = getUserFullName(profile);
  const initials = getUserInitials(profile);

  return (
    <div className="rounded-b-[1.75rem] bg-primary px-4 pb-11 pt-[calc(1rem+env(safe-area-inset-top))] text-primary-foreground shadow-sm">
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={onBackClick}
          aria-label="Go back"
          className="flex size-9 items-center justify-center rounded-full bg-primary-foreground/15 transition active:bg-primary-foreground/25"
        >
          <ChevronLeft aria-hidden="true" className="size-5" />
        </button>

        <h1 className="text-base font-bold">Profile</h1>

        <button
          type="button"
          onClick={onSettingsClick}
          aria-label="Account settings"
          className="flex size-9 items-center justify-center rounded-full transition active:bg-primary-foreground/15"
        >
          <Settings aria-hidden="true" className="size-5" />
        </button>
      </div>

      <button type="button" onClick={onDetailsClick} className="mt-5 flex w-full flex-col items-center text-center">
        <span className="relative">
          <span className="flex size-20 items-center justify-center rounded-full bg-primary-foreground text-2xl font-bold text-primary ring-4 ring-primary-foreground/25">
            {initials}
          </span>
          <span className="absolute -bottom-0.5 -right-0.5 flex size-6 items-center justify-center rounded-full border-2 border-primary bg-secondary-foreground">
            <Pencil aria-hidden="true" className="size-3 text-secondary" />
          </span>
        </span>

        <span className="mt-3 block truncate text-lg font-bold leading-tight">{fullName}</span>
        <span className="mt-1 block truncate text-xs font-medium text-primary-foreground/85">
          {profile.countryCode} {profile.phone}
        </span>
      </button>
    </div>
  );
}
