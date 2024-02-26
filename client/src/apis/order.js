import axios from "~/utils/axios";

export const apiCreateOrder = (data) => {
	return axios({
		url: "/order",
		method: "POST",
		data,
	});
};

export const apiGetAllOrder = () => {
	return axios({
		url: "/order/admin/all-orders",
		method: "GET",
	});
};

export const apiGetOrderByAdmin = (params) => {
	return axios({
		url: "/order/admin",
		method: "GET",
		params,
	});
};

export const apiGetOrderCanceledByAdmin = () => {
	return axios({
		url: "/order/admin/canceled",
		method: "GET",
	});
};

export const apiGetOrderReturnByAdmin = () => {
	return axios({
		url: "/order/admin/return-refund",
		method: "GET",
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

export const apiGetReturnOrder = () => {
	return axios({
		url: "/order/return-order",
		method: "GET",
	});
};

export const apiPutReturnOrder = (oid) => {
	return axios({
		url: "/order/confirm/" + oid,
		method: "PUT",
	});
};

export const apiUpdateStatusOrder = (data, oid) => {
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
