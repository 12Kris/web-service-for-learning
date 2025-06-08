import * as React from "react";
import { Label } from "./label";
import { cn } from "@/lib/utils";

export interface TextAreaProps extends React.ComponentProps<"textarea"> {
  label?: string;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextAreaProps>(
  ({ className, label, ...props }, ref) => {
    return (
      <div className="space-y-2 w-full">
        {label && <Label className="text-[--neutral]" htmlFor="name">{label}</Label>}

        <textarea
          className={cn(
            "flex min-h-[60px] w-full rounded-lg border-2 border-input bg-transparent px-3 py-2 text-base shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
            className
          )}
          ref={ref}
          {...props}
        />
      </div>
    );
  }
);
Textarea.displayName = "Textarea";

export { Textarea };