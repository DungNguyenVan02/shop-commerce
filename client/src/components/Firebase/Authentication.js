import icons from "~/utils/icons";
import { auth, googleProvider } from "~/config/firebase";
import { signInWithPopup, onAuthStateChanged } from "firebase/auth";
import { useEffect } from "react";
import { apiLoginWithGoogle, apiRegisterWithGoogle } from "~/apis";
import withBaseComponent from "../hocs/withBaseComponent";
import { login } from "~/redux/userSlice";
import { toast } from "react-toastify";
import routes from "~/config/routes";
import { useSearchParams } from "react-router-dom";

const Authentication = ({ dispatch, navigate }) => {
	const { FcGoogle, FaFacebook } = icons;
	const [searchParams] = useSearchParams();

	const handleLoginWithGoogle = async () => {
		await signInWithPopup(auth, googleProvider)
			.then(async (data) => {
				const payload = {
					email: data.user.email,
					fullName: data.user.displayName,
					userGoogleId: data.user.uid,
				};

				const response = await apiRegisterWithGoogle(payload);

				if (response.success) {
					const isLogin = await apiLoginWithGoogle({
						email: payload.email,
						userGoogleId: payload.userGoogleId,
					});

					if (isLogin.success) {
						dispatch(
							login({
								isLogin: true,
								currentUser: isLogin.data,
								token: isLogin.accessToken,
							})
						);

						setTimeout(() => {
							toast.info(
								"Chào mừng bạn đã đến website của chúng tôi !",
								{
									theme: "colored",
								}
							);
							navigate(
								searchParams.get("redirect")
									? searchParams.get("redirect")
									: routes.home
							);
						}, 1500);
					}
				} else {
					const isLogin = await apiLoginWithGoogle({
						email: payload.email,
						userGoogleId: payload.userGoogleId,
					});

					if (isLogin.success) {
						dispatch(
							login({
								isLogin: true,
								currentUser: isLogin.data,
								token: isLogin.accessToken,
							})
						);

						setTimeout(() => {
							toast.info(
								"Chào mừng bạn đã đến website của chúng tôi !",
								{
									theme: "colored",
								}
							);
							navigate(
								searchParams.get("redirect")
									? searchParams.get("redirect")
									: routes.home
							);
						}, 1500);
					}
				}
			})

			.catch((error) => {
				console.log(error);
			});
	};

	useEffect(() => {
		const unregisterAuth = onAuthStateChanged(auth, async (user) => {
			if (user) {
				// Người dùng đã đăng nhập
				console.log("User is signed in:", user);
			} else {
				// Không có người dùng nào đăng nhập
				console.log("No user is signed in.");
			}
		});

		return () => unregisterAuth();
	}, []);

	return (
		<div
			onClick={handleLoginWithGoogle}
			className="text-[14px] text-[#1877f2] my-3 flex justify-center items-center gap-1 w-full h-[40px] border rounded-sm cursor-pointer hover:bg-[rgba(0,0,0,.02)]"
		>
			<FcGoogle size={22} />
			<span>Google</span>
		</div>
	);
};

export default withBaseComponent(Authentication);
