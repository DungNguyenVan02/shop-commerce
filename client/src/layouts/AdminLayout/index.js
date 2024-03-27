import images from "~/assets/images";
import Sidebar from "../components/admin/Sidebar";
import { useSelector } from "react-redux";
import { userSelector } from "~/redux/selector";
import { Link } from "react-router-dom";
import routes from "~/config/routes";
import Logo from "~/components/Logo";

function AdminLayout({ children }) {
	const { currentUser } = useSelector(userSelector);
	return (
		<div className="relative">
			<header className="fixed top-0 left-0 right-0 z-[9999] h-[50px] flex justify-between items-center bg-blue-500 shadow-sm px-5">
				<Link to={routes.home}>
					<Logo />
				</Link>
				<div className="flex items-center text-[14px] text-white gap-2">
					<img
						src={images.avatarDefault}
						alt="admin"
						className="w-[34px] h-[34px] rounded-full object-cover"
					/>
					<h3>{currentUser.fullName}</h3>
				</div>
			</header>
			<div className="w-full mt-[50px] flex">
				<div className="bg-white shadow-lg fixed top-0 left-0 bottom-0 w-[240px] mt-[50px] z-30">
					<Sidebar />
				</div>
				<div className="relative flex-1 ml-[240px]">{children}</div>
			</div>
		</div>
	);
}

export default AdminLayout;
