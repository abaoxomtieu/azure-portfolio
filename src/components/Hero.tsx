"use client";

import { motion } from "framer-motion";
import { ArrowDown } from "lucide-react";

export default function Hero() {
    return (
        <section className="relative min-h-screen flex flex-col justify-center items-center overflow-hidden px-6 pt-20 bg-grid-pattern">
            <div className="z-10 text-center max-w-6xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="mb-8"
                >
                    <span className="inline-block bg-black text-white px-4 py-2 font-bold font-mono uppercase tracking-widest text-sm transform -rotate-2 brutalist-shadow border-2 border-black">
                        ABAOXOMTIEU's Study Notes
                    </span>
                </motion.div>

                <motion.h1
                    className="text-6xl md:text-8xl lg:text-9xl font-heading font-black tracking-tighter mb-8 leading-[0.9] text-black"
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                >
                    HỌC AZURE <br />
                    <span className="text-transparent text-outline md:text-black md:text-outline-none md:hover:text-primary transition-colors duration-300">
                        KHÔNG BỊ LẠC
                    </span>
                </motion.h1>

                <motion.p
                    className="text-black text-xl md:text-2xl max-w-2xl mx-auto mb-12 font-medium border-l-4 border-black pl-6 text-left"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                >
                    Đây là nơi ABAOXOMTIEU note lại những gì học được khi tự ôn Azure cert. 
                    Từ những lần "Ủa cái này là gì?" đến "À hiểu rồi!", tất cả đều được ghi lại ở đây 
                    để sau này không phải Google lại lần nữa 😅
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.6 }}
                    className="flex gap-4 justify-center"
                >
                    <a
                        href="#certs"
                        className="group relative inline-flex h-14 items-center justify-center overflow-hidden bg-primary px-10 font-bold text-black border-3 border-black brutalist-shadow transition-all duration-200 hover:translate-x-1 hover:translate-y-1 hover:shadow-none"
                    >
                        <span className="mr-2 uppercase tracking-wider">Xem Notes Ngay</span>
                        <ArrowDown className="h-5 w-5 group-hover:translate-y-1 transition-transform" />
                    </a>

                    <a
                        href="#contact"
                        className="group relative inline-flex h-14 items-center justify-center overflow-hidden bg-white px-10 font-bold text-black border-3 border-black brutalist-shadow transition-all duration-200 hover:translate-x-1 hover:translate-y-1 hover:shadow-none"
                    >
                        <span className="uppercase tracking-wider">Chat Cùng Tôi</span>
                    </a>
                </motion.div>
            </div>

            {/* Marquee effect at bottom of hero */}
            <div className="absolute bottom-10 left-0 right-0 overflow-hidden border-y-3 border-black bg-secondary py-3">
                <div className="animate-marquee whitespace-nowrap font-heading font-bold text-2xl text-black uppercase tracking-widest">
                    Học Azure • Ghi Note • Quên Lại Đọc • Hiểu Rồi • Lại Quên • Đọc Lại • Azure • Cloud • AI • Backend • Web • Học Mãi Không Chán • Azure • Cloud • AI • Backend • Web •
                </div>
            </div>
        </section>
    );
}
