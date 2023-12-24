import routes from "../config/routes";
import Blogs from "../pages/Blogs";
import DetailProduct from "../pages/DetailProduct";
import FAQs from "../pages/FAQs";
import FinalRegister from "../pages/FinalRegister";
import Home from "../pages/Home";
import Login from "../pages/Login";
import OurService from "../pages/OurService";
import Products from "../pages/Products";
import Register from "../pages/Register";
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
		path: routes.detailProduct_pid_name,
		component: DetailProduct,
	},
	{
		path: routes.finalRegister,
		component: FinalRegister,
	},
];

const privateRoutes = [];
export { publicRoutes, privateRoutes };
