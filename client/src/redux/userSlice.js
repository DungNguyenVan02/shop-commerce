import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
	name: "user",
	initialState: {
		isLogin: false,
		currentUser: null,
		token: null,
	},
	reducers: {
		register: (state, action) => {
			console.log(action.payload);
			state.isLogin = action.payload.isLogin;
			state.currentUser = action.payload.userData;
			state.token = action.payload.token;
		},
	},
});

export const { register } = userSlice.actions;

export default userSlice.reducer;
