import routes from "../config/routes";
import Blogs from "../pages/Blogs";
import DetailProduct from "../pages/DetailProduct";
import FAQs from "../pages/FAQs";
import Home from "../pages/Home";
import Login from "../pages/Login";
import OurService from "../pages/OurService";
import Products from "../pages/Products";
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
];

const privateRoutes = [];
export { publicRoutes, privateRoutes };
