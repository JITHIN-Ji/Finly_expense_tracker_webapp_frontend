/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        "primary": "#0058bc",
        "on-secondary": "#ffffff",
        "primary-fixed": "#d8e2ff",
        "error": "#ba1a1a",
        "inverse-primary": "#adc6ff",
        "surface-tint": "#005bc1",
        "on-background": "#0b1c30",
        "on-secondary-fixed-variant": "#004f58",
        "surface-container-highest": "#d3e4fe",
        "background": "#f8f9ff",
        "on-tertiary-fixed": "#351000",
        "secondary-fixed-dim": "#00daf3",
        "on-primary": "#ffffff",
        "on-error": "#ffffff",
        "primary-fixed-dim": "#adc6ff",
        "on-primary-container": "#fefcff",
        "surface-bright": "#f8f9ff",
        "surface-container": "#e5eeff",
        "outline-variant": "#c1c6d7",
        "surface-container-lowest": "#ffffff",
        "tertiary-fixed": "#ffdbcc",
        "surface": "#f8f9ff",
        "error-container": "#ffdad6",
        "on-tertiary": "#ffffff",
        "on-tertiary-container": "#fffbff",
        "on-tertiary-fixed-variant": "#7c2e00",
        "surface-container-low": "#eff4ff",
        "surface-container-high": "#dce9ff",
        "inverse-surface": "#213145",
        "inverse-on-surface": "#eaf1ff",
        "on-error-container": "#93000a",
        "on-primary-fixed": "#001a41",
        "on-primary-fixed-variant": "#004493",
        "secondary-fixed": "#9cf0ff",
        "tertiary": "#9e3d00",
        "primary-container": "#0070eb",
        "outline": "#717786",
        "on-secondary-container": "#00616d",
        "secondary-container": "#00e3fd",
        "surface-dim": "#cbdbf5",
        "on-surface-variant": "#414755",
        "on-secondary-fixed": "#001f24",
        "secondary": "#006875",
        "tertiary-fixed-dim": "#ffb595",
        "surface-variant": "#d3e4fe",
        "on-surface": "#0b1c30",
        "tertiary-container": "#c64f00"
      },
      borderRadius: {
        DEFAULT: "0.125rem",
        lg: "0.25rem",
        xl: "0.5rem",
        full: "0.75rem"
      },
      spacing: {
        "margin-desktop": "40px",
        "gutter": "24px",
        "margin-mobile": "16px",
        "unit": "8px",
        "container-max": "1440px"
      },
      fontFamily: {
        "headline-lg": ["Hanken Grotesk"],
        "body-md": ["Inter"],
        "title-md": ["Hanken Grotesk"],
        "display-lg": ["Hanken Grotesk"],
        "body-lg": ["Inter"],
        "label-sm": ["Geist"]
      },
      fontSize: {
        "headline-lg-mobile": ["24px", { lineHeight: "32px", letterSpacing: "-0.01em", fontWeight: "600" }],
        "headline-lg": ["32px", { lineHeight: "40px", letterSpacing: "-0.01em", fontWeight: "600" }],
        "body-md": ["14px", { lineHeight: "20px", letterSpacing: "0em", fontWeight: "400" }],
        "title-md": ["20px", { lineHeight: "28px", letterSpacing: "-0.01em", fontWeight: "500" }],
        "display-lg": ["48px", { lineHeight: "56px", letterSpacing: "-0.02em", fontWeight: "700" }],
        "body-lg": ["16px", { lineHeight: "24px", letterSpacing: "0em", fontWeight: "400" }],
        "label-sm": ["12px", { lineHeight: "16px", letterSpacing: "0.02em", fontWeight: "500" }]
      },
      maxWidth: {
        "container-max": "1440px"
      }
    },
  },
  plugins: [],
}
