import axios from "~/utils/axios";

export const apiGetCategories = () => {
	return axios({
		url: "/category",
		method: "GET",
	});
};
