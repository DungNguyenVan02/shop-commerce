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
	key: "shopDigital",
	storage,
};

const userConfig = {
	...commonConfig,
	whitelist: ["isLogin", "token"],
};

export const store = configureStore({
	reducer: {
		app: appSlice,
		products: productSlice,
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
