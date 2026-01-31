"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

const navLinks = [
    { href: "/#certs", label: "Certifications" },
    { href: "/#practice", label: "Architecture" },
    { href: "/#team", label: "Team" },
    { href: "/#contact", label: "Contact" },
];

export default function Navigation() {
    const [mobileOpen, setMobileOpen] = useState(false);

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b-3 border-black">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between">
                <Link
                    href="/"
                    className="font-heading font-black text-lg sm:text-2xl text-black tracking-tighter hover:text-primary transition-colors uppercase border-2 border-black px-2 py-1 bg-white hover:bg-black hover:text-white transform hover:-rotate-2 transition-all shrink-0"
                >
                    AZURE<span className="text-primary italic">.PORTFOLIO</span>
                </Link>

                <div className="hidden md:flex items-center gap-4 lg:gap-8">
                    {navLinks.map(({ href, label }) => (
                        <NavLink key={href} href={href}>{label}</NavLink>
                    ))}
                </div>

                <button
                    type="button"
                    aria-label={mobileOpen ? "Close menu" : "Open menu"}
                    aria-expanded={mobileOpen}
                    className="md:hidden p-2 border-2 border-black hover:bg-black hover:text-white transition-colors"
                    onClick={() => setMobileOpen((o) => !o)}
                >
                    {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </button>
            </div>

            {/* Mobile menu */}
            <div
                className={cn(
                    "md:hidden border-t-2 border-black bg-white overflow-hidden transition-all duration-200 ease-out",
                    mobileOpen ? "max-h-64 opacity-100" : "max-h-0 opacity-0"
                )}
            >
                <div className="px-4 py-4 flex flex-col gap-1">
                    {navLinks.map(({ href, label }) => (
                        <Link
                            key={href}
                            href={href}
                            className="text-sm font-bold text-black hover:bg-black hover:text-white px-4 py-3 uppercase tracking-widest border border-transparent hover:border-black transition-all"
                            onClick={() => setMobileOpen(false)}
                        >
                            {label}
                        </Link>
                    ))}
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
