import { useParams, Navigate } from "react-router-dom";
import routes from "../../config/routes";
import { useEffect } from "react";
import { toast } from "react-toastify";

function FinalRegister() {
	const { status } = useParams();
	useEffect(() => {
		if (status === "success") {
			toast.success("Register successfully, please login");
		} else {
			toast.info("Register failed, please register again");
		}
	}, [status]);

	return <Navigate to={routes.login} />;
}

export default FinalRegister;
