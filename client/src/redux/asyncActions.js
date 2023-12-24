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

export const getCurrentUser = createAsyncThunk(
	"user/current",
	async (data, { rejectWithValue }) => {
		const response = await apis.apiGetCurrentUser();
		if (!response.success) {
			return rejectWithValue(response);
		}
		return response.res;
	}
);

export const logoutUser = createAsyncThunk(
	"user/logout",
	async (data, { rejectWithValue }) => {
		const response = await apis.apiLogout();
		console.log(response);
		if (!response.success) {
			return rejectWithValue(response);
		}
		return response;
	}
);
