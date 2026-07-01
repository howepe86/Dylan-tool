import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontSize: {
        lg: ["20px", { lineHeight: "1.2" }],
        xl: ["20px", { lineHeight: "1.2" }],
        "2xl": ["24px", { lineHeight: "1.2" }],
        "3xl": ["32px", { lineHeight: "1.2" }],
        "4xl": ["48px", { lineHeight: "1.2" }],
      },
      lineHeight: {
        body: "1.5",
        heading: "1.2",
      },
      maxWidth: {
        prose: "680px",
      },
    },
  },
  plugins: [],
};

export default config;
