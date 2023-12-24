import { createSlice } from "@reduxjs/toolkit";
import * as actions from "./asyncActions";

const userSlice = createSlice({
	name: "user",
	initialState: {
		isLogin: false,
		currentUser: null,
		token: null,
	},
	reducers: {
		login: (state, action) => {
			state.isLogin = action.payload.isLogin;
			state.token = action.payload.token;
		},
		logout: (state, action) => {
			state.isLogin = false;
			state.token = null;
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
			});
	},
});

export const { login, logout } = userSlice.actions;

export default userSlice.reducer;
