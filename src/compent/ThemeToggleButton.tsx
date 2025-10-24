import { useTheme } from "../function/theme/ThemeProvider";

export default function ThemeToggleButton() {
  const { themeMode, toggleThemeMode } = useTheme();

  return (
    <button
      type="button"
      className="btn btn-outline-secondary"
      onClick={toggleThemeMode}
      aria-label="Toggle theme"
      title="切換主題"
    >
      {themeMode === "dark" ? "🌙 Dark" : "☀️ Light"}
    </button>
  );
}