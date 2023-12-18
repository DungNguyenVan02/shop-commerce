import { NavLink } from "react-router-dom";
import routes from "../../../config/routes";
import icons from "../../../utils/icons";
function Navigation() {
	const NAVIGATION = [
		{
			id: 1,
			name: "HOME",
			path: routes.home,
		},
		{
			id: 2,
			name: "PRODUCT",
			path: routes.products,
		},
		{
			id: 3,
			name: "BLOGS",
			path: routes.blogs,
		},
		{
			id: 4,
			name: "OUR SERVICES",
			path: routes.services,
		},
		{
			id: 5,
			name: "FAQs",
			path: routes.FAQs,
		},
	];

	const { IoMdArrowDropdown } = icons;
	return (
		<nav className="max-w-main w-full px-5 h-[48px] text-sm border-b flex items-center gap-7">
			{NAVIGATION.map((item) => (
				<NavLink
					to={item.path}
					key={item.id}
					className={({ isActive }) =>
						isActive
							? "flex items-center gap-1 text-main"
							: "flex items-center gap-1 hover:text-main"
					}
				>
					{item.name}
					<IoMdArrowDropdown />
				</NavLink>
			))}
		</nav>
	);
}

export default Navigation;
