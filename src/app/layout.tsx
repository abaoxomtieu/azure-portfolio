import type { Metadata } from "next";
import { ThemeProvider } from "@/components/ThemeProvider";
import Navigation from "@/components/Navigation";
import "./globals.css";

export const metadata: Metadata = {
  title: "ABAO.XOMTIEU",
  description: "Azure & architecture notes – certifications and practice.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <body className="antialiased bg-background text-foreground selection:bg-primary/30 selection:text-white" suppressHydrationWarning>
        <ThemeProvider>
          <Navigation />
          <main className="min-h-screen">
            {children}
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}
