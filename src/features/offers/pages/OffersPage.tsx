import { Copy, Tag } from "lucide-react";
import { AppHeader } from "../../../shared/components/AppHeader";
import { PageTransition } from "../../../shared/components/PageTransition";
import { Toast } from "../../../shared/components/Toast";
import { useToast } from "../../../shared/hooks/useToast";
import { formatCurrency } from "../../../shared/utils/formatters";
// Promo codes are defined once for the whole app in the review-booking
// feature (that's where they're actually applied to a booking). This page
// just gives people a way to browse and copy them ahead of checkout.
import { mockPromoCodes } from "../../reviewBooking/data/mockReviewData";

export default function OffersPage() {
  const { message, showToast } = useToast();

  async function handleCopy(code: string) {
    try {
      await navigator.clipboard.writeText(code);
      showToast(`${code} copied`);
    } catch {
      showToast("Couldn't copy — copy it manually");
    }
  }

  return (
    <PageTransition>
      <section className="min-h-dvh bg-muted">
        <AppHeader title="Offers and coupons" subtitle={`${mockPromoCodes.length} offers available`} />

        <div className="flex flex-col gap-3 p-4">
          {mockPromoCodes.map((promo) => (
            <article key={promo.code} className="rounded-2xl border border-border bg-card p-4 shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-xl bg-secondary text-primary">
                    <Tag aria-hidden="true" className="size-4" />
                  </span>
                  <div>
                    <p className="rounded-md border border-dashed border-primary px-2 py-0.5 text-xs font-bold text-primary">
                      {promo.code}
                    </p>
                    <p className="mt-1 text-xs font-bold text-amber-600">Save {formatCurrency(promo.save)}</p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleCopy(promo.code)}
                  aria-label={`Copy code ${promo.code}`}
                  className="flex shrink-0 items-center gap-1 rounded-lg border border-border px-2.5 py-1.5 text-xs font-bold text-foreground transition active:scale-95 active:bg-secondary"
                >
                  <Copy aria-hidden="true" className="size-3.5" />
                  Copy
                </button>
              </div>

              <p className="mt-2.5 text-xs leading-relaxed text-muted-foreground">{promo.description}</p>
              {promo.terms ? <p className="mt-1 text-[0.65rem] font-semibold text-primary">{promo.terms}</p> : null}
            </article>
          ))}
        </div>
      </section>

      <Toast message={message} />
    </PageTransition>
  );
}
