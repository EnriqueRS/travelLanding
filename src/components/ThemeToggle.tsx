import { useEffect, useState } from "react";
import { Icon } from "@iconify/react";

export default function ThemeToggle(): JSX.Element {
	const [isDark, setIsDark] = useState<boolean>(false);

	useEffect(() => {
		// Initialize from storage or system
		const root = document.documentElement;
		const stored = localStorage.getItem("theme");
		const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
		const initial = stored ? stored === "dark" : prefersDark;
		if (initial) {
			root.classList.add("dark");
		} else {
			root.classList.remove("dark");
		}
		setIsDark(initial);

		// Sync when storage changes (another tab)
		function onStorage(e: StorageEvent) {
			if (e.key === "theme" && e.newValue) {
				const v = e.newValue === "dark";
				setIsDark(v);
				if (v) root.classList.add("dark");
				else root.classList.remove("dark");
			}
		}
		window.addEventListener("storage", onStorage);
		return () => window.removeEventListener("storage", onStorage);
	}, []);

	function toggleTheme(): void {
		const root = document.documentElement;
		const next = !isDark;
		setIsDark(next);
		if (next) {
			root.classList.add("dark");
			root.setAttribute("data-theme", "dark");
			localStorage.setItem("theme", "dark");
		} else {
			root.classList.remove("dark");
			root.setAttribute("data-theme", "light");
			localStorage.setItem("theme", "light");
		}
	}

	return (
		<button
			onClick={toggleTheme}
			aria-label="Toggle theme"
			className="inline-flex items-center gap-2 rounded-md border border-slate-300 dark:border-slate-700 px-3 py-1.5 text-sm hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
		>
			<Icon icon={isDark ? "solar:moon-bold" : "solar:sun-bold"} className="h-5 w-5" />
			<span className="hidden sm:inline">{isDark ? "Oscuro" : "Claro"}</span>
		</button>
	);
}


