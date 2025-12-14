import type React from "react";
import { type ReactNode } from "react";
import { cn } from "@/lib/utils";

interface CardProps {
	children: ReactNode;
	className?: string;
	border?: boolean;
	rounded?: boolean;
	elevation?: "flat" | "raised" | "floating";
}

// Elevated card surface with hairline border and subtle shadow
const Card: React.FC<CardProps> = ({
	children,
	className = "",
	border = true,
	rounded = true,
	elevation = "raised",
}) => {
	const shadowClass = {
		flat: "",
		raised: "shadow-md",
		floating: "shadow-lg",
	}[elevation];

	return (
		<div className={cn("relative", className)}>
			<div
				className={cn(
					"relative bg-card text-card-foreground",
					rounded && "rounded",
					border && "ring-[0.5px] ring-inset ring-border",
					shadowClass,
					"px-6 pt-8 pb-6"
				)}
			>
				{children}
			</div>
		</div>
	);
};

export default Card;
