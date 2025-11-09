/** @type {import('tailwindcss').Config} */

module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}', // Учитывать все файлы в папке app
    './pages/**/*.{js,ts,jsx,tsx}', // Учитывать все файлы в папке pages
    './shared/components/**/*.{js,ts,jsx,tsx}', // Учитывать файлы в components
    './src/**/*.{html,js}', // Если у вас есть src или статичные HTML
  ],
  theme: {
    extend: {
      borderRadius: {
        '6xl': '50px',
      },
      dropShadow: {
        '3xl': '0px 0px 10px rgba(26, 27, 30, 1)',
      },
      fontSize: {
        title: '26px',
      },
      fontFamily: {
        rubik: ['"Rubik"', 'sans-serif'],
      },
      colors: {
        accent: '#DDEF5B',
        accentSoft: '#448BD4',

        primary: '#F0EFF0', // цвет текста
        muted: '#8D8D93', // цвет текста 2

        bgPrimary: '#848484',
        bgBase: '#1A1A1A', // цвет блоков
        bgMuted: '#2C2E30',
        bgSoft: '#3D3D3D', // фон для светлых поверхностей, например, полей ввода
        bgSurface: '#262E37',

        DayOne: '#FF9500',
        DayTwo: '#00C7BE',
        DayThree: '#34C759',
        DayFour: '#6750A4',
        DayFive: '#007AFF',
        DaySix: '#C00F0C',
        DaySeven: '#682D03',
        DayEight: '#F19EDC',

        customBorder: 'rgba(112, 114, 116, 0.5)',
      },
    },
  },
  safelist: [
    'bg-DayOne',
    'bg-DayTwo',
    'bg-DayThree',
    'bg-DayFour',
    'bg-DayFive',
    'bg-DaySix',
    'bg-DaySeven',
    'bg-DayEight',
  ],
};
