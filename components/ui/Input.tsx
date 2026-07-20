import { InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type Props = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
};

export function Input({ label, className, ...props }: Props) {
  return (
    <label className="grid gap-2 text-sm font-medium text-ink">
      {label && <span>{label}</span>}
      <input
        className={cn(
          "focus-ring h-11 rounded-md border border-ink/12 bg-white px-3 text-sm text-ink placeholder:text-ink/40",
          className
        )}
        {...props}
      />
    </label>
  );
}
