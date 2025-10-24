import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

type ThemeMode = "light" | "dark";
type ThemeContextValue = {
    themeMode: ThemeMode;
    setThemeMode: (nextMode: ThemeMode) => void;
    toggleThemeMode: () => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

const LOCAL_STORAGE_KEY = "app.themeMode";

function getSystemPreferredTheme(): ThemeMode {
    if (typeof window === "undefined" || !window.matchMedia) return "light";
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function applyThemeToDocument(themeMode: ThemeMode) {
    // 讓 Bootstrap 5.3 套用變數
    document.documentElement.setAttribute("data-bs-theme", themeMode);
    // 若你有自定義 CSS 走 class，也可一併加上
    document.documentElement.classList.remove("theme-light", "theme-dark");
    document.documentElement.classList.add(themeMode === "dark" ? "theme-dark" : "theme-light");
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const [themeMode, setThemeModeState] = useState<ThemeMode>(() => {
        const saved = typeof window !== "undefined" ? localStorage.getItem(LOCAL_STORAGE_KEY) : null;
        return saved === "light" || saved === "dark" ? saved : getSystemPreferredTheme();
    });

    // 套用主題到 <html>，並記錄在 localStorage
    useEffect(() => {
        applyThemeToDocument(themeMode);
        localStorage.setItem(LOCAL_STORAGE_KEY, themeMode);
    }, [themeMode]);

    // 偵測系統主題改變（如果使用者是「跟隨系統」的策略時你才需要，
    // 這裡我們直接在使用者未手動設定前才跟隨一次；若想強化可加入「auto」模式）
    useEffect(() => {
        const media = window.matchMedia("(prefers-color-scheme: dark)");
        const handleChange = () => {
            const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
            if (saved === "light" || saved === "dark") return; // 使用者已手動選擇就不覆蓋
            setThemeModeState(media.matches ? "dark" : "light");
        };
        media.addEventListener?.("change", handleChange);
        return () => media.removeEventListener?.("change", handleChange);
    }, []);

    const setThemeMode = (nextMode: ThemeMode) => setThemeModeState(nextMode);
    const toggleThemeMode = () => setThemeModeState((previous) => (previous === "dark" ? "light" : "dark"));

    const value = useMemo<ThemeContextValue>(() => ({ themeMode, setThemeMode, toggleThemeMode }), [themeMode]);

    return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
    const context = useContext(ThemeContext);
    if (!context) throw new Error("useTheme must be used within ThemeProvider");
    return context;
}