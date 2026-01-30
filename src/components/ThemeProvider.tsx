"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";

type Theme = "dark" | "light" | "system";

const ThemeProviderContext = React.createContext<{
    theme: Theme;
    setTheme: (theme: Theme) => void;
}>({
    theme: "dark", // Default to dark for this design
    setTheme: () => null,
});

export function ThemeProvider({
    children,
    defaultTheme = "dark",
    storageKey = "vite-ui-theme",
    ...props
}: {
    children: React.ReactNode;
    defaultTheme?: Theme;
    storageKey?: string;
    [key: string]: any;
}) {
    const [theme, setTheme] = React.useState<Theme>(() => "dark"); // Forcing dark mode initially for brute theme

    React.useEffect(() => {
        const root = window.document.documentElement;
        root.classList.remove("light", "dark");
        root.classList.add("dark"); // Force dark mode for now as per design
    }, [theme]);

    const value = {
        theme,
        setTheme: (theme: Theme) => {
            setTheme(theme);
        },
    };

    return (
        <ThemeProviderContext.Provider {...props} value={value}>
            {children}
        </ThemeProviderContext.Provider>
    );
}

export const useTheme = () => {
    const context = React.useContext(ThemeProviderContext);
    if (context === undefined)
        throw new Error("useTheme must be used within a ThemeProvider");
    return context;
};
