import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import routes from "~/config/routes";
import Dashboard from "~/layouts/components/admin/Dashboard";
import { userSelector } from "~/redux/selector";
function Admin() {
	const { isLogin, currentUser } = useSelector(userSelector);
	console.log(isLogin && currentUser.role !== 1974);
	if (isLogin && currentUser.role !== 1974) {
		<Navigate to={routes.login} replace={true} />;
	}
	return (
		<div>
			admin
			<Dashboard />
		</div>
	);
}

export default Admin;
