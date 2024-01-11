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
import ManageOrder from "~/pages/admin/ManageProducts";
import ManageProducts from "~/pages/admin/ManageProducts";
import ManageUsers from "~/pages/admin/ManageUsers";
import Admin from "~/pages/admin/Admin";
import Member from "~/pages/public/Member";
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
		path: routes.services,
		component: OurService,
	},
	{
		path: routes.FAQs,
		component: FAQs,
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
		path: routes.admin,
		component: Admin,
		isAdminRoutes: true,
	},

	{
		path: routes.manage_orders,
		component: ManageOrder,
		isAdminRoutes: true,
	},
	{
		path: routes.manage_products,
		component: ManageProducts,
		isAdminRoutes: true,
	},
	{
		path: routes.manage_users,
		component: ManageUsers,
		isAdminRoutes: true,
	},

	// Member
	{
		path: routes.member,
		component: Member,
		isMemberRoutes: true,
	},
];

export { publicRoutes };
