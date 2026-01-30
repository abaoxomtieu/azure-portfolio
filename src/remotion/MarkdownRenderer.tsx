import React from "react";

// Simple markdown parser for Remotion
export const MarkdownRenderer: React.FC<{ content: string }> = ({ content }) => {
	const lines = content.split("\n");
	const elements: React.ReactNode[] = [];
	let currentList: string[] = [];
	let inCodeBlock = false;
	let codeBlockContent: string[] = [];
	let codeBlockLanguage = "";

	const flushList = () => {
		if (currentList.length > 0) {
			elements.push(
				<ul
					key={`list-${elements.length}`}
					style={{
						listStyle: "disc",
						paddingLeft: "32px",
						marginBottom: "16px",
						marginTop: "16px",
					}}
				>
					{currentList.map((item, idx) => (
						<li
							key={idx}
							style={{
								marginBottom: "8px",
								color: "#374151",
								fontSize: "16px",
								lineHeight: 1.6,
							}}
						>
							{parseInlineMarkdown(item)}
						</li>
					))}
				</ul>
			);
			currentList = [];
		}
	};

	const flushCodeBlock = () => {
		if (codeBlockContent.length > 0) {
			elements.push(
				<pre
					key={`code-${elements.length}`}
					style={{
						backgroundColor: "#F9FAFB",
						border: "2px solid #000000",
						padding: "16px",
						marginBottom: "16px",
						marginTop: "16px",
						overflowX: "auto",
						fontSize: "14px",
						fontFamily: "monospace",
					}}
				>
					<code>{codeBlockContent.join("\n")}</code>
				</pre>
			);
			codeBlockContent = [];
			codeBlockLanguage = "";
		}
	};

	const parseInlineMarkdown = (text: string): React.ReactNode => {
		const parts: React.ReactNode[] = [];
		let currentIndex = 0;

		// Handle bold **text**
		const boldRegex = /\*\*(.+?)\*\*/g;
		const matches: Array<{ start: number; end: number; text: string }> = [];
		let match;
		while ((match = boldRegex.exec(text)) !== null) {
			matches.push({
				start: match.index,
				end: match.index + match[0].length,
				text: match[1],
			});
		}

		// Handle code `code`
		const codeRegex = /`(.+?)`/g;
		const codeMatches: Array<{ start: number; end: number; text: string }> = [];
		while ((match = codeRegex.exec(text)) !== null) {
			codeMatches.push({
				start: match.index,
				end: match.index + match[0].length,
				text: match[1],
			});
		}

		// Combine and sort all matches
		const allMatches = [
			...matches.map((m) => ({ ...m, type: "bold" as const })),
			...codeMatches.map((m) => ({ ...m, type: "code" as const })),
		].sort((a, b) => a.start - b.start);

		let lastIndex = 0;
		allMatches.forEach((m) => {
			if (m.start > lastIndex) {
				parts.push(text.substring(lastIndex, m.start));
			}
			if (m.type === "bold") {
				parts.push(
					<strong key={`bold-${m.start}`} style={{ fontWeight: 700, color: "#000000" }}>
						{m.text}
					</strong>
				);
			} else if (m.type === "code") {
				parts.push(
					<code
						key={`code-${m.start}`}
						style={{
							backgroundColor: "#E5E7EB",
							padding: "2px 6px",
							borderRadius: "4px",
							fontFamily: "monospace",
							fontSize: "14px",
							color: "#DC2626",
						}}
					>
						{m.text}
					</code>
				);
			}
			lastIndex = m.end;
		});

		if (lastIndex < text.length) {
			parts.push(text.substring(lastIndex));
		}

		return parts.length > 0 ? <>{parts}</> : text;
	};

	lines.forEach((line, index) => {
		const trimmed = line.trim();

		// Code blocks
		if (trimmed.startsWith("```")) {
			if (inCodeBlock) {
				flushCodeBlock();
				inCodeBlock = false;
			} else {
				inCodeBlock = true;
				codeBlockLanguage = trimmed.substring(3).trim();
			}
			return;
		}

		if (inCodeBlock) {
			codeBlockContent.push(line);
			return;
		}

		// Headers
		if (trimmed.startsWith("### ")) {
			flushList();
			elements.push(
				<h3
					key={`h3-${index}`}
					style={{
						fontSize: "24px",
						fontWeight: 700,
						color: "#000000",
						marginTop: "32px",
						marginBottom: "16px",
					}}
				>
					{trimmed.substring(4)}
				</h3>
			);
			return;
		}

		if (trimmed.startsWith("## ")) {
			flushList();
			elements.push(
				<h2
					key={`h2-${index}`}
					style={{
						fontSize: "32px",
						fontWeight: 900,
						color: "#000000",
						marginTop: "40px",
						marginBottom: "20px",
						borderBottom: "3px solid #000000",
						paddingBottom: "8px",
					}}
				>
					{trimmed.substring(3)}
				</h2>
			);
			return;
		}

		if (trimmed.startsWith("# ")) {
			flushList();
			elements.push(
				<h1
					key={`h1-${index}`}
					style={{
						fontSize: "48px",
						fontWeight: 900,
						color: "#000000",
						marginTop: "40px",
						marginBottom: "24px",
						borderBottom: "4px solid #000000",
						paddingBottom: "12px",
					}}
				>
					{trimmed.substring(2)}
				</h1>
			);
			return;
		}

		// Horizontal rule
		if (trimmed === "---") {
			flushList();
			elements.push(
				<hr
					key={`hr-${index}`}
					style={{
						border: "none",
						borderTop: "3px solid #000000",
						marginTop: "32px",
						marginBottom: "32px",
					}}
				/>
			);
			return;
		}

		// List items
		if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
			currentList.push(trimmed.substring(2));
			return;
		}

		// Regular paragraphs
		if (trimmed.length > 0) {
			flushList();
			elements.push(
				<p
					key={`p-${index}`}
					style={{
						fontSize: "16px",
						color: "#374151",
						lineHeight: 1.6,
						marginBottom: "16px",
					}}
				>
					{parseInlineMarkdown(trimmed)}
				</p>
			);
		} else {
			flushList();
		}
	});

	flushList();
	flushCodeBlock();

	return <div>{elements}</div>;
};
