import { useState } from "react";
import { Button } from "~/components/common";
import { apiResetPassword } from "~/apis";
import Swal from "sweetalert2";
import { useFormik } from "formik";
import { schemasValidResetPassword } from "~/utils/schemasValid";
import { Link } from "react-router-dom";
import routes from "~/config/routes";
import icons from "~/utils/icons";
import { useNavigate } from "react-router-dom";
import { SpinnerAnimation } from "~/components/Animation";
import { useParams } from "react-router-dom";

function FormInput() {
	const { email } = useParams();
	const navigate = useNavigate();
	const [isAnimate, setAnimate] = useState(false);
	const [isShowPass, setIsShowPass] = useState(false);
	const [isShowConfirmPass, setIsShowConfirmPass] = useState(false);
	const { FaEyeSlash, FaRegEye } = icons;

	const onSubmit = async (value, actions) => {
		setAnimate(true);
		actions.resetForm();
		const { password, codeVerify } = value;

		const response = await apiResetPassword({
			email,
			password,
			codeForgotPassword: codeVerify,
		});
		if (response?.success) {
			Swal.fire("Notifications", response.mes, "success").then(() => {
				setAnimate(false);
				navigate(routes.login);
			});
		} else {
			Swal.fire("Oops!", response.mes, "error");
			setAnimate(false);
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
			password: "",
			confirmPassword: "",
			codeVerify: "",
		},
		validationSchema: schemasValidResetPassword,
		onSubmit,
	});

	return (
		<>
			<form
				onSubmit={handleSubmit}
				className="bg-white rounded min-w-[400px] px-[30px] shadow shadow-blue-500/40"
			>
				<h3 className="py-[22px] text-[22px] font-semibold text-main text-center">
					Enter your new password
				</h3>
				<div className="flex flex-col gap-4 items-center py-[30px] pb-[16px] pt-0">
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
								placeholder="Enter your new password"
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
								placeholder="Enter confirm new password"
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
					<div className="w-full relative">
						<label
							htmlFor="confirmPassword"
							className="text-[12px] left-[10px] bg-white absolute top-[-10px] px-1 z-50"
						>
							Code verify
						</label>
						<div className="relative">
							<input
								id="codeVerify"
								type={isShowConfirmPass ? "text" : "password"}
								value={values.codeVerify}
								onChange={handleChange}
								onBlur={handleBlur}
								className={`w-full outline-none border p-[10px] placeholder:text-[12px] text-[14px] ${
									errors.codeVerify && touched.codeVerify
										? "border-main"
										: ""
								}`}
								placeholder="Enter code verify"
							/>
						</div>
						{errors.codeVerify && touched.codeVerify && (
							<p className="text-[12px] text-main my-1">
								{errors.codeVerify}
							</p>
						)}
					</div>
					<Button
						isDisabled={isSubmitting}
						type="submit"
						title="Submit"
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
		</>
	);
}

export default FormInput;
