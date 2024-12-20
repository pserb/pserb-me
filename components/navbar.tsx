"use client";

import { NavigationMenu, NavigationMenuItem, NavigationMenuLink, NavigationMenuList } from "@radix-ui/react-navigation-menu";
import { motion } from "framer-motion";
import Link from "next/link";
import { ModeToggle } from "./utils/mode-toggle";
import { motionContainer, motionItem } from "./utils/framer-motion-utils";
import FlutedGlass from "./ui/fluted-glass";
import { navigationMenuTriggerStyle } from "./ui/navigation-menu";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ChevronDown } from "lucide-react";
import { navWinButtonStyle } from "./ui/win-button";


export default function Navbar() {
	return (
		<div className="fixed top-0 left-0 z-50 flex justify-center mt-6 w-screen h-14">
			<NavigationMenu className="py-4 w-full">
				<motion.div
					className="mx-auto max-w-3xl w-[calc(100%-2rem)] flex items-center h-16 md:px-6 overflow-hidden"
					variants={motionContainer()}
					initial="hidden"
					animate="visible"
				>
					<FlutedGlass type="fluted" angle={90} className="absolute inset-0" rounded={false} border={true}>
						<div className="relative z-30 flex md:hidden items-center h-full">
							<motion.div variants={motionItem}>
								<DropdownMenu>
									<DropdownMenuTrigger className={`${navWinButtonStyle()}`} asChild>
										<NavigationMenuLink className={`ml-4 text-[20px]`}><ChevronDown /></NavigationMenuLink>
									</DropdownMenuTrigger>
									<DropdownMenuContent align="end" className="ml-4">
										<Link href="/" passHref>
											<DropdownMenuItem>
												Home
											</DropdownMenuItem>
										</Link>
										<Link href="/projects" passHref>
											<DropdownMenuItem>
												Projects
											</DropdownMenuItem>
										</Link>
										<Link href="/about" passHref>
											<DropdownMenuItem>
												About
											</DropdownMenuItem>
										</Link>
										<Link href="/resume" passHref>
											<DropdownMenuItem>
												Resume
											</DropdownMenuItem>
										</Link>
									</DropdownMenuContent>
								</DropdownMenu>
							</motion.div>
							<motion.div className="flex flex-1 justify-end p-4 -ml-4 md:ml-0" variants={motionItem}>
								<ModeToggle />
							</motion.div>
						</div>
						<div className="relative z-30 hidden md:flex items-center h-full">
							<NavigationMenuList className="md:pr-8 md:pl-4">
								<motion.div variants={motionItem}>
									<NavigationMenuItem>
										<Link href="/" legacyBehavior passHref>
											<NavigationMenuLink className={`${navWinButtonStyle()}`}>Home</NavigationMenuLink>
										</Link>
									</NavigationMenuItem>
								</motion.div>
							</NavigationMenuList>
							<NavigationMenuList className="md:pr-8">
								<motion.div variants={motionItem}>
									<NavigationMenuItem>
										<Link href="/projects" legacyBehavior passHref>
											<NavigationMenuLink className={`${navWinButtonStyle()}`}>Projects</NavigationMenuLink>
										</Link>
									</NavigationMenuItem>
								</motion.div>
							</NavigationMenuList>
							<NavigationMenuList className="md:pr-8">
								<motion.div variants={motionItem}>
									<NavigationMenuItem>
										<Link href="/about" legacyBehavior passHref>
											<NavigationMenuLink className={`${navWinButtonStyle()}`}>About</NavigationMenuLink>
										</Link>
									</NavigationMenuItem>
								</motion.div>
							</NavigationMenuList>
							<NavigationMenuList className="md:pr-8">
								<motion.div variants={motionItem}>
									<NavigationMenuItem>
										<Link href="/resume" legacyBehavior passHref>
											<NavigationMenuLink className={`${navWinButtonStyle()}`}>Resume</NavigationMenuLink>
										</Link>
									</NavigationMenuItem>
								</motion.div>
							</NavigationMenuList>
							<NavigationMenuList>
								<motion.div variants={motionItem}>
									<NavigationMenuItem>
										<Link href="/test" legacyBehavior passHref>
											<NavigationMenuLink className={`${navWinButtonStyle()}`}>Test</NavigationMenuLink>
										</Link>
									</NavigationMenuItem>
								</motion.div>
							</NavigationMenuList>
							<motion.div className="flex flex-1 justify-end p-4 -ml-4 md:ml-0" variants={motionItem}>
								<ModeToggle />
							</motion.div>
						</div>
					</FlutedGlass>
				</motion.div>
			</NavigationMenu>
		</div>
	);
}

