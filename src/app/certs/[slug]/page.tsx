import { getPostBySlug, getPostSlugs } from "@/lib/markdown";
import MarkdownContent from "@/components/MarkdownContent";
import Footer from "@/components/Footer";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export async function generateStaticParams() {
    const slugs = await getPostSlugs("certs");
    return slugs.map((slug) => ({ slug: slug.replace(/\.md$/, "") }));
}

export default async function CertPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const post = await getPostBySlug(slug, "certs");

    return (
        <div className="bg-white min-h-screen pt-24">
            <div className="max-w-4xl mx-auto px-6 mb-20">
                <Link href="/#certs" className="inline-flex items-center text-black font-bold uppercase tracking-widest hover:bg-black hover:text-white px-4 py-2 border-2 border-black transition-all mb-12">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Quay Lại Chứng Chỉ
                </Link>

                <MarkdownContent content={post.content} />
            </div>
            <Footer />
        </div>
    );
}
