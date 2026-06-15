import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#6C63FF',
          50: '#F0EFFF',
          100: '#E1DFFE',
          200: '#C3BFFD',
          300: '#A59EFC',
          400: '#877EFB',
          500: '#6C63FF',
          600: '#4D43F5',
          700: '#3129E1',
          800: '#2520B8',
          900: '#1C1890',
        },
        dark: {
          DEFAULT: '#0F0F0F',
          100: '#1A1A2E',
          200: '#16213E',
          300: '#0F3460',
        }
      },
      fontFamily: {
        georgian: ['BPG Arial', 'Sylfaen', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
export default config
