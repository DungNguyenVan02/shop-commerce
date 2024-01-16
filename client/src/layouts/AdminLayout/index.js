import images from "~/assets/images";
import Sidebar from "../components/admin/Sidebar";
import { useSelector } from "react-redux";
import { userSelector } from "~/redux/selector";

function AdminLayout({ children }) {
	const { currentUser } = useSelector(userSelector);
	return (
		<div className="relative">
			<header className="fixed top-0 left-0 right-0 z-10 h-[50px] flex justify-between items-center bg-blue-500 shadow-sm px-5">
				<img
					className="w-[200px] h-[30px]"
					src={images.logo}
					alt="logo"
				/>
				<div className="flex items-center text-[14px] text-white gap-2">
					<img
						src={images.avatarDefault}
						alt="admin"
						className="w-[34px] h-[34px] rounded-full object-cover"
					/>
					<h3>{`${currentUser.firstName} ${currentUser.lastName}`}</h3>
				</div>
			</header>
			<div className="w-full min-h-screen mt-[50px] flex">
				<div className="bg-white shadow-lg fixed top-0 left-0 bottom-0 w-[240px] mt-[60px]">
					<Sidebar />
				</div>
				<div className=" flex-1 ml-[240px]">{children}</div>
			</div>
		</div>
	);
}

export default AdminLayout;
