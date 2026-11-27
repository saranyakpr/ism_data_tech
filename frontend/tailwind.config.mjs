/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        dark: {
          DEFAULT: "#012367",
          2: "#2D465E",
          3: "#405268",
        },
        light: {
          DEFAULT: "#F1F5F4",
          2: "#FFFFFF",
        },
        navy: "#012367",
        ism: {
          DEFAULT: "#012367",
          blue: "#0055FF",
          slate: "#2D465E",
        },
        lime: "#0055FF",
        violet: "#2D465E",
        coral: "#0055FF",
        muted: "#5D6D7A",
      },
      fontFamily: {
        sans: ["Plus Jakarta Sans", "system-ui", "sans-serif"],
        display: ["Plus Jakarta Sans", "system-ui", "sans-serif"],
        body: ["Plus Jakarta Sans", "system-ui", "sans-serif"],
      },
      animation: {
        "spin-slow": "spin 20s linear infinite",
        "float": "float 6s ease-in-out infinite",
        "fade-up": "fadeUp 0.6s ease forwards",
        "glow-pulse": "glowPulse 3s ease-in-out infinite",
        "marquee": "marquee 25s linear infinite",
      },
      keyframes: {
        float: {
          "0%,100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-16px)" },
        },
        fadeUp: {
          from: { opacity: "0", transform: "translateY(32px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        glowPulse: {
          "0%,100%": { opacity: "0.5" },
          "50%": { opacity: "1" },
        },
        marquee: {
          from: { transform: "translateX(0)" },
          to: { transform: "translateX(-50%)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
