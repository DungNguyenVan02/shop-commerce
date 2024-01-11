const routes = {
	all: "*",
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

	// Admin
	admin: "/admin",
	dashboard: "/dashboard",
	manage_users: "/manage-users",
	manage_products: "/manage-products",
	manage_orders: "/manage-order",
	create_product: "/create-product",

	// Member
	member: "/member",
};

export default routes;
