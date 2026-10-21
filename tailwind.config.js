/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      // All brand colours defined ONCE here as semantic tokens.
      // Components must reference these tokens, never raw hex values.
      colors: {
        background: '#0B0D12',
        surface: '#12151C',
        elevated: '#181C26',
        border: '#1F2430',
        text: '#E6E8EE',
        muted: '#8A91A3',
        accent: {
          from: '#7C5CFF', // violet
          to: '#22D3EE', // cyan
        },
        success: '#34D399',
        warning: '#FBBF24',
        danger: '#F87171',
      },
      fontFamily: {
        heading: ['"Space Grotesk"', 'system-ui', 'sans-serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      borderRadius: {
        card: '16px',
      },
      boxShadow: {
        // Soft violet glow on hover / focus.
        glow: '0 0 0 1px rgba(124,92,255,0.25), 0 8px 32px -8px rgba(124,92,255,0.35)',
        'glow-cyan': '0 0 0 1px rgba(34,211,238,0.25), 0 8px 32px -8px rgba(34,211,238,0.35)',
      },
      backgroundImage: {
        'accent-gradient': 'linear-gradient(135deg, #7C5CFF 0%, #22D3EE 100%)',
      },
      keyframes: {
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '20%, 60%': { transform: 'translateX(-8px)' },
          '40%, 80%': { transform: 'translateX(8px)' },
        },
        caret: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0' },
        },
        scanline: {
          '0%': { top: '0%' },
          '100%': { top: '100%' },
        },
        float: {
          '0%, 100%': { transform: 'translate(0, 0) scale(1)' },
          '50%': { transform: 'translate(20px, -30px) scale(1.1)' },
        },
      },
      animation: {
        shake: 'shake 0.4s ease-in-out',
        caret: 'caret 1s step-end infinite',
        scanline: 'scanline 1.5s ease-in-out infinite',
        'float-slow': 'float 14s ease-in-out infinite',
        'float-slower': 'float 20s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
