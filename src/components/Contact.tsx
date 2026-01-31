"use client";

import { motion } from "framer-motion";

export default function Contact() {
    return (
        <section className="py-12 sm:py-16 md:py-24 px-4 sm:px-6 bg-secondary/10 border-t-3 border-black">
            <div className="max-w-4xl mx-auto">
                <div className="bg-white border-3 border-black p-4 sm:p-6 md:p-8 lg:p-12 brutalist-shadow">
                    <h2 className="text-2xl sm:text-4xl md:text-5xl font-heading font-black text-black mb-6 sm:mb-8 uppercase">
                        Start a Project
                    </h2>

                    <form className="space-y-6">
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="font-mono text-xs font-bold uppercase tracking-widest">Tên</label>
                                <input
                                    type="text"
                                    placeholder="Nhập tên của bạn"
                                    className="w-full h-12 px-4 bg-gray-50 border-2 border-black focus:outline-none focus:bg-primary/10 focus:shadow-[4px_4px_0px_#000] transition-all font-bold placeholder:text-gray-400 placeholder:font-normal"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="font-mono text-xs font-bold uppercase tracking-widest">Email</label>
                                <input
                                    type="email"
                                    placeholder="email@example.com"
                                    className="w-full h-12 px-4 bg-gray-50 border-2 border-black focus:outline-none focus:bg-primary/10 focus:shadow-[4px_4px_0px_#000] transition-all font-bold placeholder:text-gray-400 placeholder:font-normal"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="font-mono text-xs font-bold uppercase tracking-widest">Chi Tiết Dự Án</label>
                            <textarea
                                rows={4}
                                placeholder="Hãy cho tôi biết về nhu cầu Azure của bạn..."
                                className="w-full p-4 bg-gray-50 border-2 border-black focus:outline-none focus:bg-primary/10 focus:shadow-[4px_4px_0px_#000] transition-all font-bold placeholder:text-gray-400 placeholder:font-normal"
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full h-12 sm:h-14 bg-black text-white font-heading font-bold text-base sm:text-xl uppercase tracking-widest hover:bg-primary hover:text-black transition-colors border-2 border-black"
                        >
                            Gửi Yêu Cầu
                        </button>
                    </form>
                </div>
            </div>
        </section>
    );
}
