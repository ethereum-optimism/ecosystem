/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        mono: ['JetBrains Mono', 'Monaco', 'Menlo', 'Consolas', 'monospace'],
      },
      colors: {
        terminal: {
          bg: '#1d2021', // Gruvbox dark background
          secondary: '#282828', // Gruvbox dark0_soft
          border: '#504945', // Gruvbox dark2
          text: '#ebdbb2', // Gruvbox light0
          muted: '#a89984', // Gruvbox light4
          dim: '#665c54', // Gruvbox dark3
          accent: '#b8bb26', // Gruvbox bright_green
          error: '#fb4934', // Gruvbox bright_red
          warning: '#fabd2f', // Gruvbox bright_yellow
          success: '#b8bb26', // Gruvbox bright_green
          info: '#83a598', // Gruvbox bright_blue
        },
      },
      animation: {
        'cursor-blink': 'blink 1s infinite',
        glow: 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        blink: {
          '0%, 50%': { opacity: '1' },
          '51%, 100%': { opacity: '0' },
        },
        glow: {
          '0%': { 'text-shadow': '0 0 5px #b8bb26' },
          '100%': { 'text-shadow': '0 0 20px #b8bb26, 0 0 30px #b8bb26' },
        },
      },
      boxShadow: {
        terminal: '0 0 20px rgba(184, 187, 38, 0.3)',
        'terminal-inner': 'inset 0 0 20px rgba(184, 187, 38, 0.1)',
      },
    },
  },
  plugins: [],
}
