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
import ManageOrder from "~/pages/admin/ManageOrder";
import ManageUsers from "~/pages/admin/ManageUsers";
import Member from "~/pages/public/Member";
import DashBroad from "~/pages/admin/DashBroad";
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
		path: routes.admin_dashboard,
		component: DashBroad,
		isAdminRoutes: true,
	},

	{
		path: routes.admin_manage_orders,
		component: ManageOrder,
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
		path: routes.member,
		component: Member,
		isMemberRoutes: true,
	},
];

export { publicRoutes };
