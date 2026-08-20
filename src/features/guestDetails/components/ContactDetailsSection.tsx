import { Mail, Phone, UserRound } from "lucide-react";
import type { ContactDetails } from "../types/guestDetailsTypes";
import { Input } from "../../../shared/components/Input.tsx";
type ContactDetailsSectionProps = {
  contact: ContactDetails;
  errors?: { email?: string; phone?: string };
  onChange: (patch: Partial<ContactDetails>) => void;
};

export function ContactDetailsSection({
  contact,
  errors,
  onChange,
}: ContactDetailsSectionProps) {
  return (
    <section className="rounded-2xl border border-border bg-card p-3.5 shadow-sm">
      <div className="mb-3 flex items-center gap-1.5 border-b border-border pb-2.5">
        <UserRound
          aria-hidden="true"
          className="size-4 text-muted-foreground"
        />
        <p className="text-sm font-semibold text-foreground">Contact details</p>
      </div>

      <div className="flex flex-col gap-2.5">
        <div>
          <div>
            <Input
              icon={
                <Mail
                  aria-hidden="true"
                  className="size-4 shrink-0 text-muted-foreground"
                />
              }
              value={contact.email}
              onChange={(event) => onChange({ email: event.target.value })}
              placeholder="Email address"
              type="email"
              inputMode="email"
              invalid={Boolean(errors?.email)}
            />
          </div>
          {errors?.email ? (
            <p className="mt-1 pl-0.5 text-xs text-destructive">
              {errors.email}
            </p>
          ) : null}
        </div>

        <div>
          <div>
            <Input
              icon={
                <Phone
                  aria-hidden="true"
                  className="size-4 shrink-0 text-muted-foreground"
                />
              }
              prefixContent={
                <>
                  <span className="text-sm font-medium text-foreground">
                    {contact.countryCode}
                  </span>
                  <span
                    aria-hidden="true"
                    className="h-4 w-px shrink-0 bg-border"
                  />
                </>
              }
              value={contact.phone}
              onChange={(event) =>
                onChange({
                  phone: event.target.value.replace(/\D/g, "").slice(0, 10),
                })
              }
              placeholder="Phone number"
              type="tel"
              inputMode="numeric"
              invalid={Boolean(errors?.phone)}
            />
          </div>
          {errors?.phone ? (
            <p className="mt-1 pl-0.5 text-xs text-destructive">
              {errors.phone}
            </p>
          ) : null}
        </div>
      </div>
    </section>
  );
}
