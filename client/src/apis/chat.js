import axios from "~/utils/axios";

export const apiGetChats = (uid) => {
	return axios({
		url: "/chat/" + uid,
		method: "GET",
	});
};
export const apiAddChat = (data) => {
	return axios({
		url: "/chat",
		method: "POST",
		data,
	});
};

export const apiGetMessage = (chatId) => {
	return axios({
		url: "/message/" + chatId,
		method: "GET",
	});
};

export const apiAddMessage = (data) => {
	return axios({
		url: "/message",
		method: "POST",
		data,
	});
};
