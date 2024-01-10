import images from "~/assets/images";
// import Button from "~/components/Button";
import { Link } from "react-router-dom";
import routes from "~/config/routes";
import FormInput from "./FormInput";

function Login() {
	return (
		<div>
			<header className="w-full">
				<div className="flex justify-between max-w-main w-full mx-auto py-6">
					<Link to={routes.home}>
						<img src={images.logo} alt="logo" />
					</Link>
					<span className="cursor-pointer hover:text-main">
						Need help?
					</span>
				</div>
			</header>
			<div className="py-[60px] bg-orange-200 flex items-center justify-center">
				<FormInput />
			</div>
		</div>
	);
}

export default Login;
