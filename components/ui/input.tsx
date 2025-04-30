import * as React from "react";
import { Label } from "./label";

import { cn } from "@/lib/utils";

type InputColor = "primary" | "secondary" | "success" | "danger";


interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  icon?: React.ReactNode;
  color?: InputColor;
}

const colorClasses: Record<InputColor, string> = {
  primary: "border-input bg-transparent",
  secondary: "border-gray-500 focus-visible:ring-gray-500",
  success: "border-green-500 focus-visible:ring-green-500",
  danger: "border-red-500 focus-visible:ring-red-500",
};


const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, label, icon,color = "primary", ...props }, ref) => {
    return (
      <div className={`${label ? "space-y-2" : ""} relative`}>
        {label && <Label htmlFor="name">{label}</Label>}
        {icon && <div className="">{icon}</div>}

        <input
          type={type}
          className={cn(
            // "flex h-9 w-full outline-none rounded-lg border-2  px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
            "flex h-9 w-full outline-none rounded-lg border-2  px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
            colorClasses[color],
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
