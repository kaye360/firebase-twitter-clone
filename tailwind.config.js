/** @type {import('tailwindcss').Config} */
module.exports = {
	content: [
		"./src/**/*.{js,jsx,ts,tsx}",
	],
	theme: {
		extend: {
			animation: {
				'fade-in': 'fade-in 250ms linear both',
				'bounce-up-in': 'bounce-up-in cubic-bezier(0.34, 1.56, 0.64, 1) 350ms '
			},
			keyframes: {
				'fade-in': {
					'0%': { opacity: '0' },
					'100%': { opacity: '1' }
				},
				'bounce-up-in' : {
					'0%' : { transform: 'translateY(50%)' },
					'100%' : { transform: 'translateY(0)' }
				}
			}
      	},
	},
	plugins: [],
}