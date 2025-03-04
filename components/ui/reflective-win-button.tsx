'use client';

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/win-button";
import ReflectiveSurface from "./reflective-surface";

export interface ReflectiveButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
  VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  reflectionIntensity?: number;
  reflectionColor?: string;
}

const ReflectiveWinButton = React.forwardRef<HTMLButtonElement, ReflectiveButtonProps>(
  ({ 
    className, 
    variant, 
    size, 
    shadow, 
    asChild = false, 
    reflectionIntensity = 40,
    reflectionColor,
    ...props 
  }, ref) => {
    const Comp = asChild ? Slot : "button";
    
    // Determine reflection color based on variant
    const getReflectionColor = () => {
      if (reflectionColor) return reflectionColor;
      
      // Default colors for different variants
      switch (variant) {
        case 'default':
          return 'rgba(255, 255, 255, 0.12)';
        case 'destructive':
          return 'rgba(255, 200, 200, 0.1)';
        case 'secondary':
          return 'rgba(220, 220, 255, 0.1)';
        default:
          return 'rgba(255, 255, 255, 0.1)';
      }
    };
    
    return (
      <ReflectiveSurface 
        intensity={reflectionIntensity}
        reflectionColor={getReflectionColor()}
        className="inline-flex"
      >
        <Comp
          className={cn(buttonVariants({ variant, size, shadow, className }))}
          ref={ref}
          {...props}
        />
      </ReflectiveSurface>
    );
  }
);

ReflectiveWinButton.displayName = "ReflectiveWinButton";

export { ReflectiveWinButton };