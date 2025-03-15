/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f5f9ff',
          100: '#e8f1fd',
          200: '#d1e3fa',
          300: '#a6c8f5',
          400: '#7aabef',
          500: '#4f8fea',
          600: '#0066CC', // Apple blue
          700: '#0055a5',
          800: '#003f7c',
          900: '#002952',
        },
        secondary: {
          50: '#f9fafb',
          100: '#f3f4f6',
          200: '#e5e7eb',
          300: '#d1d5db',
          400: '#9ca3af',
          500: '#6b7280',
          600: '#4b5563',
          700: '#374151',
          800: '#1f2937', // Apple dark gray
          900: '#111827',
        },
        accent: {
          50: '#f2fbf9',
          100: '#d3f1ea',
          200: '#a7e4d7',
          300: '#6dd5c2',
          400: '#34c6ac',
          500: '#1fb396', // Teal accent
          600: '#199081',
          700: '#136b60',
          800: '#0e4c43',
          900: '#0a332e',
        },
        apple: {
          gray: '#f5f5f7', // Apple light gray background
          darkgray: '#86868b', // Apple medium gray
          black: '#1d1d1f',   // Apple black
        },
        // Novas cores para o tema galáctico
        galaxy: {
          black: '#050714', // Fundo escuro profundo
          darkblue: '#0c1445', // Azul escuro galáctico
          purple: '#291854', // Roxo espacial
          nebula: '#481380', // Púrpura nebulosa
          accent: '#6225E6', // Roxo intenso
          highlight: '#BD00FF', // Violeta neon
          stardust: '#be21fe', // Poeira de estrelas
          star: '#FFFFFF', // Branco estrela
        },
        neon: {
          blue: '#00DDFF', // Azul neon
          purple: '#8A2BE2', // Púrpura neon
          pink: '#FF00C7', // Rosa neon
          green: '#00FFA3', // Verde neon
          yellow: '#FFAA00', // Amarelo neon
          cyan: '#00FFFF', // Ciano neon
        }
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', 'San Francisco', 'Helvetica Neue', 'Helvetica', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        'apple': '10px',
      },
      boxShadow: {
        'apple': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'apple-lg': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        'neon-blue': '0 0 5px #00DDFF, 0 0 10px #00DDFF, 0 0 15px #00DDFF',
        'neon-purple': '0 0 5px #8A2BE2, 0 0 10px #8A2BE2, 0 0 15px #8A2BE2',
        'neon-pink': '0 0 5px #FF00C7, 0 0 10px #FF00C7, 0 0 15px #FF00C7',
        'neon-multi': '0 0 2px #FF00C7, 0 0 4px #8A2BE2, 0 0 6px #00DDFF',
        'galaxy-card': '0 0 15px rgba(189, 0, 255, 0.3), 0 0 30px rgba(0, 221, 255, 0.2)',
      },
      backgroundImage: {
        'galaxy-gradient': 'linear-gradient(to bottom right, #050714, #0c1445, #291854, #481380)',
        'nebula-gradient': 'linear-gradient(135deg, #050714 0%, #0c1445 25%, #291854 50%, #481380 75%, #6225E6 100%)',
        'stars': 'radial-gradient(#FFFFFF, transparent 1px)',
        'neon-border': 'linear-gradient(90deg, #00DDFF, #8A2BE2, #FF00C7, #00DDFF)',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
        starPulse: {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.5 },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        borderGlow: {
          '0%, 100%': { borderColor: '#00DDFF' },
          '33%': { borderColor: '#8A2BE2' },
          '66%': { borderColor: '#FF00C7' },
        },
      },
      animation: {
        shimmer: 'shimmer 6s linear infinite',
        starPulse: 'starPulse 3s ease-in-out infinite',
        float: 'float 6s ease-in-out infinite',
        borderGlow: 'borderGlow 6s linear infinite',
      },
    },
  },
  plugins: [],
} 