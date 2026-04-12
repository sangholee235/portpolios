const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
  content: [
    './src/pages/**/*.{js,jsx,tsx}',
    './src/components/**/*.{js,jsx,tsx}',
    './src/app/**/*.{js,jsx,tsx}',
  ],
  theme: {
    colors: {
      // Brand colors
      primary: '#3B3DFF',
      second: '#6283FD',

      // Particular colors
      point: '#FF6A3B',

      // Achromatic colors
      deepbrown: '#5D4A37',
      mediumbrown : '#906C48',
      lightbrown : '#B2975C',
      deepcream: '#F3EE7A',
      mediumcream : '#FDFCC8',
      lightcream : '#FFFFF0',
      deepred: '#9C0716',
      mediumred : '#C41316',
      lightred : '#EB6E6E',
      deepnavy: '#1A2359',
      mediumnavy : '#2E4485',
      lightnavy : '#70C3E4',

      // Additional colors
      background: {
        DEFAULT: '#F8F9FA',
        dark: '#343A40',
      },
    },
    fontFamily: {
      sans: ['Pretendard', ...defaultTheme.fontFamily.sans],
      heading: ['GmarketSans', ...defaultTheme.fontFamily.sans],
    },
    fontSize: {
      h1: '24px', // Head 1
      h2: '20px', // Title 1
      h3: '18px', // Title 2, 3
      h4: '16px', // Title 4, 5, SubTitle 1, Body1
      h5: '15px',
      h6: '14px', // SubTitle 2, Body2, Button
      h7: '12px',
      '2xs': '0.625rem',
      '3xs': '0.5rem',
    },
    screens: {
      sm: '375px',    // sm을 375px로 설정
      md: '700px',    // md를 700px로 설정
      lg: '1080px',   // lg를 1080px로 설정
      xl: '1440px',   // xl을 1440px로 설정
      '2xl': '1800px' // 2xl을 1800px로 설정
    },
    extend: {
      spacing: {
        '4.5': '1.125rem',
        '5.5': '1.375rem',
      },
      borderRadius: {
        '4xl': '2rem',
      },
    },
  },
  plugins: [],
};
