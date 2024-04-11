import axios from "~/utils/axios";

export const apiGetSlides = () => {
	return axios({
		url: "/slide",
		method: "GET",
	});
};

export const apiCreateSlide = (data) => {
	return axios({
		url: "/slide",
		method: "POST",
		data,
	});
};

export const apiUpdateSlide = (data) => {
	return axios({
		url: "/slide",
		method: "PUT",
		data,
	});
};
