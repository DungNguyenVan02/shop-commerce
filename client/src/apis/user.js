import axios from "~/utils/axios";

export const apiGetCurrentUser = () => {
	return axios({
		url: "/user/current",
		method: "GET",
	});
};

export const apiGetAllUser = (params) => {
	return axios({
		url: "/user",
		method: "GET",
		params,
	});
};

export const apiUpdateUserByAdmin = (data, uid) => {
	return axios({
		url: "/user/" + uid,
		method: "PUT",
		data,
	});
};

export const apiDeleteUser = (uid) => {
	return axios({
		url: "/user/" + uid,
		method: "DELETE",
	});
};

export const apiForgotPassword = (data) => {
	return axios({
		url: `/user/forgotpassword`,
		method: "POST",
		data,
	});
};

export const apiResetPassword = (data) => {
	return axios({
		url: `/user/resetpassword`,
		method: "PUT",
		data,
	});
};

export const apiRegister = (data) => {
	return axios({
		url: "/user/register",
		method: "POST",
		data,
	});
};

export const apiFinalRegister = (codeVerified) => {
	return axios({
		url: `/user/completedregister`,
		method: "PUT",
		data: codeVerified,
	});
};

export const apiLogin = (data) => {
	return axios({
		url: "/user/login",
		method: "POST",
		data,
	});
};

export const apiLogout = () => {
	return axios({
		url: "/user/logout",
		method: "POST",
	});
};

export const apiUpdateUser = (data) => {
	return axios({
		url: "/user/current",
		method: "PUT",
		data,
	});
};

export const apiAddCart = (data) => {
	return axios({
		url: "/user/cart",
		method: "PUT",
		data,
	});
};

export const apiRemoveCart = (data) => {
	return axios({
		url: "/user/remove-cart",
		method: "DELETE",
		data,
	});
};

export const apiUpdateQuantityCart = (pid, data) => {
	return axios({
		url: "/user/update-quantity/" + pid,
		method: "PUT",
		data,
	});
};

export const apiUpdateAddress = (data) => {
	return axios({
		url: "/user/address",
		method: "PUT",
		data,
	});
};
