import { createSlice } from "@reduxjs/toolkit";
import * as actions from "./asyncActions";
const productSlice = createSlice({
	name: "products",
	initialState: {
		newProducts: null,
		errorMessage: "",
	},
	actions: {},
	extraReducers: (builder) => {
		builder
			.addCase(actions.getNewProducts.pending, (state) => {})
			.addCase(actions.getNewProducts.fulfilled, (state, action) => {
				state.newProduct = action.payload;
			})
			.addCase(actions.getNewProducts.rejected, (state, action) => {
				state.status = false;
				state.errorMessage = action.payload.message;
			});
	},
});

export default productSlice.reducer;
