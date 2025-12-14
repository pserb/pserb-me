"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import SyntaxHighlighter from "react-syntax-highlighter";
import { a11yDark, a11yLight } from "react-syntax-highlighter/dist/esm/styles/hljs";

interface Props {
	value: {
		code: string;
		language: string;
	};
}

const CodeBlock = ({ value }: Props) => {
	const { code, language } = value;
	const { resolvedTheme } = useTheme();
	const [mounted, setMounted] = useState(false);

	// Avoid hydration mismatch
	useEffect(() => {
		setMounted(true);
	}, []);

	// Map XML to verilog and YAML to vhdl for better highlighting
	const mappedLanguage = language === "xml" ? "verilog" : language === "yaml" ? "vhdl" : language;

	const isDark = mounted ? resolvedTheme === "dark" : true;

	const customStyle = {
		padding: "1rem 1.25rem",
		paddingTop: "1rem",
		margin: 0,
		backgroundColor: isDark ? "oklch(0.14 0 0)" : "oklch(0.97 0 0)",
		fontVariantLigatures: "none",
		borderRadius: "4px",
		fontSize: "0.875rem",
		lineHeight: "1.6",
	};

	const lineNumberColor = isDark ? "oklch(0.45 0 0)" : "oklch(0.55 0 0)";

	// Badge colors that match the code block background
	const badgeBg = isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.06)";
	const badgeText = isDark ? "oklch(0.6 0 0)" : "oklch(0.5 0 0)";

	return (
		<div className="relative my-6 rounded overflow-hidden border border-border">
			<SyntaxHighlighter
				showLineNumbers={code.split('\n').length >= 5}
				language={mappedLanguage}
				style={isDark ? a11yDark : a11yLight}
				customStyle={customStyle}
				codeTagProps={{ 
					style: { 
						fontFamily: "var(--font-geist-mono), ui-monospace, monospace",
					} 
				}}
				lineNumberStyle={{
					minWidth: "2.5em",
					paddingRight: "1em",
					color: lineNumberColor,
					userSelect: "none",
				}}
			>
				{code}
			</SyntaxHighlighter>
			{/* Language label - positioned inside the code block area */}
			{language && (
				<div 
					className="absolute top-2 right-2 px-2 py-0.5 text-[10px] font-mono uppercase tracking-wide rounded"
					style={{ 
						backgroundColor: badgeBg,
						color: badgeText,
					}}
				>
					{language}
				</div>
			)}
		</div>
	);
};

export default CodeBlock;
