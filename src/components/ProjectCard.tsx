"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, BadgeCheck, Code2 } from "lucide-react";

interface ProjectCardProps {
    title: string;
    description?: string;
    href: string;
    type: "cert" | "practice";
    tags?: string[];
    index: number;
}

export default function ProjectCard({ title, description, href, type, tags, index }: ProjectCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
        >
            <Link href={href} className="group block h-full">
                <div className="relative h-full bg-white border-3 border-black p-4 sm:p-6 md:p-8 transition-all duration-200 hover:translate-x-[-4px] hover:translate-y-[-4px] hover:shadow-[8px_8px_0px_#000000]">

                    <div className="flex items-center justify-between mb-4 sm:mb-6">
                        <span className={`inline-flex items-center gap-2 px-3 py-1 font-bold tracking-wider uppercase border-2 border-black text-xs ${type === 'cert' ? 'bg-secondary text-white' : 'bg-primary text-white'
                            }`}>
                            {type === 'cert' ? <BadgeCheck className="w-3 h-3" /> : <Code2 className="w-3 h-3" />}
                            {type === 'cert' ? 'Certification' : 'Architecture'}
                        </span>
                        <div className="w-8 h-8 flex items-center justify-center bg-black text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                            <ArrowRight className="w-4 h-4 -rotate-45 group-hover:rotate-0 transition-transform duration-300" />
                        </div>
                    </div>

                    <h3 className="text-xl sm:text-2xl font-heading font-black text-black mb-2 sm:mb-3">
                        {title}
                    </h3>

                    {description && (
                        <p className="text-gray-700 text-sm leading-relaxed mb-4 sm:mb-6 font-medium">
                            {description}
                        </p>
                    )}

                    {tags && (
                        <div className="flex flex-wrap gap-2 mt-auto pt-4 border-t-2 border-black/10">
                            {tags.map((tag) => (
                                <span key={tag} className="text-xs font-bold font-mono text-black">
                                    #{tag}
                                </span>
                            ))}
                        </div>
                    )}
                </div>
            </Link>
        </motion.div>
    );
}
