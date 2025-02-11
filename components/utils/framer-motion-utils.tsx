import { Variants } from "framer-motion";

export const motionContainer = (delayChildren: number = 0, staggerChildren: number = 0.06): Variants => ({
	hidden: { opacity: 0, y: -20 },
	visible: {
		opacity: 1,
		transition: {
			delayChildren,
			staggerChildren,
		},
	},
});

export const motionItem = {
	hidden: { opacity: 0 },
	visible: { opacity: 1 },
};
