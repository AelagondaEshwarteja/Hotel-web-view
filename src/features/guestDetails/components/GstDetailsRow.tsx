import { ChevronDown, Receipt } from "lucide-react";
import { useState } from "react";
import type { GstDetails } from "../types/guestDetailsTypes.ts";
import {Input} from "../../../shared/components/Input.tsx"
type GstDetailsRowProps = {
  gst?: GstDetails;
  errors?: { gstNumber?: string; companyName?: string };
  suggestedCompanyName?: string;
  onChange: (patch: Partial<GstDetails>) => void;
  onClear: () => void;
};

export function GstDetailsRow({ gst, errors, suggestedCompanyName, onChange, onClear }: GstDetailsRowProps) {
  const [isOpen, setIsOpen] = useState(Boolean(gst));

  function handleToggle() {
    if (isOpen) {
      onClear();
      setIsOpen(false);
      return;
    }
    onChange({
      gstNumber: gst?.gstNumber ?? "",
      companyName: gst?.companyName ?? suggestedCompanyName ?? "",
    });
    setIsOpen(true);
  }

  return (
    <section className="rounded-2xl border border-border bg-card p-3.5 shadow-sm">
      <button
        type="button"
        onClick={handleToggle}
        className="flex w-full items-center justify-between gap-3 rounded-xl border border-input bg-background px-3.5 py-3 text-left transition hover:bg-muted/50"
      >
        <span className="flex items-center gap-2 text-sm font-semibold text-foreground">
          <Receipt aria-hidden="true" className="size-4 text-muted-foreground" />
          Add GST details
          <span className="text-xs font-normal text-muted-foreground">optional</span>
        </span>

        <ChevronDown
          aria-hidden="true"
          className={`size-4 text-muted-foreground transition ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen ? (
        <div className="mt-3 flex flex-col gap-2.5 border-t border-dashed border-border pt-3">
          <div >
            <Input value={gst?.gstNumber ?? ""}
  onChange={(event) => onChange({ gstNumber: event.target.value.toUpperCase() })}
  placeholder="GSTIN"
  maxLength={15}
  invalid={Boolean(errors?.gstNumber)}
  className="uppercase placeholder:normal-case" />
            {errors?.gstNumber ? (
              <p className="mt-1 pl-0.5 text-xs text-destructive">{errors.gstNumber}</p>
            ) : null}
          </div>

          <div>
            <Input
  value={gst?.companyName ?? ""}
  onChange={(event) => onChange({ companyName: event.target.value })}
  placeholder="Company / legal name"
  invalid={Boolean(errors?.companyName)}
/>
            {errors?.companyName ? (
              <p className="mt-1 pl-0.5 text-xs text-destructive">{errors.companyName}</p>
            ) : null}
          </div>
        </div>
      ) : null}
    </section>
  );
}