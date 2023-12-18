import { configureStore } from "@reduxjs/toolkit";
import categorySlice from "./categorySlice";
import productSlice from "./productSlice";
import userSlice from "./userSlice";
import storage from "redux-persist/lib/storage";
import { persistReducer, persistStore } from "redux-persist";

const commonConfig = {
	key: "shopDigital",
	storage,
};

const userConfig = {
	...commonConfig,
	whitelist: ["isLogin", "token"],
};

export const store = configureStore({
	reducer: {
		categories: categorySlice,
		products: productSlice,
		user: persistReducer(userConfig, userSlice),
	},
});

export const persistor = persistStore(store);
