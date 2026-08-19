import { useQuery } from "@tanstack/react-query";
import { Bell, Briefcase, CreditCard, Gift, Heart, LifeBuoy, Tag } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { delayedResponse } from "../../../shared/api/delay";
import { PageTransition } from "../../../shared/components/PageTransition";
import { Skeleton } from "../../../shared/components/Skeleton";
import { Toast } from "../../../shared/components/Toast";
import { useToast } from "../../../shared/hooks/useToast";
import { LogoutButton } from "../components/LogoutButton";
import { ProfileHeader } from "../components/ProfileHeader";
import { ProfileMenuSectionList } from "../components/ProfileMenuSectionList";
import { ProfileStatsCard } from "../components/ProfileStatsCard";
import { CURRENT_USER_PROFILE } from "../data/profileData";
import type { ProfileMenuSection } from "../types/profileMenuTypes";

export default function ProfilePage() {
  const navigate = useNavigate();
  const { message, showToast } = useToast();

  // Profile data is static today, but this mirrors how it'll load once it
  // comes from a real account API — and gives the page a skeleton state.
  const profileQuery = useQuery({
    queryKey: ["profile", "current-user"],
    queryFn: () => delayedResponse(CURRENT_USER_PROFILE, 500),
  });

  const sections: ProfileMenuSection[] = [
    {
      title: "My account",
      items: [
        { id: "bookings", label: "My bookings", icon: Briefcase, onSelect: () => navigate("/bookings") },
        { id: "wishlist", label: "Wishlist", icon: Heart, onSelect: () => navigate("/wishlist") },
        {
          id: "payment-methods",
          label: "Saved payment methods",
          icon: CreditCard,
          onSelect: () => showToast("Saved payment methods coming soon"),
        },
      ],
    },
    {
      title: "Offers and rewards",
      items: [
        { id: "offers", label: "Offers and coupons", icon: Tag, onSelect: () => navigate("/offers") },
        { id: "refer", label: "Refer and earn", icon: Gift, onSelect: () => showToast("Refer and earn coming soon") },
      ],
    },
    {
      title: "Support",
      items: [
        { id: "help", label: "Help and support", icon: LifeBuoy, onSelect: () => showToast("Help and support coming soon") },
        { id: "notifications", label: "Notifications", icon: Bell, onSelect: () => showToast("Notifications coming soon") },
      ],
    },
  ];

  if (profileQuery.isLoading || !profileQuery.data) {
    return (
      <PageTransition>
        <section className="min-h-dvh bg-muted pb-6">
          <div className="rounded-b-[1.75rem] bg-primary px-4 pb-11 pt-[calc(1rem+env(safe-area-inset-top))]">
            <div className="flex items-center justify-between">
              <Skeleton className="size-9 rounded-full bg-primary-foreground/20" />
              <Skeleton className="h-4 w-16 bg-primary-foreground/20" />
              <Skeleton className="size-9 rounded-full bg-primary-foreground/20" />
            </div>
            <div className="mt-5 flex flex-col items-center">
              <Skeleton className="size-20 rounded-full bg-primary-foreground/20" />
              <Skeleton className="mt-3 h-5 w-32 bg-primary-foreground/20" />
              <Skeleton className="mt-2 h-3 w-24 bg-primary-foreground/20" />
            </div>
          </div>

          <div className="flex flex-col gap-4 px-4">
            <Skeleton className="-mt-8 mx-1 h-20 rounded-2xl" />
            <Skeleton className="h-32 rounded-2xl" />
            <Skeleton className="h-24 rounded-2xl" />
            <Skeleton className="h-24 rounded-2xl" />
          </div>
        </section>
      </PageTransition>
    );
  }

  const profile = profileQuery.data;

  return (
    <PageTransition>
      <section className="min-h-dvh bg-muted pb-6">
        <ProfileHeader
          profile={profile}
          onBackClick={() => navigate(-1)}
          onSettingsClick={() => showToast("Settings coming soon")}
          onDetailsClick={() => showToast("Edit profile coming soon")}
        />

        <div className="flex flex-col gap-4 px-4">
          <ProfileStatsCard profile={profile} />

          {sections.map((section) => (
            <ProfileMenuSectionList key={section.title} section={section} />
          ))}

          <LogoutButton onClick={() => showToast("Logged out")} />
        </div>
      </section>

      <Toast message={message} />
    </PageTransition>
  );
}
