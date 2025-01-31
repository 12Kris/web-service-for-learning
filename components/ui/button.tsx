import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "rounded-full inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-1",
  {
    variants: {
      variant: {
        default:
          "text-[--neutral] bg-transparent hover:text-white border-2 border-[--neutral] border-solid rounded-full hover:bg-[--neutral]",
        destructive:
          "text-[--accent] hover:text-white hover:bg-[--accent] border-2 border-[--accent] border-solid rounded-full",
        destructiveSolid: "text-white bg-[--accent] hover:bg-[--accent]/80",
        secondary:
          "text-[--neutral] bg-[--primary] hover:bg-[--primary] shadow-none rounded-full",
        solid:
          "text-white bg-black rounded-full border-2 border-black border-solid ",
        outline:
          "text-black rounded-full border-2 border-black border-solid hover:bg-black hover:text-white",
        ghost: "text-[--neutral]",
        link: "text-[--neutral] underline-offset-4 hover:underline",
        primary: "bg-[--primary] text-[--neutral] hover:bg-[--primary]/90",
        primaryOutline:
          "text-[--primary] border-2 border-[--primary] hover:bg-[--primary] hover:text-[--primary-foreground]",
        accent: "bg-[--accent] text-white hover:bg-[--accent]/90",
        accentOutline:
          "text-[--accent] border-2 border-[--accent] hover:bg-[--accent] hover:text-white",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 px-3 text-xs",
        wide: "h-9 px-6",
        lg: "h-10 px-8",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
