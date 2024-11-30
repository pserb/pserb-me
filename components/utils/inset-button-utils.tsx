import { cva } from "class-variance-authority";

export const insetButtonStyle = cva(
    "shadow-[inset_0_1px_3px_rgba(0,0,0,0.1),_inset_0_1px_2px_rgba(0,0,0,0.06)] dark:shadow-[inset_0_2px_4px_rgba(0,0,0,0.1),_inset_0_-2px_6px_rgba(0,0,0,0.8)] bg-background/40 text-foreground border-border/50 backdrop-blur-sm border",
)