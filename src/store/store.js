import { configureStore } from "@reduxjs/toolkit";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage";

import { postsReducer } from "./posts/slice";
import { authReducer } from "./auth/slice.js";
import { setupInterceptors } from "./interceptor.js";
import { instance } from "./init.js";

const postsPersistConfig = {
  key: "posts",
  storage,
};

const authPersistConfig = {
  key: "auth",
  storage,
  whitelist: ["token", "refreshToken", "user", "isLoggedIn"],
};

export const store = configureStore({
  reducer: {
    posts: persistReducer(postsPersistConfig, postsReducer),
    auth: persistReducer(authPersistConfig, authReducer),
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
  devTools: import.meta.env.MODE === "development",
});

setupInterceptors(instance, store);

export const persistor = persistStore(store);
