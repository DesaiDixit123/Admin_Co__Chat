/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      screens: {
        'xs': '450px',
        // => @media (min-width: 450px) { ... }
        'sm': '640px',
        // => @media (min-width: 640px) { ... }
        'md': '768px',
        // => @media (min-width: 768px) { ... }
        'lg': '1024px',
        // => @media (min-width: 1024px) { ... }
        'xl': '1280px',
        // => @media (min-width: 1280px) { ... }
        '2xl': '1536px',
        // => @media (min-width: 1536px) { ... }
        '3xl': '1670px',

      },
      colors: {
        'primary': '#183A6B',
        'g1': '#0B1727',
        'g2': '#232E3C',
        'g3': '#344050',
        'g4': '#4D5969',
        'g5': '#5E6E82',
        'g6': '#748194',
        'g7': '#9DA9BB',
        'l1': '#B6C1D2',
        'l2': '#D8E2EF',
        'l3': '#EDF2F9',
        'l4': '#F9FAFD',
        'green': '#18904E',
        'error': '#B01212',
        'red': '#FF3B30',



      },
      fontSize: {
        '12': ['12px', '20px'],
        '14': ['14px', '20px'],
        '16': ['16px', '26px'],
        '18': ['18px', '24px'],
        '20': ['20px', '28px'],
        '22': ['22px', '30px'],
        '24': ['24px', '32px'],
        '26': ['26px', '36px'],
        '28': ['28px', '36px'],
        '30': ['30px', '40px'],
        '32': ['32px', '42px'],
        '36': ['36px', '46px'],
        '48': ['48px', '56px'],
      },
      fontFamily: {
        'pop': ['Poppins', 'sans-serif'],
        'dm': ['DM Sans', 'sans-serif'],

      },


    },
  },
  plugins: [],
}

