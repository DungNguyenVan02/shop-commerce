import { useState } from "react";
import { Button } from "~/components/common";
import { apiRegister, apiFinalRegister } from "~/apis";
import Swal from "sweetalert2";
import { useFormik } from "formik";
import { schemasValidRegister } from "~/utils/schemasValid";
import { Link } from "react-router-dom";
import routes from "~/config/routes";
import icons from "~/utils/icons";
import { useNavigate } from "react-router-dom";
import { SpinnerAnimation } from "~/components/Animation";
import Authentication from "~/components/Firebase/Authentication";

function FormInput() {
	const navigate = useNavigate();
	const [isConfirm, setIsConfirm] = useState(false);
	const [isAnimate, setAnimate] = useState(false);
	const [valueConfirm, setValueConfirm] = useState("");
	const [isShowPass, setIsShowPass] = useState(false);
	const [isShowConfirmPass, setIsShowConfirmPass] = useState(false);
	const { FaEyeSlash, FaRegEye } = icons;

	const onSubmit = async (value, actions) => {
		setAnimate(true);
		// actions.resetForm();
		const response = await apiRegister(value);
		if (response?.success) {
			Swal.fire(
				"Hệ thống thông báo",
				"Vui lòng kiểm tra email của bạn và nhập mã xác nhận tài khoản",
				"success"
			).then(() => {
				setIsConfirm(true);
				setAnimate(false);
			});
		} else {
			Swal.fire("Oops!", response.mes, "error");
			setAnimate(false);
		}
	};

	const finalRegister = async () => {
		const response = await apiFinalRegister({ codeVerified: valueConfirm });
		if (response?.success) {
			Swal.fire("Hệ thống thông báo", response.mes, "success").then(
				() => {
					setIsConfirm(false);
					navigate(routes.login);
				}
			);
		} else {
			Swal.fire("Oops!", response.mes, "error");
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
			fullName: "",
			phone: "",
			email: "",
			password: "",
			confirmPassword: "",
		},
		validationSchema: schemasValidRegister,
		onSubmit,
	});

	return (
		<>
			<form
				onSubmit={handleSubmit}
				className="bg-white rounded-xl min-w-[400px] px-[30px] shadow shadow-blue-500/40"
			>
				<h3 className="py-[22px] text-[22px] font-semibold text-main text-center">
					Đăng ký
				</h3>
				<div className="flex flex-col gap-4 items-center py-[30px] pb-[16px] pt-0">
					<div className="w-full relative">
						<label
							htmlFor="fullName"
							className="text-[12px] left-[10px] bg-white absolute top-[-10px] px-1 z-50"
						>
							Họ tên
						</label>
						<input
							id="fullName"
							type="text"
							value={values.fullName}
							onChange={handleChange}
							onBlur={handleBlur}
							className={`w-full outline-none rounded-md border p-[10px] placeholder:text-[12px] text-[14px] ${
								errors.fullName && touched.fullName
									? "border-main"
									: ""
							}`}
							placeholder="Nhập họ tên của bạn"
						/>
						{errors.fullName && touched.fullName && (
							<p className="text-[12px] text-main my-1">
								{errors.fullName}
							</p>
						)}
					</div>
					<div className="w-full relative">
						<label
							htmlFor="phone"
							className="text-[12px] left-[10px] bg-white absolute top-[-10px] px-1 z-50"
						>
							Số điện thoại
						</label>
						<input
							id="phone"
							type="text"
							value={values.phone}
							onChange={handleChange}
							onBlur={handleBlur}
							className={`w-full outline-none  rounded-md border p-[10px] placeholder:text-[12px] text-[14px] ${
								errors.phone && touched.phone
									? "border-main"
									: ""
							}`}
							placeholder="Nhập số điện thoại của bạn"
						/>
						{errors.phone && touched.phone && (
							<p className="text-[12px] text-main my-1">
								{errors.phone}
							</p>
						)}
					</div>
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
							className={`w-full outline-none rounded-md border p-[10px] placeholder:text-[12px] text-[14px] ${
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
								className={`w-full outline-none rounded-md border p-[10px] placeholder:text-[12px] text-[14px] ${
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
					<div className="w-full relative">
						<label
							htmlFor="confirmPassword"
							className="text-[12px] left-[10px] bg-white absolute top-[-10px] px-1 z-50"
						>
							Xác nhận mật khẩu
						</label>
						<div className="relative">
							<input
								id="confirmPassword"
								type={isShowConfirmPass ? "text" : "password"}
								value={values.confirmPassword}
								onChange={handleChange}
								onBlur={handleBlur}
								className={`w-full outline-none rounded-md border p-[10px] placeholder:text-[12px] text-[14px] ${
									errors.confirmPassword &&
									touched.confirmPassword
										? "border-main"
										: ""
								}`}
								placeholder="Nhập lại mật khẩu vừa nhập"
							/>
							<i
								className="absolute top-[50%] right-3 translate-y-[-50%] opacity-80 cursor-pointer"
								onClick={() =>
									setIsShowConfirmPass(!isShowConfirmPass)
								}
							>
								{isShowConfirmPass ? (
									<FaRegEye size={17} />
								) : (
									<FaEyeSlash size={18} />
								)}
							</i>
						</div>
						{errors.confirmPassword && touched.confirmPassword && (
							<p className="text-[12px] text-main my-1">
								{errors.confirmPassword}
							</p>
						)}
					</div>
					<Button
						isDisabled={isSubmitting}
						type="submit"
						title="Đăng ký"
						rightAnimation={isAnimate && <SpinnerAnimation />}
					/>
					<div className="w-full">
						<div className="w-full relative flex justify-center items-center opacity-70 text-[14px] before:absolute before:top-[50%] before:w-full before:h-[1px]  before:bg-gray-400">
							<span className=" px-1 bg-white z-10">hoặc</span>
						</div>
						<Authentication />
					</div>
					<div className="flex justify-center text-[14px]">
						<p className="text-gray-400 mr-1">
							Bạn đã có tài khoản? đăng nhập tại
						</p>
						<Link
							to={routes.login}
							className="cursor-pointer hover:text-main text-blue-600 font-medium"
						>
							đây
						</Link>
					</div>
				</div>
			</form>
			{isConfirm && (
				<div className="fixed top-0 right-0 bottom-0 left-0 bg-overlay z-[51]">
					<div className="absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] bg-white shadow-md min-w-[240px] p-[40px] flex flex-col items-center gap-4">
						<h3>Vui lòng nhập code xác thực tài khoản</h3>
						<input
							required
							value={valueConfirm}
							onChange={(e) => setValueConfirm(e.target.value)}
							placeholder="Code final register"
							className="outline-none border h-[34px] rounded-md px-4 placeholder:text-[14px]"
						/>
						<Button title="Confirm" handleClick={finalRegister} />
					</div>
				</div>
			)}
		</>
	);
}

export default FormInput;
