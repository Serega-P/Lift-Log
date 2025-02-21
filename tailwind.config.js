/** @type {import('tailwindcss').Config} */


module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}", // Учитывать все файлы в папке app
    "./pages/**/*.{js,ts,jsx,tsx}", // Учитывать все файлы в папке pages
    "./components/**/*.{js,ts,jsx,tsx}", // Учитывать файлы в components
    "./src/**/*.{html,js}", // Если у вас есть src или статичные HTML
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
        accent: '#34C759',
        accentSoft: '#6FCF97',

        primary: '#E8EAEE', // цвет текста
        muted: '#707274',   // цвет текста 2
				
        bgPrimary: '#1F2125',
        bgBase: '#27292B',
        bgMuted: '#2C2E30',
        bgSoft: '#3B4043',
        bgSurface: '#252A34', // фон для светлых поверхностей, например, полей ввода

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
    "bg-DayOne",
    "bg-DayTwo",
    "bg-DayThree",
    "bg-DayFour",
    "bg-DayFive",
    "bg-DaySix",
    "bg-DaySeven",
    "bg-DayEight",
  ],
};