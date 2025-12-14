"use client";

import { NavigationMenu, NavigationMenuItem, NavigationMenuLink, NavigationMenuList } from "@radix-ui/react-navigation-menu";
import { motion } from "framer-motion";
import Link from "next/link";
import { ModeToggle } from "./utils/mode-toggle";
import { motionContainer, motionItem } from "./utils/framer-motion-utils";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Menu } from "lucide-react";
import { cn } from "@/lib/utils";

const navLinkStyles = cn(
	"inline-flex items-center justify-center h-9 px-4 py-2",
	"text-sm font-medium font-mono",
	"border border-border bg-card",
	"transition-all duration-150 hover:duration-0",
	"hover:bg-foreground hover:text-background hover:border-foreground",
	"focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
);

export default function Navbar() {
	return (
		<header className="fixed top-0 mt-2 left-0 z-50 w-full pt-4 px-2 sm:px-6 md:px-10 lg:px-16">
			{/* Container matches the main content wrapper exactly */}
			<div className="mx-auto w-full max-w-4xl">
				<NavigationMenu className="w-full">
					<motion.div
						className="flex items-center justify-between h-14 px-4 bg-card border border-border shadow-md rounded sm:rounded"
						variants={motionContainer()}
						initial="hidden"
						animate="visible"
					>
						{/* Mobile menu */}
						<div className="flex md:hidden items-center">
							<motion.div variants={motionItem}>
								<DropdownMenu>
									<DropdownMenuTrigger className={navLinkStyles}>
										<Menu className="size-4" />
									</DropdownMenuTrigger>
									<DropdownMenuContent align="start" className="ml-2">
										<Link href="/" passHref>
											<DropdownMenuItem className="font-mono">Home</DropdownMenuItem>
										</Link>
										<Link href="/projects" passHref>
											<DropdownMenuItem className="font-mono">Projects</DropdownMenuItem>
										</Link>
										<Link href="/about" passHref>
											<DropdownMenuItem className="font-mono">About</DropdownMenuItem>
										</Link>
									</DropdownMenuContent>
								</DropdownMenu>
							</motion.div>
						</div>

						{/* Desktop nav */}
						<NavigationMenuList className="hidden md:flex items-center gap-2">
							<motion.div variants={motionItem}>
								<NavigationMenuItem>
									<Link href="/" legacyBehavior passHref>
										<NavigationMenuLink className={navLinkStyles}>Home</NavigationMenuLink>
									</Link>
								</NavigationMenuItem>
							</motion.div>
							<motion.div variants={motionItem}>
								<NavigationMenuItem>
									<Link href="/projects" legacyBehavior passHref>
										<NavigationMenuLink className={navLinkStyles}>Projects</NavigationMenuLink>
									</Link>
								</NavigationMenuItem>
							</motion.div>
							<motion.div variants={motionItem}>
								<NavigationMenuItem>
									<Link href="/about" legacyBehavior passHref>
										<NavigationMenuLink className={navLinkStyles}>About</NavigationMenuLink>
									</Link>
								</NavigationMenuItem>
							</motion.div>
						</NavigationMenuList>

						{/* Theme toggle */}
						<motion.div variants={motionItem}>
							<ModeToggle />
						</motion.div>
					</motion.div>
				</NavigationMenu>
			</div>
		</header>
	);
}
