import axios from "~/utils/axios";

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

export const apiRatingProduct = (data) => {
	return axios({
		url: "/product/ratings",
		method: "PUT",
		data,
	});
};

export const apiCreateProduct = (data) => {
	return axios({
		url: "/product",
		method: "POST",
		data,
	});
};

export const apiDeleteProduct = (pid) => {
	return axios({
		url: "/product/" + pid,
		method: "DELETE",
	});
};

export const apiUpdateProduct = (data, pid) => {
	return axios({
		url: "/product/" + pid,
		method: "PUT",
		data,
	});
};

export const apiUpdateSold = (data) => {
	return axios({
		url: "/product/sold",
		method: "PUT",
		data,
	});
};

export const apiVariantsProduct = (data, pid) => {
	return axios({
		url: "/product/variants/" + pid,
		method: "PUT",
		data,
	});
};
