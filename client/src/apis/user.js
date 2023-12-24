import axios from "../utils/axios";

export const apiGetCurrentUser = () => {
	return axios({
		url: "/user/current",
		method: "GET",
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
		url: `/user/completedregister/${codeVerified}`,
		method: "PUT",
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
