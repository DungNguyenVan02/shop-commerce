const routes = {
	all: "*",
	home: "/",
	products: "/:category",
	login: "/login",
	register: "/register",
	blogs: "/blogs",
	services: "/services",
	FAQs: "/FAQs",
	cart: "/cart",
	resetpassword: "/resetpassword",
	resetpassword_email: "/resetpassword/:email",
	detailProduct_category_pid_name: "/:category/:pid/:name",
	checkout: "/checkout",
	checkoutOnline: "/checkout-online",

	// Admin
	admin_dashboard: "/admin/dashboard",
	admin_manage_users: "/admin/manage-users",
	admin_manage_orders: "/admin/manage-order",
	admin_create_product: "/admin/create-product",
	admin_manage_products: "/admin/manage-products",

	// Member
	member_personal: "/member/personal",
	member_cart: "/member/cart",
	member_order: "/member/order",
	member_history: "/member/history",
};

export default routes;
