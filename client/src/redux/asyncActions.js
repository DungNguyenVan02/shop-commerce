import { createAsyncThunk } from "@reduxjs/toolkit";
import * as apis from "../apis";

export const getCategories = createAsyncThunk(
	"app/categories",
	async (data, { rejectWithValue }) => {
		const response = await apis.apiGetCategories();
		if (!response.success) {
			return rejectWithValue(response);
		}
		return response.getAllCategory;
	}
);

export const getNewProducts = createAsyncThunk(
	"product/newProducts",
	async (data, { rejectWithValue }) => {
		const response = await apis.apiGetProducts({ sort: "-createdAt" });
		if (!response.success) {
			return rejectWithValue(response);
		}
		return response.products;
	}
);
