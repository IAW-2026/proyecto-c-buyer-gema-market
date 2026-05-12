import React from "react";

interface FieldProps {
  label?: string;
  hint?: string;
  error?: string;
  children: React.ReactNode;
  optional?: boolean;
}

export const Field = ({ label, hint, error, children, optional }: FieldProps) => (
  <label className="block">
    {label && (
      <div className="flex justify-between items-baseline mb-1.5">
        <span className="text-[13px] text-ink-2 font-medium">{label}</span>
        {optional && <span className="text-[11px] text-ink-3">opcional</span>}
      </div>
    )}
    {children}
    {hint && !error && <div className="text-xs text-ink-3 mt-1.5">{hint}</div>}
    {error && <div className="text-xs text-danger mt-1.5">{error}</div>}
  </label>
);
