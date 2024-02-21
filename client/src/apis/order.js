import axios from "~/utils/axios";

export const apiCreateOrder = (data) => {
	return axios({
		url: "/order",
		method: "POST",
		data,
	});
};
export const apiGetOrderByAdmin = (params) => {
	return axios({
		url: "/order/admin",
		method: "GET",
		params,
	});
};

export const apiGetOrder = () => {
	return axios({
		url: "/order",
		method: "GET",
	});
};
export const apiGetHistoryOrder = () => {
	return axios({
		url: "/order/history-order",
		method: "GET",
	});
};

export const apiUpdateStatusByAdmin = (data, oid) => {
	return axios({
		url: "/order/status/" + oid,
		method: "PUT",
		data,
	});
};

export const apiDeleteOrder = (oid) => {
	return axios({
		url: "/order/delete/" + oid,
		method: "DELETE",
	});
};
