const routes = {
	all: "*",
	home: "/",
	products: "/products",
	products_slug: "/products/:slug",
	products_slug_brand: "/products/:slug/:brand",

	login: "/login",
	register: "/register",
	blogs: "/blogs",
	blogs_detail_bid: "/blogs/detail/:bid",
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
	admin_manage_blogs: "/admin/manage-blogs",
	admin_create_blog: "/admin/create-blog",
	admin_create_product: "/admin/create-product",
	admin_manage_products: "/admin/manage-products",
	admin_manage_return: "/admin/manage-return",
	admin_manage_canceled: "/admin/manage-canceled",

	// Member
	member_personal: "/member/personal",
	member_cart: "/member/cart",
	member_wishlist: "/member/wishlist",
	member_order: "/member/order",
	member_return: "/member/return-refund",
	member_history: "/member/history",
};

export default routes;
