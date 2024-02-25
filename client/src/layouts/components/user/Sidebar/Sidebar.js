import { NavLink } from "react-router-dom";

import icons from "~/utils/icons";
import { createSlug } from "~/utils/helper";
import { useSelector } from "react-redux";
import { appSelector } from "~/redux/selector";
function Sidebar() {
	const { categories } = useSelector(appSelector);

	const {
		FaList,
		IoIosPhonePortrait,
		FaTabletAlt,
		FaLaptop,
		AiFillPrinter,
		FaHeadphonesSimple,
		CiCamera,
		SlScreenDesktop,
		BsSpeaker,
	} = icons;

	const iconsTop = [
		IoIosPhonePortrait,
		FaTabletAlt,
		FaLaptop,
		BsSpeaker,
		SlScreenDesktop,
		AiFillPrinter,
		CiCamera,
		FaHeadphonesSimple,
	];

	return (
		<aside className="w-full">
			<div className="flex flex-col border">
				<h3 className="flex items-center text-4 py-[10px] px-[20px] bg-main text-white font-semibold">
					<i className="pr-2">
						<FaList />
					</i>
					ALL COLLECTIONS
				</h3>
				{categories?.map((category, i) => {
					const Icon = iconsTop[i];
					return (
						<NavLink
							to={categories?.slug || createSlug(category.name)}
							key={category._id}
							className={({ isActive }) =>
								isActive
									? "flex items-center text-4 py-[12px] px-[20px] text-main hover:bg-slate-100 gap-3"
									: "flex items-center text-4 py-[12px] px-[20px] hover:text-main hover:bg-slate-100 gap-3"
							}
						>
							<Icon />
							{category.name}
						</NavLink>
					);
				})}
			</div>
		</aside>
	);
}

export default Sidebar;
