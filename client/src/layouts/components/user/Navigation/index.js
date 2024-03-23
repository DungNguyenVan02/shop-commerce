import { NavLink } from "react-router-dom";
import routes from "~/config/routes";
import icons from "~/utils/icons";
function Navigation() {
	const NAVIGATION = [
		{
			id: 1,
			name: "Trang chủ",
			path: routes.home,
		},
		{
			id: 2,
			name: "Sản phẩm",
			path: routes.products,
		},
		{
			id: 3,
			name: "Bài viết",
			path: routes.blogs,
		},
		{
			id: 4,
			name: "Dịch vụ",
			path: routes.services,
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
