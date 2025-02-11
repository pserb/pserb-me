import SyntaxHighlighter from "react-syntax-highlighter";
import { monokaiSublime, tomorrow, tomorrowNight, tomorrowNightBright, a11yDark } from "react-syntax-highlighter/dist/esm/styles/hljs";
import { CSSProperties } from "styled-components";

interface Props {
	value: {
		code: string;
		language: string;
	};
}

const customStyle: CSSProperties = {
	padding: "1.5em",
	marginBlock: "2em",
	paddingInline: "1.5em",
	backgroundColor: "#191919",
	fontVariantLigatures: "none",
};

const CodeBlock = ({ value }: Props) => {
	const { code, language } = value;

	// Map XML to verilog and YAML to vhdl
	const mappedLanguage = language === "xml" ? "verilog" : language === "yaml" ? "vhdl" : language;

	console.log("Language: ", language);

	return (
		<SyntaxHighlighter
			className="border border-foreground"
			showLineNumbers={false}
			// showInlineLineNumbers={true}
			language={mappedLanguage}
			style={a11yDark} // Add 'as any' to bypass type checking
			customStyle={customStyle}
			codeTagProps={{ style: { fontFamily: "var(--jetbrainsMono)" } }}
		>
			{code}
		</SyntaxHighlighter>
	);
};

export default CodeBlock;
