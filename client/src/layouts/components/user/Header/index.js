import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search } from "~/components/common";
import icons from "~/utils/icons";
import routes from "~/config/routes";
import { useSelector } from "react-redux";
import { userSelector } from "~/redux/selector";
import { getCurrentUser } from "~/redux/asyncActions";
import { useDispatch } from "react-redux";
import { logout, clearMes } from "~/redux/userSlice";
import Swal from "sweetalert2";
import { Cart } from "~/components/Product";
import Logo from "~/components/Logo";
import Headroom from "react-headroom";

function Header() {
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const [isHover, setIsHover] = useState(false);
	const { BsCart3, FaCircleUser } = icons;
	const { isLogin, currentUser, mes } = useSelector(userSelector);

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
		<div className="w-full z-[99999999999999999]">
			<Headroom
				style={{
					WebkitTransition: "all .5s ease-in-out",
					MozTransition: "all .5s ease-in-out",
					OTransition: "all .5s ease-in-out",
					transition: "all .5s ease-in-out",
				}}
			>
				<header className="w-full flex flex-col items-center bg-white  shadow-sm">
					<div className="w-full h-[38px] bg-main">
						<div className="max-w-main w-full h-full mx-auto px-5 flex items-center justify-between text-[12px] text-white">
							<div>
								<span>
									Liên hệ đặt hàng với chúng tôi: 0398967140
								</span>
							</div>
							{isLogin && currentUser ? (
								<div
									className="relative flex items-center gap-2 cursor-pointer opacity-85"
									onMouseEnter={() => setIsHover(true)}
									onMouseLeave={() => setIsHover(false)}
								>
									<FaCircleUser size={24} />
									<h2>{currentUser?.fullName}</h2>
									{isHover && (
										<ul
											className="absolute top-[30px] min-w-[200px] right-0 py-2 bg-white
								 text-gray-900 rounded-md shadow-md text-[14px] z-20 subArrow"
										>
											{currentUser?.role === 1974 && (
												<Link
													to={routes.admin_dashboard}
												>
													<li className="px-3 py-2 hover:bg-slate-100 cursor-pointer hover:text-blue-400">
														Quản lý hệ thống
													</li>
												</Link>
											)}
											<Link to={routes.member_personal}>
												<li className="px-3 py-2 hover:bg-slate-100 cursor-pointer hover:text-blue-400">
													Tài khoản của tôi
												</li>
											</Link>

											<li
												onClick={handleLogout}
												className="px-3 py-2 hover:bg-slate-100 cursor-pointer hover:text-blue-400"
											>
												Đăng xuất
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
										Đăng ký
									</Link>
									<span className="opacity-60">|</span>
									<Link
										to={routes.login}
										className="cursor-pointer hover:opacity-70"
									>
										Đăng nhập
									</Link>
								</div>
							)}
						</div>
					</div>
					<div className="max-w-main w-full h-[110px] flex justify-between items-center py-[35px] gap-[60px] ">
						<Link to={routes.home}>
							<Logo />
						</Link>
						<Search />
						<div className="  cart-wrap p-2 relative cursor-pointer opacity-85">
							<Link to={currentUser && routes.cart}>
								<BsCart3 size={24} />
								<span className=" w-5 h-5 bg-main text-center text-white text-[14px] rounded-full absolute top-[-2px] left-5">
									{currentUser?.cart.length || 0}
								</span>
							</Link>
							<Cart />
						</div>
					</div>
				</header>
			</Headroom>
		</div>
	);
}

export default Header;
