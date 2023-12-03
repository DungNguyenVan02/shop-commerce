import axios from "../utils/axios";

export const apiGetProducts = (params) => {
	return axios({
		url: "/product",
		method: "GET",
		params,
	});
};
