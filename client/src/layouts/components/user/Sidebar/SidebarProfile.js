import React, { Fragment, useMemo, useState } from "react";
import { NavLink } from "react-router-dom";
import { memberSlideBar } from "~/utils/contains";
import { useSelector } from "react-redux";
import { userSelector } from "~/redux/selector";
import images from "~/assets/images";
import icons from "~/utils/icons";
import routes from "~/config/routes";

const SidebarProfile = () => {
	const [isShowSubMenu, setIsShowSubMenu] = useState([]);
	const { currentUser } = useSelector(userSelector);
	const { FaPen } = icons;

	const handleShowSubMenu = (tabId) => {
		if (isShowSubMenu.includes(tabId)) {
			setIsShowSubMenu(isShowSubMenu.filter((item) => item !== tabId));
		} else {
			setIsShowSubMenu((prev) => [...prev, tabId]);
		}
	};

	const isActiveMenu = useMemo(() => {
		return "px-5 py-2 flex items-center gap-4 transition-all text-main";
	}, []);
	const isNotActiveMenu = useMemo(() => {
		return "px-5 py-2 flex items-center gap-4 transition-all hover:text-main";
	}, []);

	return (
		<div className="flex flex-col p-2">
			<div className="flex items-center justify-center gap-2 p-2 border-b mb-[24px]">
				<img
					loading="lazy"
					className="w-[50px] h-[50px] object-cover rounded-full shadow-lg"
					src={currentUser?.image || images.avatarDefault}
					alt="avatar"
				/>
				<div>
					<h3 className="font-semibold text-[#333]">
						{currentUser?.fullName}
					</h3>
					<NavLink
						to={routes.member_personal}
						className="flex items-center gap-1 cursor-pointer"
					>
						<FaPen color="#888" />
						<h4 className="text-[#888]">Edit profile</h4>
					</NavLink>
				</div>
			</div>
			{memberSlideBar.map((el) => {
				return (
					<Fragment key={el.id}>
						<NavLink
							className={({ isActive }) =>
								isActive ? isActiveMenu : isNotActiveMenu
							}
							onClick={() => handleShowSubMenu(el.id)}
							to={el.path}
						>
							<>
								<span>{el.icon}</span>
								<span>{el.title}</span>
							</>
						</NavLink>
					</Fragment>
				);
			})}
		</div>
	);
};

export default SidebarProfile;
