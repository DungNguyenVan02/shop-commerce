import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import routes from "~/config/routes";
import { userSelector } from "~/redux/selector";

function Member() {
	const { isLogin, currentUser } = useSelector(userSelector);
	if (!isLogin && currentUser.role !== 1974) {
		<Navigate to={routes.login} replace={true} />;
	}
	return <div>Member</div>;
}

export default Member;
