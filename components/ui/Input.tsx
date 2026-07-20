"use client";

import { InputHTMLAttributes, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
};

export function Input({ label, className, type, ...props }: Props) {
  const [show, setShow] = useState(false);
  const isPassword = type === "password";

  const input = (
    <input
      type={isPassword ? (show ? "text" : "password") : type}
      className={cn(
        "focus-ring h-11 rounded-md border border-ink/12 bg-white px-3 text-sm text-ink placeholder:text-ink/40",
        isPassword ? "w-full pr-10" : className
      )}
      {...props}
    />
  );

  return (
    <label className={cn("grid gap-2 text-sm font-medium text-ink", isPassword && className)}>
      {label && <span>{label}</span>}
      {isPassword ? (
        <span className="relative flex">
          {input}
          <button
            type="button"
            tabIndex={-1}
            onClick={() => setShow((current) => !current)}
            aria-label={show ? "Ocultar senha" : "Mostrar senha"}
            className="focus-ring absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1 text-ink/50 hover:text-ink"
          >
            {show ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </span>
      ) : (
        input
      )}
    </label>
  );
}
