import React, { memo } from "react";
import { clsx } from "clsx";
import { CheckIcon, XIcon } from "lucide-react";

type CheckedInputProps = {
  value: boolean;
  label: string;
  onChange: (value: boolean) => void;
};

export const CheckedInput = memo(function CheckedInput({
  value,
  label,
  onChange,
}: CheckedInputProps) {
  return (
    <label
      htmlFor={label}
      className={clsx(
        "flex items-center gap-1 px-2 h-6 pt-[1px]",
        "cursor-pointer select-none",
        "border border-neutral-300 rounded text-xs",
        "hover:bg-neutral-200",
        {
          "bg-neutral-100": value,
        },
      )}
    >
      {value ? (
        <CheckIcon className="mt-[1px]" size={14} />
      ) : (
        <XIcon className="mt-[1px]" size={14} />
      )}
      <input
        id={label}
        name={label}
        type="checkbox"
        className="hidden"
        checked={value}
        onChange={(e) => onChange(e.target.checked)}
      />
      <span>{label}</span>
    </label>
  );
});
