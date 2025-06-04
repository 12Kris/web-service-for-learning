import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "rounded-full inline-flex font-bold items-center justify-center gap-2 whitespace-nowrap text-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[--neutral] disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:w-4 [&_svg]:h-4",
  {
    variants: {
      variant: {
        default:
          "text-[--neutral] bg-transparent border-2 border-[--neutral] hover:text-white hover:bg-[--neutral]",
        destructive:
          "text-[--accent] bg-transparent border-2 border-[--accent] hover:text-white hover:bg-[--accent]",
        destructiveSolid: "text-white bg-[--accent] hover:bg-[--accent]/80",
        secondary:
          "text-[--neutral] bg-[--primary] border-2 border-[--primary] hover:bg-[--primary-light]",
        solid:
          "text-white bg-[--neutral-dark] border-2 border-[--neutral-dark]",
        outline:
          "text-[--neutral] bg-transparent border-2 border-[--neutral] hover:bg-[--neutral] hover:text-white",
        ghost: "text-[--neutral] bg-transparent",
        link: "text-[--neutral] bg-transparent underline-offset-4 hover:underline",
        primary:
          "bg-[--primary] text-[--neutral] border-2 border-[--primary] hover:border-[--neutral] hover:bg-[--neutral] hover:text-white",
          // "bg-[--primary] text-[--neutral] border-2 border-[--primary] hover:bg-[--primary-hover]",
        primaryOutline:
          "text-[--primary] bg-transparent border-2 border-[--primary] hover:bg-[--primary] hover:text-[--primary-foreground]",
        accent:
          "bg-[--accent] text-white border-2 border-[--accent] hover:bg-[--accent-hover]",
        accentOutline:
          "text-[--accent] bg-transparent border-2 border-[--accent] hover:bg-[--accent] hover:text-white",
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
