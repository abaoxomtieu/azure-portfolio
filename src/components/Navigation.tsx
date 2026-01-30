import Link from "next/link";
import { cn } from "@/lib/utils";

export default function Navigation() {
    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b-3 border-black">
            <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                <Link href="/" className="font-heading font-black text-2xl text-black tracking-tighter hover:text-primary transition-colors uppercase border-2 border-black px-2 py-1 bg-white hover:bg-black hover:text-white transform hover:-rotate-2 transition-all">
                    AZURE<span className="text-primary italic">.PORTFOLIO</span>
                </Link>

                <div className="hidden md:flex space-x-8">
                    <NavLink href="/#certs">Certifications</NavLink>
                    <NavLink href="/#practice">Architecture</NavLink>
                    <NavLink href="/#team">Team</NavLink>
                    <NavLink href="/#contact">Contact</NavLink>
                </div>
            </div>
        </nav>
    );
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
    return (
        <Link
            href={href}
            className="text-sm font-bold text-black hover:bg-black hover:text-white px-3 py-1 transition-all uppercase tracking-widest border border-transparent hover:border-black"
        >
            {children}
        </Link>
    );
}
