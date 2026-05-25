"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";

interface MultiSelectContextType {
  values: string[];
  setValues: (values: string[]) => void;
}

const MultiSelectContext = React.createContext<
  MultiSelectContextType | undefined
>(undefined);

export function MultiSelect({
  values,
  onValuesChange,
  children,
}: {
  values: string[];
  onValuesChange: (values: string[]) => void;
  children: React.ReactNode;
}) {
  return (
    <MultiSelectContext.Provider
      value={{
        values,
        setValues: onValuesChange,
      }}
    >
      <div className="space-y-2">{children}</div>
    </MultiSelectContext.Provider>
  );
}

interface MultiSelectTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

export function MultiSelectTrigger({
  children,
  className,
  ...props
}: MultiSelectTriggerProps) {
  return (
    <button
      type="button"
      className={cn(
        "flex w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm transition-colors",
        "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
        "disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...props}
    >
      {children}
      <ChevronsUpDown className="h-4 w-4 opacity-50" />
    </button>
  );
}

export function MultiSelectValue({ placeholder }: { placeholder?: string }) {
  const context = React.useContext(MultiSelectContext);

  if (!context) return null;

  return (
    <span className="truncate">
      {context.values.length > 0 ? context.values.join(", ") : placeholder}
    </span>
  );
}

export function MultiSelectContent({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-md border bg-popover p-1 shadow-md">{children}</div>
  );
}

export function MultiSelectGroup({ children }: { children: React.ReactNode }) {
  return <div className="space-y-1">{children}</div>;
}

interface MultiSelectItemProps {
  value: string;
  children: React.ReactNode;
}

export function MultiSelectItem({ value, children }: MultiSelectItemProps) {
  const context = React.useContext(MultiSelectContext);

  if (!context) return null;

  const selected = context.values.includes(value);

  const toggle = () => {
    if (selected) {
      context.setValues(context.values.filter((v) => v !== value));
    } else {
      context.setValues([...context.values, value]);
    }
  };

  return (
    <button
      type="button"
      onClick={toggle}
      className={cn(
        "flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm hover:bg-muted transition-colors",
      )}
    >
      <Check
        className={cn("h-4 w-4", selected ? "opacity-100" : "opacity-0")}
      />

      <span>{children}</span>
    </button>
  );
}
