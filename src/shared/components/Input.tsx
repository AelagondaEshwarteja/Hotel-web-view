import { forwardRef, type InputHTMLAttributes, type ReactNode } from "react";
import { cn } from "../utils/cn";

export type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  /** Marks the field as invalid (red border/ring) — pass instead of styling aria-invalid manually. */
  invalid?: boolean;
  /** Optional leading icon. Switches the input into the "bordered wrapper" layout used for icon-prefixed fields. */
  icon?: ReactNode;
  /**
   * Optional leading content before the input itself, e.g. a country code ("+91"). Implies the wrapper layout too.
   * Named `prefixContent` (not `prefix`) because `prefix` is already a reserved RDFa HTML attribute on inputs.
   */
  prefixContent?: ReactNode;
};

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { invalid = false, icon, prefixContent, className, ...props },
  ref,
) {
  if (icon || prefixContent) {
    return (
      <div
        className={cn(
          "flex items-center gap-2.5 rounded-xl border bg-background px-3.5 py-3 transition focus-within:ring-2",
          invalid
            ? "border-destructive ring-1 ring-destructive/30"
            : "border-input focus-within:border-primary focus-within:ring-primary/20",
        )}
      >
        {icon}
        {prefixContent}
        <input
          ref={ref}
          aria-invalid={invalid}
          className={cn(
            "w-full min-w-0 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground",
            className,
          )}
          {...props}
        />
      </div>
    );
  }

  return (
    <input
      ref={ref}
      aria-invalid={invalid}
      className={cn(
        "w-full rounded-xl border bg-background px-3.5 py-3 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus:ring-2",
        invalid ? "border-destructive ring-1 ring-destructive/30" : "border-input focus:border-primary focus:ring-primary/20",
        className,
      )}
      {...props}
    />
  );
});