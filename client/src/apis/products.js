import axios from "../utils/axios";

export const apiGetProducts = (params) => {
	return axios({
		url: "/product",
		method: "GET",
		params,
	});
};

export const apiGetProduct = (pid) => {
	return axios({
		url: "/product/" + pid,
		method: "GET",
	});
};
