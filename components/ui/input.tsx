import * as React from "react";
import { Label } from "./label";

import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  icon?: React.ReactNode;
}
const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, label, icon, ...props }, ref) => {
    return (
      <div className={`${label ? "space-y-2" : ""} relative`}>
        {label && <Label htmlFor="name">{label}</Label>}
        {icon && <div className="">{icon}</div>}

        <input
          type={type}
          className={cn(
            "flex h-9 w-full outline-none rounded-lg border-2 border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
            className,
            { "pl-9": icon }
          )}
          ref={ref}
          {...props}
        />
      </div>
    );
  }
);
Input.displayName = "Input";

export { Input };