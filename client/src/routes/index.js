import routes from "../config/routes";
import Blogs from "../pages/public/Blogs";
import DetailProduct from "../pages/public/DetailProduct";
import FAQs from "../pages/public/FAQs";
import Home from "../pages/public/Home";
import Login from "../pages/public/Login";
import OurService from "../pages/public/OurService";
import Products from "../pages/public/Products";
import Register from "../pages/public/Register";
import ResetPassword from "../pages/public/ResetPassword";
import { CreateProduct, ManageProducts } from "~/pages/admin/ManageProducts";
import { Canceled, ListOrder, ReturnOrder } from "~/pages/admin/ManageOrder";
import ManageUsers from "~/pages/admin/ManageUsers";
import DashBroad from "~/pages/admin/DashBroad";
import Cart from "~/pages/public/Cart";
import History from "~/pages/public/History";
import Personal from "~/pages/public/Personal";
import Checkout from "~/pages/public/Checkout";
import CheckoutOnline from "~/pages/public/CheckoutOnline";
import Order from "~/pages/public/Order";
import Wishlist from "~/pages/public/Wishlist";
import Return from "~/pages/public/Return";
import { CreateBlog, ManageBlogs } from "~/pages/admin/ManageBlogs";
import DetailBlog from "~/pages/public/DetailBlog";

const publicRoutes = [
	{
		path: routes.home,
		component: Home,
	},
	{
		path: routes.products,
		component: Products,
	},
	{
		path: routes.login,
		component: Login,
		headerNone: true,
	},
	{
		path: routes.register,
		component: Register,
		headerNone: true,
	},
	{
		path: routes.blogs,
		component: Blogs,
	},
	{
		path: routes.blogs_detail_bid,
		component: DetailBlog,
	},
	{
		path: routes.services,
		component: OurService,
	},
	{
		path: routes.FAQs,
		component: FAQs,
	},
	{
		path: routes.cart,
		component: Cart,
	},
	{
		path: routes.checkout,
		component: Checkout,
	},
	{
		path: routes.checkoutOnline,
		component: CheckoutOnline,
		headerNone: true,
	},
	{
		path: routes.detailProduct_category_pid_name,
		component: DetailProduct,
	},
	{
		path: routes.resetpassword_email,
		component: ResetPassword,
		headerNone: true,
	},

	// Admin
	{
		path: routes.admin_dashboard,
		component: DashBroad,
		isAdminRoutes: true,
	},

	{
		path: routes.admin_manage_orders,
		component: ListOrder,
		isAdminRoutes: true,
	},
	{
		path: routes.admin_manage_blogs,
		component: ManageBlogs,
		isAdminRoutes: true,
	},
	{
		path: routes.admin_create_blog,
		component: CreateBlog,
		isAdminRoutes: true,
	},
	{
		path: routes.admin_manage_return,
		component: ReturnOrder,
		isAdminRoutes: true,
	},
	{
		path: routes.admin_manage_canceled,
		component: Canceled,
		isAdminRoutes: true,
	},
	{
		path: routes.admin_manage_products,
		component: ManageProducts,
		isAdminRoutes: true,
	},
	{
		path: routes.admin_create_product,
		component: CreateProduct,
		isAdminRoutes: true,
	},
	{
		path: routes.admin_manage_users,
		component: ManageUsers,
		isAdminRoutes: true,
	},

	// Member
	{
		path: routes.member_personal,
		component: Personal,
		isMemberRoutes: true,
	},
	{
		path: routes.member_cart,
		component: Cart,
		isMemberRoutes: true,
	},
	{
		path: routes.member_wishlist,
		component: Wishlist,
		isMemberRoutes: true,
	},
	{
		path: routes.member_order,
		component: Order,
		isMemberRoutes: true,
	},
	{
		path: routes.member_return,
		component: Return,
		isMemberRoutes: true,
	},
	{
		path: routes.member_history,
		component: History,
		isMemberRoutes: true,
	},
];

export { publicRoutes };
