import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap border border-primary text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 relative",
  {
    variants: {
      variant: {
        default:
          "bg-background text-primary-background hover:bg-foreground hover:text-primary-foreground",
        destructive:
          "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
        outline:
          "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        icon: "h-9 w-9",
      },
      shadow: {
        none: "",
        solid: "before:absolute before:content-[''] before:top-[6px] before:left-[6px] before:w-full before:h-full before:bg-foreground/15 before:-z-10 dark:before:bg-foreground/75",
        stippled: "before:absolute before:content-[''] before:top-[6px] before:left-[6px] before:w-full before:h-full before:-z-10 before:bg-[radial-gradient(black_0.25px,transparent_0.8px)] dark:before:bg-[radial-gradient(white_0.25px,transparent_0.8px)] before:bg-[length:2px_2px]",
        striped: "before:absolute before:content-[''] before:top-[6px] before:left-[6px] before:w-full before:h-full before:-z-10 before:bg-[linear-gradient(45deg,black_25%,transparent_25%,transparent_50%,black_50%,black_75%,transparent_75%,transparent_100%)] before:bg-[length:3px_3px]",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      shadow: "solid",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const WinButton = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, shadow, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, shadow, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
WinButton.displayName = "WinButton"

export { WinButton, buttonVariants }

export const navWinButtonStyle = cva([
  // base bttn
  "inline-flex items-center justify-center gap-2 whitespace-nowrap border border-primary text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 relative",

  // variant default
  "bg-background text-primary-background hover:bg-foreground hover:text-primary-foreground",

  // size default
  "h-9 px-4 py-2",

  // shadow solid
  // "before:absolute before:content-[''] before:top-[6px] before:left-[6px] before:w-full before:h-full before:bg-foreground/15 before:-z-10 dark:before:bg-foreground/75",

  // shadow stippled
  "before:absolute before:content-[''] before:top-[4px] before:left-[4px] before:w-full before:h-full before:-z-10 before:bg-[radial-gradient(black_0.25px,transparent_0.8px)] dark:before:bg-[radial-gradient(white_0.25px,transparent_0.8px)] before:bg-[length:2px_2px]"
]);