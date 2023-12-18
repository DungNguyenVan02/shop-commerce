import { Link } from "react-router-dom";
import Search from "../../../components/Search";
import images from "../../../assets/images";
import icons from "../../../utils/icons";
import routes from "../../../config/routes";
import { useSelector } from "react-redux";
import { userSelector } from "../../../redux/selector";

function Header() {
	const { FaShoppingCart, FaCircleUser } = icons;
	const { isLogin, currentUser } = useSelector(userSelector);

	console.log(isLogin, currentUser);
	return (
		<header className="w-full flex flex-col items-center">
			<div className="w-full h-[38px] bg-main">
				<div className="max-w-main w-full h-full mx-auto px-5 flex items-center justify-between text-[12px] text-white">
					<div>
						<span>ORDER ONLINE OR CALL US (+1800) 000 8808</span>
					</div>
					<div>
						<Link
							to={routes.login}
							className="cursor-pointer hover:opacity-70"
						>
							Sign In or Create Account
						</Link>
					</div>
				</div>
			</div>
			<div className="max-w-main w-full px-5 h-[110px] flex justify-between items-center py-[35px] border-b">
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
			</div>
		</header>
	);
}

export default Header;
