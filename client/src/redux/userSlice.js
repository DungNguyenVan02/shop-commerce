import { createSlice } from "@reduxjs/toolkit";
import * as actions from "./asyncActions";

const userSlice = createSlice({
	name: "user",
	initialState: {
		isLogin: false,
		currentUser: null,
		token: null,
		mes: "",
		checkouts: [],
	},
	reducers: {
		login: (state, action) => {
			state.isLogin = action.payload.isLogin;
			state.token = action.payload.token;
			state.currentUser = action.payload.currentUser;
		},
		logout: (state) => {
			state.isLogin = false;
			state.token = null;
			state.currentUser = null;
		},
		clearMes: (state) => {
			state.mes = "";
		},
		checkouts: (state, action) => {
			state.checkouts = [...action.payload];
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(actions.getCurrentUser.pending, (state) => {})
			.addCase(actions.getCurrentUser.fulfilled, (state, action) => {
				state.currentUser = action.payload;
			})
			.addCase(actions.getCurrentUser.rejected, (state, action) => {
				state.currentUser = null;
				state.isLogin = false;
				state.token = null;
				state.mes = "Phiên đăng nhập hết hạn, vui lòng đăng nhập lại !";
			});
	},
});

export const { login, logout, clearMes, checkouts } = userSlice.actions;

export default userSlice.reducer;
