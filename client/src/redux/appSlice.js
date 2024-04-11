import { createSlice } from "@reduxjs/toolkit";
import * as actions from "./asyncActions";
const appSlice = createSlice({
	name: "app",
	initialState: {
		categories: null,
		isShowModal: false,
		slides: null,
	},
	reducers: {
		showModal: (state, action) => {
			state.isShowModal = action.payload.isShowModal;
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(actions.getCategories.fulfilled, (state, action) => {
				state.categories = action.payload;
			})
			.addCase(actions.getSlide.fulfilled, (state, action) => {
				state.slides = action.payload;
			});
	},
});

export const { showModal } = appSlice.actions;

export default appSlice.reducer;
