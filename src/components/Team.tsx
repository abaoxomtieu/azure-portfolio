"use client";

import { motion } from "framer-motion";

const members = [
    {
        name: "ABAOXOMTIEU",
        role: "AI Engineer",
        bio: "Thích học Cloud và Backend, Web, thích xây dựng các giải pháp AI",
        image: "https://api.dicebear.com/7.x/avataaars/svg?seed=ABAOXOMTIEU",
        color: "bg-primary",
        github: "https://github.com/abaoxomtieu",
        facebook: "https://facebook.com/hotonbao"
    }
];

export default function Team() {
    return (
        <section id="team" className="py-24 px-6 bg-white border-t-3 border-black">
            <div className="max-w-7xl mx-auto">
                <div className="flex items-baseline gap-4 mb-16">
                    <span className="bg-black text-white px-3 py-1 font-mono text-sm font-bold">03.</span>
                    <h2 className="text-4xl md:text-6xl font-heading font-black text-black">MEET THE EXPERTS</h2>
                </div>

                <div className="grid md:grid-cols-1 gap-8 max-w-2xl mx-auto">
                    {members.map((member, index) => (
                        <motion.div
                            key={member.name}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="group"
                        >
                            <div className={`relative aspect-square border-3 border-black mb-6 overflow-hidden brutalist-shadow ${member.color} max-w-xs mx-auto`}>
                                <img
                                    src={member.image}
                                    alt={member.name}
                                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-300"
                                />
                            </div>
                            <h3 className="text-2xl font-heading font-bold text-black uppercase text-center mb-2">{member.name}</h3>
                            <p className="font-mono text-sm font-bold text-gray-500 uppercase tracking-widest text-center mb-3">{member.role}</p>
                            {member.bio && (
                                <p className="text-gray-700 text-sm leading-relaxed text-center mb-4 font-medium">{member.bio}</p>
                            )}
                            <div className="flex gap-4 justify-center">
                                {member.github && (
                                    <a
                                        href={member.github}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-block px-4 py-2 bg-white border-2 border-black font-bold uppercase tracking-widest hover:bg-black hover:text-white transition-all brutalist-shadow hover:translate-x-1 hover:translate-y-1 hover:shadow-none text-xs"
                                    >
                                        GitHub
                                    </a>
                                )}
                                {member.facebook && (
                                    <a
                                        href={member.facebook}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-block px-4 py-2 bg-white border-2 border-black font-bold uppercase tracking-widest hover:bg-black hover:text-white transition-all brutalist-shadow hover:translate-x-1 hover:translate-y-1 hover:shadow-none text-xs"
                                    >
                                        Facebook
                                    </a>
                                )}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
