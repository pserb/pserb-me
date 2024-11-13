"use client"

import { NavigationMenu, NavigationMenuItem, NavigationMenuLink, NavigationMenuList } from "@radix-ui/react-navigation-menu"
import { motion } from "framer-motion"
import Link from "next/link"
import { navigationMenuTriggerStyle } from "./ui/navigation-menu"
import { ModeToggle } from "./mode-toggle"

export default function Navbar() {
    const container = {
        hidden: { opacity: 0, y: -20 },
        visible: {
            opacity: 1,
            transition: {
                delayChildren: 0.18,
                staggerChildren: 0.12,
            }
        }
    }

    const item = {
        hidden: { opacity: 0 },
        visible: { opacity: 1 }
    }

    return (
        <div className="fixed top-0 left-0 z-50 flex justify-center pt-6 w-screen">
            <NavigationMenu className="py-4 w-full">
                <motion.div
                    className="mx-auto max-w-3xl w-[calc(100%-2rem)] flex items-center h-14 md:px-6 rounded-md backdrop-blur supports-[backdrop-filter]:bg-background/60 border"
                    variants={container}
                    initial="hidden"
                    animate="visible"
                >
                    <NavigationMenuList className="md:pr-8">
                        <motion.div variants={item}>
                            <NavigationMenuItem>
                                <Link href="/" legacyBehavior passHref>
                                    <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                                        Home
                                    </NavigationMenuLink>
                                </Link>
                            </NavigationMenuItem>
                        </motion.div>
                    </NavigationMenuList>
                    <NavigationMenuList className="md:pr-8">
                        <motion.div variants={item}>
                            <NavigationMenuItem>
                                <Link href="/projects" legacyBehavior passHref>
                                    <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                                        Projects
                                    </NavigationMenuLink>
                                </Link>
                            </NavigationMenuItem>
                        </motion.div>
                    </NavigationMenuList>
                    <NavigationMenuList className="md:pr-8">
                        <motion.div variants={item}>
                            <NavigationMenuItem>
                                <Link href="/about" legacyBehavior passHref>
                                    <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                                        About
                                    </NavigationMenuLink>
                                </Link>
                            </NavigationMenuItem>
                        </motion.div>
                    </NavigationMenuList>
                    <NavigationMenuList>
                        <motion.div variants={item}>
                            <NavigationMenuItem>
                                <Link href="/resume" legacyBehavior passHref>
                                    <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                                        Resume
                                    </NavigationMenuLink>
                                </Link>
                            </NavigationMenuItem>
                        </motion.div>
                    </NavigationMenuList>
                    <motion.div
                        className="flex flex-1 justify-end p-4 -ml-4 md:ml-0"
                        variants={item}
                    >
                        <ModeToggle />
                    </motion.div>
                </motion.div>
            </NavigationMenu>
        </div>
    )
}