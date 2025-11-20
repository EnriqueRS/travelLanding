import type { Config } from "tailwindcss";

export default {
	darkMode: "class",
	theme: {
		extend: {
			colors: {
				obsidian: {
					900: "#050505",
					800: "#0a0a0a",
					700: "#121212",
					600: "#1a1a1a",
				},
			},
			fontFamily: {
				sans: ["Inter", "sans-serif"],
			},
		},
	},
} satisfies Config;



