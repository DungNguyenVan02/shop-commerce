import { useState } from "react";
import { Button } from "~/components/common";
import { login } from "~/redux/userSlice";
import { toast } from "react-toastify";
import { apiLogin, apiForgotPassword } from "~/apis";
import Swal from "sweetalert2";
import { useDispatch } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useFormik } from "formik";
import { schemasValidLogin } from "~/utils/schemasValid";
import { Link } from "react-router-dom";
import routes from "~/config/routes";
import icons from "~/utils/icons";
import { SpinnerAnimation } from "~/components/Animation";
import Authentication from "~/components/Firebase/Authentication";

function FormInput() {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const [isShowPass, setIsShowPass] = useState(false);
	const [isAnimation, setIsAnimation] = useState(false);
	const [isForgotpassword, setIsForgotpassword] = useState(false);
	const [emailForgotpassword, setEmailForgotpassword] = useState("");
	const [searchParams] = useSearchParams();

	const { FaEyeSlash, FaRegEye, IoCloseOutline } = icons;

	const handleForgotPassword = async () => {
		setIsAnimation(true);
		const response = await apiForgotPassword({
			email: emailForgotpassword,
		});
		if (response?.success) {
			Swal.fire("Hệ thống thông báo", response.mes, "success");
			setIsAnimation(false);
			navigate(`${routes.resetpassword}/${emailForgotpassword}`);
		} else {
			Swal.fire("Oops!", response.mes, "error");
			setIsAnimation(false);
		}
	};

	const onSubmit = async (value, actions) => {
		setIsAnimation(true);
		const response = await apiLogin(value);
		if (response?.success) {
			actions.resetForm();
			dispatch(
				login({
					isLogin: true,
					currentUser: response.data,
					token: response.accessToken,
				})
			);
			setTimeout(() => {
				toast.info("Chào mừng bạn đã đến website của chúng tôi !", {
					theme: "colored",
				});
				setIsAnimation(false);
				navigate(
					searchParams.get("redirect")
						? searchParams.get("redirect")
						: routes.home
				);
			}, 1500);
		} else {
			Swal.fire("Oops!", response.mes, "error");
			setIsAnimation(false);
		}
	};

	const {
		values,
		errors,
		touched,
		isSubmitting,
		handleBlur,
		handleChange,
		handleSubmit,
	} = useFormik({
		initialValues: {
			email: "",
			password: "",
		},
		validationSchema: schemasValidLogin,
		onSubmit,
	});

	return (
		<>
			<form
				onSubmit={handleSubmit}
				className="bg-white rounded min-w-[400px] px-[30px] shadow shadow-blue-500/40"
			>
				<h3 className="py-[22px] text-[22px] font-semibold text-main text-center">
					Đăng nhập
				</h3>
				<div className="flex flex-col gap-4 items-center py-[30px] pb-[16px] pt-0">
					<div className="w-full relative">
						<label
							htmlFor="email"
							className="text-[12px] left-[10px] bg-white absolute top-[-10px] px-1 z-50"
						>
							Email
						</label>
						<input
							id="email"
							type="email"
							value={values.email}
							onChange={handleChange}
							onBlur={handleBlur}
							className={`w-full outline-none border p-[10px] placeholder:text-[12px] text-[14px] ${
								errors.email && touched.email
									? "border-main"
									: ""
							}`}
							placeholder="Nhập email của bạn"
						/>
						{errors.email && touched.email && (
							<p className="text-[12px] text-main my-1">
								{errors.email}
							</p>
						)}
					</div>
					<div className="w-full relative">
						<label
							htmlFor="password"
							className="text-[12px] left-[10px] bg-white absolute top-[-10px] px-1 z-50"
						>
							Mật khẩu
						</label>
						<div className="relative">
							<input
								id="password"
								type={isShowPass ? "text" : "password"}
								value={values.password}
								onChange={handleChange}
								onBlur={handleBlur}
								className={`w-full outline-none border p-[10px] placeholder:text-[12px] text-[14px] ${
									errors.password && touched.password
										? "border-main"
										: ""
								}`}
								placeholder="Nhập mật khẩu của bạn"
							/>
							<i
								className="absolute top-[50%] right-3 translate-y-[-50%] opacity-80 cursor-pointer"
								onClick={() => setIsShowPass(!isShowPass)}
							>
								{isShowPass ? (
									<FaRegEye size={17} />
								) : (
									<FaEyeSlash size={18} />
								)}
							</i>
						</div>
						{errors.password && touched.password && (
							<p className="text-[12px] text-main my-1">
								{errors.password}
							</p>
						)}
					</div>
					<Button
						isDisabled={isSubmitting}
						type="submit"
						title="Đăng nhập"
						rightAnimation={isAnimation && <SpinnerAnimation />}
					/>
				</div>
				<div className="relative flex justify-center items-center opacity-70 text-[14px] before:absolute before:top-[50%] before:w-full before:h-[1px]  before:bg-gray-400">
					<span className=" px-1 bg-white z-10">hoặc</span>
				</div>
				<Authentication />
				<div className="font-[300] text-sm pb-4">
					<div className="flex justify-between">
						<span
							className="cursor-pointer hover:text-main"
							onClick={() => setIsForgotpassword(true)}
						>
							Lấy lại mật khẩu?
						</span>
						<Link
							to={routes.register}
							className="cursor-pointer hover:text-main"
						>
							Đăng ký
						</Link>
					</div>
				</div>
			</form>
			{isForgotpassword && (
				<div
					className="fixed top-0 right-0 bottom-0 left-0 bg-overlay z-[51] "
					onClick={() => setIsForgotpassword(false)}
				>
					<div
						onClick={(e) => e.stopPropagation()}
						className="flex flex-col items-center gap-4 absolute top-[50%] left-[50%] translate-y-[0%] translate-x-[-50%] bg-white shadow-md min-w-[500px] p-[40px] animate-slideTop"
					>
						<i
							onClick={() => setIsForgotpassword(false)}
							className="absolute top-0 right-[2px] p-4 hover:opacity-70 cursor-pointer"
						>
							{<IoCloseOutline size={24} />}
						</i>
						<h3>Nhập email đăng ký</h3>
						<input
							required
							value={emailForgotpassword}
							onChange={(e) =>
								setEmailForgotpassword(e.target.value)
							}
							placeholder="VD: email@gmail.com"
							className="outline-none w-full border h-[34px] rounded-md px-4 placeholder:text-[14px]"
						/>
						<Button
							title="Gửi"
							handleClick={handleForgotPassword}
							rightAnimation={isAnimation && <SpinnerAnimation />}
						/>
					</div>
				</div>
			)}
		</>
	);
}

export default FormInput;
