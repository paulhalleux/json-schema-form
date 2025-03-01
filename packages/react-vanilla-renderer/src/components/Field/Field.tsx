import React from "react";
import { clsx } from "clsx";

type FieldProps = React.InputHTMLAttributes<HTMLDivElement> & {
  label?: string;
  help?: string;
  error?: string;
  id?: string;
  required?: boolean;
};

export function Field({
  className,
  label,
  help,
  error,
  children,
  id,
  required,
  ...props
}: FieldProps) {
  return (
    <div
      className={clsx("flex flex-col space-y-1 w-full", className)}
      {...props}
    >
      {label && (
        <label htmlFor={id} className={"text-sm font-medium text-neutral-700"}>
          {label} {required && <span className="text-red-700">*</span>}
        </label>
      )}
      {children}
      {help && !error && (
        <small className="text-neutral-500 text-xs">{help}</small>
      )}
      {error && <small className="text-red-700 text-xs">{error}</small>}
    </div>
  );
}
