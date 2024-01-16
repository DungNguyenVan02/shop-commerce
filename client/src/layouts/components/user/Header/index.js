import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search } from "~/components/SectionLayout";
import images from "~/assets/images";
import icons from "~/utils/icons";
import routes from "~/config/routes";
import { useSelector } from "react-redux";
import { userSelector as selector } from "~/redux/selector";
import { getCurrentUser } from "~/redux/asyncActions";
import { useDispatch } from "react-redux";
import { logout, clearMes } from "~/redux/userSlice";
import Swal from "sweetalert2";

function Header() {
	const navigate = useNavigate();
	const dispatch = useDispatch();

	const [isHover, setIsHover] = useState(false);
	const { FaShoppingCart, FaCircleUser } = icons;
	const { isLogin, currentUser, mes } = useSelector(selector);

	useEffect(() => {
		if (isLogin) {
			dispatch(getCurrentUser());
		}
	}, [isLogin, dispatch]);

	useEffect(() => {
		if (mes)
			Swal.fire("Oops!", mes, "info").then(() => {
				dispatch(clearMes());
				navigate(`${routes.login}`);
			});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [mes]);

	const handleLogout = () => {
		dispatch(logout());
		navigate(routes.home);
	};

	return (
		<header className="w-full flex flex-col items-center">
			<div className="w-full h-[38px] bg-main">
				<div className="max-w-main w-full h-full mx-auto px-5 flex items-center justify-between text-[12px] text-white">
					<div>
						<span>ORDER ONLINE OR CALL US (+1800) 000 8808</span>
					</div>
					{isLogin && currentUser ? (
						<div
							className="relative flex items-center gap-2 cursor-pointer opacity-85"
							onMouseEnter={() => setIsHover(true)}
							onMouseLeave={() => setIsHover(false)}
						>
							<FaCircleUser size={24} />
							<h2>{`${currentUser?.firstName} ${currentUser?.lastName}`}</h2>
							{isHover && (
								<ul
									className="absolute top-[30px] w-[140px] right-0 py-2 bg-white
							 text-gray-900 rounded-md shadow-md text-[14px] z-20 subArrow"
								>
									<li className="px-3 py-2 hover:bg-slate-100 cursor-pointer hover:text-blue-400">
										<Link
											to={
												currentUser?.role === 1974
													? routes.admin_dashboard
													: routes.member
											}
										>
											My account
										</Link>
									</li>
									<li className="px-3 py-2 hover:bg-slate-100 cursor-pointer hover:text-blue-400">
										My purchase
									</li>
									<li
										onClick={handleLogout}
										className="px-3 py-2 hover:bg-slate-100 cursor-pointer hover:text-blue-400"
									>
										Logout
									</li>
								</ul>
							)}
						</div>
					) : (
						<div className="flex gap-2">
							<Link
								to={routes.register}
								className="cursor-pointer hover:opacity-70"
							>
								Sign up
							</Link>
							<span className="opacity-60">|</span>
							<Link
								to={routes.login}
								className="cursor-pointer hover:opacity-70"
							>
								Login
							</Link>
						</div>
					)}
				</div>
			</div>
			<div className="max-w-main w-full px-5 h-[110px] flex justify-between items-center py-[35px] border-b gap-[60px]">
				<Link to={routes.home}>
					<img
						className="w-[234px] object-contain flex-1"
						src={images.logo}
						alt="digital world"
					/>
				</Link>
				<Search />
				<div className="relative cursor-pointer opacity-85">
					<FaShoppingCart size={24} />
					<span className=" w-5 h-5 bg-main text-center text-white text-[14px] rounded-full absolute top-[-10px] left-3">
						1
					</span>
				</div>
			</div>
		</header>
	);
}

export default Header;
