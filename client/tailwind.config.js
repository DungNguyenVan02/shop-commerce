/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ["./src/**/*.{html,js}", "./public/index.html"],
	theme: {
		extend: {
			fontFamily: {
				main: ["Poppins", "sans-serif"],
			},
			maxWidth: {
				main: "1220px",
			},
			backgroundColor: {
				main: "#ee3131",
			},
			colors: {
				main: "#ee3131",
				star: "#f1b400",
			},
			keyframes: {
				slideTop: {
					"0%": {
						"-webkit-transform": "translateY(40px);",
						transform: "translateY(40px);",
					},
					"100%": {
						"-webkit-transform": "translateY(0);",
						transform: "translateY(0);",
					},
				},
			},
			animation: {
				slideTop:
					"slideTop 0.4s  cubic-bezier(0.250, 0.460, 0.450, 0.940) both;",
			},
		},
	},
	plugins: [],
};
