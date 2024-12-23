/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      transitionDuration: {
        DEFAULT: '300ms'
      },
      width: {
        '100':'25rem',
        '104':'26rem',
        '108':'27rem',
        'lg':'32rem'
      },
      screens: {
        '3xl':'1920px'
      }
    },
  },
  plugins: [],
}

