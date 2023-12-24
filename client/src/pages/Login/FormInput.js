import { useState } from "react";
import Button from "../../components/Button";
import { login } from "../../redux/userSlice";
import { toast } from "react-toastify";
import { apiLogin } from "../../apis";
import Swal from "sweetalert2";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import { schemasValidLogin } from "../../utils/schemasValid";
import { Link } from "react-router-dom";
import routes from "../../config/routes";
import icons from "../../utils/icons";

function FormInput() {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const [isShowPass, setIsShowPass] = useState(false);
	const { FaEyeSlash, FaRegEye } = icons;

	const onSubmit = async (value, actions) => {
		actions.resetForm();
		const response = await apiLogin(value);
		if (response?.success) {
			toast.info("Welcome to digital world!");
			dispatch(
				login({
					isLogin: true,
					userData: response.data,
					token: response.accessToken,
				})
			);
			navigate(routes.home);
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
			email: "",
			password: "",
		},
		validationSchema: schemasValidLogin,
		onSubmit,
	});

	return (
		<form
			onSubmit={handleSubmit}
			className="bg-white rounded min-w-[400px] px-[30px] shadow shadow-blue-500/40"
		>
			<h3 className="py-[22px] text-[22px] font-semibold text-main text-center">
				Log in
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
							errors.email && touched.email ? "border-main" : ""
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
				<Button
					isDisabled={isSubmitting}
					type="submit"
					title="Log in"
				/>
			</div>
			<div className="font-[300] text-sm pb-4">
				<div className="flex justify-between">
					<span className="cursor-pointer hover:text-main">
						Forgot your password?
					</span>
					<Link
						to={routes.register}
						className="cursor-pointer hover:text-main"
					>
						Create Account
					</Link>
				</div>
			</div>
		</form>
	);
}

export default FormInput;
