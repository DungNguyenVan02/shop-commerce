import { Link } from "react-router-dom";
import Search from "../../../components/Search";
import images from "../../../assets/images";
import icons from "../../../utils/icons";
import routes from "../../../config/routes";

function Header() {
	const { FaShoppingCart, FaCircleUser } = icons;
	return (
		<header className="h-[110px] flex justify-between items-center border-b py-[35px]">
			<Link to={routes.home}>
				<img
					className="w-[234px] object-contain"
					src={images.logo}
					alt="digital world"
				/>
			</Link>
			<Search />
			<div className="flex items-center gap-7">
				<div className="relative cursor-pointer">
					<FaShoppingCart size={24} />
					<span className=" w-5 h-5 bg-main text-center text-white text-[14px] rounded-full absolute top-[-10px] left-3">
						1
					</span>
				</div>
				<div className="cursor-pointer">
					<FaCircleUser size={24} />
				</div>
			</div>
		</header>
	);
}

export default Header;
