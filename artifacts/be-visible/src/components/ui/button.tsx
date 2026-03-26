import * as React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "outline" | "default";
  size?: "sm" | "md" | "lg" | "icon" | "default";
}

export function buttonVariants({
  variant = "primary",
  size = "md",
  className,
}: {
  variant?: ButtonProps["variant"];
  size?: ButtonProps["size"];
  className?: string;
} = {}) {
  const base = "inline-flex items-center justify-center font-bold transition-all focus:outline-none disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98]";

  const variants: Record<NonNullable<ButtonProps["variant"]>, string> = {
    primary: "bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm",
    secondary: "bg-surface-container-high text-foreground hover:bg-surface-container-high/80",
    ghost: "bg-transparent text-muted-foreground hover:text-foreground hover:bg-surface-container-low",
    outline: "bg-transparent border border-border text-foreground hover:bg-surface-container-low",
    default: "bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm",
  };

  const sizes: Record<NonNullable<ButtonProps["size"]>, string> = {
    sm: "h-8 px-3 text-xs rounded-md",
    md: "h-10 px-4 py-2 text-sm rounded-md",
    lg: "h-12 px-8 text-base rounded-xl",
    icon: "h-9 w-9 rounded-md",
    default: "h-10 px-4 py-2 text-sm rounded-md",
  };

  return cn(base, variants[variant ?? "primary"], sizes[size ?? "md"], className);
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={buttonVariants({ variant, size, className })}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button };
