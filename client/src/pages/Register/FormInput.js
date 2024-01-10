import { useState } from "react";
import Button from "~/components/Button";
import { apiRegister, apiFinalRegister } from "~/apis";
import Swal from "sweetalert2";
import { useFormik } from "formik";
import { schemasValidRegister } from "~/utils/schemasValid";
import { Link } from "react-router-dom";
import routes from "~/config/routes";
import icons from "~/utils/icons";
import { useNavigate } from "react-router-dom";
import { SpinnerAnimation } from "~/components/Animation";

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
		actions.resetForm();
		const response = await apiRegister(value);
		if (response?.success) {
			Swal.fire(
				"Notifications",
				"Please check your email and verify with us",
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
			Swal.fire("Congratulation", response.mes, "success").then(() => {
				setIsConfirm(false);
				navigate(routes.login);
			});
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
			firstName: "",
			lastName: "",
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
				className="bg-white rounded min-w-[400px] px-[30px] shadow shadow-blue-500/40"
			>
				<h3 className="py-[22px] text-[22px] font-semibold text-main text-center">
					Register
				</h3>
				<div className="flex flex-col gap-4 items-center py-[30px] pb-[16px] pt-0">
					<div className="w-full relative">
						<label
							htmlFor="firstName"
							className="text-[12px] left-[10px] bg-white absolute top-[-10px] px-1 z-50"
						>
							First name
						</label>
						<input
							id="firstName"
							type="text"
							value={values.firstName}
							onChange={handleChange}
							onBlur={handleBlur}
							className={`w-full outline-none border p-[10px] placeholder:text-[12px] text-[14px] ${
								errors.firstName && touched.firstName
									? "border-main"
									: ""
							}`}
							placeholder="Enter your first name"
						/>
						{errors.firstName && touched.firstName && (
							<p className="text-[12px] text-main my-1">
								{errors.firstName}
							</p>
						)}
					</div>
					<div className="w-full relative">
						<label
							htmlFor="lastName"
							className="text-[12px] left-[10px] bg-white absolute top-[-10px] px-1 z-50"
						>
							Last name
						</label>
						<input
							id="lastName"
							type="text"
							value={values.lastName}
							onChange={handleChange}
							onBlur={handleBlur}
							className={`w-full outline-none border p-[10px] placeholder:text-[12px] text-[14px] ${
								errors.lastName && touched.lastName
									? "border-main"
									: ""
							}`}
							placeholder="Enter your last name"
						/>
						{errors.lastName && touched.lastName && (
							<p className="text-[12px] text-main my-1">
								{errors.lastName}
							</p>
						)}
					</div>
					<div className="w-full relative">
						<label
							htmlFor="phone"
							className="text-[12px] left-[10px] bg-white absolute top-[-10px] px-1 z-50"
						>
							Phone
						</label>
						<input
							id="phone"
							type="text"
							value={values.phone}
							onChange={handleChange}
							onBlur={handleBlur}
							className={`w-full outline-none border p-[10px] placeholder:text-[12px] text-[14px] ${
								errors.phone && touched.phone
									? "border-main"
									: ""
							}`}
							placeholder="Enter your phone"
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
							className={`w-full outline-none border p-[10px] placeholder:text-[12px] text-[14px] ${
								errors.email && touched.email
									? "border-main"
									: ""
							}`}
							placeholder="Enter your email"
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
							Password
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
								placeholder="Enter your password"
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
							Confirm password
						</label>
						<div className="relative">
							<input
								id="confirmPassword"
								type={isShowConfirmPass ? "text" : "password"}
								value={values.confirmPassword}
								onChange={handleChange}
								onBlur={handleBlur}
								className={`w-full outline-none border p-[10px] placeholder:text-[12px] text-[14px] ${
									errors.confirmPassword &&
									touched.confirmPassword
										? "border-main"
										: ""
								}`}
								placeholder="Enter confirm password"
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
						title="Register"
						rightAnimation={isAnimate && <SpinnerAnimation />}
					/>
					<div className="flex justify-center text-[14px]">
						<p className="text-gray-400 mr-1">Have an account?</p>
						<Link
							to={routes.login}
							className="cursor-pointer hover:text-main"
						>
							Go to login
						</Link>
					</div>
				</div>
			</form>
			{isConfirm && (
				<div className="fixed top-0 right-0 bottom-0 left-0 bg-overlay z-[51]">
					<div className="absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] bg-white shadow-md min-w-[240px] p-[40px] flex flex-col items-center gap-4">
						<h3>Please confirm code verify</h3>
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
