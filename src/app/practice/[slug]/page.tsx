import { getPostBySlug, getPostSlugs } from "@/lib/markdown";
import MarkdownContent from "@/components/MarkdownContent";
import Footer from "@/components/Footer";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export async function generateStaticParams() {
    const slugs = await getPostSlugs("practice");
    return slugs.map((slug) => ({ slug: slug.replace(/\.md$/, "") }));
}

export default async function PracticePage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const post = await getPostBySlug(slug, "practice");

    return (
        <div className="bg-white min-h-screen pt-20 sm:pt-24">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 mb-12 sm:mb-20">
                <Link href="/#practice" className="inline-flex items-center text-black font-bold uppercase tracking-widest hover:bg-black hover:text-white px-3 py-2 sm:px-4 border-2 border-black transition-all mb-8 sm:mb-12 text-sm sm:text-base">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Architecture
                </Link>

                <div className="p-4 sm:p-6 md:p-8 bg-white border-2 border-black brutalist-shadow mb-8 sm:mb-12">
                    <h3 className="text-black font-black uppercase tracking-wider mb-2 text-sm bg-secondary inline-block px-2 text-white">Architecture Overview</h3>
                    <p className="text-gray-800 font-medium mt-4">
                        This architecture document details the implementation, scaling strategies, and configurations for a production-grade system.
                    </p>
                </div>

                <MarkdownContent content={post.content} />
            </div>
            <Footer />
        </div>
    );
}
