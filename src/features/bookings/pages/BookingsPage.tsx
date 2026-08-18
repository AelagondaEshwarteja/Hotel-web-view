import { CalendarCheck, CalendarX2, MapPin } from "lucide-react";
import { useState } from "react";
import { AppHeader } from "../../../shared/components/AppHeader";
import { PageTransition } from "../../../shared/components/PageTransition";
import { cn } from "../../../shared/utils/cn";

type BookingStatus = "Upcoming" | "Completed" | "Cancelled";

type Booking = {
  id: string;
  hotelName: string;
  city: string;
  checkIn: string;
  checkOut: string;
  status: BookingStatus;
  image: string;
};

const DUMMY_BOOKINGS: Booking[] = [
  {
    id: "bk-1",
    hotelName: "The Grand Resort",
    city: "Goa, India",
    checkIn: "15 Aug 2026",
    checkOut: "17 Aug 2026",
    status: "Upcoming",
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&q=80",
  },
  {
    id: "bk-2",
    hotelName: "Lakeview Heritage",
    city: "Udaipur, India",
    checkIn: "2 Jun 2026",
    checkOut: "4 Jun 2026",
    status: "Completed",
    image: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=400&q=80",
  },
  {
    id: "bk-3",
    hotelName: "Palm Grove Retreat",
    city: "Kerala, India",
    checkIn: "10 Apr 2026",
    checkOut: "12 Apr 2026",
    status: "Cancelled",
    image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=400&q=80",
  },
];

const BOOKING_TABS: BookingStatus[] = ["Upcoming", "Completed", "Cancelled"];

function statusStyle(status: BookingStatus) {
  if (status === "Upcoming") {
    return "bg-secondary text-primary";
  }

  if (status === "Completed") {
    return "bg-muted text-muted-foreground";
  }

  return "bg-destructive/10 text-destructive";
}

function emptyMessage(status: BookingStatus) {
  if (status === "Upcoming") {
    return {
      title: "No upcoming bookings",
      description: "Your future hotel stays will appear here.",
    };
  }

  if (status === "Completed") {
    return {
      title: "No completed stays",
      description: "Hotels you have already stayed at will appear here.",
    };
  }

  return {
    title: "No cancelled bookings",
    description: "Any cancelled hotel bookings will appear here.",
  };
}

export default function BookingsPage() {
  const [activeStatus, setActiveStatus] = useState<BookingStatus>("Upcoming");

  const visibleBookings = DUMMY_BOOKINGS.filter(
    (booking) => booking.status === activeStatus,
  );

  const emptyState = emptyMessage(activeStatus);

  return (
    <PageTransition>
      <section className="min-h-dvh bg-muted pb-24">
        <AppHeader title="Bookings" showBack={false} showMenu={false} />

        <div className="sticky top-0 z-10 border-b border-border bg-background px-4 pb-3 pt-1">
          <div className="grid grid-cols-3 rounded-xl bg-muted p-1">
            {BOOKING_TABS.map((status) => {
              const isActive = activeStatus === status;
              const count = DUMMY_BOOKINGS.filter(
                (booking) => booking.status === status,
              ).length;

              return (
                <button
                  key={status}
                  type="button"
                  onClick={() => setActiveStatus(status)}
                  className={cn(
                    "flex min-w-0 items-center justify-center gap-1.5 rounded-lg px-2 py-2.5 text-xs font-bold transition active:scale-[0.98]",
                    isActive
                      ? "bg-card text-primary shadow-sm"
                      : "text-muted-foreground",
                  )}
                >
                  <span className="truncate">{status}</span>
                  <span
                    className={cn(
                      "flex size-5 shrink-0 items-center justify-center rounded-full text-[0.6rem] font-bold",
                      isActive
                        ? "bg-secondary text-primary"
                        : "bg-background text-muted-foreground",
                    )}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="p-4">
          {visibleBookings.length > 0 ? (
            <div className="space-y-3">
              {visibleBookings.map((booking) => (
                <article
                  key={booking.id}
                  className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm"
                >
                  <div className="flex">
                    <img
                      src={booking.image}
                      alt={booking.hotelName}
                      className="h-28 w-28 shrink-0 object-cover"
                    />

                    <div className="min-w-0 flex-1 p-3">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="min-w-0 truncate text-sm font-bold text-foreground">
                          {booking.hotelName}
                        </h3>

                        <span
                          className={cn(
                            "shrink-0 rounded-full px-2 py-0.5 text-[0.62rem] font-bold",
                            statusStyle(booking.status),
                          )}
                        >
                          {booking.status}
                        </span>
                      </div>

                      <div className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
                        <MapPin
                          aria-hidden="true"
                          className="size-3.5 shrink-0"
                        />
                        <span className="truncate">{booking.city}</span>
                      </div>

                      <div className="mt-1.5 flex items-center gap-1 text-xs text-muted-foreground">
                        <CalendarCheck
                          aria-hidden="true"
                          className="size-3.5 shrink-0"
                        />
                        <span className="truncate">
                          {booking.checkIn} – {booking.checkOut}
                        </span>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="flex min-h-[23rem] flex-col items-center justify-center px-6 text-center">
              <div className="flex size-14 items-center justify-center rounded-full bg-secondary text-primary">
                {activeStatus === "Cancelled" ? (
                  <CalendarX2 aria-hidden="true" className="size-6" />
                ) : (
                  <CalendarCheck aria-hidden="true" className="size-6" />
                )}
              </div>
              <h2 className="mt-4 text-base font-bold text-foreground">
                {emptyState.title}
              </h2>
              <p className="mt-1 max-w-xs text-sm leading-5 text-muted-foreground">
                {emptyState.description}
              </p>
            </div>
          )}
        </div>
      </section>
    </PageTransition>
  );
}