export default function Footer() {
    return (
        <footer className="bg-white pt-12 sm:pt-16 md:pt-20 border-t-4 border-black" id="contact">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-12 pb-12 sm:pb-20">
                <div>
                    <h2 className="text-3xl sm:text-5xl md:text-7xl font-heading font-black text-black mb-4 sm:mb-6 leading-none">
                        LET'S <br />
                        BUILD <br />
                        <span className="text-primary italic">SCALABLE.</span>
                    </h2>
                </div>

                <div className="flex flex-col justify-end items-start md:items-end gap-6 sm:gap-8">
                    <div className="flex flex-col gap-2 md:text-right">
                        <span className="font-mono text-sm font-bold uppercase text-gray-500">Liên Hệ</span>
                        <a href="mailto:htbqn2003@gmail.com" className="text-lg sm:text-2xl md:text-4xl font-bold hover:text-primary transition-colors hover:underline decoration-4 underline-offset-4 break-all">
                            htbqn2003@gmail.com
                        </a>
                    </div>

                    <div className="flex flex-wrap gap-3 sm:gap-4">
                        <SocialLink href="https://github.com/abaoxomtieu">GitHub</SocialLink>
                        <SocialLink href="https://facebook.com/hotonbao">Facebook</SocialLink>
                    </div>
                </div>
            </div>

            <div className="bg-black text-white py-4 px-4 sm:px-6">
                <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-2 sm:gap-0 text-xs font-mono uppercase tracking-widest text-center sm:text-left">
                    <p>© 2026 ABAOXOMTIEU.</p>
                    <p className="whitespace-nowrap">AI ENGINEER • CLOUD • BACKEND • WEB</p>
                </div>
            </div>
        </footer>
    );
}

function SocialLink({ href, children }: { href: string; children: React.ReactNode }) {
    return (
        <a
            href={href}
            className="inline-block px-4 sm:px-6 py-2.5 sm:py-3 bg-white border-2 border-black font-bold uppercase tracking-widest hover:bg-black hover:text-white transition-all brutalist-shadow hover:translate-x-1 hover:translate-y-1 hover:shadow-none text-sm sm:text-base"
        >
            {children}
        </a>
    );
}
