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
		},
	},
	plugins: [],
};
