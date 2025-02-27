import React from "react";
import { clsx } from "clsx";

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  error?: boolean;
};

const inputClasses = clsx(
  "w-full h-8 px-3 text-xs text-neutral-900 bg-neutral-100 border border-neutral-200 rounded",
  "focus:outline-none focus:border-neutral-300 focus:ring-2 focus:ring-neutral-100",
);

export function Input({ className, error, ...props }: InputProps) {
  return (
    <input
      {...props}
      className={clsx(
        inputClasses,
        {
          "border-red-700 focus:border-red-800 focus:ring-red-200": error,
        },
        className,
      )}
    />
  );
}
