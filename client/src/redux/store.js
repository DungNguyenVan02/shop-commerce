import { configureStore } from "@reduxjs/toolkit";
import appSlice from "./appSlice";
import productSlice from "./productSlice";
import userSlice from "./userSlice";
import storage from "redux-persist/lib/storage";
import {
	FLUSH,
	PAUSE,
	PERSIST,
	PURGE,
	REGISTER,
	REHYDRATE,
	persistReducer,
	persistStore,
} from "redux-persist";

const commonConfig = {
	storage,
};

const userConfig = {
	...commonConfig,
	whitelist: ["isLogin", "token", "currentUser", "checkouts"],
	key: "shopDigital",
};

const productConfig = {
	...commonConfig,
	whitelist: ["deadDaily"],
	key: "shopDigital/product",
};

export const store = configureStore({
	reducer: {
		app: appSlice,
		products: persistReducer(productConfig, productSlice),
		user: persistReducer(userConfig, userSlice),
	},
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware({
			serializableCheck: {
				ignoredActions: [
					FLUSH,
					REHYDRATE,
					PAUSE,
					PERSIST,
					PURGE,
					REGISTER,
				],
			},
		}),
});

export const persistor = persistStore(store);
