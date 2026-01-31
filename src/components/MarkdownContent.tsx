"use client";

import { useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import rehypeRaw from "rehype-raw";
import rehypeSanitize from "rehype-sanitize";
import mermaid from "mermaid";
// Import highlight.js styles
import "highlight.js/styles/github.css";

export default function MarkdownContent({ content }: { content: string }) {
    useEffect(() => {
        // Handle Mermaid diagrams
        const mermaidBlocks = document.querySelectorAll('.language-mermaid');

        if (mermaidBlocks.length > 0) {
            mermaid.initialize({ 
                startOnLoad: false, 
                theme: 'neutral',
                securityLevel: 'loose'
            });

            mermaidBlocks.forEach(async (block, index) => {
                const pre = block.parentElement;
                if (!pre) return;

                const code = block.textContent || "";
                const id = `mermaid-${index}`;

                // Create a dedicated container for the diagram
                const div = document.createElement("div");
                div.id = id;
                div.className = "mermaid flex justify-center bg-gray-50 p-4 rounded-lg border-2 border-gray-300 my-8";
                div.innerHTML = code;

                // Replace the <pre> block with the new div
                pre.replaceWith(div);
            });

            // Run mermaid on the newly inserted divs
            setTimeout(() => {
                mermaid.run({
                    nodes: document.querySelectorAll('.mermaid')
                });
            }, 100);
        }
    }, [content]);

    return (
        <article className="markdown-body">
            <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[
                    rehypeRaw,
                    rehypeHighlight,
                    rehypeSanitize
                ]}
                components={{
                    h1: ({node, ...props}) => (
                        <h1 className="text-5xl md:text-6xl font-heading font-black text-black mb-6 mt-8 pb-4 border-b-4 border-black" {...props} />
                    ),
                    h2: ({node, ...props}) => (
                        <h2 className="text-3xl md:text-4xl font-heading font-black text-black mt-10 mb-4 pb-2 border-b-4 border-black" {...props} />
                    ),
                    h3: ({node, ...props}) => (
                        <h3 className="text-2xl font-heading font-bold text-black mt-8 mb-3" {...props} />
                    ),
                    h4: ({node, ...props}) => (
                        <h4 className="text-xl font-heading font-bold text-black mt-6 mb-2" {...props} />
                    ),
                    p: ({node, ...props}) => (
                        <p className="text-gray-800 leading-relaxed mb-4 text-base md:text-lg" {...props} />
                    ),
                    a: ({node, ...props}) => (
                        <a className="text-blue-600 hover:text-blue-800 hover:underline font-semibold" {...props} />
                    ),
                    ul: ({node, ...props}) => (
                        <ul className="list-disc pl-6 mb-4 space-y-2" {...props} />
                    ),
                    ol: ({node, ...props}) => (
                        <ol className="list-decimal pl-6 mb-4 space-y-2" {...props} />
                    ),
                    li: ({node, ...props}) => (
                        <li className="text-gray-800 leading-relaxed" {...props} />
                    ),
                    strong: ({node, ...props}) => (
                        <strong className="font-bold text-black" {...props} />
                    ),
                    code: ({node, inline, className, children, ...props}: any) => {
                        const match = /language-(\w+)/.exec(className || '');
                        const language = match ? match[1] : '';
                        
                        if (inline) {
                            return (
                                <code className="bg-gray-100 text-red-600 px-1.5 py-0.5 rounded text-sm font-mono" {...props}>
                                    {children}
                                </code>
                            );
                        }
                        
                        // For code blocks, return as-is (will be wrapped by pre)
                        return (
                            <code className={className} {...props}>
                                {children}
                            </code>
                        );
                    },
                    pre: ({node, children, ...props}: any) => {
                        // Check if it's a mermaid diagram
                        const childProps = (children as any)?.props || {};
                        if (childProps.className?.includes('language-mermaid')) {
                            return <pre {...props}>{children}</pre>;
                        }
                        return (
                            <pre className="bg-gray-50 border border-gray-300 rounded-lg overflow-x-auto my-4 max-w-full text-sm sm:text-base" {...props}>
                                {children}
                            </pre>
                        );
                    },
                    blockquote: ({node, ...props}) => (
                        <blockquote className="border-l-4 border-gray-300 pl-4 italic text-gray-700 my-4" {...props} />
                    ),
                    table: ({node, ...props}) => (
                        <div className="overflow-x-auto my-6 -mx-1 sm:mx-0">
                            <table className="w-full min-w-0" {...props} />
                        </div>
                    ),
                    thead: ({node, ...props}) => (
                        <thead {...props} />
                    ),
                    th: ({node, ...props}) => (
                        <th {...props} />
                    ),
                    td: ({node, ...props}) => (
                        <td {...props} />
                    ),
                    hr: ({node, ...props}) => (
                        <hr className="border-t-2 border-gray-300 my-8" {...props} />
                    ),
                }}
            >
                {content}
            </ReactMarkdown>
        </article>
    );
}
