import { adminSlideBar } from "~/utils/contains";
import { NavLink } from "react-router-dom";
import { Fragment, useMemo, useState } from "react";
import icons from "~/utils/icons";
function Sidebar() {
	const { HiOutlineChevronDown, HiOutlineChevronRight } = icons;
	const [isShowSubMenu, setIsShowSubMenu] = useState([]);

	const handleShowSubMenu = (tabId) => {
		if (isShowSubMenu.includes(tabId)) {
			setIsShowSubMenu(isShowSubMenu.filter((item) => item !== tabId));
		} else {
			setIsShowSubMenu((prev) => [...prev, tabId]);
		}
	};

	const isActiveMenu = useMemo(() => {
		return "px-5 py-2 flex items-center gap-4 transition-all bg-blue-500 text-white";
	}, []);
	const isNotActiveMenu = useMemo(() => {
		return "px-5 py-2 flex items-center gap-4 transition-all hover:bg-gray-100";
	}, []);

	return (
		<div className="flex flex-col">
			{adminSlideBar.map((el) => {
				return (
					<Fragment key={el.id}>
						{!el.children ? (
							<NavLink
								to={el.path}
								className={({ isActive }) =>
									isActive ? isActiveMenu : isNotActiveMenu
								}
							>
								<span>{el.icon}</span>
								<span>{el.title}</span>
							</NavLink>
						) : (
							<div>
								<div
									className="flex items-center gap-3 px-5 py-2 cursor-pointer hover:bg-gray-100"
									onClick={() => handleShowSubMenu(el.id)}
								>
									<>
										<span>{el.icon}</span>
										<span>{el.title}</span>
									</>
									{isShowSubMenu.includes(el.id) ? (
										<HiOutlineChevronDown />
									) : (
										<HiOutlineChevronRight />
									)}
								</div>
								{isShowSubMenu.includes(el.id) &&
									el.children.map((sub) => (
										<div key={sub.id}>
											<NavLink
												to={sub.path}
												className={({ isActive }) =>
													isActive
														? `${isActiveMenu} pl-[56px] py-1 text-[14px]`
														: `${isNotActiveMenu} pl-[54px] py-1 text-[14px]`
												}
											>
												{sub.title}
											</NavLink>
										</div>
									))}
							</div>
						)}
					</Fragment>
				);
			})}
		</div>
	);
}

export default Sidebar;
