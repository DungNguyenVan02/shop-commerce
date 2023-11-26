import routes from "../config/routes";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Product from "../pages/Product";
const publicRoutes = [
	{
		path: routes.home,
		component: Home,
	},
	{
		path: routes.product,
		component: Product,
	},
	{
		path: routes.login,
		component: Login,
	},
];

const privateRoutes = [];
export { publicRoutes, privateRoutes };
