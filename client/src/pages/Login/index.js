import Swal from "sweetalert2";
import { useCallback, useState } from "react";
import images from "../../assets/images";
import Button from "../../components/Button";
import InputField from "../../components/InputField";
import { apiRegister, apiLogin } from "../../apis";
import { useNavigate } from "react-router-dom";
import routes from "../../config/routes";
import { toast } from "react-toastify";
import { register } from "../../redux/userSlice";
import { useDispatch } from "react-redux";

function Login() {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const [isRegister, setIsRegister] = useState(false);

	const [payload, setPayLoad] = useState({
		firstName: "",
		lastName: "",
		phone: "",
		email: "",
		password: "",
	});

	const resetPayload = () => {
		setPayLoad({
			firstName: "",
			lastName: "",
			phone: "",
			email: "",
			password: "",
		});
	};

	const handleSubmit = useCallback(async () => {
		let idTimeOut;
		const { firstName, lastName, phone, ...data } = payload;
		if (isRegister) {
			const response = await apiRegister(payload);

			if (response?.success) {
				Swal.fire("Congratulation", response.mes, "success").then(
					() => {
						setIsRegister(false);
						resetPayload();
					}
				);
			} else {
				Swal.fire("Oops!", response.mes, "error");
			}
		} else {
			const response = await apiLogin(data);
			if (response?.success) {
				dispatch(
					register({
						isLogin: true,
						userData: response.data,
						token: response.accessToken,
					})
				);
				toast.info("Welcome to our website");
				navigate(`${routes.home}`);
			} else {
				Swal.fire("Oops!", response.mes, "error");
			}
		}
		return () => {
			clearTimeout(idTimeOut);
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [payload, isRegister]);

	return (
		<div>
			<header className="w-full">
				<div className="flex justify-between max-w-main w-full mx-auto py-6">
					<img src={images.logo} alt="logo" />
					<span className="cursor-pointer hover:text-main">
						Need help?
					</span>
				</div>
				<div className="min-h-[500px] bg-orange-200 flex items-center justify-center">
					<form className="bg-white rounded shadow-amber-50 min-w-[400px] px-[30px] shadow shadow-blue-500/40">
						<h3 className="py-[22px] text-[22px] font-semibold text-main text-center">
							{isRegister ? "Register" : "Log in"}
						</h3>
						<div className="flex flex-col gap-4 items-center py-[30px] pb-[16px] pt-0">
							{isRegister && (
								<>
									<InputField
										value={payload.firstName}
										setValue={setPayLoad}
										fieldKey="firstName"
									/>
									<InputField
										value={payload.lastName}
										setValue={setPayLoad}
										fieldKey="lastName"
									/>
									<InputField
										value={payload.phone}
										setValue={setPayLoad}
										fieldKey="phone"
									/>
								</>
							)}
							<InputField
								value={payload.email}
								setValue={setPayLoad}
								fieldKey="email"
							/>
							<InputField
								value={payload.password}
								setValue={setPayLoad}
								fieldKey="password"
								type="password"
							/>
							<Button
								title={isRegister ? "Register" : "Log in"}
								handleClick={handleSubmit}
							/>
						</div>
						<div className="font-[300] text-sm pb-4">
							{!isRegister ? (
								<div className="flex justify-between">
									<span className="cursor-pointer hover:text-main">
										Forgot your password?
									</span>
									<span
										className="cursor-pointer hover:text-main"
										onClick={() => {
											setIsRegister(true);
											resetPayload();
										}}
									>
										Create Account
									</span>
								</div>
							) : (
								<div className="flex justify-center">
									<p className="text-gray-400 mr-1">
										Have an account?
									</p>
									<span
										className="cursor-pointer hover:text-main"
										onClick={() => {
											setIsRegister(false);
											resetPayload();
										}}
									>
										Go to login
									</span>
								</div>
							)}
						</div>
					</form>
				</div>
			</header>
		</div>
	);
}

export default Login;
