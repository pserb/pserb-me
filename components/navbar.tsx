"use client";

import { NavigationMenu, NavigationMenuItem, NavigationMenuLink, NavigationMenuList } from "@radix-ui/react-navigation-menu";
import { motion } from "framer-motion";
import Link from "next/link";
import { navigationMenuTriggerStyle } from "./ui/navigation-menu";
import { ModeToggle } from "./utils/mode-toggle";
import { motionContainer, motionItem } from "./utils/framer-motion-utils";

export default function Navbar() {
	return (
		<div className="fixed top-0 left-0 z-50 flex justify-center mt-6 w-screen h-14">
			<NavigationMenu className="py-4 w-full">
				<motion.div
					className="mx-auto max-w-3xl w-[calc(100%-2rem)] flex items-center h-14 md:px-6 rounded-md backdrop-blur supports-[backdrop-filter]:bg-background/60 border"
					variants={motionContainer()}
					initial="hidden"
					animate="visible"
				>
					<NavigationMenuList className="md:pr-8">
						<motion.div variants={motionItem}>
							<NavigationMenuItem>
								<Link href="/" legacyBehavior passHref>
									<NavigationMenuLink className={navigationMenuTriggerStyle()}>Home</NavigationMenuLink>
								</Link>
							</NavigationMenuItem>
						</motion.div>
					</NavigationMenuList>
					<NavigationMenuList className="md:pr-8">
						<motion.div variants={motionItem}>
							<NavigationMenuItem>
								<Link href="/projects" legacyBehavior passHref>
									<NavigationMenuLink className={navigationMenuTriggerStyle()}>Projects</NavigationMenuLink>
								</Link>
							</NavigationMenuItem>
						</motion.div>
					</NavigationMenuList>
					<NavigationMenuList className="md:pr-8">
						<motion.div variants={motionItem}>
							<NavigationMenuItem>
								<Link href="/about" legacyBehavior passHref>
									<NavigationMenuLink className={navigationMenuTriggerStyle()}>About</NavigationMenuLink>
								</Link>
							</NavigationMenuItem>
						</motion.div>
					</NavigationMenuList>
					<NavigationMenuList>
						<motion.div variants={motionItem}>
							<NavigationMenuItem>
								<Link href="/resume" legacyBehavior passHref>
									<NavigationMenuLink className={navigationMenuTriggerStyle()}>Resume</NavigationMenuLink>
								</Link>
							</NavigationMenuItem>
						</motion.div>
					</NavigationMenuList>
					<motion.div className="flex flex-1 justify-end p-4 -ml-4 md:ml-0" variants={motionItem}>
						<ModeToggle />
					</motion.div>
				</motion.div>
			</NavigationMenu>
		</div>
	);
}
