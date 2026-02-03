"use client";

import * as React from "react";
import { cn } from "../lib/utils";

const Select = ({ children, onValueChange, defaultValue, value: controlledValue, name, required, ...props }: {
  children: React.ReactNode;
  onValueChange?: (value: string) => void;
  defaultValue?: string;
  value?: string;
  name?: string;
  required?: boolean;
}) => {
  const [internalValue, setInternalValue] = React.useState(defaultValue || "");
  const [open, setOpen] = React.useState(false);
  const [selectedLabel, setSelectedLabel] = React.useState<string>("");
  
  const value = controlledValue !== undefined ? controlledValue : internalValue;

  const handleChange = (newValue: string, newLabel?: string) => {
    if (controlledValue === undefined) {
      setInternalValue(newValue);
    }
    if (newLabel) setSelectedLabel(newLabel);
    onValueChange?.(newValue);
  };

  return (
    <SelectContext.Provider value={{ value, onValueChange: handleChange, open, setOpen, selectedLabel, setSelectedLabel }}>
      <div className="relative">
        {children}
      </div>
    </SelectContext.Provider>
  );
};

const SelectContext = React.createContext<{
  value: string;
  onValueChange: (value: string, label?: string) => void;
  open: boolean;
  setOpen: (open: boolean) => void;
  selectedLabel: string;
  setSelectedLabel: (label: string) => void;
}>({ value: "", onValueChange: () => {}, open: false, setOpen: () => {}, selectedLabel: "", setSelectedLabel: () => {} });

const SelectTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, children, ...props }, ref) => {
  const { open, setOpen } = React.useContext(SelectContext);

  return (
    <button
      ref={ref}
      type="button"
      className={cn(
        "flex h-10 w-full items-center justify-between rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      onClick={() => setOpen(!open)}
      {...props}
    >
      {children}
    </button>
  );
});
SelectTrigger.displayName = "SelectTrigger";

const SelectValue = ({ placeholder, children }: { placeholder?: string; children?: React.ReactNode }) => {
  const { value, selectedLabel } = React.useContext(SelectContext);
  return <span className={!value && placeholder ? "text-gray-500" : ""}>{children || selectedLabel || value || placeholder}</span>;
};

const SelectContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => {
  const { open, setOpen } = React.useContext(SelectContext);

  if (!open) return null;

  return (
    <>
      <div
        className="fixed inset-0 z-40"
        onClick={() => setOpen(false)}
      />
      <div
        ref={ref}
        className={cn(
          "absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md border border-gray-200 bg-white py-1 text-base shadow-lg focus:outline-none sm:text-sm",
          className
        )}
        {...props}
      >
        {children}
      </div>
    </>
  );
});
SelectContent.displayName = "SelectContent";

const SelectItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { value: string }
>(({ className, children, value, ...props }, ref) => {
  const { value: selectedValue, onValueChange, setOpen, setSelectedLabel, selectedLabel } = React.useContext(SelectContext);

  // Update label if this is the selected item and label is not set correctly
  React.useEffect(() => {
    if (selectedValue === value && children) {
        // Simple heuristic: if children is string, use it. strict checking is hard in react
        const labelText = typeof children === 'string' ? children : 
                         Array.isArray(children) ? children.filter(c => typeof c === 'string').join('') : '';
        if (labelText && selectedLabel !== labelText) {
             setSelectedLabel(labelText);
        }
    }
  }, [selectedValue, value, children, setSelectedLabel, selectedLabel]);

  return (
    <div
      ref={ref}
      className={cn(
        "relative cursor-pointer select-none py-2 pl-3 pr-9 hover:bg-gray-100",
        selectedValue === value && "bg-gray-100 font-semibold",
        className
      )}
      onClick={() => {
        // Try to get text content
        const labelText = typeof children === 'string' ? children : undefined;
        onValueChange(value, labelText);
        setOpen(false);
      }}
      {...props}
    >
      {children}
    </div>
  );
});
SelectItem.displayName = "SelectItem";

const SelectGroup = ({ children, ...props }: React.HTMLAttributes<HTMLDivElement>) => {
  return <div {...props}>{children}</div>;
};

const SelectLabel = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn("py-1.5 pl-8 pr-2 text-sm font-semibold", className)}
      {...props}
    />
  );
});
SelectLabel.displayName = "SelectLabel";

const SelectSeparator = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn("-mx-1 my-1 h-px bg-gray-200", className)}
      {...props}
    />
  );
});
SelectSeparator.displayName = "SelectSeparator";

export {
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectLabel,
  SelectItem,
  SelectSeparator,
};
