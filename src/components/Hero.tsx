"use client";

import { motion } from "framer-motion";
import { ArrowDown } from "lucide-react";

export default function Hero() {
    return (
        <section className="relative min-h-screen flex flex-col justify-center items-center overflow-hidden px-4 sm:px-6 pt-24 sm:pt-20 bg-grid-pattern">
            <div className="z-10 text-center max-w-6xl mx-auto w-full">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="mb-6 sm:mb-8"
                >
                    <span className="inline-block bg-black text-white px-3 py-1.5 sm:px-4 sm:py-2 font-bold font-mono uppercase tracking-widest text-xs sm:text-sm transform -rotate-2 brutalist-shadow border-2 border-black">
                        ABAOXOMTIEU's Study Notes
                    </span>
                </motion.div>

                <motion.h1
                    className="text-4xl sm:text-5xl md:text-8xl lg:text-9xl font-heading font-black tracking-tighter mb-6 sm:mb-8 leading-[0.9] text-black"
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                >
                    HỌC AZURE <br />
                    <span className="text-transparent text-outline sm:text-black sm:text-outline-none sm:hover:text-primary transition-colors duration-300">
                        KHÔNG BỊ LẠC
                    </span>
                </motion.h1>

                <motion.p
                    className="text-black text-base sm:text-xl md:text-2xl max-w-2xl mx-auto mb-8 sm:mb-12 font-medium border-l-4 border-black pl-4 sm:pl-6 text-left"
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
                    className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center"
                >
                    <a
                        href="#certs"
                        className="group relative inline-flex h-12 sm:h-14 items-center justify-center overflow-hidden bg-primary px-6 sm:px-10 font-bold text-black border-3 border-black brutalist-shadow transition-all duration-200 hover:translate-x-1 hover:translate-y-1 hover:shadow-none w-full sm:w-auto text-sm sm:text-base"
                    >
                        <span className="mr-2 uppercase tracking-wider">Xem Notes Ngay</span>
                        <ArrowDown className="h-4 w-4 sm:h-5 sm:w-5 group-hover:translate-y-1 transition-transform shrink-0" />
                    </a>

                    <a
                        href="#contact"
                        className="group relative inline-flex h-12 sm:h-14 items-center justify-center overflow-hidden bg-white px-6 sm:px-10 font-bold text-black border-3 border-black brutalist-shadow transition-all duration-200 hover:translate-x-1 hover:translate-y-1 hover:shadow-none w-full sm:w-auto text-sm sm:text-base"
                    >
                        <span className="uppercase tracking-wider">Chat Cùng Tôi</span>
                    </a>
                </motion.div>
            </div>

            {/* Marquee effect at bottom of hero */}
            <div className="absolute bottom-6 sm:bottom-10 left-0 right-0 overflow-hidden border-y-3 border-black bg-secondary py-2 sm:py-3">
                <div className="animate-marquee whitespace-nowrap font-heading font-bold text-base sm:text-xl md:text-2xl text-black uppercase tracking-widest">
                    Học Azure • Ghi Note • Quên Lại Đọc • Hiểu Rồi • Lại Quên • Đọc Lại • Azure • Cloud • AI • Backend • Web • Học Mãi Không Chán • Azure • Cloud • AI • Backend • Web •
                </div>
            </div>
        </section>
    );
}
