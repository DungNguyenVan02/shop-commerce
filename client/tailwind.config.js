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
				overlay: "rgba(0,0,0,0.6)",
			},
			colors: {
				main: "#ee3131",
				star: "#f1b400",
			},

			keyframes: {
				slideTop: {
					"0%": {
						"-webkit-transform": "translateY(0) translateX(-50%);",
						transform: "translateY(0) translateX(-50%);",
					},
					"100%": {
						"-webkit-transform":
							"translateY(-50%) translateX(-50%);",
						transform: "translateY(-50%) translateX(-50%);",
					},
				},
				slideTopInput: {
					"0%": {
						"-webkit-transform": "translateY(100%);",
						transform: "translateY(100%);",
					},
					"100%": {
						"-webkit-transform": "translateY(0);",
						transform: "translateY(0);",
					},
				},

				textGradient: {
					"0%, 100%": {
						"background-size": "200% 200%",
						"background-position": "left center",
					},
					"50%": {
						"background-size": "200% 200%",
						"background-position": "right center",
					},
				},
			},
			animation: {
				slideTop:
					"slideTop 0.4s cubic-bezier(0.250, 0.460, 0.450, 0.940) both;",
				slideTopInput: "slideTopInput 0.2s linear forwards",
				textGradient: "textGradient 3s ease infinite",
			},
			borderRadius: {
				custom: "37% 63% 100% 0% / 33% 0% 100% 67% ",
			},
		},
	},
	plugins: [],
};
