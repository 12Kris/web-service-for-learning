import * as React from "react"

import { cn } from "@/lib/utils"


interface Option {
  id: string | number;
  name: string;
}

interface SelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  options: Option[];
  multiple?: boolean;
  onChange?: (event: React.ChangeEvent<HTMLSelectElement>, value: string | string[]) => void;
}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, options, multiple = false, onChange, ...props }, ref) => {

    const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
      if (onChange) {
        const selectedValues = multiple
          ? Array.from(event.target.selectedOptions).map((option: any) => option.value)
          : event.target.value;
        onChange(event, selectedValues);
      }
    };

    return (
      <select
        className={cn(
          "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        multiple={multiple}
        onChange={handleChange}
        {...props}
      >
        {options.map((option, index) => (
          <option key={index} value={option.id}>
            {option.name}
          </option>
        ))}
      </select>
    )
  }
)

Select.displayName = "Select"

export { Select }
