/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      listStyleType: {
        alpha: 'lower-alpha',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      colors: {
        primary: '#3FB648', // Replace with your desired primary color
        green: '#6CB28E',
        menu: '#d6f0cb',

      },
      fontWeight: {
        // fontc: ['Briem Hand', 'cursive'],
        // curtom: ['Noto Sans KR', 'sans-serif'],
      },
      fontFamily: {
        'sans': ['Poppins', 'sans-serif'],
        lato: ['Lato', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
