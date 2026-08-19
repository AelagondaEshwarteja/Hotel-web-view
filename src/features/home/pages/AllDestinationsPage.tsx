import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import { AppHeader } from "../../../shared/components/AppHeader";
import { PageTransition } from "../../../shared/components/PageTransition";
import { Skeleton } from "../../../shared/components/Skeleton";
import { queryKeys } from "../../../shared/api/queryKeys";
import { formatCurrency } from "../../../shared/utils/formatters";
import { buildHotelListSearch } from "../../hotelList/hooks/useHotelSearchParams";
import { fetchDestinations } from "../api/homeApi";
import { useSearchForm } from "../hooks/useSearchForm";

/**
 * "View all" destination for the home page's Top travel destinations rail.
 * Shows only the app's curated set of popular/top cities — same dataset
 * the home rail pulls from, just laid out for browsing instead of a scroller.
 */
export default function AllDestinationsPage() {
  const navigate = useNavigate();
  const form = useSearchForm();
  const destinationsQuery = useQuery({ queryKey: queryKeys.destinations, queryFn: fetchDestinations });

  function handleSelect(city: string, country: string) {
    const search = buildHotelListSearch({
      city: `${city}, ${country}`,
      checkIn: format(form.checkIn, "yyyy-MM-dd"),
      checkOut: format(form.checkOut, "yyyy-MM-dd"),
      rooms: 1,
      adults: 1,
      children: 0,
    });

    navigate(`/hotels?${search}`);
  }

  return (
    <PageTransition>
      <section className="min-h-dvh bg-muted pb-8">
        <AppHeader title="Popular destinations" subtitle="Top cities to explore right now" />

        <div className="grid grid-cols-2 gap-3 px-4 pt-2">
          {destinationsQuery.isLoading
            ? Array.from({ length: 6 }).map((_, index) => <Skeleton key={index} className="h-44" />)
            : destinationsQuery.data?.map((destination) => (
                <button
                  key={destination.id}
                  type="button"
                  onClick={() => handleSelect(destination.city, destination.country)}
                  className="relative h-44 overflow-hidden rounded-xl shadow-sm transition active:scale-[0.97]"
                >
                  <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: `url(${destination.image})` }}
                    role="img"
                    aria-label={destination.city}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-foreground/85 via-foreground/10 to-transparent" />

                  <span className="absolute left-2.5 top-2.5 text-sm font-bold text-primary-foreground drop-shadow-sm">
                    {destination.city}
                  </span>
                  <span className="absolute left-2.5 top-7 text-[0.65rem] font-medium text-primary-foreground/80">
                    {destination.propertyCount} properties
                  </span>

                  {destination.startingFrom ? (
                    <span className="absolute inset-x-0 bottom-0 p-2.5 text-left">
                      <span className="block text-[0.6rem] font-medium text-primary-foreground/80">Starting from</span>
                      <span className="block text-sm font-bold text-primary-foreground">
                        {formatCurrency(destination.startingFrom)}
                      </span>
                    </span>
                  ) : null}
                </button>
              ))}
        </div>
      </section>
    </PageTransition>
  );
}
