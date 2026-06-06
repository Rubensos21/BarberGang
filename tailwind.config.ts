import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx}', './app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#050505',
        paper: '#efefeb',
        neon: '#a3ff00',
        cyan: '#18e3ff',
        ink: '#101010'
      },
      boxShadow: {
        neon: '0 0 0 1px rgba(163,255,0,.65), 0 0 24px rgba(163,255,0,.35)',
        cyan: '0 0 0 1px rgba(24,227,255,.65), 0 0 24px rgba(24,227,255,.35)'
      },
      backgroundImage: {
        'mesh-street':
          'radial-gradient(circle at 20% 20%, rgba(24,227,255,.28), transparent 25%), radial-gradient(circle at 80% 15%, rgba(163,255,0,.18), transparent 22%), radial-gradient(circle at 35% 80%, rgba(255,0,110,.22), transparent 25%), linear-gradient(135deg, #09091b 0%, #241934 45%, #0a0a0a 100%)',
        grain:
          'linear-gradient(rgba(255,255,255,.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.04) 1px, transparent 1px)'
      },
      fontFamily: {
        display: ['var(--font-display)', 'sans-serif'],
        sans: ['var(--font-body)', 'system-ui', 'sans-serif']
      },
      keyframes: {
        floaty: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' }
        },
        pulseGlow: {
          '0%, 100%': { opacity: '0.85' },
          '50%': { opacity: '1' }
        }
      },
      animation: {
        floaty: 'floaty 8s ease-in-out infinite',
        pulseGlow: 'pulseGlow 4s ease-in-out infinite'
      }
    }
  },
  plugins: []
};

export default config;