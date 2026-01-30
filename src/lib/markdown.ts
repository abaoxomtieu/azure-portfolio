import fs from "fs";
import path from "path";
import matter from "gray-matter";

const contentDirectory = path.join(process.cwd(), "content");

export interface MarkdownPost {
    slug: string;
    title: string;
    date?: string;
    content: string; // Raw markdown content
    description?: string;
    [key: string]: any;
}

export async function getPostSlugs(type: "certs" | "practice") {
    const dir = path.join(contentDirectory, type);
    if (!fs.existsSync(dir)) return [];
    return fs.readdirSync(dir).filter((file) => file.endsWith(".md"));
}

export async function getPostBySlug(slug: string, type: "certs" | "practice"): Promise<MarkdownPost> {
    const realSlug = slug.replace(/\.md$/, "");
    const fullPath = path.join(contentDirectory, type, `${realSlug}.md`);

    if (!fs.existsSync(fullPath)) {
        throw new Error(`File not found: ${fullPath}`);
    }

    const fileContents = fs.readFileSync(fullPath, "utf8");
    const { data, content } = matter(fileContents);

    // Use the filename or first header as title if not in frontmatter
    let title = data.title;
    if (!title) {
        const titleMatch = content.match(/^# (.+)$/m);
        title = titleMatch ? titleMatch[1] : realSlug;
    }

    // Return raw markdown content - will be processed by react-markdown on client
    return {
        slug: realSlug,
        title,
        content: content, // Raw markdown
        ...data,
    };
}

export async function getAllPosts(type: "certs" | "practice"): Promise<MarkdownPost[]> {
    const slugs = await getPostSlugs(type);
    const posts = await Promise.all(
        slugs.map(async (slug) => {
            const post = await getPostBySlug(slug, type);
            // Remove content from list view to save size
            const { content, ...meta } = post;
            return { ...meta, content: "" } as MarkdownPost;
        })
    );
    return posts; // Use sort logic if date exists
}
