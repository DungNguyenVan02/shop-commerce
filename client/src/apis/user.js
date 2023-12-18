import axios from "../utils/axios";

export const apiRegister = (data) => {
	return axios({
		url: "/user/register",
		method: "POST",
		data,
	});
};

export const apiLogin = (data) => {
	return axios({
		url: "/user/login",
		method: "POST",
		data,
	});
};
