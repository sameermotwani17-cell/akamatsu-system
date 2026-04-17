// Tailwind v4: all theming is done in globals.css via @theme {}
// This file is kept for IDE tooling compatibility only.
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
};

export default config;
