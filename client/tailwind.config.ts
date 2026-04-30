/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        pixel: ['"Press Start 2P"', 'monospace'],
      },
      colors: {
        // Pixel-art palette — CGA-inspired with modern touches
        pixel: {
          bg: '#0a0a0f',
          surface: '#12121a',
          border: '#2a2a3a',
          primary: '#00d4ff',
          secondary: '#ff6b9d',
          accent: '#c084fc',
          gold: '#fbbf24',
          green: '#34d399',
          text: '#e2e8f0',
          muted: '#64748b',
        },
      },
      animation: {
        'pixel-flicker': 'pixel-flicker 3s ease-in-out infinite',
        'fade-in': 'fade-in 0.4s ease-out',
        'slide-up': 'slide-up 0.5s ease-out',
      },
      keyframes: {
        'pixel-flicker': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.85' },
          '75%': { opacity: '0.95' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'slide-up': {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      boxShadow: {
        'pixel': '4px 4px 0px 0px rgba(0, 212, 255, 0.3)',
        'pixel-hover': '6px 6px 0px 0px rgba(0, 212, 255, 0.5)',
        'pixel-inset': 'inset 2px 2px 0px 0px rgba(0, 212, 255, 0.2)',
      },
    },
  },
  plugins: [],
};
