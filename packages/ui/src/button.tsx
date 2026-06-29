import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "./lib/cn";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg font-display font-semibold transition-[transform,filter] duration-100 active:scale-[0.97] disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background select-none cursor-pointer",
  {
    variants: {
      variant: {
        primary:
          "bg-primary text-primary-foreground shadow-[0_6px_0_0_rgba(0,0,0,0.16)] hover:-translate-y-0.5 hover:brightness-105 active:translate-y-0 active:shadow-[0_2px_0_0_rgba(0,0,0,0.16)]",
        secondary:
          "bg-secondary text-secondary-foreground shadow-[0_6px_0_0_rgba(0,0,0,0.16)] hover:-translate-y-0.5 hover:brightness-105 active:translate-y-0 active:shadow-[0_2px_0_0_rgba(0,0,0,0.16)]",
        accent:
          "bg-accent text-accent-foreground shadow-[0_6px_0_0_rgba(0,0,0,0.12)] hover:-translate-y-0.5 hover:brightness-105 active:translate-y-0",
        outline: "border-2 border-border bg-card text-foreground hover:bg-muted",
        ghost: "text-foreground hover:bg-muted",
      },
      size: {
        sm: "h-9 px-4 text-sm",
        md: "h-11 px-5 text-base",
        lg: "h-14 px-8 text-lg",
        icon: "h-11 w-11",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, type, ...props }, ref) => (
    <button
      ref={ref}
      type={type ?? "button"}
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  ),
);
Button.displayName = "Button";

export { buttonVariants };
