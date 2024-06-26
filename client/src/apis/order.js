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

export const apiGetOrderCanceledByAdmin = (params) => {
	return axios({
		url: "/order/admin/canceled",
		method: "GET",
		params,
	});
};

export const apiGetOrderReturnByAdmin = (params) => {
	return axios({
		url: "/order/admin/return-refund",
		method: "GET",
		params,
	});
};

export const apiGetOrder = (params) => {
	return axios({
		url: "/order",
		method: "GET",
		params,
	});
};
export const apiGetHistoryOrder = (params) => {
	return axios({
		url: "/order/history-order",
		method: "GET",
		params,
	});
};

export const apiGetReturnOrder = (params) => {
	return axios({
		url: "/order/return-order",
		method: "GET",
		params,
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

export const apiCheckoutOnline = (data) => {
	return axios({
		url: "/order/payment_vnpay",
		method: "POST",
		data,
	});
};
