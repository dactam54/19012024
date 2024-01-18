/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      backgroundColor: {
        main: '#d70018',
        'overlay-70': 'rgba(0,0,0,0.7)',
        'overlay-30': 'rgba(0,0,0,0.3)',
        main1: '#FECDA6  '
      },
      colors: {
        main: '#d70018',
      },
      width: {
        main: '1220px'
      },
      keyframes: {
        'scale-up-center': {
          '0%': {
            '-webkit-transform': 'scale(0);',
            transform: 'scale(0);'
          },
          '100%': {
            '-webkit-transform': 'scale(1);',
            transform: 'scale(1);'
          }
        },
        'slide-left': {
          '0%': {
            '-webkit-transform': 'translateX(300px);',
            transform: 'translateX(300px);'
          },
          '100%': {
            '-webkit-transform': 'translateX(0);',
            transform: 'translateX(0);'
          }
        },
        'slide-top': {
          '0%': {
            '-webkit-transform': 'translateY(15px);',
            transform: 'translateY(15px);'
          },
          '100%': {
            '-webkit-transform': 'translateY(0);',
            transform: 'translateY(0);'
          }
        }
      },
      animation: {
        'scale-up-center': 'scale-up-center 0.4s cubic-bezier(0.390, 0.575, 0.565, 1.000) both;',
        'slide-left': 'slide-left 0.5s cubic-bezier(0.250, 0.460, 0.450, 0.940) both;',
        'slide-top': 'slide-top 0.3s cubic-bezier(0.250, 0.460, 0.450, 0.940) both;',
      }
    },
  },
  plugins: [
    require('@tailwindcss/line-clamp')
  ],
}