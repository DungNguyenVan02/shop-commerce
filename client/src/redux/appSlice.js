import { createSlice } from "@reduxjs/toolkit";
import * as actions from "./asyncActions";
const appSlice = createSlice({
	name: "app",
	initialState: {
		categories: null,
		isLoading: false,
		isShowModal: false,
	},
	reducers: {
		showModal: (state, action) => {
			state.isShowModal = action.payload.isShowModal;
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(actions.getCategories.pending, (state) => {
				state.isLoading = true;
			})
			.addCase(actions.getCategories.fulfilled, (state, action) => {
				state.isLoading = false;
				state.categories = action.payload;
			})
			.addCase(actions.getCategories.rejected, (state, action) => {
				state.errorMessage = action.payload.message;
			});
	},
});

export const { showModal } = appSlice.actions;

export default appSlice.reducer;
