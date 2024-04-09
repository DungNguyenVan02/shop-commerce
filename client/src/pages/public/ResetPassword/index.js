import { Link } from "react-router-dom";
import routes from "~/config/routes";
import FormInput from "./FormInput";
import Logo from "~/components/Logo";
function ResetPassword() {
	return (
		<>
			<header className="w-full">
				<div className="flex justify-between max-w-main w-full mx-auto py-6">
					<Link to={routes.home}>
						<Logo />
					</Link>
					<span className="cursor-pointer hover:text-main">
						Cần trợ giúp
					</span>
				</div>
			</header>
			<div className=" py-[24px] bg-orange-200 flex items-center justify-center">
				<FormInput />
			</div>
		</>
	);
}

export default ResetPassword;
