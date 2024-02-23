import axios from "~/utils/axios";

export const apiCreateBlog = (data) => {
	return axios({
		url: "/blog",
		method: "POST",
		data,
	});
};

export const apiGetBlogs = (params) => {
	return axios({
		url: "/blog",
		method: "GET",
		params,
	});
};

export const apiGetBlog = (bid) => {
	return axios({
		url: "/blog/" + bid,
		method: "GET",
	});
};

export const apiUpdateBlog = (bid, data) => {
	return axios({
		url: "/blog/" + bid,
		method: "PUT",
		data,
	});
};

export const apiDeleteBlog = (bid) => {
	return axios({
		url: "/blog/" + bid,
		method: "DELETE",
	});
};
