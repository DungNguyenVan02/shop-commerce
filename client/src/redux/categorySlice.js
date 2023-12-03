import { createSlice } from "@reduxjs/toolkit";
import * as actions from "./asyncActions";
const categorySlice = createSlice({
	name: "app",
	initialState: {
		categories: null,
		isLoading: false,
	},
	actions: {},
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
				state.status = false;
				state.errorMessage = action.payload.message;
			});
	},
});

export default categorySlice.reducer;
