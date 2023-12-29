const routes = {
	home: "/",
	products: "/:category",
	login: "/login",
	register: "/register",
	blogs: "/blogs",
	services: "/services",
	FAQs: "/FAQs",

	resetpassword: "/resetpassword",
	resetpassword_email: "/resetpassword/:email",

	detailProduct_category_pid_name: "/:category/:pid/:name",
};

export default routes;
