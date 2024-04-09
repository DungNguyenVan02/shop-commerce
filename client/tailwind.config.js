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
			boxShadow: {
				custom: "rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 2px 6px 2px;",
				custom_1:
					"rgba(17, 17, 26, 0.05) 0px 1px 0px, rgba(17, 17, 26, 0.1) 0px 0px 8px;",
			},
			backgroundImage: {
				gradient: "linear-gradient(45deg, #185a9d 10%, #43cea2 100%);",
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

				scaleUpTopRight: {
					"0%": {
						"-webkit-transform": "scale(0.5);",
						transform: "scale(0.5);",
						"-webkit-transform-origin": "100% 0% ;",
						"transform-origin": "100% 0% ;",
					},
					"100%": {
						"-webkit-transform": "scale(1);",
						transform: "scale(1);",
						"-webkit-transform-origin": "100% 0% ;",
						"transform-origin": "100% 0% ;",
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

				slideTopForm: {
					"0%": {
						"-webkit-transform": "translateY(0);",
						transform: "translateY(0);",
					},
					"100%": {
						"-webkit-transform": "translateY(-100px);",
						transform: "translateY(-100px);",
					},
				},

				slideTopLeft: {
					"0%": {
						"-webkit-transform":
							"translateY(20px) translateX(20px);",
						transform: "translateY(20px) translateX(20px);",
					},
					" 100%": {
						"-webkit-transform": "translateY(0) translateX(0);",
						transform: "translateY(0) translateX(0);",
					},
				},

				slideHide: {
					"0% offset": {
						"-webkit-transform":
							"translateZ(0) translateY(0) translateX(0);",
						transform: "translateZ(0) translateY(0) translateX(0);",
					},
					" 100%": {
						"-webkit-transform":
							"translateZ(-400px) translateY(200px) translateX(200px);",
						transform:
							"translateZ(-400px) translateY(200px) translateX(200px);",
					},
				},
			},
			animation: {
				slideTopForm:
					"slideTopForm 0.5s cubic-bezier(0.250, 0.460, 0.450, 0.940) both;",
				slideTop:
					"slideTop 0.4s cubic-bezier(0.250, 0.460, 0.450, 0.940) both;",
				slideTopInput: "slideTopInput 0.2s linear forwards",
				textGradient: "textGradient 3s ease infinite",
				scaleUpTopRight:
					"scaleUpTopRight 0.2s cubic-bezier(0.390, 0.575, 0.565, 1.000) both",
				slideTopLeft:
					"slideTopLeft 0.5s cubic-bezier(0.250, 0.460, 0.450, 0.940) both;",
				slideHide:
					"slideHide 0.45s cubic-bezier(0.470, 0.000, 0.745, 0.715) both;",
			},

			borderRadius: {
				custom: "37% 63% 100% 0% / 33% 0% 100% 67% ",
			},
		},
	},
	plugins: [],
};
