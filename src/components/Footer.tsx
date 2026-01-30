export default function Footer() {
    return (
        <footer className="bg-white pt-20 border-t-4 border-black" id="contact">
            <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12 pb-20">
                <div>
                    <h2 className="text-5xl md:text-7xl font-heading font-black text-black mb-6 leading-none">
                        LET'S <br />
                        BUILD <br />
                        <span className="text-primary italic">SCALABLE.</span>
                    </h2>
                </div>

                <div className="flex flex-col justify-end items-start md:items-end gap-8">
                    <div className="flex flex-col gap-2 md:text-right">
                        <span className="font-mono text-sm font-bold uppercase text-gray-500">Liên Hệ</span>
                        <a href="mailto:htbqn2003@gmail.com" className="text-2xl md:text-4xl font-bold hover:text-primary transition-colors hover:underline decoration-4 underline-offset-4">
                            htbqn2003@gmail.com
                        </a>
                    </div>

                    <div className="flex gap-4">
                        <SocialLink href="https://github.com/abaoxomtieu">GitHub</SocialLink>
                        <SocialLink href="https://facebook.com/hotonbao">Facebook</SocialLink>
                    </div>
                </div>
            </div>

            <div className="bg-black text-white py-4 px-6">
                <div className="max-w-7xl mx-auto flex justify-between items-center text-xs font-mono uppercase tracking-widest">
                    <p>© 2024 ABAOXOMTIEU.</p>
                    <p>AI ENGINEER • CLOUD • BACKEND • WEB</p>
                </div>
            </div>
        </footer>
    );
}

function SocialLink({ href, children }: { href: string; children: React.ReactNode }) {
    return (
        <a
            href={href}
            className="inline-block px-6 py-3 bg-white border-2 border-black font-bold uppercase tracking-widest hover:bg-black hover:text-white transition-all brutalist-shadow hover:translate-x-1 hover:translate-y-1 hover:shadow-none"
        >
            {children}
        </a>
    );
}
